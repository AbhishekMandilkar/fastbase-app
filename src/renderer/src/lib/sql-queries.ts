export const getTableSchemaQuery = (tableName: string) => {
  return `SELECT column_name, data_type, column_default, is_nullable, character_maximum_length
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_name = '${tableName}';`
}

export const getTableContraintsQuery = (tableName: string) => {
  return `SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE 
    tc.table_name = '${tableName}';`
}

export const getDatabaseTableStructure = (schema?: string) => {
  return `SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM
  information_schema.columns
WHERE
  table_schema = '${schema || 'public'}'
ORDER BY
  table_name, ordinal_position;
`
}

export const getAllForeignKeyConstraints = () => {
  return `SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints AS tc
JOIN
  information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN
  information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE
  constraint_type = 'FOREIGN KEY';
`
}
