export const portoneV2Examples = {
  // NPM 설치
  npmInstall: `npm install @portone/browser-sdk`,

  // TypeScript 타입 정의
  typeDefinitions: `interface PortOneV2Config {
  storeId: string;
  channelKey: string;
}

interface PortOneV2PaymentData {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'KRW' | 'USD';
  payMethod?: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER';
  customer?: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
}`,

  // React 컴포넌트 사용법
  reactComponentUsage: (storeId: string, channelKey: string) => `'use client';

import { useState } from 'react';
import { PortOne } from '@portone/browser-sdk';

export default function PaymentComponent() {
  const [payMethod, setPayMethod] = useState<'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER'>('CARD');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const response = await PortOne.requestPayment({
        storeId: '${storeId || 'store-00000000-0000-0000-0000-000000000000'}',
        channelKey: '${channelKey || 'channel-key-00000000-0000-0000-0000-000000000000'}',
        paymentId: 'payment-' + Date.now(),
        orderName: '테스트 상품',
        totalAmount: 1000,
        currency: 'KRW',
        payMethod: payMethod,
        customer: {
          fullName: '홍길동',
          phoneNumber: '010-1234-5678',
          email: 'test@example.com'
        }
      });

      if (response.code) {
        // 결제 실패
        console.error('결제 실패:', response);
        alert(\`결제 실패: \${response.message}\`);
      } else {
        // 결제 성공
        console.log('결제 성공:', response);
        alert(\`결제 성공! Payment ID: \${response.paymentId}\`);
        
        // 서버에 결제 검증 요청
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentId: response.paymentId,
            txId: response.txId 
          })
        });
        
        if (verifyResponse.ok) {
          console.log('서버 검증 완료');
        }
      }
    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">결제 수단</label>
        <select 
          value={payMethod} 
          onChange={(e) => setPayMethod(e.target.value as any)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="CARD">신용카드</option>
          <option value="VIRTUAL_ACCOUNT">가상계좌</option>
          <option value="TRANSFER">계좌이체</option>
        </select>
      </div>
      <button 
        onClick={handlePayment}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? '결제 진행중...' : '결제하기'}
      </button>
    </div>
  );
}`,

  // Next.js 페이지 예제
  nextjsPageExample: (storeId: string, channelKey: string) => `'use client';

import { useState, useEffect } from 'react';
import { PortOne } from '@portone/browser-sdk';

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const requestPayment = async () => {
    try {
      const response = await PortOne.requestPayment({
        storeId: '${storeId || 'store-00000000-0000-0000-0000-000000000000'}',
        channelKey: '${channelKey || 'channel-key-00000000-0000-0000-0000-000000000000'}',
        paymentId: 'payment-' + Date.now(),
        orderName: '테스트 상품',
        totalAmount: 1000,
        currency: 'KRW',
        payMethod: 'CARD',
        customer: {
          fullName: '홍길동',
          phoneNumber: '010-1234-5678',
          email: 'test@example.com'
        }
      });

      // 결제 완료 후 서버에 검증 요청
      const verifyResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: response.paymentId,
          txId: response.txId
        })
      });

      if (verifyResponse.ok) {
        alert('결제가 완료되었습니다!');
      }
    } catch (error) {
      console.error('결제 실패:', error);
      alert('결제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="p-4">
      <h1>PortOne v2 결제</h1>
      <button 
        onClick={requestPayment}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        결제하기
      </button>
    </div>
  );
}`,

  // 서버 사이드 검증 API
  serverVerification: `// pages/api/payments/verify.ts 또는 app/api/payments/verify/route.ts
import { PortOneApi } from '@portone/server-sdk';

const portone = PortOneApi({
  apiSecret: process.env.V2_API_SECRET!, // API Secret
});

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    // PortOne v2 서버에서 결제 정보 조회
    const payment = await portone.getPayment({
      paymentId,
    });

    if (payment.status === 'PAID') {
      // 결제 성공 - 여기서 비즈니스 로직 처리
      // 예: 주문 상태 업데이트, 이메일 발송 등
      
      return Response.json({ 
        success: true, 
        payment 
      });
    } else {
      return Response.json({ 
        success: false, 
        message: '결제가 완료되지 않았습니다.' 
      });
    }
  } catch (error) {
    console.error('결제 검증 실패:', error);
    return Response.json({ 
      success: false, 
      error: '결제 검증 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
}`,

  // 환경변수 설정
  envSetup: `# .env.local
STORE_ID=store-00000000-0000-0000-0000-000000000000
CHANNEL_KEY=channel-key-00000000-0000-0000-0000-000000000000
V2_API_SECRET=00000000000000000000000000000000000000000000000000000000000000000000000000000000
V2_WEBHOOK_SECRET=00000000000000000000000000000000000000000000000000000000000000000000000000000000`,

  // 웹훅 처리
  webhookHandler: `// app/api/webhooks/portone/route.ts
import { PortOneApi } from '@portone/server-sdk';
import crypto from 'crypto';

const portone = PortOneApi({
  apiSecret: process.env.V2_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('portone-signature');
    
    // 웹훅 서명 검증
    const expectedSignature = crypto
      .createHmac('sha256', process.env.V2_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhook = JSON.parse(body);
    
    // 결제 완료 웹훅 처리
    if (webhook.type === 'Transaction.Paid') {
      const { paymentId } = webhook.data;
      
      // 결제 정보 조회 및 검증
      const payment = await portone.getPayment({ paymentId });
      
      if (payment.status === 'PAID') {
        // 비즈니스 로직 처리
        console.log('결제 완료:', payment);
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('웹훅 처리 실패:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}`,

  // 전체 라이브러리 코드
  fullLibraryCode: `// lib/services/portone-v2.ts
'use client';

import { PortOne, PaymentRequest } from '@portone/browser-sdk';

export interface PortOneV2Config {
  storeId: string;
  channelKey: string;
}

export interface PortOneV2PaymentData {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: 'KRW' | 'USD';
  payMethod?: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER';
  customer?: {
    customerId?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
}

let portOneInstance: typeof PortOne | null = null;

export function validatePortOneV2StoreId(storeId: string): boolean {
  const storeIdRegex = /^store-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return storeIdRegex.test(storeId);
}

export function validatePortOneV2ChannelKey(channelKey: string): boolean {
  const channelKeyRegex = /^channel-key-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return channelKeyRegex.test(channelKey);
}

export async function initializePortOneV2(config: PortOneV2Config): Promise<boolean> {
  try {
    const { PortOne } = await import('@portone/browser-sdk');
    portOneInstance = PortOne;
    return true;
  } catch (error) {
    console.error('Failed to initialize PortOne v2:', error);
    return false;
  }
}

export async function requestPortOneV2Payment(
  paymentData: PortOneV2PaymentData,
  onResult?: (response: any) => void
): Promise<any> {
  if (!portOneInstance) {
    throw new Error('PortOne v2 SDK not initialized');
  }

  const request: PaymentRequest = {
    storeId: paymentData.storeId,
    channelKey: paymentData.channelKey,
    paymentId: paymentData.paymentId,
    orderName: paymentData.orderName,
    totalAmount: paymentData.totalAmount,
    currency: paymentData.currency,
    payMethod: paymentData.payMethod,
    customer: paymentData.customer,
  };

  try {
    const response = await portOneInstance.requestPayment(request);
    onResult?.(response);
    return response;
  } catch (error) {
    onResult?.(error);
    throw error;
  }
}

export function removePortOneV2(): void {
  portOneInstance = null;
}`,
};
