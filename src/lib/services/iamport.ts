import type { RequestPayParams, RequestPayResponse } from 'iamport-typings';

export type PaymentData = RequestPayParams;

let isScriptLoaded = false;
let isInitialized = false;

export const validateIamportMerchantId = (merchantId: string): boolean =>
  merchantId.length > 0 && merchantId.startsWith('imp');

export const initializeIamport = (merchantId: string) => {
  if (typeof window === 'undefined' || !isScriptLoaded) return false;

  try {
    window.IMP?.init(merchantId);
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize Iamport:', error);
    return false;
  }
};

export const onScriptLoad = () => {
  isScriptLoaded = true;
};

export const cleanupIamport = () => {
  isInitialized = false;
  if (window.IMP) {
    delete (window as unknown as Record<string, unknown>).IMP;
  }
};

export const isIamportReady = () =>
  isScriptLoaded && isInitialized && !!window.IMP;

export const requestPayment = (
  paymentData: PaymentData,
  onResult?: (response: RequestPayResponse) => void
) => {
  if (!isIamportReady()) {
    console.error('Iamport not ready');
    return Promise.reject('Iamport not ready');
  }

  return new Promise((resolve, reject) => {
    window.IMP!.request_pay(paymentData, (response: RequestPayResponse) => {
      onResult?.(response);
      if (response.success) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
};
