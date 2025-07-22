// TossPayments SDK Code Examples

export const tossPaymentsExamples = {
  sdkInstall: `npm install @tosspayments/tosspayments-sdk --save`,

  reactComponentUsage: (clientKey: string) => `'use client';

import { useState, useEffect, useRef } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

export default function TossPaymentsComponent() {
  const [amount, setAmount] = useState(50000);
  const [widgets, setWidgets] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeTossPayments();
  }, []);

  useEffect(() => {
    if (widgets && amount > 0) {
      updateAmount();
    }
  }, [widgets, amount]);

  const initializeTossPayments = async () => {
    try {
      const clientKey = '${clientKey || 'test_gck_'}';
      const tossPayments = await loadTossPayments(clientKey);
      
      const widgetsInstance = tossPayments.widgets({
        customerKey: 'customer-' + Date.now()
      });

      // 결제 금액 설정
      await widgetsInstance.setAmount({
        value: amount,
        currency: 'KRW'
      });

      // 결제 UI 렌더링
      await widgetsInstance.renderPaymentMethods({
        selector: '#payment-methods',
        variantKey: 'DEFAULT'
      });

      // 약관 동의 UI 렌더링
      await widgetsInstance.renderAgreement({
        selector: '#agreement'
      });

      setWidgets(widgetsInstance);
      setIsInitialized(true);
    } catch (error) {
      console.error('TossPayments 초기화 실패:', error);
    }
  };

  const updateAmount = async () => {
    if (!widgets) return;
    
    try {
      await widgets.setAmount({
        value: amount,
        currency: 'KRW'
      });
    } catch (error) {
      console.error('금액 업데이트 실패:', error);
    }
  };

  const handlePayment = async () => {
    if (!widgets) {
      alert('결제 위젯이 준비되지 않았습니다.');
      return;
    }

    try {
      await widgets.requestPayment({
        orderId: 'order-' + Date.now(),
        orderName: '테스트 상품',
        customerName: '김토스',
        customerEmail: 'test@example.com',
        customerMobilePhone: '01012341234',
        successUrl: \`\${window.location.origin}/tosspayments/success\`,
        failUrl: \`\${window.location.origin}/tosspayments/fail\`
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">결제 금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md"
          min="100"
        />
      </div>
      
      {/* 결제 수단 선택 UI */}
      <div id="payment-methods" ref={paymentMethodsRef}></div>
      
      {/* 약관 동의 UI */}
      <div id="agreement" ref={agreementRef}></div>
      
      <button
        onClick={handlePayment}
        disabled={!isInitialized}
        className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isInitialized ? \`\${amount.toLocaleString()}원 결제하기\` : '초기화 중...'}
      </button>
    </div>
  );
}`,

  nextjsSuccessPage: () => `'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PaymentResult {
  orderId: string;
  paymentKey: string;
  amount: number;
}

export default function TossPaymentsSuccess() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    if (orderId && paymentKey && amount) {
      // 서버에 결제 승인 요청
      confirmPayment(paymentKey, orderId, Number(amount));
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const confirmPayment = async (paymentKey: string, orderId: string, amount: number) => {
    try {
      const response = await fetch('/api/tosspayments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentKey, orderId, amount })
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.message || '결제 승인 실패');
      }
    } catch (error) {
      console.error('결제 승인 실패:', error);
      alert('결제 승인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">결제 승인 중...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-green-600 mb-2">결제 성공!</h1>
          <p className="text-gray-600">결제가 성공적으로 완료되었습니다.</p>
        </div>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left">
            <h3 className="font-medium mb-2">결제 정보</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>주문번호: {result.orderId}</div>
              <div>결제키: {result.paymentKey}</div>
              <div>결제금액: {result.amount.toLocaleString()}원</div>
            </div>
          </div>
        )}

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}`,

  nextjsFailPage: () => `'use client';

import { useSearchParams } from 'next/navigation';

export default function TossPaymentsFail() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">결제 실패</h1>
          <p className="text-gray-600">결제 처리 중 오류가 발생했습니다.</p>
        </div>

        {(errorCode || errorMessage) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
            <h3 className="font-medium text-red-800 mb-2">오류 정보</h3>
            <div className="space-y-1 text-sm text-red-700">
              {errorCode && <div>오류 코드: {errorCode}</div>}
              {errorMessage && <div>오류 메시지: {errorMessage}</div>}
            </div>
          </div>
        )}

        <div className="mt-6 space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            이전으로
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}`,

  serverConfirmAPI: () => `// app/api/tosspayments/confirm/route.ts
const TOSS_PAYMENTS_SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // TossPayments 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': \`Basic \${Buffer.from(TOSS_PAYMENTS_SECRET_KEY + ':').toString('base64')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const payment = await response.json();

    if (!response.ok) {
      return Response.json(
        { message: payment.message || '결제 승인 실패' },
        { status: 400 }
      );
    }

    // 결제 성공 처리 로직
    // 예: 데이터베이스에 주문 정보 저장, 이메일 발송 등

    return Response.json({
      orderId: payment.orderId,
      paymentKey: payment.paymentKey,
      amount: payment.totalAmount,
      status: payment.status,
      approvedAt: payment.approvedAt,
    });
  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error);
    return Response.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}`,
};
