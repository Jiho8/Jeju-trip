import React from 'react'
import My_like from '../icons/My_like';
import Check from '../icons/Check';
import Activity from '../icons/Activity';
import { useNavigate } from 'react-router-dom';

function MyMenu({ isLoggedIn, openPopup }) {

  const navigate = useNavigate();

  // 각 타입별 메뉴 정보 객체 (type 및 url, icon, title 포함)
  const mymenuContent = [
    {
      type: 'check',
      url: 'checklist',
      icon: <Check className={'my-menuicon'}/>,
      txt: '체크리스트'
    },
    {
      type: 'like',
      url: 'like',
      icon: <My_like className={'my-menuicon-like'}/>,
      txt: '좋아요'
    },
    {
      type: 'activity',
      url: 'activity',
      icon: <Activity className={'my-menuicon'}/>,
      txt: '나의활동'
    }
  ];

  // 메뉴 클릭 시 실행되는 함수
  const handleClick = (url) => {
    // isLoggedIn prop을 통해 로그인 여부를 확인하여 팝업 및 navigate 처리. 
    if (!isLoggedIn) {
      openPopup('login');
    } else {
      navigate(`/my/${url}`);
    }
  };

  return (
    <div className='my-menu1'>
      {
        mymenuContent.map(item => (
          <div key={item.type} className={`my-menu-${item.type}`}
               onClick={() => {handleClick(item.url)}}    // 클릭 시 url과 함께 함수 실행 요청
               style={{cursor: 'pointer'}}
          >
            {item.icon}
            <span>{item.txt}</span>
          </div>          
        ))
      }
    </div>
  )
}

export default MyMenu