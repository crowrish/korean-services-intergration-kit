'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ApiKeyInput from '@/components/ApiKeyInput';
import CodeBlock from '@/components/CodeBlock';
import LiveDemo from '@/components/LiveDemo';
import { channelTalkExamples } from '@/lib/code-examples/channeltalk';
import {
  initializeChannelTalk,
  removeChannelTalk,
  validateChannelTalkKey,
} from '@/lib/services/channeltalk';

export default function ChannelTalkPage() {
  const [pluginKey, setPluginKey] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [showChannelIconIndicator, setShowChannelIconIndicator] =
    useState(false);

  useEffect(() => {
    return () => {
      removeChannelTalk();
    };
  }, []);

  const handlePluginKeyChange = (value: string) => {
    setPluginKey(value);
    setIsValid(validateChannelTalkKey(value));
    if (isActive) {
      setIsActive(false);
      removeChannelTalk();
    }
  };

  const handleStartTest = async () => {
    if (validateChannelTalkKey(pluginKey)) {
      const success = await initializeChannelTalk({ pluginKey });
      setIsActive(success);

      // 성공적으로 초기화되면 우하단 아이콘 표시 효과
      if (success) {
        setShowChannelIconIndicator(true);
        // 5초 후 표시 효과 제거
        setTimeout(() => {
          setShowChannelIconIndicator(false);
        }, 5000);
      }
    }
  };

  const stopTest = () => {
    removeChannelTalk();
    setIsActive(false);
    setShowChannelIconIndicator(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            홈으로 돌아가기
          </Link>

          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-3 shadow-sm">
              <Image
                src="/logos/channeltalk.png"
                alt="Channel Talk logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Channel Talk</h1>
              <p className="text-gray-600">채널톡 고객상담 채팅 위젯 통합</p>
            </div>
          </div>

          <p className="text-gray-700 max-w-3xl">
            채널톡은 웹사이트에 실시간 고객상담 채팅 위젯을 제공하는
            서비스입니다. Plugin Key를 입력하면 실제 채팅 위젯이 페이지 우측
            하단에 나타납니다.
          </p>

          <div className="mt-4 flex gap-4">
            <Link
              href="https://developers.channel.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              채널톡 개발자 문서 보기 →
            </Link>
            <Link
              href="https://channel-io.github.io/channel-web-sdk-loader/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Channel Web SDK Loader →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* API Key Input */}
            <ApiKeyInput
              label="Plugin Key"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={pluginKey}
              onChange={handlePluginKeyChange}
              onSubmit={handleStartTest}
              isValid={isValid}
            />

            {/* Live Demo */}
            <LiveDemo isActive={isActive}>
              {isActive ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      채널톡 위젯이 활성화되었습니다!
                    </span>
                  </div>
                  <p className="text-gray-600 mt-4">
                    페이지 우측 하단에 채팅 위젯이 표시됩니다.
                  </p>
                  <button
                    onClick={stopTest}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    테스트 중지
                  </button>
                </div>
              ) : null}
            </LiveDemo>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Setup Guide */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                설정 가이드
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">채널톡 회원가입</p>
                    <p>채널톡 웹사이트에서 무료 계정을 생성하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">플러그인 설정</p>
                    <p>설정 &gt; 메신저 설정에서 플러그인을 활성화하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Plugin Key 복사</p>
                    <p>설정 &gt; 개발자 설정에서 Plugin Key를 복사하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">웹사이트에 적용</p>
                    <p>위의 코드를 웹사이트에 추가하세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples - Full Width */}
        <div className="space-y-8 mt-8">
          {/* NPM Module Option */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              옵션 1: NPM 모듈 사용 (권장)
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              패키지 관리자를 통해 안정적으로 설치하고 타입스크립트 지원을 받을
              수 있습니다.
            </p>

            <div className="space-y-4">
              <CodeBlock
                title="NPM 모듈 설치"
                language="bash"
                code={channelTalkExamples.npmInstall}
              />

              <CodeBlock
                title="NPM 모듈 React 사용법"
                language="tsx"
                code={channelTalkExamples.npmReactUsage(pluginKey)}
              />
            </div>
          </div>

          {/* Direct Implementation Option */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              옵션 2: 직접 구현
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              TypeScript로 직접 채널톡 서비스를 구현하는 방식입니다. 더 자세한
              내용은{' '}
              <a
                href="https://developers.channel.io/reference/web-quickstart-kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Channel.io 개발자 문서
              </a>
              를 참고하세요.
            </p>

            <div className="space-y-4">
              <CodeBlock
                title="TypeScript 서비스 클래스 작성"
                language="tsx"
                code={channelTalkExamples.spaTypeScript}
              />

              <CodeBlock
                title="React SPA 컴포넌트 사용법"
                language="tsx"
                code={channelTalkExamples.spaReactUsage(pluginKey)}
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  중요 안내
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  위의 두 옵션 중 하나만 선택해서 사용하세요. 두 방식을 동시에
                  사용하면 스크립트가 중복 로드될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 채널톡 아이콘 표시 효과 */}
      {showChannelIconIndicator && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            {/* 파동 애니메이션 */}
            <div className="w-14 h-14 rounded-full bg-blue-400 animate-ping"></div>
            <div
              className="absolute inset-0 w-14 h-14 rounded-full bg-blue-400 animate-ping"
              style={{ animationDelay: '0.5s' }}
            ></div>

            {/* 화살표 포인터 */}
            <div className="absolute top-1/2 -left-60 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
              채널톡 위젯이 여기에 나타났습니다!
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
