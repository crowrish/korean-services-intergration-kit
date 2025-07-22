'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';

import type { RequestPayResponse } from 'iamport-typings';

import ApiKeyInput from '@/components/ApiKeyInput';
import CodeBlock from '@/components/CodeBlock';
import LiveDemo from '@/components/LiveDemo';
import { getImagePath } from '@/lib/image-utils';
import { portoneV1Examples } from '@/lib/code-examples/portone-v1';
import {
  PaymentData,
  cleanupIamport,
  initializeIamport,
  isIamportReady,
  onScriptLoad,
  requestPayment,
  validateIamportMerchantId,
} from '@/lib/services/iamport';

export default function IamportPage() {
  const [merchantId, setMerchantId] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [productName, setProductName] = useState('테스트 상품');
  const [amount, setAmount] = useState('1000');
  const [paymentResult, setPaymentResult] = useState<RequestPayResponse | null>(
    null
  );

  useEffect(() => {
    return () => {
      cleanupIamport();
    };
  }, []);

  const handleMerchantIdChange = (value: string) => {
    setMerchantId(value);
    setIsValid(validateIamportMerchantId(value));
    if (isActive) {
      setIsActive(false);
      cleanupIamport();
    }
  };

  const handleStartTest = () => {
    if (validateIamportMerchantId(merchantId)) {
      const success = initializeIamport(merchantId);
      if (success) {
        setIsActive(true);
      } else {
        alert('스크립트가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const stopTest = () => {
    cleanupIamport();
    setIsActive(false);
    setPaymentResult(null);
  };

  const handleTestPayment = async () => {
    if (!isActive || !isIamportReady()) {
      alert('먼저 PortOne v1을 초기화해주세요.');
      return;
    }

    setIsPaymentLoading(true);

    const paymentData: PaymentData = {
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: 'merchant_' + new Date().getTime(),
      name: productName,
      amount: parseInt(amount),
      buyer_email: 'test@example.com',
      buyer_name: '테스트 구매자',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시 강남구',
      buyer_postcode: '12345',
    };

    try {
      await requestPayment(paymentData, (response) => {
        // 결제 결과를 state에 저장
        setPaymentResult(response);
      });
    } catch (error) {
      console.error('결제 실패:', error);
      // 실패한 경우에도 결과를 저장 (이미 onResult에서 처리됨)
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://cdn.iamport.kr/v1/iamport.js"
        strategy="lazyOnload"
        onLoad={onScriptLoad}
      />
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
                  src={getImagePath('/logos/portone.png')}
                  alt="PortOne logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">PortOne v1</h1>
                <p className="text-gray-600">PortOne v1 결제 시스템 통합</p>
              </div>
            </div>

            <p className="text-gray-700 max-w-3xl">
              PortOne v1은 한국의 주요 온라인 결제 서비스입니다. v2와는 별도의
              서비스이며, Merchant ID를 입력하면 실제 결제 모듈을 테스트해볼 수
              있습니다.
            </p>

            <div className="mt-4">
              <Link
                href="https://docs.iamport.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                PortOne v1 개발자 문서 보기 →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* API Key Input */}
              <ApiKeyInput
                label="Merchant ID"
                placeholder="imp12345678"
                value={merchantId}
                onChange={handleMerchantIdChange}
                onSubmit={handleStartTest}
                isValid={isValid}
              />

              {/* Payment Details */}
              {isActive && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    결제 정보
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="productName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        구매 상품명
                      </label>
                      <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="상품명을 입력하세요"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        결제 금액 (원)
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="결제 금액을 입력하세요"
                        min="100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Demo */}
              <LiveDemo isActive={isActive}>
                {isActive ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
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
                        PortOne v1이 초기화되었습니다!
                      </span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-gray-600">
                        결제 테스트를 진행해보세요.
                      </p>

                      <button
                        onClick={handleTestPayment}
                        disabled={isPaymentLoading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isPaymentLoading
                          ? '결제 진행 중...'
                          : `테스트 결제하기 (${parseInt(amount).toLocaleString()}원)`}
                      </button>

                      <div className="mt-4">
                        <button
                          onClick={stopTest}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          테스트 중지
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </LiveDemo>

              {/* Payment Result */}
              {paymentResult && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      결제 결과
                    </h3>
                    <button
                      onClick={() => setPaymentResult(null)}
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
                        paymentResult.success
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {paymentResult.success ? '✅ 결제 성공' : '❌ 결제 실패'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {JSON.stringify(paymentResult, null, 2)}
                    </pre>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          JSON.stringify(paymentResult, null, 2)
                        );
                        alert('결제 결과가 클립보드에 복사되었습니다.');
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                    >
                      JSON 복사
                    </button>
                  </div>
                </div>
              )}
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
                      <p className="font-medium text-gray-900">
                        PortOne 회원가입
                      </p>
                      <p>PortOne 웹사이트에서 계정을 생성하세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Merchant ID 확인
                      </p>
                      <p>PortOne 관리자 페이지에서 Merchant ID를 확인하세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">PG사 설정</p>
                      <p>사용할 PG사(이니시스, KCP 등)를 설정하세요.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                      4
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        웹사이트에 적용
                      </p>
                      <p>아래 코드를 웹사이트에 추가하세요.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TypeScript Support */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  TypeScript 지원
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="text-gray-700">
                    TypeScript를 사용하는 경우{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      iamport-typings
                    </code>{' '}
                    패키지를 설치하면 PortOne v1 API의 타입 정의를 사용할 수
                    있어 개발 경험이 향상됩니다.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <code className="text-sm font-mono text-gray-800">
                      npm install -D iamport-typings
                    </code>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Link
                      href="https://github.com/junhoyeo/iamport-typings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub에서 iamport-typings 보기 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Examples - Full Width */}
          <div className="space-y-8 mt-8">
            {/* Next.js Script Option */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                옵션 1: Next.js Script 컴포넌트 (권장)
              </h3>
              <p className="text-green-700 text-sm mb-4">
                Next.js의 Script 컴포넌트를 사용하여 최적화된 스크립트 로딩을
                구현합니다.
              </p>

              <div className="space-y-4">
                <CodeBlock
                  title="TypeScript 타입 설치 (선택사항)"
                  language="bash"
                  code={portoneV1Examples.typeInstall}
                />

                <CodeBlock
                  title="Next.js Script 컴포넌트 사용법"
                  language="tsx"
                  code={portoneV1Examples.nextjsScript(merchantId)}
                />
              </div>
            </div>

            {/* React Script Loading Option */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                옵션 2: React 스크립트 로딩
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                useEffect 훅을 사용하여 동적으로 스크립트를 로드하는 방식입니다.
              </p>

              <div className="space-y-4">
                <CodeBlock
                  title="React 스크립트 로딩 방식"
                  language="tsx"
                  code={portoneV1Examples.reactScriptLoading(merchantId)}
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
      </div>
    </>
  );
}
