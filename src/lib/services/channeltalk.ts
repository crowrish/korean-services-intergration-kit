'use client';

import * as ChannelService from '@channel.io/channel-web-sdk-loader';

export interface ChannelTalkConfig {
  pluginKey: string;
}

export const validateChannelTalkKey = (key: string): boolean => {
  if (!key || typeof key !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    key
  );
};

export const initializeChannelTalk = async (
  config: ChannelTalkConfig
): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      console.error(
        'ChannelTalk can only be initialized in browser environment'
      );
      return false;
    }

    if (window.ChannelIO) {
      try {
        window.ChannelIO('shutdown');
      } catch (error) {
        console.warn('Error shutting down existing ChannelIO:', error);
      }
    }

    await ChannelService.loadScript();

    if (!window.ChannelIO)
      throw new Error('ChannelIO not available after script load');

    window.ChannelIO('boot', { pluginKey: config.pluginKey });
    console.log('ChannelTalk initialized successfully with SDK');
    return true;
  } catch (error) {
    console.error('Failed to initialize ChannelTalk:', error);
    return false;
  }
};

export const removeChannelTalk = (): void => {
  try {
    if (typeof window === 'undefined') return;

    if (window.ChannelIO) window.ChannelIO('shutdown');
    console.log('ChannelTalk cleaned up');
  } catch (error) {
    console.error('Error cleaning up ChannelTalk:', error);
  }
};

const channelMethod = (method: string) => () => {
  if (window.ChannelIO) window.ChannelIO(method);
};

export const showChannelTalk = channelMethod('show');
export const hideChannelTalk = channelMethod('hide');
export const openChannelTalk = channelMethod('open');
