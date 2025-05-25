import React from 'react'

// 카카오 로그인 인가 코드 요청 컴포넌트
function KakaoLogin() {
  // 카카오 OAuth 인증 URL
  const kakao_url = 'https://kauth.kakao.com/oauth/authorize';

  // 환경 변수에서 클라이언트 ID 및 리다이렉트 URI 불러오기
  const kakao_client_id = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const kakao_redirect_uri = `${process.env.REACT_APP_REDIRECT_URI}/authkakao`;
  
  // 인증 요청에 필요한 파라미터 - 인가 코드 받기
  const kakao_response_type = 'code';
  
  // 카카오 로그인 버튼 클릭 시 실행되는 함수 (인가 코드 요청)
  function kakao_login() {
    // 카카오 OAuth 인증 페이지로 이동 (응답)
    window.location.href = kakao_url+`?client_id=${kakao_client_id}&redirect_uri=${kakao_redirect_uri}&response_type=${kakao_response_type}`
  }

  return (
    // 영역 클릭 시 함수 실행.
    <p className='btn-kakao' onClick={kakao_login}>
      <img src="/imgs/login_kakao_01.png" alt="로그인btn-카카오" className='login-pc'/>
      <img src="/imgs/login_kakao_02.png" alt="로그인btn(mob)-카카오" className='login-mobile'/>
    </p>
  )
}

export default KakaoLogin