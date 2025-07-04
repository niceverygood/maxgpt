# MaxGPT - AI 채팅 도우미

React + Next.js 기반의 GPT 채팅 웹 애플리케이션입니다.

## 🚀 기능

- 실시간 GPT 채팅 인터페이스
- 오른쪽 하단 고정 채팅 위젯
- 반응형 디자인 (Tailwind CSS)
- 메시지 히스토리 유지
- 타이핑 인디케이터
- 매끄러운 애니메이션

## 📋 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/account/api-keys)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 🛠️ 기술 스택

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5-turbo
- **Language**: TypeScript

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI API 연동
│   ├── globals.css           # 글로벌 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 메인 페이지
└── components/
    └── ChatWidget.tsx       # 채팅 위젯 컴포넌트
```

## 🎨 UI 특징

- **고정 채팅 위젯**: 우측 하단에 고정되어 있어 언제든지 접근 가능
- **반응형 디자인**: 모든 디바이스에서 최적화된 UI
- **메시지 애니메이션**: 새 메시지가 나타날 때 부드러운 애니메이션
- **타이핑 인디케이터**: AI가 응답을 생성하는 동안 로딩 표시

## 📝 사용 방법

1. 페이지 오른쪽 하단의 파란색 채팅 아이콘을 클릭합니다.
2. 채팅창이 열리면 메시지를 입력하고 Enter를 누르거나 전송 버튼을 클릭합니다.
3. AI가 응답을 생성하면 채팅창에 표시됩니다.
4. 연속적인 대화가 가능하며, 이전 대화 내용을 기억합니다.

## 🔧 빌드 및 배포

### 빌드

```bash
npm run build
```

### 로컬 프로덕션 실행

```bash
npm start
```

## 🚨 주의사항

- OpenAI API 키가 필요합니다.
- API 사용량에 따라 요금이 부과될 수 있습니다.
- 환경변수 파일(.env.local)은 절대 커밋하지 마세요.

## 🚀 배포 가이드

### Netlify 배포

1. **GitHub 연결**: Netlify 계정에서 이 저장소를 연결
2. **환경변수 설정**: Netlify Dashboard → Site settings → Environment variables
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. **빌드 설정**: `netlify.toml` 파일이 자동으로 설정을 처리합니다
4. **배포**: 자동으로 빌드 및 배포됩니다

### 수동 배포 명령어

```bash
# 프로덕션 빌드
npm run build

# 로컬에서 프로덕션 모드 실행
npm start
```

## 📄 라이선스

MIT License 