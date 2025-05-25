import React, { useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataLoading from '../../component/_common/DataLoading';
import '../../styles/00-login/login.scss'

// 카카오 로그인 리다이렉트 처리 컴포넌트
function KakaoRedirect() {;
    const navigate = useNavigate();
    
    useEffect(()=>{
        // URL에서 쿼리 파라미터 가져오기
        const search = window.location.search;
        const param = new URLSearchParams(search);
        const code = param.get('code');   // 카카오에서 받은 인증 코드

        if (!code) return;   // code 값이 없으면 return

        // 백엔드 API에 code를 보내 토큰과 유저 정보 받기
        axios({
            method: "get",
            url: `${process.env.REACT_APP_APIURL}/kakao`,
            params: {code}
        })
        .then(res=>{
            // 백엔드 응답에서 액세스 토큰과 사용자 정보 추출
            const access_token = res.data.kakao_access_token;
            const kakao_user = {
                id: String(res.data.id),
                name: res.data.properties?.nickname
            }
            
            // 세션 스토리지에 로그인 관련 정보 저장
            sessionStorage.setItem('provider', 'kakao');
            sessionStorage.setItem('access', access_token);
            sessionStorage.setItem('user', JSON.stringify(kakao_user));

            // 로그인 후 메인 페이지(홈)로 리다이렉트 (약간의 지연 후)
            setTimeout(() => {
                navigate('/');
            }, 1100);
        })
        .catch(err => {
            console.error('카카오 로그인 실패:', err);
        });
    }, [navigate])

    return (
        <div className='rd-background'>
            <p><img src="/imgs/logo_black.svg" alt="떠나봅서logo" /></p>
            <DataLoading className={'rb-loading'}/>
            <span>카카오 로그인중입니다...</span>
        </div>
    )
}

export default KakaoRedirect