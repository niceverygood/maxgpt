import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const { message, messages = [] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // 파일 분석 요청인지 확인
    const isFileAnalysis = message.includes('파일명:') && message.includes('파일 내용:')
    
    // OpenAI API 호출을 위한 메시지 형식 구성
    const systemMessage = {
      role: 'system' as const,
      content: isFileAnalysis 
        ? '당신은 파일 분석 전문가입니다. 업로드된 파일의 내용을 자세히 분석하고, 주요 내용을 요약하며, 핵심 포인트를 정리해서 한국어로 설명해주세요. 파일의 구조, 중요한 정보, 그리고 사용자가 알아야 할 핵심 내용을 포함해서 답변해주세요.'
        : '당신은 친절하고 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 정확하고 유용한 답변을 제공해주세요. 한국어로 답변해주세요.'
    }

    const conversationMessages = [
      systemMessage,
      ...messages,
      {
        role: 'user' as const,
        content: message
      }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationMessages,
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || '죄송합니다. 응답을 생성할 수 없습니다.'

    return NextResponse.json({ response })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // OpenAI API 에러 처리
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        )
      } else if (error.status === 429) {
        return NextResponse.json(
          { error: 'API rate limit exceeded' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 