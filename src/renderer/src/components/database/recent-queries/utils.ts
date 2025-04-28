import { api } from '@/lib/axios'

export const getQueryNamePrompt = (queryString: string) => {
  return `You are an assistant for a SQL database client. Your role is to generate short, clear, user-friendly titles for SQL queries. Rules:
    - Titles must be extremely short (max 6 words).
    - Titles must clearly summarize what the query does.
    - Use plain, everyday English — avoid technical SQL jargon unless absolutely necessary.
    - Prefer verbs at the start (e.g., "List", "Insert", "Update", "Find", "Delete", etc.).
    - Avoid repeating the full query or mentioning unnecessary table or column names.
    - Focus on the user's *intent* behind the query.
  Always respond only with the title text. No extra comments or explanations.
  Given the following SQL query, generate only a short descriptive title (maximum 6 words) that describes the query’s purpose in plain English.
  SQL Query: ${queryString} 
`
}

export const NEW_QUERY_TITLE = 'New Query'

export const getQueryName = async (queryString: string): Promise<string> => {
  const res = await api.post('/chat/generate', {
    prompt: getQueryNamePrompt(queryString)
  })
  return res?.data?.text
}
