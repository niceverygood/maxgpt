import React from 'react'
import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            MaxGPT
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            OpenAI GPT를 활용한 스마트 AI 채팅 도우미
          </p>
        </div>
        
        {/* 중앙 채팅 인터페이스 */}
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
        
        {/* 하단 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">스마트 대화</h3>
              <p className="text-sm text-gray-600">자연스러운 대화를 통해 다양한 질문에 답변을 받아보세요</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">파일 분석</h3>
              <p className="text-sm text-gray-600">텍스트, 코드 파일을 업로드하여 내용을 분석받아보세요</p>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-4">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">빠른 응답</h3>
              <p className="text-sm text-gray-600">실시간으로 빠르고 정확한 답변을 제공합니다</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 