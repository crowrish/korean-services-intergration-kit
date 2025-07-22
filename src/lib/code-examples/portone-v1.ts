// PortOne v1 Code Examples

export const portoneV1Examples = {
  typeInstall: `npm install -D iamport-typings`,

  nextjsScript: (merchantId: string) => `'use client';

import { useState } from 'react';
import Script from 'next/script';
import type { RequestPayResponse } from 'iamport-typings'; // 타입스크립트 사용 시

declare global {
  interface Window {
    IMP: any;
  }
}

function PaymentPage() {
  const [impReady, setImpReady] = useState(false);

  const handleScriptLoad = () => {
    console.log('Iamport 스크립트 로드 완료');
    if (window.IMP) {
      window.IMP.init('${merchantId || 'YOUR_MERCHANT_ID'}');
      setImpReady(true);
    }
  };

  const handleScriptError = () => {
    console.error('Iamport 스크립트 로드 실패');
  };

  const requestPay = () => {
    if (!window.IMP || !impReady) {
      alert('결제 모듈이 아직 준비되지 않았습니다.');
      return;
    }
    
    window.IMP.request_pay({
      pg: 'html5_inicis', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: 'merchant_' + new Date().getTime(), // 주문번호
      name: '상품명',
      amount: 14000,
      buyer_email: 'buyer@example.com',
      buyer_name: '구매자',
      buyer_tel: '010-1234-5678',
      buyer_addr: '서울특별시 강남구',
      buyer_postcode: '12345'
    }, (response: RequestPayResponse) => {
      if (response.success) {
        // 결제 성공
        alert(\`결제 성공: \${response.imp_uid}\`);
        
        // 서버 검증 API 호출
        // fetch('/api/payments/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     imp_uid: response.imp_uid,
        //     merchant_uid: response.merchant_uid
        //   })
        // });
      } else {
        // 결제 실패
        alert(\`결제 실패: \${response.error_msg}\`);
      }
    });
  };

  return (
    <>
      {/* Next.js Script 컴포넌트로 최적화된 로딩 */}
      <Script
        src="https://cdn.iamport.kr/v1/iamport.js"
        strategy="afterInteractive" // 페이지 인터랙티브 후 로드
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">결제 테스트</h2>
        <button
          onClick={requestPay}
          disabled={!impReady}
          className={\`px-6 py-3 rounded-lg font-medium transition-colors \${
            impReady 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }\`}
        >
          {impReady ? '결제하기' : '로딩중...'}
        </button>
      </div>
    </>
  );
}`,

  reactScriptLoading: (merchantId: string) => `'use client';

import { useEffect, useState } from 'react';
import type { RequestPayResponse } from 'iamport-typings'; // 타입스크립트 사용 시

declare global {
  interface Window {
    IMP: any;
  }
}

function PaymentComponent() {
  const [impLoaded, setImpLoaded] = useState(false);

  useEffect(() => {
    // 이미 로드된 경우 스킵
    if (window.IMP) {
      window.IMP.init('${merchantId || 'YOUR_MERCHANT_ID'}');
      setImpLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => {
      if (window.IMP) {
        window.IMP.init('${merchantId || 'YOUR_MERCHANT_ID'}');
        setImpLoaded(true);
      }
    };
    script.onerror = () => {
      console.error('Iamport 스크립트 로드 실패');
    };
    
    document.head.appendChild(script);

    // 클린업
    return () => {
      const existingScript = document.querySelector('script[src="https://cdn.iamport.kr/v1/iamport.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const requestPay = () => {
    if (!window.IMP) {
      alert('결제 모듈이 아직 로드되지 않았습니다.');
      return;
    }
    
    window.IMP.request_pay({
      pg: 'html5_inicis',
      pay_method: 'card',
      merchant_uid: 'merchant_' + new Date().getTime(),
      name: '상품명',
      amount: 14000,
      buyer_email: 'buyer@example.com',
      buyer_name: '구매자',
      buyer_tel: '010-1234-5678'
    }, (response: RequestPayResponse) => {
      if (response.success) {
        alert(\`결제 성공: \${response.imp_uid}\`);
      } else {
        alert(\`결제 실패: \${response.error_msg}\`);
      }
    });
  };

  return (
    <button 
      onClick={requestPay} 
      disabled={!impLoaded}
      className={impLoaded ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}
    >
      {impLoaded ? '결제하기' : '로딩중...'}
    </button>
  );
}`,
};
