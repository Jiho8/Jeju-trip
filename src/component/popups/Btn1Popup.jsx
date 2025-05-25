import React from 'react'
import Warning from '../icons/Warning';

// 버튼이 1개인 단순 확인용 팝업
function Btn1Popup({ isOpen, setIsOpen, type, onConfirm, className='' }) {

  // 각 타입별 팝업 정보 객체 (본문 및 아이콘 포함)
  const popupContent = {
    logout: {
      txt: '로그아웃되었습니다'
    },
    save: {
      txt: '저장되었습니다'
    },
    delete: {
      txt: '삭제되었습니다'
    },
    select: {
      txt: '선택된 항목이 없습니다',
      icon: <Warning className={'popup-warningicon'}/>
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
          <p>{popupContent[type]?.txt}.</p>
        </div>

        {/* 팝업 버튼 */}
        <div className='popup-btns-box'>
          <button className='btn1popup-btn' onClick={() => {
            if (onConfirm) onConfirm();  // 조건부 실행. 콜백함수 없으면 별도의 동작 없이 팝업만 닫음.
            else setIsOpen(false); 
          }}>
            확인
          </button>
        </div>

      </div>
    </div>
  )
}

export default Btn1Popup