import { NextRequest, NextResponse } from "next/server"
import { generateStream, models, autoModel } from "../../../../lib/ai"
import { AiSqlChatModel } from "@fastbase/shared/enums/ai-chat-model"
import { openai } from "@ai-sdk/openai"

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

export async function POST(request: NextRequest) {
  try {
    console.log('Request received')
    const body = await request.json()
    const { type, messages, context, model, currentQuery = '' } = body

    try {
      const result = generateStream({
        type,
        model: !model || model === 'auto' ? autoModel : models[model as AiSqlChatModel],
        context,
        messages,
        currentQuery,
        signal: request.signal,
      })

      const response = result.toDataStreamResponse({
        headers: {
          'Transfer-Encoding': 'chunked',
        },
      })

      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3002')
      response.headers.set('Access-Control-Allow-Credentials', 'true')

      return response
    } catch (error) {
      const isOverloaded = error instanceof Error && error.message.includes('Overloaded')

      if (isOverloaded) {
        console.log('Fallback model')

        const result = generateStream({
          type,
          model: openai('gpt-4o-mini'),
          context,
          messages,
          currentQuery,
          signal: request.signal,
        })

        const response = result.toDataStreamResponse({
          headers: {
            'Transfer-Encoding': 'chunked',
          },
        })

        response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3002')
        response.headers.set('Access-Control-Allow-Credentials', 'true')

        return response
      }

      throw error
    }
  } catch (error) {
    console.error('Error in sql-chat endpoint:', error)

    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3002',
          'Access-Control-Allow-Credentials': 'true',
        },
      }
    )
  }
}
