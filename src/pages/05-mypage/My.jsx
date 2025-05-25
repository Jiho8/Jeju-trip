import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import MyMenu from '../../component/05-mypage/MyMenu';
import Btn1Popup from '../../component/popups/Btn1Popup';
import Btn2Popup from '../../component/popups/Btn2Popup';
import { googleLogout, kakaoLogout, naverLogout } from '../../utils/logout';
import '../../styles/05-mypage/my.scss';

function My() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);   // 사용자 정보
  const [popupType, setPopupType] = useState(null);   // 팝업 유형
  const [isPopupOpen, setIsPopupOpen] = useState(false);   // Btn2Popup 상태 관리
  const [isDonePopupOpen, setIsDonePopupOpen] = useState(false);  // Btn1Popup 상태 관리
  const [myTrip, setMyTrip] = useState(null);   // 나의 여행 수

  const isLoggedIn = !!sessionStorage.getItem('access');   // 로그인 여부 확인

  // 세션에 저장된 사용자 정보 가져오기
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 나의 여행 수 가져오기
  useEffect(() => {
    if(user) {
      const userId = user.id;
      axios.get(`${process.env.REACT_APP_APIURL}/plan/user/${userId}`)
      .then(res => {
          const tripLth = res.data.length;
          setMyTrip(tripLth);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          // 서버에서 404가 발생하면, plan이 없으므로 tripLth를 0으로 설정
          setMyTrip(0);
          // console.warn("No plan data found for user.");
        } else {
          // 그 외의 오류가 발생했을 때 처리
          console.error("Error fetching plan:", err);
        }
      });
    }
  }, [user, myTrip])

  // Btn2Popup type별 팝업
  function openPopup(type) {
    setPopupType(type);
    setIsPopupOpen(true);
  }

  // 로그아웃 동작 및 팝업 관리
  function handleLogoutConfirm() {
    const provider = sessionStorage.getItem('provider');  // 로그인된 소셜 정보(?)
    setIsPopupOpen(false);   // 팝업 닫기

    // 로그아웃 완료 팝업 (비동기. 로그아웃 완료 후 진행되어야 함.)
    const afterLogout = () => {
      setTimeout(() => {
        setIsDonePopupOpen(true);
      }, 400);
    }

    // 각 소셜 로그아웃 진행
    if (provider === 'kakao') {
      kakaoLogout();
      return;
    } 
    if (provider === 'naver') {
      naverLogout(afterLogout);
    } else if (provider === 'google') {
      googleLogout(afterLogout);
    }
  }

  // 통화 팝업 관리
  function handleCallConfirm() {
    const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);   // 모바일 여부 확인
    setIsPopupOpen(false);  // 팝업 닫기

    if(isMobile) {
      window.location.href = 'tel:15880000';
    } else {
      alert('※ 웹 브라우저 환경에서는 통화 연결이 어렵습니다. \n1588-0000 으로 전화해주세요.');
    }
  }

  // 나의 여행 팝업 관리
  function handleTripConfirm() {
    navigate('/planner')
  }
  
  return (
    <div className='my-page'>
      <h2 className='tab-maintitle'>MY</h2>

      { user ? (
        <>
          {/* 로그인 상태 */}

          <div className='my-login'>
            <p>{`${user.name} 님, 어시여 !`}</p>
            <span>{user.email ? user.email : user.id}</span>
          </div>

          {/* 아이콘 메뉴 */}
          <MyMenu isLoggedIn={isLoggedIn} openPopup={openPopup}/>

          {/* 리스트 메뉴 */}
          <div className='my-menu2'>
            <div className='my-menu-trip'>
              <p>여행</p>
              <b onClick={() => {
                  if (!isLoggedIn) openPopup('login');   // 로그인 되어 있지 않은 경우 로그인 요청 팝업 open
                  else if (!myTrip) openPopup('trip');   // 추가한 여행이 없을 경우 알림 팝업 open
                  else navigate('/planner');             // 나의 여행 페이지로 이동
                }}
              >
                나의 여행 보기
              </b>
              {myTrip !== 0 && (
                <span className='my-trip-num'>{myTrip}</span>  // 작성한 여행이 있을 때만 여행 수 표시
              )}
              <NavLink to='/planner/pickplan'>추천 일정 보기</NavLink>
            </div>
            <div className='my-menu-help'>
              <p>고객센터</p>
              <NavLink to='/my/qna'>자주 묻는 질문</NavLink>
              <b onClick={() => openPopup('call')}>전화 걸기</b>
            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <span className='my-login-out'
                onClick={() => openPopup('logout')}>
            로그아웃
          </span>
        </>
      ) : (
        <>
          {/* 비로그인 상태 */}

          <div className='my-login'>
            <p>로그인을 해주세요.</p>
            <span onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>
              로그인 하러가기 →
            </span>
          </div>

          {/* 아이콘 메뉴 */}
          <MyMenu isLoggedIn={isLoggedIn} openPopup={openPopup}/>

          {/* 리스트 메뉴 */}
          <div className='my-menu2'>
            <div className='my-menu-trip'>
              <p>여행</p>
              <b onClick={() => {
                  if (!isLoggedIn) openPopup('login');
                  else navigate('/planner');
                }}
              >
                나의 여행 보기
              </b>
              <NavLink to='/planner/pickplan'>추천 일정 보기</NavLink>
            </div>
            <div className='my-menu-help'>
              <p>고객센터</p>
              <NavLink to='/my/qna'>자주 묻는 질문</NavLink>
              <span onClick={() => openPopup('call')}>전화 걸기</span>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <span className='my-login-out'
                onClick={() => navigate('/login')}>
            로그인
          </span>
        </>
      )}

      {/* 로그아웃 완료 팝업 */}
      <Btn1Popup 
        isOpen={isDonePopupOpen}
        setIsOpen={setIsDonePopupOpen}
        type={'logout'}
        onConfirm={() => {
          navigate('/')}}
      />

      {/* 로그아웃 확인 팝업 / 전화 팝업 / 로그인 요청 팝업 */}
      <Btn2Popup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        type={popupType}
        onConfirm={
          popupType === 'logout'
            ? handleLogoutConfirm
            : popupType === 'call'
            ? handleCallConfirm
            : popupType === 'login'
            ? () => navigate('/login')
            : popupType === 'trip'
            ? handleTripConfirm
            : () => setIsPopupOpen(false)
        }
      />
    </div>
  )
}

export default My