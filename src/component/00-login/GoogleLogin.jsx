import React from 'react'

// 구글 로그인 인가 코드 요청 컴포넌트
function GoogleLogin() {
  // 구글 OAuth2 인증 URL
  const google_url = 'https://accounts.google.com/o/oauth2/v2/auth';

  // 환경 변수에서 클라이언트 ID 및 리다이렉트 URI 불러오기
  const google_client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const google_redirect_uri = `${process.env.REACT_APP_REDIRECT_URI}/authgoogle`;

  // 인증 요청에 필요한 파라미터들
  const google_response_type = 'code';            // 인가 코드 받기
  const google_scope = 'profile email';           // 요청할 사용자 정보 범위
  const google_access_type = 'offline';           // 리프레시 토큰 받기 위한 설정
  const google_include_granted_scopes = 'true';   // 기존 승인 범위 포함 여부

  // CSRF 방지를 위한 상태 값 생성 및 세션 저장
  const google_state = crypto.randomUUID();
  sessionStorage.setItem('google_state', google_state);
  
  // 구글 로그인 버튼 클릭 시 실행되는 함수 (인가 코드 요청)
  function google_login() {
    // 구글 OAuth2 인증 페이지로 이동 (응답)
    window.location.href = google_url+`?client_id=${google_client_id}&redirect_uri=${google_redirect_uri}&response_type=${google_response_type}&scope=${google_scope}&access_type=${google_access_type}&include_granted_scopes=${google_include_granted_scopes}&state=${google_state}`
  }

  return (
    // 영역 클릭 시 함수 실행.
    <p onClick={google_login}>
      <img src="/imgs/login_google_01.png" alt="로그인btn-구글" className='login-pc'/>
      <img src="/imgs/login_google_02.png" alt="로그인btn(mob)-구글" className='login-mobile'/>
    </p>
  )
}

export default GoogleLogin