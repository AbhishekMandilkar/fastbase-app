import {ColumnMeta, ForeignKeyMeta} from "./useDatabaseStructure";

export const systemPrompt = ({
    schema,
  }: {
    schema: string;
  }) => 
    `You are a SQL expert specialized in PostgreSQL. Your task is to convert natural language questions into safe and accurate SQL SELECT queries, based on the given schema.
  
  The schema below represents all relevant tables, their columns, data types, nullability, primary keys, foreign keys, and relationships:
  
  ${schema}
  
  Guidelines:
  
  1. **Only generate SELECT queries.** Do not generate INSERT, UPDATE, DELETE, DROP, or any other DDL/DML statements.
  2. Always return at least two columns if possible (e.g. aggregations should include group-by columns).
  3. **NULLABLE fields** should be considered for filtering with IS NOT NULL or appropriate null-safe logic.
  4. **Foreign key relations** should be used for JOINs where applicable — use foreign key references to infer table relationships.
  5. For string matches, use ILIKE and LOWER() when comparing user-provided values.
  6. For partial matches, use "ILIKE '%term%'".
  7. When users ask for trends, return grouped results with appropriate time intervals (e.g., YEAR(date_column)).
  8. If the user asks for a "rate" or percentage, return decimals (e.g., 0.1 for 10%).
  9. Infer semantic meaning of user questions — e.g., "active users" could mean a column like "is_active = true".
  10. Always alias aggregate results clearly, like "COUNT(*) AS total_users".
  
  Output the SQL query only.
  `;
  


export function formatSchemaForPrompt(columns: ColumnMeta[]): string {
  console.log(columns)
  const mappedObject = Object.groupBy(columns, (col) => col.table_name)
  console.log(mappedObject)
  const formatted = Object.entries(mappedObject)
    .map(([table, fields]) => {
      return `Table Name: ${table}\n  columns:\n${fields?.map((field) => {
        return `- ${field.column_name} ${field.data_type} ${field.is_nullable} ${field.column_default}`
      }).join('\n')}`
    })
    .join('\n\n')

  return formatted
}

export function formatForeignKeysForPrompt(
  foreignKeys: ForeignKeyMeta[],
  inline: boolean = false
): Record<string, string[]> | string {
  if (inline) {
    // Inline version: embed FK info per table
    const tableFKs: Record<string, string[]> = {}
    foreignKeys.forEach((fk) => {
      const line = `- ${fk.column_name} → ${fk.foreign_table}.${fk.foreign_column} (foreign key)`
      if (!tableFKs[fk.table_name]) {
        tableFKs[fk.table_name] = []
      }
      tableFKs[fk.table_name].push(line)
    })
    return tableFKs
  } else {
    // Global FK section version
    const lines = foreignKeys.map(
      (fk) => `- ${fk.table_name}.${fk.column_name} → ${fk.foreign_table}.${fk.foreign_column}`
    )
    return `\n Foreign Keys:\n${lines.join('\n')}`
  }
}
