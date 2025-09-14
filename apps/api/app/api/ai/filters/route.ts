// app/api/sql-filters/route.ts
import { SQL_OPERATORS_LIST } from '@fastbase/shared/utils/sql'
import { generateObject } from 'ai'
import { z } from 'zod'
import { NextResponse } from 'next/server'
import {autoModel} from '@/lib/ai'

const inputSchema = z.object({
  prompt: z.string(),
  context: z.string(),
})

const responseSchema = z.array(
  z.object({
    column: z.string(),
    operator: z.enum(SQL_OPERATORS_LIST.map((op) => op.value) as [string, ...string[]]),
    value: z.string(),
  })
)

export async function OPTIONS() {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3002',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = inputSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.format() },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3002',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      )
    }

    const { prompt, context } = parsed.data

    console.info('sql filters input', { prompt, context })

    const { object } = await generateObject({
      model: autoModel,
      system: `
        You are a SQL filter generator that converts natural language queries into precise database filters.
        You should understand the sense of the prompt as much as possible, as users can ask with just a few words without any context.
        If you do not generate any filters, a user will not be able to filter the data.

        Guidelines:
        - Return an empty array if the prompt is unclear or cannot be converted to filters
        - Create multiple filters when the query has multiple conditions
        - Use exact column names as provided in the context
        - Choose the most appropriate operator for each condition
        - Format values correctly based on column types (strings, numbers, dates, etc.)
        - For enum columns, ensure values match the available options
        - For exact days use >= and <= operators
        - If user asks 'empty' and the column is a string, use empty string as value

        Current time: ${new Date().toISOString()}
        Available operators: ${JSON.stringify(SQL_OPERATORS_LIST, null, 2)}

        Table context:
        ${context}
      `,
      prompt,
      schema: responseSchema.element,
      schemaDescription:
        'An array of objects with the following properties: column, operator, value where the operator is one of the SQL operators available',
      output: 'array',
    })

    console.info('sql filters result object', object)

    return NextResponse.json(object, {
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3002',
        'Access-Control-Allow-Credentials': 'true',
      }
    })
  } catch (error) {
    console.error('Unexpected error in /api/sql-filters:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3002',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )
  }
}