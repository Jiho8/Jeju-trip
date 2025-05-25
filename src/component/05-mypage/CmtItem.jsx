import React from 'react'

function CmtItem({title, dateTime, postTitle}) {
  return (
    <>
      {/* 작성한 댓글 내용 / 작성일 / 원본 게시물 제목 */}
      <p>{title}</p>
      <span>{dateTime}</span>
      <span>{postTitle}</span>
    </>
  )
}

export default CmtItem