// Channel Talk Code Examples

export const channelTalkExamples = {
  npmInstall: `npm install @channel.io/channel-web-sdk-loader`,

  npmReactUsage: (pluginKey: string) => `'use client';

import { useEffect } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export default function App() {
  useEffect(() => {
    // 스크립트 로드
    ChannelService.loadScript();
    
    // 채널톡 부팅
    ChannelService.boot({
      pluginKey: '${pluginKey || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}'
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (window.ChannelIO) {
        window.ChannelIO('shutdown');
      }
    };
  }, []);

  return (
    <div>
      <h1>My App</h1>
      {/* 앱 컨텐츠 - 채널톡 위젯이 자동으로 우측 하단에 표시됩니다 */}
    </div>
  );
}`,

  spaTypeScript: `// lib/services/channeltalk-spa.ts
'use client';

// TypeScript 타입 정의
interface BootOption {
  pluginKey: string;
  language?: string;
  memberId?: string;
  memberHash?: string;
  profile?: Profile;
  hideChannelButtonOnBoot?: boolean;
}

interface Profile {
  name?: string;
  email?: string;
  mobileNumber?: string;
  [key: string]: any;
}

interface Callback {
  (error: Error | null, user: any): void;
}

declare global {
  interface Window {
    ChannelIO?: {
      (command: 'boot', option: BootOption, callback?: Callback): void;
      (command: 'shutdown'): void;
      (command: 'show'): void;
      (command: 'hide'): void;
      (command: 'open'): void;
      (command: 'track', event: string, properties?: any): void;
      (command: 'setPage', page: string): void;
    };
    ChannelIOInitialized?: boolean;
  }
}

class ChannelService {
  loadScript() {
    if (typeof window === 'undefined') return;
    
    (function(){
      var w=window as any;
      if(w.ChannelIO) return;
      var ch = function(){ch.c(arguments);};
      ch.q = []; ch.c = function(args: any){ch.q.push(args);};
      w.ChannelIO = ch;
      
      function l() {
        if(w.ChannelIOInitialized) return;
        w.ChannelIOInitialized = true;
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
        var x = document.getElementsByTagName('script')[0];
        if(x.parentNode) x.parentNode.insertBefore(s, x);
      }
      
      if(document.readyState === 'complete') l();
      else {
        window.addEventListener('DOMContentLoaded', l);
        window.addEventListener('load', l);
      }
    })();
  }

  boot(option: BootOption, callback?: Callback) {
    window.ChannelIO?.('boot', option, callback);
  }

  shutdown() {
    window.ChannelIO?.('shutdown');
  }

  show() {
    window.ChannelIO?.('show');
  }

  hide() {
    window.ChannelIO?.('hide');
  }

  open() {
    window.ChannelIO?.('open');
  }

  track(event: string, properties?: any) {
    window.ChannelIO?.('track', event, properties);
  }

  setPage(page: string) {
    window.ChannelIO?.('setPage', page);
  }
}

export default new ChannelService();`,

  spaReactUsage: (pluginKey: string) => `'use client';

import { useEffect } from 'react';
import channelService from '@/lib/services/channeltalk-spa';

export default function App() {
  useEffect(() => {
    // 스크립트 로드 및 채널톡 부팅
    channelService.loadScript();
    channelService.boot({
      pluginKey: '${pluginKey || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'}'
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      channelService.shutdown();
    };
  }, []);

  return (
    <div>
      <h1>My App</h1>
      {/* 앱 컨텐츠 - 채널톡 위젯이 자동으로 우측 하단에 표시됩니다 */}
    </div>
  );
}`,
};
