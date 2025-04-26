import useSqlQuery from '@/components/database/hooks/use-sql-query'
import { getAllForeignKeyConstraints, getDatabaseTableStructure } from '@/lib/sql-queries'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router'

export type ColumnMeta = {
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

export type ForeignKeyMeta = {
  table_name: string
  column_name: string
  foreign_table: string
  foreign_column: string
}

const useDatabaseStructure = () => {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  const { handleQuery } = useSqlQuery()


  const fetchDatabaseStructure = async () => {
    const tableStructureSQL = getDatabaseTableStructure()
    const foreignKeysSQL = getAllForeignKeyConstraints()
    const [tableStructure, foreignKeys] = await Promise.all([
      handleQuery(tableStructureSQL),
      handleQuery(foreignKeysSQL)
    ])
    return { tableStructure, foreignKeys }
  }

  const databaseStructure = useQuery({
    queryKey: ['databaseStructure', connectionId],
    queryFn: fetchDatabaseStructure,
    enabled: !!connectionId
  })

  return databaseStructure
}

export default useDatabaseStructure
