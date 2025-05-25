import React from 'react'
import Down_black from '../icons/Down_black'
import Up_black from '../icons/Up_black'

function Toggle({title, isOpen, setIsOpen}) {

  // 토글 상태 변경 함수 (열림/닫힘 상태 반전)
  function toggleItem() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      {/* 토글 영역 클릭 시 함수 실행 */}
      <div className='toggle' onClick={toggleItem}>
        <b>{title}</b>
        {/* isOpen 상태에 따라 아이콘 변경. true(열림)일 때 down. */}
        <span>{ isOpen ? <Down_black className={'toggle-icon'}/> : <Up_black className={'toggle-icon'}/>}</span>
      </div>
    </>
  )
}

export default Toggle 