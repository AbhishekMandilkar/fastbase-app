import { sqliteTable, text, integer, index,} from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import {ConnectionConfig, ConnectionType} from '../types'

const genId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8)

const defaultRandom = () => genId()

const defaultNow = () => new Date()

export const connection = sqliteTable('connection', {
  id: text().primaryKey().$defaultFn(defaultRandom),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull().$defaultFn(defaultNow),
  nickname: text(),
  type: text().$type<ConnectionType>().notNull(),
  host: text(),
  port: text(),
  user: text(),
  config: text({ mode: 'json' }).$type<ConnectionConfig>(),
  password: text(),
  database: text().notNull(),
  favourite: integer({
    mode: 'boolean'
  }),
  url: text()
})

export type Connection = typeof connection.$inferSelect
export type ConnectionInsert = typeof connection.$inferInsert

export const query = sqliteTable(
  'query',
  {
    id: text().primaryKey().$defaultFn(defaultRandom),
    createdAt: integer({ mode: 'timestamp_ms' }).notNull().$defaultFn(defaultNow),
    connectionId: text().notNull(),
    title: text().notNull(),
    query: text().notNull(),
    isFavorite: integer({
      mode: 'boolean'
    })
  },
  (t) => {
    return {
      connectionId_idx: index('query_connectionId_idx').on(t.connectionId)
    }
  }
)

export type Query = typeof query.$inferSelect
export type QueryInsert = typeof query.$inferInsert
