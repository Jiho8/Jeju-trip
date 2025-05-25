import React from 'react'

// 네이버 로그인 인가 코드 요청 컴포넌트
function NaverLogin() {
  // 네이버 OAuth2.0 인증 URL
  const naver_url = 'https://nid.naver.com/oauth2.0/authorize';

  // 환경 변수에서 클라이언트 ID 및 리다이렉트 URI 불러오기
  const naver_client_id = process.env.REACT_APP_NAVER_CLIENT_ID;
  const naver_redirect_uri = `${process.env.REACT_APP_REDIRECT_URI}/authnaver`;

  // 인증 요청에 필요한 파라미터 - 인가 코드 받기
  const naver_response_type = 'code';

  // CSRF 방지를 위한 상태 값 생성 및 세션 저장
  const state = crypto.randomUUID();
  sessionStorage.setItem('naver_state', state);
  
  // 네이버 로그인 버튼 클릭 시 실행되는 함수 (인가 코드 요청)
  function naver_login() {
    // 응답
    window.location.href = naver_url+`?client_id=${naver_client_id}&redirect_uri=${naver_redirect_uri}&response_type=${naver_response_type}&state=${state}`
  }

  return (
    // 영역 클릭 시 함수 실행.
    <p onClick={naver_login}>
      <img src="/imgs/login_naver_01.png" alt="로그인btn-네이버" className='login-pc'/>
      <img src="/imgs/login_naver_02.png" alt="로그인btn(mob)-네이버" className='login-mobile'/>
    </p>
  )
}

export default NaverLogin