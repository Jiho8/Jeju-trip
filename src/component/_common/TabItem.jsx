import React from 'react'

function TabItem({ imgUrl, title, dateTime }) {
  // 이미지 없을 때 표시할 기본 이미지.
  const imgSrc = imgUrl ? imgUrl :'/imgs/common_noimage_02.png';
  
  return (
    <div className='tabitem'>
      <p><img src={imgSrc} /></p>
      <div>
        <p>{title}</p>
        <span>{dateTime}</span>
      </div>
    </div>
  )
}

export default TabItem