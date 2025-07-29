import { GoogleTagManager } from '@next/third-parties/google';
import localFont from 'next/font/local';

import type { Metadata } from 'next';

import Footer from '@/components/Footer';

import './globals.css';

const pretendard = localFont({
  src: '../styles/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});

const pretendardMono = localFont({
  src: '../styles/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard-mono',
  weight: '45 920',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Korean Services Integration Kit For Next.js',
  description:
    '한국 웹 서비스들을 Next.js에 쉽게 통합하고 테스트할 수 있는 개발자 도구입니다. API를 실시간으로 테스트해보세요.',
  keywords: [
    '토스페이먼츠',
    '포트원',
    '채널톡',
    'Next.js',
    'Korean payment',
    'TossPayments',
    'PortOne',
    'ChannelTalk',
    '카카오 로그인',
    'Kakao Login'
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${pretendardMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">{children}</main>
        <Footer />
        <GoogleTagManager gtmId="GTM-KQHLJLS6" />
      </body>
    </html>
  );
}
