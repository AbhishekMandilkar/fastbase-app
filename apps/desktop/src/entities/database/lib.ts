import type { DatabaseType } from '@fastbase/shared/enums/database-type'
import type { WhereFilter } from './sql/where'
import type { Database } from '~/lib/indexeddb'
import { databaseContextType } from '@fastbase/shared/database'
import { toast } from 'sonner'
import { indexedDb } from '~/lib/indexeddb'
import { dbQuery } from '~/lib/query'
import { queryClient } from '~/main'
import { databaseColumnsQuery } from './queries/columns'
import { databaseQuery, databasesQuery } from './queries/database'
import { databaseEnumsQuery } from './queries/enums'
import { databasePrimaryKeysQuery } from './queries/primary-keys'
import { databaseRowsQuery } from './queries/rows'
import { databaseTablesAndSchemasQuery } from './queries/tables-and-schemas'
import { databaseTableTotalQuery } from './queries/total'
import { contextSql } from './sql/context'

export async function fetchDatabases() {
  if (!navigator.onLine) {
    return
  }

  try {
    const [fetchedDatabases] = await Promise.all([
      indexedDb.databases.toArray(),
    ])
    const fetchedMap = new Map(fetchedDatabases.map(d => [d.id, d]))

    const toUpdate = fetchedDatabases
      .map((d) => {
        const existing = fetchedMap.get(d.id)!
        const changes: Partial<Database> = {}

        if (existing.name !== d.name) {
          changes.name = d.name
        }

        const existingUrl = new URL(existing.connectionString)
        existingUrl.password = ''
        const fetchedUrl = new URL(d.connectionString)
        fetchedUrl.password = ''

        if (existingUrl.toString() !== fetchedUrl.toString()) {
          changes.connectionString = d.connectionString
          changes.isPasswordExists = !!d.isPasswordExists
          changes.isPasswordPopulated = !!new URL(d.connectionString).password
        }

        return {
          key: d.id,
          changes,
        }
      })

    await Promise.all([
      indexedDb.databases.bulkUpdate(toUpdate),
    ]);

    toUpdate.forEach(({ key }) => {
      queryClient.invalidateQueries({ queryKey: databaseQuery(key).queryKey })
    })
    queryClient.invalidateQueries({ queryKey: databasesQuery().queryKey })
  }
  catch (e) {
    console.error(e)
    toast.error('Failed to fetch databases. Please try again later.')
  }
}

export async function createDatabase({ saveInCloud, ...database }: {
  name: string
  type: DatabaseType
  connectionString: string
  saveInCloud: boolean
}) {
  const url = new URL(database.connectionString.trim())

  const isPasswordExists = !!url.password

  if (isPasswordExists && !saveInCloud) {
    url.password = ''
  }

  const id = crypto.randomUUID();
  // const { id } = await trpc.databases.create.mutate({
  //   ...database,
  //   connectionString: url.toString(),
  //   isPasswordExists,
  // })

  await indexedDb.databases.add({
    ...database,
    id,
    isPasswordExists,
    isPasswordPopulated: isPasswordExists,
    createdAt: new Date(),
  })

  return { id }
}

export async function removeDatabase(id: string) {
  await Promise.all([
    indexedDb.databases.delete(id),
  ])
}

export async function updateDatabasePassword(id: string, password: string) {
  const database = await indexedDb.databases.get(id)

  if (!database) {
    throw new Error('Database not found')
  }

  const url = new URL(database.connectionString)

  url.password = password
  database.connectionString = url.toString()
  database.isPasswordPopulated = true

  await indexedDb.databases.put(database)
}

export async function prefetchDatabaseCore(database: Database) {
  if (database.isPasswordExists && !database.isPasswordPopulated) {
    await queryClient.prefetchQuery(databaseQuery(database.id))
    return
  }

  await Promise.all([
    queryClient.prefetchQuery(databaseQuery(database.id)),
    queryClient.prefetchQuery(databaseTablesAndSchemasQuery(database)),
  ])

  await Promise.all([
    queryClient.prefetchQuery(databaseEnumsQuery(database)),
    queryClient.prefetchQuery(databasePrimaryKeysQuery(database)),
  ])
}

export async function prefetchDatabaseTableCore(database: Database, schema: string, table: string, query: {
  filters: WhereFilter[]
  orderBy: Record<string, 'ASC' | 'DESC'>
}) {
  await Promise.all([
    queryClient.prefetchInfiniteQuery(databaseRowsQuery(database, table, schema, query)),
    queryClient.prefetchQuery(databaseColumnsQuery(database, table, schema)),
    queryClient.prefetchQuery(databaseTableTotalQuery(database, table, schema, query)),
  ])
}

export async function getDatabaseContext(database: Database): Promise<typeof databaseContextType.infer> {
  const [result] = await dbQuery({
    type: database.type,
    connectionString: database.connectionString,
    query: contextSql()[database.type],
  })

  const { database_context } = result.rows[0] as { database_context: unknown }

  return databaseContextType.assert(database_context)
}
