'use client';

import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk';

export interface TossPaymentsConfig {
  clientKey: string;
  customerKey?: string;
}

export interface TossPaymentsPaymentData {
  orderId: string;
  orderName: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  customerMobilePhone?: string;
}

export interface TossPaymentsResponse {
  code?: string;
  message?: string;
  orderId?: string;
  paymentKey?: string;
  type?: string;
  [key: string]: unknown;
}

let tossPaymentsInstance: unknown = null;
let widgetsInstance: unknown = null;

export const validateTossPaymentsClientKey = (clientKey: string): boolean =>
  clientKey.startsWith('test_gck_') || clientKey.startsWith('live_gck_');

export const initializeTossPayments = async (
  config: TossPaymentsConfig
): Promise<boolean> => {
  try {
    tossPaymentsInstance = await loadTossPayments(config.clientKey);
    widgetsInstance = (
      tossPaymentsInstance as {
        widgets: (config: { customerKey: string }) => unknown;
      }
    ).widgets({ customerKey: ANONYMOUS });
    return true;
  } catch (error) {
    console.error('Failed to initialize TossPayments:', error);
    return false;
  }
};

const withWidgetsCheck = async <T extends unknown[]>(
  action: (...args: T) => Promise<void>,
  errorMsg: string,
  ...args: T
): Promise<boolean> => {
  if (!widgetsInstance) {
    console.error('TossPayments widgets not initialized');
    return false;
  }
  try {
    await action(...args);
    return true;
  } catch (error) {
    console.error(errorMsg, error);
    return false;
  }
};

export const setPaymentAmount = (amount: number): Promise<boolean> =>
  withWidgetsCheck(
    async () =>
      (
        widgetsInstance as {
          setAmount: (config: { value: number; currency: string }) => void;
        }
      ).setAmount({ value: amount, currency: 'KRW' }),
    'Failed to set payment amount:'
  );

export const renderPaymentMethods = (selector: string): Promise<boolean> =>
  withWidgetsCheck(
    async () =>
      (
        widgetsInstance as {
          renderPaymentMethods: (config: {
            selector: string;
            variantKey: string;
          }) => void;
        }
      ).renderPaymentMethods({ selector, variantKey: 'DEFAULT' }),
    'Failed to render payment methods:'
  );

export const renderAgreement = (selector: string): Promise<boolean> =>
  withWidgetsCheck(
    async () =>
      (
        widgetsInstance as {
          renderAgreement: (config: { selector: string }) => void;
        }
      ).renderAgreement({ selector }),
    'Failed to render agreement:'
  );

export const requestTossPayment = async (
  paymentData: TossPaymentsPaymentData,
  onResult?: (response: TossPaymentsResponse) => void
): Promise<void> => {
  if (!widgetsInstance) {
    const error = {
      code: 'WIDGET_NOT_INITIALIZED',
      message: 'TossPayments widgets not initialized',
    };
    onResult?.(error);
    throw new Error(error.message);
  }

  try {
    const { origin } = window.location;
    await (
      widgetsInstance as {
        requestPayment: (
          data: TossPaymentsPaymentData & {
            successUrl: string;
            failUrl: string;
          }
        ) => Promise<void>;
      }
    ).requestPayment({
      ...paymentData,
      successUrl: `${origin}/tosspayments/success`,
      failUrl: `${origin}/tosspayments/fail`,
    });
  } catch (error: unknown) {
    const typedError = error as { code?: string; message?: string };
    const response: TossPaymentsResponse = {
      code: typedError.code || 'PAYMENT_ERROR',
      message: typedError.message || '결제 처리 중 오류가 발생했습니다.',
      type: 'error',
    };
    onResult?.(response);
    throw error;
  }
};

export const removeTossPayments = (): void => {
  ['#payment-methods', '#agreement'].forEach((selector) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = '';
  });

  tossPaymentsInstance = null;
  widgetsInstance = null;
};
