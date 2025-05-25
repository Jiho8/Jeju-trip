import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ListPage from '../../../component/_common/ListPage';
import GetTripPopup from '../../../component/popups/GetTripPopup';
import Newpost from '../../../component/icons/Newpost';
import NoCheck from '../../../component/_common/NoCheck';

function CheckList() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);                       // 여행 선택 팝업 상태 관리
  const [isDonePopupOpen, setIsDonePopupOpen] = useState(false);               // 삭제 완료 팝업 상태 관리
  const [checkData, setCheckData] = useState(null);                            // 체크리스트 데이터
  const [isPlanCheckData, setIsPlanCheckData] = useState([]);                  // planId가 연결된 체크리스트 데이터
  const [planData, setPlanData] = useState([]);                                // 연결되지 않은 여행(plan) 데이터
  const [trashClick, setTrashClick] = useState({});                            // 삭제 버튼 클릭 상태
  const [deleteTarget, setDeleteTarget] = useState({ index: null, type: null });  // 삭제 대상 아이템
  const [loading, setLoading] = useState(true);    // 로딩 상태 관리

  // 세션에서 로그인된 사용자 ID 가져오기
  const userId = String(JSON.parse(sessionStorage.getItem('user'))?.id);

  // 삭제 아이콘 클릭 처리 함수
  const trash = (id) => {
    setTrashClick((prev) => ({
      ...prev, // 기존 값 유지
      [id]: false, // 해당 id의 trash 상태만 false로 변경
    }));
    // 삭제 팝업 열고 삭제 대상 저장
    setDeleteTarget({ id });
  };

  // 최초 로딩 처리 (로딩 애니메이션 보여주기 위한 시간 지연)
  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false)
    }, 1200)
  })

  // 체크리스트 데이터 불러오기
  useEffect(()=>{
    setLoading(true);    // 로딩 시작

    axios.get(`${process.env.REACT_APP_APIURL}/check/user/${userId}`)
    .then(res=>{
      if(res.data && res.data.length > 0) {
        // planId가 있는 체크리스트(연결된 여행이 있는 체크리스트)만 따로 저장
        const filteredData = res.data.filter(check => check.planId !== null);
        setIsPlanCheckData(filteredData);
        setCheckData(res.data);
      } else {
        setCheckData([]);   // 데이터가 없는 경우 빈 배열 저장
      }
    })
    .catch(err => {
      if (err.response && err.response.status === 404) {
        setCheckData([]);   // 404면 비어있다고 판단
      } else {
        console.error("Error fetching plan:", err);
      }
    })
    .finally(() => {
      setLoading(false); // 요청 끝나면 로딩 false
    });
  },[userId])

  // 나의 여행 데이터 불러오기
  useEffect(()=>{
    // isPlanCheckData가 준비된 후에 실행되도록 조건 추가
    if (!userId && !isPlanCheckData) return;

    axios.get(`${process.env.REACT_APP_APIURL}/plan/user/${userId}`)
      .then(res=>{
        // 연결된 체크리스트에 포함된 planId 배열 만들기
        const connectedPlanIds = isPlanCheckData.map(check => check.planId);
        // 연결되지 않은 여행만 필터링
        const filteredData = res.data.filter(plan => !connectedPlanIds.includes(plan.id));
        setPlanData(filteredData);
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setPlanData([]);  // 여행 데이터 없음
        } else {
          console.error("Error fetching plan:", err);
        }
      });
  }, [userId, isPlanCheckData]);

  
  // 체크리스트 삭제 요청 함수
  function deleteCheckData() {
    const { id } = deleteTarget;
    
    if (id !== null) {
      // 백엔드에 put 요청. userId와 checkId(삭제할 체크리스트 id) 필수.
      axios.put(`${process.env.REACT_APP_APIURL}/check/del`, { userId, checkId: id })
        .then(() => {
          // 삭제 성공 시 체크리스트에서 제거
          setCheckData(prevData => prevData.filter(item => item.id !== id));
          setTrashClick({});
        })
        .catch(err => {
          console.error(err);
          alert('삭제에 실패했습니다.');
        });
    } else {
      console.log('No item to delete. deleteIndex is null');
    }
  }
  
  return (
    <div style={{padding: '92px 0 150px'}}>
      {/* 리스트 표시 컴포넌트 */}
      <ListPage
        listData={checkData || []}              // 전체 리스트 전달
        page="check"                            // 페이지 정보 전달
        trashClick={trashClick}                 // 삭제 상태 전달
        trash={(id) => trash(id)}               // 삭제 버튼 클릭 핸들러 전달
        onConfirm={() => {                      // 삭제 확인 시 실행할 로직
          deleteCheckData();
          setIsDonePopupOpen(true);             // 삭제 완료 팝업 열기
        }}
        isDonePopupOpen={isDonePopupOpen}       // 삭제 완료 팝업 상태 전달
        setIsDonePopupOpen={setIsDonePopupOpen}
        loading={loading}                       // 로딩 상태 전달
      />
      {/* 데이터 없을 때 표시할 컴포넌트 */}
      <div>
        {!loading && checkData !== null && checkData.length === 0 && <NoCheck />}
      </div>

      {/* 체크리스트 추가 버튼. 클릭 시 여행 선택 팝업 open */}
      <div onClick={() => setIsPopupOpen(true)} className='add-check-btn-wrap'>
        <Newpost className={'add-check-btn'}/>
      </div>
      
      {/* 여행 선택 팝업 */}
      <GetTripPopup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        planData={planData}       // 연결된 체크리스트 없는 여행 데이터 전달
        checkData={checkData}     // 전체 체크리스트 데이터 전달
      />
    </div>
  )
}

export default CheckList