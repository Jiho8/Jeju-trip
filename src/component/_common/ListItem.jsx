import React from 'react'
import Right_black from '../icons/Right_black'
import { useNavigate } from 'react-router-dom';

function ListItem({ id, title, date, page }) {
  const navigate = useNavigate();

  // 아이템 클릭 시 실행할 함수 (링크 이동)
  function changeLink() {
    // page prop에 따라 상세 페이지로 이동 (체크리스트 또는 플래너)
    if(page === 'check') {
      navigate(`/my/checklist/checkdetail/${id}`)
    } else if(page === 'plan') {
      navigate(`/planner/plannerdetail/${id}`,)
    }
  }

  return (
    <div className='listitem' onClick={changeLink}>
      <div>
        <p>{title}</p>
        {/* 여행 데이터의 경우 date 값이 배열이므로 여행 첫번째 날(0번째)과 마지막 날(개수-1번째)만 화면에 표시 */}
        <span> {date.length > 1 ? `${date[0]} - ${date[date.length-1]}` : date} </span>
      </div>
      <Right_black className={'listitem-icon'}/>
    </div>
  )
}

export default ListItem