import React, { useState } from 'react'
import ListItem from './ListItem'
import Btn1Popup from '../popups/Btn1Popup';
import Btn2Popup from '../popups/Btn2Popup';
import SwipeAction from './SwipeAction'
import SwipeHand from './SwipeHand';
import DataLoading from './DataLoading';

function ListPage({listData, page, trashClick, trash, onConfirm, isDonePopupOpen, setIsDonePopupOpen, loading = false}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);    // 팝업 열림 상태 관리
  const [openSwipeId, setOpenSwipeId] = useState(null);     // 스와이프 된 아이템id 상태 관리

  let title = '';

  // page prop에 따라 페이지 title 변경 (체크리스트 또는 플래너 페이지)
  if(page === 'check') {
    title = '체크리스트';
  } else if(page === 'plan') {
    title = '나의 여행 보기';
  }

  // 데이터를 연도별로 그룹화
  const groupedData = listData.reduce((acc, item) => {
    const year = item?.date[0].split('.')[0];   // 연도 추출 (데이터 형태: YYYY.MM.DD)
    if(!acc[year]) {
      acc[year] = [];       // 해당 연도 그룹이 없으면 배열 초기화.
    }
    acc[year].push(item);   // 해당 연도 그룹에 아이템 추가.
    return acc;             // acc는 연도별로 데이터를 모아두는 객체 (예: {2024: [...], 2023: [...]})
  }, {});

  // 연도 목록 배열로 만들고, 내림차순 정렬 (최신 연도 우선)
  const years = Object.keys(groupedData).sort((a,b)=>b-a);

  // 각 연도 그룹 안에서 항목을 날짜 기준으로 내림차순 정렬
  years.forEach((year) => {
    groupedData[year].sort((a, b) => {
      const aDate = new Date(a.date[0].replace(/\./g, '-'));   // 정렬을 위해 변환. 'YYYY.MM.DD' → 'YYYY-MM-DD'
      const bDate = new Date(b.date[0].replace(/\./g, '-'));
      return bDate - aDate;
    });
  });
  
  return (
    <div className='listpage'>
      <h2>{title}</h2>
      {
      // loading prop이 false일 때만 데이터 표시.
      loading ? (
        <DataLoading className={'listpage-loading'}/>
      ) : (
        <>
          {
            // 밀어서 삭제 기능을 알려주기 위한 손가락 모션.
            listData.length !== 0 && (
              <div className='listpage-swipehand-wrap'>
                <div className='listpage-swipehand'>
                  <SwipeHand />
                </div>
              </div>
            )
          }

          {
            // 연도배열을 이용하여 데이터 출력.
            years.map((year) => (
              <div key={year} className='listpage-year'>
                <h3>{year}</h3>

                {/* 해당 연도의 항목 렌더링 */}
                {groupedData[year].map((item) => (
                  // 삭제 대기 중인 항목(서버에는 존재하지만 화면에서 삭제 요청된 항목) 제외하고 렌더링
                  !trashClick?.[item.id] && (
                    <SwipeAction
                      key={item.id}
                      setTrashClick={() => {
                        setOpenSwipeId(item.id);             // 현재 스와이프된 항목 ID 설정.
                        trash(item.id);                      // trash prop으로 해당 항목 화면에서 삭제.
                      }}
                      setIsPopupOpen={setIsPopupOpen}        // 삭제 확인 팝업 open.
                      resetSwipe={openSwipeId === item.id}   // 해당 항목이 현재 열린 항목이면 스와이프 초기화.
                    >
                      <ListItem                              // listItem 컴포넌트를 통해 데이터 출력.
                        id={item.id}
                        title={item.title}
                        date={item.date}
                        page={page}                          // 현재 페이지 유형.
                      />
                    </SwipeAction>
                  )
                ))}
              </div>
            ))
          }
        </>
      )}

      {/* 삭제 확인 팝업 */}
      <Btn2Popup
        isOpen={isPopupOpen}             // 팝업 열림 상태 관리
        setIsOpen={setIsPopupOpen}       // 팝업 상태 변경 함수 전달
        type={'delete'}                  // 팝업 유형
        onCancel={() => {                // 취소 버튼 클릭 시 실행
          setOpenSwipeId(null);          // 스와이프 상태 초기화
        }}
        onConfirm={() => {               // 확인 버튼 클릭 시 실행
          onConfirm();                   // 삭제 처리 함수 호출
          setIsPopupOpen(false);         // 팝업 닫기
        }}
      />

      {/* 삭제 완료 팝업 */}
      <Btn1Popup
        isOpen={isDonePopupOpen}         // 완료 팝업 열림 상태 관리
        setIsOpen={setIsDonePopupOpen}   // 완료 팝업 상태 변경 함수 전달
        type={'delete'}                  // 팝업 유형
      />
    </div>
  );
}

export default ListPage