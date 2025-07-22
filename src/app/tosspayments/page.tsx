'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import ApiKeyInput from '@/components/ApiKeyInput';
import CodeBlock from '@/components/CodeBlock';
import LiveDemo from '@/components/LiveDemo';
import { tossPaymentsExamples } from '@/lib/code-examples/tosspayments';
import {
  TossPaymentsPaymentData,
  TossPaymentsResponse,
  initializeTossPayments,
  removeTossPayments,
  renderAgreement,
  renderPaymentMethods,
  requestTossPayment,
  setPaymentAmount,
} from '@/lib/services/tosspayments';

export default function TossPaymentsPage() {
  const [clientKey, setClientKey] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [amount, setAmount] = useState('50000');
  const [customerName, setCustomerName] = useState('김토스');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [paymentResult, setPaymentResult] = useState<TossPaymentsResponse | null>(null);
  const [widgetsRendered, setWidgetsRendered] = useState(false);

  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      removeTossPayments();
    };
  }, []);

  const handleClientKeyChange = (value: string) => {
    setClientKey(value);
    setIsValid(true);
    if (isActive) {
      setIsActive(false);
      setWidgetsRendered(false);
      removeTossPayments();
    }
  };

  const handleStartTest = async () => {
    if (clientKey.trim()) {
      const success = await initializeTossPayments({ clientKey, customerKey: 'customer-' + Date.now() });
      if (success) {
        setIsActive(true);
        await renderPaymentWidgets();
      }
    }
  };

  const renderPaymentWidgets = async () => {
    try {
      await Promise.all([
        setPaymentAmount(parseInt(amount)),
        renderPaymentMethods('#payment-methods'),
        renderAgreement('#agreement')
      ]);
      setWidgetsRendered(true);
    } catch (error) {
      console.error('결제 위젯 렌더링 실패:', error);
    }
  };

  const stopTest = () => {
    removeTossPayments();
    setIsActive(false);
    setWidgetsRendered(false);
    setPaymentResult(null);
  };

  const handleTestPayment = async () => {
    if (!isActive || !widgetsRendered) {
      alert('먼저 토스페이먼츠를 초기화하고 위젯을 렌더링해주세요.');
      return;
    }

    setIsPaymentLoading(true);

    const paymentData: TossPaymentsPaymentData = {
      orderId: 'order-' + Date.now(),
      orderName: '테스트 상품',
      amount: parseInt(amount),
      customerName,
      customerEmail,
      customerMobilePhone: '01012341234',
    };

    try {
      await requestTossPayment(paymentData, (response) => {
        setPaymentResult(response);
      });
    } catch (error: unknown) {
      console.error('결제 실패:', error);
      const { code, message } = error as { code?: string; message?: string };
      setPaymentResult({
        code: code || 'PAYMENT_ERROR',
        message: message || '결제 처리 중 오류가 발생했습니다.',
        type: 'error',
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  // amount 변경시 위젯 업데이트
  useEffect(() => {
    if (isActive && widgetsRendered && amount) {
      setPaymentAmount(parseInt(amount));
    }
  }, [amount, isActive, widgetsRendered]);

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
                src="/logos/tosspayments.png"
                alt="TossPayments logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TossPayments</h1>
              <p className="text-gray-600">토스페이먼츠 결제 시스템 통합</p>
            </div>
          </div>

          <p className="text-gray-700 max-w-3xl">
            토스페이먼츠는 한국의 대표적인 간편결제 서비스입니다. Client Key를
            입력하면 실제 결제 위젯을 테스트해볼 수 있습니다.
          </p>

          <div className="mt-4 flex gap-4">
            <Link
              href="https://www.tosspayments.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              토스페이먼츠 공식 사이트 →
            </Link>
            <Link
              href="https://docs.tosspayments.com/sdk/v2/js"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              토스페이먼츠 개발자 문서 →
            </Link>
          </div>
        </div>

        {/* Sandbox Link - Full Width */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-green-800">
                [추천] 공식 예제 보기
              </h4>
              <p className="text-sm text-green-700 mt-1">
                토스페이먼츠 샌드박스에서 다양한 결제 시나리오와 상세한 예제를
                확인하세요. (여기가 더 잘만들었어요.)
              </p>
              <Link
                href="https://developers.tosspayments.com/sandbox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                토스페이먼츠 샌드박스 바로가기
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* API Key Input */}
            <ApiKeyInput
              label="Client Key"
              placeholder="test_gck_"
              value={clientKey}
              onChange={handleClientKeyChange}
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
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      구매자명
                    </label>
                    <input
                      type="text"
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="구매자명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customerEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      구매자 이메일
                    </label>
                    <input
                      type="email"
                      id="customerEmail"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="구매자 이메일을 입력하세요"
                    />
                  </div>
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
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      토스페이먼츠 회원가입
                    </p>
                    <p>토스페이먼츠 웹사이트에서 가맹점 계정을 생성하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Client Key 확인</p>
                    <p>토스페이먼츠 개발자센터에서 Client Key를 확인하세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">결제 방법 설정</p>
                    <p>사용할 결제 수단을 설정하고 승인을 받으세요.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">웹사이트에 적용</p>
                    <p>아래 코드를 웹사이트에 추가하세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Widget - Full Width */}
        {isActive && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              결제 위젯
            </h3>

            {/* 결제 방법 선택 */}
            <div
              id="payment-methods"
              ref={paymentMethodsRef}
              className="mb-6"
            ></div>

            {/* 약관 동의 */}
            <div id="agreement" ref={agreementRef} className="mb-6"></div>

            {widgetsRendered && (
              <div className="flex justify-center">
                <button
                  onClick={handleTestPayment}
                  disabled={isPaymentLoading}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium"
                >
                  {isPaymentLoading
                    ? '결제 진행 중...'
                    : `${parseInt(amount).toLocaleString()}원 결제하기`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Demo & Payment Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
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
                      토스페이먼츠가 초기화되었습니다!
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    위의 결제 위젯에서 결제를 테스트해보세요.
                  </p>
                  <button
                    onClick={stopTest}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    테스트 중지
                  </button>
                </div>
              ) : null}
            </LiveDemo>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Result */}
            {paymentResult && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">결과</h3>
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
                      paymentResult.code
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {paymentResult.code ? '❌ 오류 발생' : '✅ 처리 완료'}
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
        </div>

        {/* Code Examples - Full Width */}
        <div className="space-y-8 mt-8">
          {/* SDK 설치 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              SDK 설치 및 설정
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              토스페이먼츠 SDK를 설치하고 초기 설정을 진행합니다.
            </p>

            <CodeBlock
              title="SDK 설치"
              language="bash"
              code={tossPaymentsExamples.sdkInstall}
            />
          </div>

          {/* React 컴포넌트 사용법 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              React 컴포넌트 사용법
            </h3>
            <p className="text-green-700 text-sm mb-4">
              @tosspayments/tosspayments-sdk를 사용한 React 컴포넌트 구현
              방법입니다.
            </p>

            <CodeBlock
              title="결제 위젯 컴포넌트"
              language="tsx"
              code={tossPaymentsExamples.reactComponentUsage(clientKey)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
