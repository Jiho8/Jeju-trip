import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import '../styles/splash.scss'

function Splash() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);   // 페이드아웃 애니메이션 상태 관리

    // 컴포넌트 마운트 후 2.5초 뒤에 페이드아웃 상태로 변경
    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true); // animation 시작
        }, 2500);

        return () => clearTimeout(timer); // 타이머 제거
    }, []);

    // 애니메이션 완료 후 로그인 페이지로 이동
    const animationComplete = () => {
        if(fadeOut) {
            navigate("/login", { replace: true });
        }
    }

    return (
        <motion.div
            className="spl-background"
            initial={{ opacity: 0 }}        // 시작
            animate={fadeOut ? { opacity: 0 } : { opacity: 1 }}  // fadeOut이 true면 사라짐, 아니면 나타남
            exit={{ opacity: 0 }}           // 컴포넌트 언마운트 시 사라짐
            transition={{ duration: 0.5 }}  // 애니메이션 지속 시간 0.5초
            onAnimationComplete={animationComplete}   // 애니메이션 종료 후 동작
        >
            <img src="/imgs/logo_white.svg" alt="떠나봅서logo" />
        </motion.div>
    )
}

export default Splash