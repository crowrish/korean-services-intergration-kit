import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';

import Footer from '@/components/Footer';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
