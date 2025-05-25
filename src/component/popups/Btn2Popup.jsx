import React from 'react'
import Warning from '../icons/Warning';
import Call from '../icons/Call';

// 버튼이 2개인 확인용 팝업
function Btn2Popup({ isOpen, setIsOpen, type, onConfirm, onCancel, className='' }) {

  // 각 타입별 팝업 정보 객체 (본문 및 버튼, 아이콘 포함)
  const popupContent = {
    login: {
      txt: `로그인이 필요한 페이지입니다.
            로그인 하시겠습니까?`,
      btntxt1: '아니오',
      btntxt2: '예',
      icon: <Warning className={'popup-warningicon'}/>
    },
    delete: {
      txt: '정말 삭제하시겠습니까?',
      btntxt1: '아니오',
      btntxt2: '예',
      icon: <Warning className={'popup-warningicon'}/>
    },
    trip: {
      txt: `등록된 여행이 없습니다.
            여행 일정을 새로 추가하시겠습니까?`,
      btntxt1: '아니오',
      btntxt2: '예',
      icon: <Warning className={'popup-warningicon'}/>
    },
    logout: {
      txt: '정말 로그아웃하시겠습니까?',
      btntxt1: '아니오',
      btntxt2: '예',
      icon: <Warning className={'popup-warningicon'}/>
    },
    exit: {
      txt: '작성중인 내용이 있습니다. 나가시겠습니까?',
      subtxt: '변경사항은 저장되지 않습니다.',    // 부가 설명 텍스트
      btntxt1: '아니오',
      btntxt2: '예',
      icon: <Warning className={'popup-warningicon'}/>
    },
    call: {
      txt: '1588-0000',
      btntxt1: '취소',
      btntxt2: '통화',
      icon: <Call className={'popup-callicon'}/>
    }
  }

  // 팝업 배경 클릭 시 팝업 닫힘
  function closePopup(e) {
    if(e.target.classList.contains('popup-box')) {
      setIsOpen(false);
    }
  }

  // 팝업이 닫혀있으면 랜더링 하지 않음.
  if (!isOpen) return null;

  return (
    <div className={className ? className : 'popup-box'} onClick={closePopup}>
      <div className='popup'>

        {/* 아이콘 및 팝업 본문 */}
        <div className='popup-cont'>
          {popupContent[type]?.icon}
          <p>
            {popupContent[type]?.txt}
            <span>{popupContent[type]?.subtxt}</span>
          </p>
        </div>

        {/* 팝업 버튼 */}
        <div className='popup-btns-box'>
          {/* 취소 버튼 */}
          <button 
            className='btn2popup-btn' 
            onClick={() => {
              setIsOpen(false);           // 팝업 닫기
              if (onCancel) onCancel();   // onCancel 콜백 함수가 있으면 호출
            }}>
            {popupContent[type]?.btntxt1}
          </button>
          {/* 확인 버튼 */}
          <button
            className='btn1popup-btn'
            onClick={() => {
              if (onConfirm) onConfirm();  // onConfirm 콜백 함수 호출
          }}>
            {popupContent[type]?.btntxt2}
          </button>
        </div>

      </div>
    </div>
  )
}

export default Btn2Popup