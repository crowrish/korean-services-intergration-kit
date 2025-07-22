'use client';

interface MultiApiKeyInputProps {
  fields: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    isValid: boolean;
  }[];
  onSubmit: () => void;
  submitLabel?: string;
}

export default function MultiApiKeyInput({
  fields,
  onSubmit,
  submitLabel = '테스트 시작',
}: MultiApiKeyInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allValid = fields.every(
      (field) => field.value.trim() && field.isValid
    );
    if (allValid) {
      onSubmit();
    }
  };

  const allValid = fields.every((field) => field.value.trim() && field.isValid);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API 키 설정</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field, index) => (
          <div key={index}>
            <label
              htmlFor={`api-key-${index}`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                id={`api-key-${index}`}
                type="text"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  field.isValid ? 'border-gray-300' : 'border-red-300 bg-red-50'
                }`}
              />
              {!field.isValid && field.value.trim() && (
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
            {!field.isValid && field.value.trim() && (
              <p className="mt-1 text-sm text-red-600">
                유효하지 않은 {field.label} 형식입니다.
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={!allValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            allValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}
