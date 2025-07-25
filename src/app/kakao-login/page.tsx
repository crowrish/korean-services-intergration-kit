'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import CodeBlock from '@/components/CodeBlock';
import { kakaoExamples } from '@/lib/code-examples/kakao-login';
import { getImagePath } from '@/lib/image-utils';

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Auth: {
        authorize: (settings: {
          redirectUri?: string;
          scope?: string;
          prompt?: string;
          throughTalk?: boolean;
        }) => void;
      };
    };
  }
}

export default function KakaoLoginPage() {
  const [appKey, setAppKey] = useState('');
  const [isKakaoReady, setIsKakaoReady] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [loginResult, setLoginResult] = useState<{
    type: 'success' | 'error' | 'info';
    data: Record<string, unknown>;
  } | null>(null);

  const handleKakaoLoad = () => {
    setIsKakaoReady(true);
  };

  // 페이지 로드 시 URL에서 authorization code 확인 및 현재 URL 설정
  useEffect(() => {
    // 현재 URL 설정 (쿼리 파라미터 제외, 트레일링 슬래시 제거)
    const baseUrl = window.location.href.split('?')[0].replace(/\/$/, '');
    setCurrentUrl(baseUrl);

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    if (code) {
      setLoginResult({
        type: 'success',
        data: { 
          message: '인증 코드를 받았습니다!',
          authorizationCode: code,
          nextStep: '이 코드를 서버로 전송하여 access token으로 교환하세요.'
        }
      });
      
      // URL에서 파라미터 제거
      const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
    } else if (error) {
      setLoginResult({
        type: 'error',
        data: { 
          error: error,
          errorDescription: errorDescription || '인증 중 오류가 발생했습니다.'
        }
      });
      
      // URL에서 파라미터 제거
      const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleOfficialLogin = () => {
    if (!appKey.trim()) {
      alert('앱 키를 입력해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(appKey);
    }

    try {
      // 공식 SDK 방식 - 현재 페이지가 리다이렉트됨
      window.Kakao.Auth.authorize({
        redirectUri: window.location.href.split('?')[0].replace(/\/$/, '') // 현재 전체 URL (쿼리 파라미터 제외, 트레일링 슬래시 제거)
      });
      
    } catch (err) {
      console.error('로그인 실패:', err);
      setLoginResult({
        type: 'error',
        data: { error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' }
      });
    }
  };

  const handlePopupLogin = () => {
    if (!appKey.trim()) {
      alert('앱 키를 입력해주세요.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(appKey);
    }

    try {
      // 팝업 창 생성
      const popup = window.open(
        '',
        'kakaoLogin',
        'width=500,height=600,scrollbars=no,resizable=no'
      );

      if (!popup) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        return;
      }

      // 팝업 창에 로딩 메시지 표시
      const loadingHTML = `
        <html>
          <head><title>카카오 로그인</title></head>
          <body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;">
            <div style="text-align:center;">
              <div>카카오 로그인 페이지로 이동 중...</div>
              <div style="margin-top:20px;">잠시만 기다려주세요.</div>
            </div>
          </body>
        </html>
      `;
      
      if (popup.document) {
        popup.document.open();
        popup.document.write(loadingHTML);
        popup.document.close();
      }

      // 인증 URL 생성
      const currentUrl = window.location.href.split('?')[0].replace(/\/$/, ''); // 현재 전체 URL (쿼리 파라미터 제외, 트레일링 슬래시 제거)
      const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${appKey}&redirect_uri=${encodeURIComponent(currentUrl)}&response_type=code`;
      
      // 팝업에서 인증 페이지로 이동
      setTimeout(() => {
        popup.location.href = authUrl;
      }, 500);

      // 팝업 창 모니터링 (선택사항)
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoginResult({
            type: 'info',
            data: { message: '팝업 창이 닫혔습니다.' }
          });
        }
      }, 1000);

      setLoginResult({
        type: 'success',
        data: { message: '팝업 창에서 카카오 로그인을 진행해주세요.' }
      });
      
    } catch (err) {
      console.error('로그인 실패:', err);
      setLoginResult({
        type: 'error',
        data: { error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
        integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
        crossOrigin="anonymous"
        onLoad={handleKakaoLoad}
      />

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
            <div className="w-16 h-16 bg-[#FDDC3F] border border-gray-200 rounded-lg flex items-center justify-center p-3 shadow-sm">
              <Image
                src={getImagePath('/logos/kakao.png')}
                alt="Kakao logo"
                width={40}
                height={40}
                className="object-contain rounded"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">카카오 로그인 Kakao Login</h1>
              <p className="text-gray-600">카카오 JS SDK</p>
            </div>
          </div>

          <p className="text-gray-700 max-w-3xl">
            카카오 JS SDK를 사용해서 로그인 테스트를 진행해보세요.
            JavaScript Key를 입력하면 두 가지 방식으로 카카오 로그인을 테스트해볼 수 있습니다:
            <br />• 공식 방식 (리다이렉트) • 팝업 방식
          </p>

          <div className="mt-4 flex gap-4">
            <Link
              href="https://developers.kakao.com/tool/demo/login/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              카카오 로그인 데모 →
            </Link>
            <Link
              href="https://developers.kakao.com/sdk/reference/js/release/Kakao.Auth.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              카카오 SDK 참조 문서 →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column - App Key Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                JavaScript Key 입력
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="appKey"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    JavaScript Key
                  </label>
                  <input
                    type="text"
                    id="appKey"
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    placeholder="카카오 앱의 JavaScript Key를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleOfficialLogin}
                    disabled={!isKakaoReady || !appKey.trim()}
                    className="w-full px-4 py-3 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-medium"
                  >
                    {!isKakaoReady ? '카카오 SDK 로딩 중...' : '테스트 (공식 방식)'}
                  </button>
                  <button
                    onClick={handlePopupLogin}
                    disabled={!isKakaoReady || !appKey.trim()}
                    className="w-full px-4 py-3 bg-yellow-300 text-yellow-900 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed font-medium"
                  >
                    {!isKakaoReady ? '카카오 SDK 로딩 중...' : '테스트 (팝업)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Login Result */}
            {loginResult && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">로그인 결과</h3>
                  <button
                    onClick={() => setLoginResult(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      loginResult.type === 'error'
                        ? 'bg-red-100 text-red-800'
                        : loginResult.type === 'info'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {loginResult.type === 'error' ? '❌ 로그인 실패' : 
                     loginResult.type === 'info' ? 'ℹ️ 정보' : 
                     '✅ 로그인 성공'}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(loginResult.data, null, 2)}
                  </pre>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        JSON.stringify(loginResult.data, null, 2)
                      );
                      alert('결과가 클립보드에 복사되었습니다.');
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                  >
                    JSON 복사
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Setup Guide */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                설정 가이드
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      카카오 디벨로퍼스 계정 생성
                    </p>
                    <p>카카오 디벨로퍼스 사이트에서 계정을 생성하고 앱을 등록하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">플랫폼 등록</p>
                    <p>웹 플랫폼을 추가하고 사이트 도메인을 등록하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Redirect URI 등록</p>
                    <p className="mb-2">카카오 로그인 → Redirect URI에 다음 URI들을 등록하세요:</p>
                    
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">현재 페이지 URL (권장):</p>
                        <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                          {currentUrl || '[현재페이지URL]'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">💡 이 URL을 복사해서 사용하면 모든 환경에서 작동합니다</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1">또는 수동으로 등록:</p>
                        <div className="space-y-1">
                          <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                            http://localhost:3000/kakao-login
                          </div>
                          <div className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                            https://crowrish.github.io/korean-services-intergration-kit/kakao-login
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      href="https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-redirect-uri"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Redirect URI 등록 방법 보기 →
                    </Link>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">카카오 로그인 활성화</p>
                    <p>제품 설정에서 카카오 로그인을 활성화하고 필요한 동의항목을 설정하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs font-medium">
                    5
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">JavaScript Key 확인</p>
                    <p>앱 설정에서 JavaScript Key를 확인하고 위에 입력하세요.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SDK Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                SDK 상태
              </h3>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isKakaoReady ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isKakaoReady ? 'Kakao SDK 로드 완료' : 'Kakao SDK 로딩 중...'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            구현 참고사항
          </h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>• <strong>공식 방식:</strong> 현재 페이지가 카카오 로그인 페이지로 리다이렉트되며, 인증 완료 후 등록된 Redirect URI로 돌아옵니다.</p>
            <p>• <strong>팝업 방식:</strong> 별도 팝업 창에서 로그인이 진행되며, 메인 페이지는 그대로 유지됩니다.</p>
            <p>• 인증 성공 시 authorization code를 받게 되며, 이를 서버에서 access token으로 교환해야 합니다.</p>
            <p>• 실제 서비스에서는 받은 토큰을 서버로 전송하여 사용자 정보를 안전하게 처리해야 합니다.</p>
            <p>• 개발 환경에서는 localhost 도메인이 Redirect URI에 등록되어 있어야 정상 작동합니다.</p>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          {/* SDK 설치 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              SDK 설치 및 초기화
            </h3>
            <p className="text-yellow-700 text-sm mb-4">
              카카오 JavaScript SDK를 로드하고 초기화하는 방법입니다.
            </p>

            <div className="space-y-4">
              <CodeBlock
                title="HTML 스크립트 방식"
                language="html"
                code={kakaoExamples.htmlScript}
              />

              <CodeBlock
                title="Next.js Script 컴포넌트 방식 (권장)"
                language="tsx"
                code={kakaoExamples.nextjsScript}
              />
            </div>
          </div>

          {/* 공식 로그인 구현 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              공식 로그인 구현 (리다이렉트 방식)
            </h3>
            <p className="text-green-700 text-sm mb-4">
              카카오 공식 SDK를 사용한 표준 로그인 방식입니다. 현재 페이지가 카카오 로그인 페이지로 리다이렉트됩니다.
            </p>

            <CodeBlock
              title="공식 로그인 구현"
              language="javascript"
              code={kakaoExamples.officialLogin}
            />
          </div>

          {/* 팝업 로그인 구현 */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              팝업 로그인 구현
            </h3>
            <p className="text-purple-700 text-sm mb-4">
              팝업 창에서 카카오 로그인을 진행하는 방식입니다. 메인 페이지는 그대로 유지됩니다.
            </p>

            <CodeBlock
              title="팝업 로그인 구현"
              language="javascript"
              code={kakaoExamples.popupLogin}
            />
          </div>

        </div>
      </div>
    </div>
  );
}