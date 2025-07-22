'use client';

import {
  Entity,
  type PaymentRequest,
  requestPayment,
} from '@portone/browser-sdk/v2';

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
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
  };
  customData?: string;
  redirectUrl?: string;
  noticeUrls?: string[];
  confirmUrl?: string;
}

export interface PortOneV2Response {
  code?: string;
  message?: string;
  transactionType?: string;
  paymentId?: string;
  txId?: string;
}

let isSDKInitialized = false;

export const validatePortOneV2StoreId = (storeId: string): boolean => {
  if (!storeId || typeof storeId !== 'string') return false;
  return /^store-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    storeId
  );
};

export const validatePortOneV2ChannelKey = (channelKey: string): boolean => {
  if (!channelKey || typeof channelKey !== 'string') return false;
  return /^channel-key-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    channelKey
  );
};

export const initializePortOneV2 = async (
  config: PortOneV2Config
): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      console.error(
        'PortOne v2 can only be initialized in browser environment'
      );
      return false;
    }

    isSDKInitialized = true;
    console.log('PortOne v2 SDK initialized successfully with config:', config);
    return true;
  } catch (error) {
    console.error('Failed to initialize PortOne v2:', error);
    return false;
  }
};

export const requestPortOneV2Payment = async (
  paymentData: PortOneV2PaymentData,
  onResult?: (response: PortOneV2Response) => void
): Promise<PortOneV2Response> => {
  const createError = (code: string, message: string) => ({ code, message });

  return new Promise((resolve, reject) => {
    if (!isSDKInitialized) {
      const error = createError(
        'NOT_INITIALIZED',
        'PortOne v2 SDK not initialized'
      );
      onResult?.(error);
      return reject(error);
    }

    if (typeof window === 'undefined') {
      const error = createError(
        'BROWSER_ONLY',
        'Payment can only be requested in browser environment'
      );
      onResult?.(error);
      return reject(error);
    }

    try {
      const request: PaymentRequest = {
        storeId: paymentData.storeId,
        channelKey: paymentData.channelKey,
        paymentId: paymentData.paymentId,
        orderName: paymentData.orderName,
        totalAmount: paymentData.totalAmount,
        currency:
          paymentData.currency === 'KRW'
            ? Entity.Currency.KRW
            : Entity.Currency.USD,
        payMethod: paymentData.payMethod,
        customer: paymentData.customer,
      };

      requestPayment(request)
        .then((response) => {
          console.log('PortOne v2 payment response:', response);
          const normalizedResponse: PortOneV2Response = {
            transactionType: response?.transactionType,
            paymentId: response?.paymentId,
            txId: response?.txId,
          };
          onResult?.(normalizedResponse);
          resolve(normalizedResponse);
        })
        .catch((error) => {
          console.error('PortOne v2 payment error:', error);
          const errorResponse = createError(
            error.code || 'PAYMENT_ERROR',
            error.message || 'Payment failed'
          );
          onResult?.(errorResponse);
          reject(errorResponse);
        });
    } catch (error) {
      console.error('PortOne v2 payment request failed:', error);
      const errorResponse = createError(
        'REQUEST_FAILED',
        error instanceof Error ? error.message : 'Payment request failed'
      );
      onResult?.(errorResponse);
      reject(errorResponse);
    }
  });
};

export const removePortOneV2 = (): void => {
  isSDKInitialized = false;
  console.log('PortOne v2 instance cleaned up');
};
