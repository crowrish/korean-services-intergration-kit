'use client';

import { LiveDemoProps } from '@/types/services';

export default function LiveDemo({ isActive, children }: LiveDemoProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">실시간 데모</h3>

      {isActive ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">연결됨</span>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
            {children}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="text-gray-500">
              API 키를 입력하면 실시간 데모를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
