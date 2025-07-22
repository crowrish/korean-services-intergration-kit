export const getIamportHtmlTemplate = (
  merchantId: string
) => `<!-- Iamport 스크립트를 </body> 태그 직전에 추가 -->
<script src="https://cdn.iamport.kr/v1/iamport.js"></script>
<script>
  // Iamport 초기화
  IMP.init('${merchantId}');

  // 결제 함수
  function requestPay() {
    IMP.request_pay({
      pg: 'html5_inicis', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: 'merchant_' + new Date().getTime(), // 주문번호
      name: '주문명: 결제테스트', // 상품명
      amount: 14000, // 결제금액
      buyer_email: 'iamport@siot.do', // 구매자 이메일
      buyer_name: '구매자이름', // 구매자 이름
      buyer_tel: '010-1234-5678', // 구매자 전화번호
      buyer_addr: '서울특별시 강남구 삼성동', // 구매자 주소
      buyer_postcode: '123-456' // 구매자 우편번호
    }, function (rsp) { // callback
      if (rsp.success) {
        // 결제 성공 시 로직
        console.log('결제가 완료되었습니다.', rsp);
        alert('결제가 완료되었습니다. 결제 고유번호: ' + rsp.imp_uid);
        
        // 서버로 결제 정보 전송
        // fetch('/api/payments/verify', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     imp_uid: rsp.imp_uid,
        //     merchant_uid: rsp.merchant_uid
        //   })
        // });
      } else {
        // 결제 실패 시 로직
        console.log('결제에 실패하였습니다.', rsp);
        alert('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg);
      }
    });
  }
</script>

<!-- 결제 버튼 예제 -->
<button onclick="requestPay()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
  결제하기
</button>`;
