'use client';

import { ApiKeyInputProps } from '@/types/services';

export default function ApiKeyInput({
  label,
  placeholder,
  value,
  onChange,
  onSubmit,
  isValid = true,
}: ApiKeyInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API 키 설정</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
          <div className="relative">
            <input
              id="api-key"
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
              }`}
            />
            {!isValid && (
              <div className="absolute right-3 top-3">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {!isValid && (
            <p className="mt-1 text-sm text-red-600">
              유효하지 않은 API 키 형식입니다.
            </p>
          )}
        </div>

        {/* Security Warning for TossPayments */}
        {label === 'Client Key' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <svg
                className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h4 className="text-xs font-medium text-red-800">보안 경고</h4>
                <p className="text-xs text-red-700 mt-0.5">
                  테스트용 키만 사용하세요.{' '}
                  <strong>라이브 키는 절대 입력하지 마세요!</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!value.trim() || !isValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            value.trim() && isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          테스트 시작
        </button>
      </form>
    </div>
  );
}
