import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataLoading from '../../component/_common/DataLoading';

// 네이버 로그인 리다이렉트 처리 컴포넌트
function NaverRedirect() {
    const navigate = useNavigate();
    
    useEffect(()=>{
        // URL에서 쿼리 파라미터 가져오기
        const search = window.location.search;
        const param = new URLSearchParams(search);
        const code = param.get('code');        // 네이버에서 받은 인증 코드
        const getState = param.get('state');   // 네이버에서 받은 state 값
        const sessionState = sessionStorage.getItem('naver_state');   // 세션에 저장된 state 값
        
        if (!code) return;   // code 값이 없으면 return

        // 전달받은 state와 세션에 저장된 state 비교 (CSRF 공격 방지용)
        if (getState !== sessionState) {
            alert('⚠️ 로그인 보안 오류! 다시 시도해주세요');
            return;
        }

        // 백엔드 API에 code와 state를 보내 토큰과 유저 정보 받기
        axios({
            method: "get",
            url: `${process.env.REACT_APP_APIURL}/naver`,
            params: { code, state: getState }
        })
        .then(res=>{
            // 백엔드 응답에서 액세스 토큰과 사용자 정보 추출
            const access_token = res.data.naver_access_token;
            const naver_user = {
                id: res.data.id,
                name: res.data.name,
                email: res.data.email
            }
            
            // 세션 스토리지에 로그인 관련 정보 저장
            sessionStorage.setItem('provider', 'naver');
            sessionStorage.setItem('access', access_token);
            sessionStorage.setItem('user', JSON.stringify(naver_user));

            // 로그인 후 메인 페이지(홈)로 리다이렉트 (약간의 지연 후)
            setTimeout(() => {
                navigate('/');
            }, 1100);
        })
        .catch(err => {
            console.error('네이버 로그인 실패:', err);
        });
    }, [navigate])

    return (
        <div className='rd-background'>
            <p><img src="/imgs/logo_black.svg" alt="떠나봅서logo" /></p>
            <DataLoading className={'rb-loading'}/>
            <span>네이버 로그인중입니다...</span>
        </div>
    )
}

export default NaverRedirect