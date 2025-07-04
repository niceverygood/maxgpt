'use client'

import React, { useState, useRef, useEffect } from 'react'
// PDF.js는 클라이언트 사이드에서만 동적으로 로드

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  fileName?: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])



  // 텍스트 파일 읽기 함수
  const readTextFile = async (file: File): Promise<string> => {
    try {
      const text = await file.text()
      return text
    } catch (error) {
      console.error('텍스트 파일 읽기 오류:', error)
      throw new Error('텍스트 파일을 읽을 수 없습니다.')
    }
  }

  // 파일 업로드 처리 함수
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.')
      return
    }

    // 지원되는 파일 형식 확인 (현재는 텍스트 파일만)
    const supportedTypes = [
      'text/plain',
      'text/markdown',
      'application/json',
    ]

    const isTextFile = supportedTypes.includes(file.type) || 
                      file.name.endsWith('.txt') || 
                      file.name.endsWith('.md') ||
                      file.name.endsWith('.json') ||
                      file.name.endsWith('.js') ||
                      file.name.endsWith('.ts') ||
                      file.name.endsWith('.jsx') ||
                      file.name.endsWith('.tsx') ||
                      file.name.endsWith('.css') ||
                      file.name.endsWith('.html')

    if (!isTextFile) {
      alert('현재는 텍스트 파일만 지원합니다. (.txt, .md, .json, .js, .ts, .jsx, .tsx, .css, .html)')
      return
    }

    setIsLoading(true)

    try {
      let fileContent = ''
      
      // 모든 파일을 텍스트로 읽기
      fileContent = await readTextFile(file)

      // 파일 내용이 너무 길면 자르기 (토큰 제한 고려)
      const maxLength = 15000 // 약 4000 토큰 정도
      if (fileContent.length > maxLength) {
        fileContent = fileContent.substring(0, maxLength) + '\n\n[파일이 너무 길어 일부만 표시됩니다.]'
      }

      // 파일 업로드 메시지 추가
      const fileMessage: Message = {
        id: Date.now().toString(),
        text: `📎 ${file.name}`,
        isUser: true,
        timestamp: new Date(),
        fileName: file.name
      }

      setMessages(prev => [...prev, fileMessage])

      // GPT에게 파일 분석 요청 (UI에 표시되지 않음)
      const analysisPrompt = `파일명: ${file.name}\n\n파일 내용:\n${fileContent}\n\n위 파일을 분석해주세요.`
      
      // 직접 API 호출하여 분석 요청
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: analysisPrompt,
            messages: messages.map(msg => ({
              role: msg.isUser ? 'user' : 'assistant',
              content: msg.text
            }))
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to analyze file')
        }

        const data = await response.json()
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || '죄송합니다. 파일 분석 중 오류가 발생했습니다.',
          isUser: false,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, botMessage])
      } catch (error) {
        console.error('Error analyzing file:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: '죄송합니다. 파일 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }

    } catch (error) {
      console.error('파일 업로드 오류:', error)
      alert('파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const sendMessage = async (text: string, fileName?: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      fileName: fileName
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.',
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 메시지를 전송하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* 헤더 */}
      <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold">MaxGPT</h2>
            <p className="text-sm text-blue-100">AI 채팅 도우미</p>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg">안녕하세요! 👋</p>
            <p className="text-sm mt-2">궁금한 것이 있으시면 언제든지 물어보세요!</p>
            <p className="text-xs mt-2 text-gray-400">파일 업로드(+)나 메시지를 입력해보세요</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-appear`}
          >
            <div
              className={`max-w-lg px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              <div className="text-sm">
                {message.fileName ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>{message.text}</span>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}
              </div>
              <p className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t p-6">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          {/* 파일 업로드 버튼 */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-xl px-4 py-3 transition-colors flex-shrink-0"
            title="파일 업로드"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          
          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.css,.html"
            className="hidden"
          />
          
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-3 transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
} 