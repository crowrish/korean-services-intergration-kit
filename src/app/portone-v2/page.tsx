'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import CodeBlock from '@/components/CodeBlock';
import LiveDemo from '@/components/LiveDemo';
import { getImagePath } from '@/lib/image-utils';
import MultiApiKeyInput from '@/components/MultiApiKeyInput';
import { portoneV2Examples } from '@/lib/code-examples/portone-v2';
import {
  PortOneV2PaymentData,
  PortOneV2Response,
  initializePortOneV2,
  removePortOneV2,
  requestPortOneV2Payment,
  validatePortOneV2ChannelKey,
  validatePortOneV2StoreId,
} from '@/lib/services/portone-v2';

export default function PortOneV2Page() {
  const [storeId, setStoreId] = useState('');
  const [channelKey, setChannelKey] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isStoreIdValid, setIsStoreIdValid] = useState(true);
  const [isChannelKeyValid, setIsChannelKeyValid] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [productName, setProductName] = useState('테스트 상품');
  const [amount, setAmount] = useState('1000');
  const [payMethod, setPayMethod] = useState<
    'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER'
  >('CARD');
  const [paymentResult, setPaymentResult] = useState<PortOneV2Response | null>(
    null
  );

  useEffect(() => {
    return () => {
      removePortOneV2();
    };
  }, []);

  const handleValueChange =
    (
      setter: (v: string) => void,
      validator: (v: string) => boolean,
      validSetter: (v: boolean) => void
    ) =>
    (value: string) => {
      setter(value);
      validSetter(validator(value));
      if (isActive) {
        setIsActive(false);
        removePortOneV2();
      }
    };

  const handleStoreIdChange = handleValueChange(
    setStoreId,
    validatePortOneV2StoreId,
    setIsStoreIdValid
  );
  const handleChannelKeyChange = handleValueChange(
    setChannelKey,
    validatePortOneV2ChannelKey,
    setIsChannelKeyValid
  );

  const handleStartTest = async () => {
    if (
      validatePortOneV2StoreId(storeId) &&
      validatePortOneV2ChannelKey(channelKey)
    ) {
      setIsActive(await initializePortOneV2({ storeId, channelKey }));
    }
  };

  const stopTest = () => {
    removePortOneV2();
    setIsActive(false);
    setPaymentResult(null);
  };

  const handleTestPayment = async () => {
    if (!isActive) {
      alert('먼저 PortOne v2를 초기화해주세요.');
      return;
    }

    setIsPaymentLoading(true);

    const paymentData: PortOneV2PaymentData = {
      storeId,
      channelKey,
      paymentId: 'payment-' + new Date().getTime(),
      orderName: productName,
      totalAmount: parseInt(amount),
      currency: 'KRW',
      payMethod: payMethod,
      customer: {
        fullName: '테스트 구매자',
        phoneNumber: '010-1234-5678',
        email: 'test@example.com',
      },
    };

    try {
      await requestPortOneV2Payment(paymentData, (response) => {
        setPaymentResult(response);
      });
    } catch (error) {
      console.error('결제 실패:', error);
    } finally {
      setIsPaymentLoading(false);
    }
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
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-3 shadow-sm">
              <Image
                src={getImagePath('/logos/portone.png')}
                alt="PortOne v2 logo"
                width={40}
                height={40}
                className="object-contain rounded"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">포트원 v2 PortOne v2</h1>
              <p className="text-gray-600">
                차세대 PortOne v2 결제 시스템 통합
              </p>
            </div>
          </div>

          <p className="text-gray-700 max-w-3xl">
            PortOne v2 통합 PG 서비스입니다. Store ID와 Channel Key를 입력하면 실제 결제 모듈을
            테스트해볼 수 있습니다.
          </p>

          <div className="mt-4 flex gap-4">
            <Link
              href="https://portone.io/korea/ko"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PortOne v2 공식 사이트 →
            </Link>
            <Link
              href="https://developers.portone.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PortOne v2 개발자 문서 →
            </Link>
            <Link
              href="https://github.com/portone-io/portone-sample/tree/main/nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              PortOne v2 Next.js 샘플 코드 (GitHub) →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* API Keys Input */}
            <MultiApiKeyInput
              fields={[
                {
                  label: 'Store ID',
                  placeholder: 'store-00000000-0000-0000-0000-000000000000',
                  value: storeId,
                  onChange: handleStoreIdChange,
                  isValid: isStoreIdValid,
                },
                {
                  label: 'Channel Key',
                  placeholder:
                    'channel-key-00000000-0000-0000-0000-000000000000',
                  value: channelKey,
                  onChange: handleChannelKeyChange,
                  isValid: isChannelKeyValid,
                },
              ]}
              onSubmit={handleStartTest}
              submitLabel="PortOne v2 초기화"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="결제 금액을 입력하세요"
                      min="100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="payMethod"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      결제 수단
                    </label>
                    <select
                      id="payMethod"
                      value={payMethod}
                      onChange={(e) =>
                        setPayMethod(e.target.value as typeof payMethod)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="CARD">신용카드</option>
                      <option value="VIRTUAL_ACCOUNT">가상계좌</option>
                      <option value="TRANSFER">계좌이체</option>
                    </select>
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
                      PortOne v2가 초기화되었습니다!
                    </span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      최신 PortOne v2 SDK로 결제 테스트를 진행해보세요.
                    </p>

                    <button
                      onClick={handleTestPayment}
                      disabled={isPaymentLoading}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                      !paymentResult.code || paymentResult.code === '0'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {!paymentResult.code || paymentResult.code === '0'
                      ? '✅ 결제 성공'
                      : '❌ 결제 실패'}
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
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
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
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      PortOne 회원가입
                    </p>
                    <p>PortOne 웹사이트에서 v2 계정을 생성하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Store ID 및 Channel Key 확인
                    </p>
                    <p>
                      PortOne v2 관리자 페이지에서 Store ID와 Channel Key를
                      확인하세요.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">결제 수단 설정</p>
                    <p>사용할 결제 수단(카드, 가상계좌 등)을 설정하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">웹사이트에 적용</p>
                    <p>아래 코드를 웹사이트에 추가하세요.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* v1과 v2 차이점 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                v1과 v2의 차이점
              </h3>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">PortOne v1</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Merchant ID 사용</li>
                      <li>• jQuery 기반 스크립트</li>
                      <li>• 콜백 함수 방식</li>
                    </ul>
                  </div>
                  <div className="text-gray-600">
                    <p className="font-medium text-gray-900 mb-1">PortOne v2</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Store ID + Channel Key</li>
                      <li>• 모던 ES6+ SDK</li>
                      <li>• Promise/async-await</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples - Full Width */}
        <div className="space-y-8 mt-8">
          {/* NPM Package Option */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              NPM 패키지 설치 (권장)
            </h3>
            <p className="text-green-700 text-sm mb-4">
              공식 PortOne v2 SDK를 사용하여 최적화된 결제 경험을 구현합니다.
            </p>

            <div className="space-y-4">
              <CodeBlock
                title="NPM 패키지 설치"
                language="bash"
                code={portoneV2Examples.npmInstall}
              />

              <CodeBlock
                title="React 컴포넌트 사용법"
                language="tsx"
                code={portoneV2Examples.reactComponentUsage(
                  storeId,
                  channelKey
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
