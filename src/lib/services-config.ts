import { ServiceConfig } from '@/types/services';
import { getImagePath } from './image-utils';

export const services: ServiceConfig[] = [
  {
    id: 'channeltalk',
    name: 'Channel Talk',
    description:
      '채널톡 고객상담 채팅 위젯을 웹사이트에 쉽게 통합하고 테스트하세요.',
    logoUrl: getImagePath('/logos/channeltalk.png'),
    docsUrl: 'https://developers.channel.io/docs',
    category: 'Communication',
    inputLabel: 'Plugin Key',
    inputPlaceholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    route: '/channeltalk',
  },
  {
    id: 'portone-v1',
    name: 'PortOne v1 (아임포트)',
    description:
      'PortOne v1(아임포트) 결제 시스템을 Next.js에 통합하여 간편결제를 테스트하고 구현하세요.',
    logoUrl: getImagePath('/logos/portone.png'),
    docsUrl:
      'https://developers.portone.io/opi/ko/integration/start/v1/auth?v=v1',
    category: 'Payment',
    inputLabel: 'Merchant ID',
    inputPlaceholder: 'imp12345678',
    route: '/portone-v1',
  },
  {
    id: 'portone-v2',
    name: 'PortOne v2',
    description:
      'PortOne v1 결제 시스템을 Next.js에 통합하여 간편결제를 테스트하고 구현하세요.',
    logoUrl: getImagePath('/logos/portone.png'),
    docsUrl:
      'https://developers.portone.io/opi/ko/integration/start/v2/checkout?v=v2',
    category: 'Payment',
    inputLabel: 'Store ID & Channel Key',
    inputPlaceholder: 'store-xxxx... & channel-key-xxxx...',
    route: '/portone-v2',
  },
  {
    id: 'tosspayments',
    name: 'TossPayments',
    description:
      '토스페이먼츠 결제 시스템을 통해 간편하고 안전한 결제 서비스를 테스트하고 구현하세요.',
    logoUrl: getImagePath('/logos/tosspayments.png'),
    docsUrl: 'https://docs.tosspayments.com/sdk/v2/js',
    category: 'Payment',
    inputLabel: 'Client Key',
    inputPlaceholder: 'test_gck_',
    route: '/tosspayments',
  },
];
