# Korean Services Integration Kit

한국의 주요 SaaS들을 Next.js에 쉽게 통합하고 테스트할 수 있는 개발자 도구입니다. 🔑API 키만 준비하세요!

🌐 **Live Demo**: https://crowrish.github.io/korean-services-intergration-kit/

## 🚀 주요 기능

- **실시간 테스트**: API 키만 입력하면 즉시 서비스 연동 테스트 가능
- **코드 예제 제공**: 각 서비스별 구현 예제와 문서
- **Next.js 최적화**: App Router, next/script 적용

## 📦 지원하는 기능

- **Channel Talk**: 고객상담 채팅 위젯 통합
- **PortOne v1 (아임포트)**: 기존 아임포트 결제 시스템
- **PortOne v2**: PortOne v2 결제 API
- **TossPayments**: 토스페이먼츠 결제 위젯

## 🔗 관련 링크

- [Channel Talk 개발자 문서](https://developers.channel.io/docs)
- [PortOne 개발자 문서](https://developers.portone.io/)
- [TossPayments 개발자 문서](https://docs.tosspayments.com/)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [아임포트 TypeScript 타입 정의](https://github.com/junhoyeo/iamport-typings)

## 🔧 사용 방법

### 각 서비스별 설정

#### Channel Talk
1. [Channel Talk](https://channel.io) 계정 생성
2. Plugin Key 확인
3. 애플리케이션에서 Plugin Key 입력 후 테스트

#### PortOne v1 (아임포트)
1. [PortOne](https://portone.io) 계정 생성
2. v1 상점 생성
3. Merchant ID 확인 (imp_)
4. PG사 설정 후 테스트

#### PortOne v2
1. [PortOne](https://portone.io) 계정 생성
2. v2 상점 생성
3. Store ID 및 Channel Key 확인
4. 결제 수단 설정 후 테스트

#### TossPayments
1. [TossPayments](https://www.tosspayments.com) 가맹점 계정 생성
2. Client Key 확인
3. 결제 위젯으로 테스트

## 🐛 문제 해결

### 자주 발생하는 문제

1. **스크립트 로드 실패**: 네트워크 상태 및 방화벽 설정 확인
2. **결제 위젯 렌더링 실패**: DOM 요소가 존재하는지 확인
3. **TypeScript 오류**: 패키지 타입 정의 설치 확인

### 디버깅 팁

- 브라우저 개발자 도구의 콘솔 확인
- 네트워크 탭에서 API 호출 상태 확인
- React DevTools로 컴포넌트 상태 확인

## 🛠 기술 스택

- **Frontend**: Next.js 15.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Code Quality**: ESLint, Prettier
- **Package Manager**: npm

## 📋 시스템 요구사항

- Node.js 18.17 이상
- npm 9 이상

## ⚡ 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/nextjs-korea-services-kit.git
cd nextjs-korea-services-kit
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📄 라이선스

MIT License

## ⭐ 지원

이 프로젝트가 도움이 되었다면 ⭐를 눌러주세요!

버그 리포트는 [Issues](https://github.com/your-username/nextjs-korea-services-kit/issues)에서 등록해 주세요.
