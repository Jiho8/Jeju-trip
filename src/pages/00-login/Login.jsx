import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import KakaoLogin from '../../component/00-login/KakaoLogin';
import NaverLogin from '../../component/00-login/NaverLogin';
import GoogleLogin from '../../component/00-login/GoogleLogin';
import "../../styles/00-login/login.scss";

function Login() {
  // 페이지 진입 시 상단으로 스크롤 이동.
  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])
  
  return (
    <div className='login-page'>
      {/* 본문 및 로고 이미지 */}
      <div className='maintxt'>
        <h2>어디서든 제주,<br/>언제든</h2>
        <p><img src="/imgs/logo_blue.svg" alt="로고(blue)" /></p>
      </div>

      {/* 로그인 버튼 */}
      <div className='maincont'>
        <div className='loginbtns'>
          <NaverLogin/>
          <KakaoLogin/>
          <GoogleLogin/>
        </div>
        
        {/* 클릭 시 메인 페이지(홈)로 이동 */}
        <NavLink to='/'>
          <span>로그인하지 않고 둘러보기 →</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Login