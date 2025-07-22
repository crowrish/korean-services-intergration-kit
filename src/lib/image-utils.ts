export function getImagePath(path: string): string {
  // Production 환경에서만 basePath 추가
  if (process.env.NODE_ENV === 'production') {
    const basePath = '/korean-services-intergration-kit';
    // 이미 basePath가 있는 경우 중복 제거
    if (path.startsWith(basePath)) {
      return path;
    }
    return basePath + path;
  }
  return path;
}