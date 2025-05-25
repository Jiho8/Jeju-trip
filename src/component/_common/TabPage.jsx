import React from 'react'
import TabMenu from './TabMenu';

function TabPage({ type, onTabChange, selectedTab }) { 

  // 각 타입별 탭 정보 객체 (메인 타이틀과 탭 제목 배열 포함)
  const tab = {
    activity: {
      mainTitle: '나의 활동',
      tabTitle: ['게시물', '댓글']
    },
    like: {
      mainTitle: '좋아요',
      tabTitle: ['장소', '게시물']
    },
    plan: {
      mainTitle: '나의 일정 추가',
      tabTitle: ['지역별', '좋아요']
    },
    community: {
      mainTitle: '떠나톡',
      tabTitle: ['게시물', '갤러리']
    }
  }

  return (
    <>
      <h2 className='tab-maintitle'>{tab[type].mainTitle}</h2>
      {/* 타이틀 및 탭 상태 관리를 위한 변수 전달 */}
      <TabMenu tabTitle={tab[type].tabTitle} onTabChange={onTabChange} selectedTab={selectedTab}/>
    </>
  )
}

export default TabPage