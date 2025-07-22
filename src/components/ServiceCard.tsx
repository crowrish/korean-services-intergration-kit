'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ServiceCardProps } from '@/types/services';

export default function ServiceCard({ service }: ServiceCardProps) {
  const categoryColors = {
    Payment: 'bg-blue-100 text-blue-800',
    Analytics: 'bg-green-100 text-green-800',
    Communication: 'bg-purple-100 text-purple-800',
    Social: 'bg-yellow-100 text-yellow-800',
    Map: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center p-2 shadow-sm">
            {service.logoUrl ? (
              <Image
                src={service.logoUrl}
                alt={`${service.name} logo`}
                width={32}
                height={32}
                className="object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-gray-600">
                {service.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {service.name}
            </h3>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColors[service.category]}`}
            >
              {service.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="flex items-center justify-between">
        <Link
          href={service.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
        >
          <span>문서 보기</span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>

        <Link
          href={service.route}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          테스트하기
        </Link>
      </div>
    </div>
  );
}
