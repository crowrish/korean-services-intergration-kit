export interface ServiceConfig {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  docsUrl: string;
  category: 'Payment' | 'Analytics' | 'Communication' | 'Social' | 'Map';
  inputLabel: string;
  inputPlaceholder: string;
  route: string;
}

export interface ServiceCardProps {
  service: ServiceConfig;
}

export interface ApiKeyInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isValid?: boolean;
}

export interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export interface LiveDemoProps {
  isActive: boolean;
  children: React.ReactNode;
}
