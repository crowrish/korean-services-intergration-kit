// Kakao Login SDK Code Examples

export const kakaoExamples = {
  htmlScript: `<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
        integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
        crossorigin="anonymous"></script>`,

  nextjsScript: `import Script from 'next/script';

<Script
  src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
  integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
  crossOrigin="anonymous"
  onLoad={() => console.log('Kakao SDK loaded')}
/>`,

  officialLogin: `// SDK 초기화
Kakao.init('YOUR_JAVASCRIPT_KEY');

// 공식 로그인 방식 (리다이렉트)
function kakaoLogin() {
  Kakao.Auth.authorize({
    redirectUri: window.location.origin + '/callback' // 등록한 redirect_uri
  });
}

// 버튼 클릭 이벤트
<button onClick={() => kakaoLogin()}>
  <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
</button>`,

  popupLogin: `// SDK 초기화
Kakao.init('YOUR_JAVASCRIPT_KEY');

// 팝업 로그인 방식
function kakaoPopupLogin() {
  // 팝업 창 생성
  const popup = window.open(
    '',
    'kakaoLogin',
    'width=500,height=600,scrollbars=no,resizable=no'
  );

  if (!popup) {
    alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    return;
  }

  // 인증 URL 생성
  const clientId = 'YOUR_JAVASCRIPT_KEY';
  const redirectUri = encodeURIComponent(window.location.origin + '/callback');
  const authUrl = \`https://kauth.kakao.com/oauth/authorize?client_id=\${clientId}&redirect_uri=\${redirectUri}&response_type=code\`;
  
  // 팝업에서 인증 페이지로 이동
  popup.location.href = authUrl;

  // 팝업 창 모니터링
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed);
      console.log('팝업 창이 닫혔습니다.');
    }
  }, 1000);
}

// 버튼 클릭 이벤트
<button onClick={() => kakaoPopupLogin()}>
  카카오 로그인 (팝업)
</button>`,
};