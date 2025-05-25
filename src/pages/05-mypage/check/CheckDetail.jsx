import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { mode } from '../../../api';
import Toggle from '../../../component/_common/Toggle'
import CheckItem from '../../../component/05-mypage/CheckItem';
import SwipeHand from '../../../component/_common/SwipeHand';
import Btn1Popup from '../../../component/popups/Btn1Popup';
import Btn2Popup from '../../../component/popups/Btn2Popup';
import Close from '../../../component/icons/Close';
import "../../../styles/05-mypage/check/checkDetail.scss";

function CheckDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  const needDefaultData = ['의류', '세면도구 / 화장품', '전자기기', '신분증 / 면허증', '현금', '카드'];  // 필수 준비물 기본값

  const { isEditMode: isEdit, enterEditMode, exitEditMode } = mode();             // Zustand 편집모드 상태 관리 함수
        
  const [isOpenNeed, setIsOpenNeed] = useState(true);                             // 필수 준비물 토글 상태 관리
  const [isOpenEtc, setIsOpenEtc] = useState(true);                               // 기타 준비물 토글 상태 관리
  const [deleteTarget, setDeleteTarget] = useState({ index: null, type: null });  // 삭제 대상 저장
  const [isDelPopupOpen, setIsDelPopupOpen] = useState(false);            // 삭제 확인 팝업
  const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);          // 저장 완료 팝업
  const [isExitPopupOpen, setIsExitPopupOpen] = useState(false);          // 페이지 벗어날 때 경고 팝업
  const [list, setList] = useState(null);                                 // 전체 체크리스트 데이터
  const [ originData, setOriginData ] = useState(null);                   // 처음 불러왔을 때 체크리스트 데이터 (수정 여부 확인 위해)
  const [ needList, setNeedList ] = useState(
    needDefaultData.map(name => ({ name, checked: false }))
  );                                                                      // 체크리스트 데이터 - 필수 준비물
  const [ etcList, setEtcList ] = useState([]);                           // 체크리스트 데이터 - 기타 준비물
  const [ trashClick, setTrashClick ] = useState({
    need: Array(needList.length).fill(false),
    etc: Array(etcList.length).fill(false),
  });                                                                     // 삭제 버튼 클릭 상태

  const { id } = useParams();                                             // url에서 id 가져오기
  const userId = String(JSON.parse(sessionStorage.getItem('user'))?.id);  // 세션에 저장된 사용자 id

  const isNewChecklist = location.state?.isEdit === true;       // isEdit 값으로 새 체크리스트 여부 확인

  const trash = (index, type) => {
    setTrashClick((prev) => ({
      ...prev, // 기존 값 유지
      [index]: false, // 해당 인덱스의 trash 상태만 false로 변경
    }));
    // 삭제 팝업 열고 삭제 대상 저장
    setDeleteTarget({ index, type });
    setIsDelPopupOpen(true);
  };
  
  // 서버 데이터 가져오기
  useEffect(() => {
    if (isNewChecklist) {
      enterEditMode();   // 새 체크리스트는 편집 모드로 진입.
      const newList = addNewList(location.state);   // state로 전달 받은 데이터 가져오기
      setList(newList);
      setOriginData(JSON.parse(JSON.stringify(newList)));
      return;
    }

    // 기존 체크리스트 데이터 불러오기
    axios.get(`${process.env.REACT_APP_APIURL}/check/user/${userId}/${id}`)
    .then(res => {
      const allData = res.data;

      setList(allData);    // 전체 데이터
      setNeedList(allData.item?.Need || []);  // 필수 준비물
      setEtcList(allData.item?.Etc || []);    // 기타 준비물
      setOriginData(JSON.parse(JSON.stringify(allData)));   // 처음 데이터 저장
    })
  }, [id, userId, location.state]);

  // 새 체크리스트 구조 생성 함수
  function addNewList(state) {
    const { planId = null, title = '', date = '' } = location.state || {};
    return {
      id,
      planId,
      title,
      date,
      item: {
        Need: JSON.parse(JSON.stringify(needList)),
        Etc: JSON.parse(JSON.stringify(etcList))
      }
    };
  }

  // 저장 팝업 열기 및 저장 실행
  function openSavePopup() {
    // 삭제된 항목 필터링
    let filteredNeedList = needList;
    let filteredEtcList = etcList;

    const isNeedDeleted = trashClick.need.includes(true);
    const isEtcDeleted = trashClick.etc.includes(true);

    if (isNeedDeleted) {
      filteredNeedList = needList.filter((_, i) => !trashClick.need[i]);
    }
    if (isEtcDeleted) {
      filteredEtcList = etcList.filter((_, i) => !trashClick.etc[i]);
    }

    // 삭제된 항목이 있는지 확인
    const isDeleted = isNeedDeleted || isEtcDeleted;

    // 변경된 항목이 있는지 확인
    const isDataChanged = 
      JSON.stringify(originData?.item?.Need) !== JSON.stringify(needList) ||
      JSON.stringify(originData?.item?.Etc) !== JSON.stringify(etcList);

    if(isNewChecklist || isDataChanged || isDeleted) {
      setIsSavePopupOpen(true);

      const newList = { ...list, item: { Need: filteredNeedList, Etc: filteredEtcList } };
      setOriginData(JSON.parse(JSON.stringify(newList)));  // 저장 후 원본 데이터 업데이트

      if (isNewChecklist) {
        // 새 체크리스트일 경우 POST
        saveCheckData(newList);
      } else {
        // 기존 체크리스트일 경우 PUT
        updateCheckData(newList);
      }
    } else {
      exitEditMode();   // 변경 없음 -> 편집 모드만 종료
    }
  }

  // 새 체크리스트 추가 (POST)
  function saveCheckData(newList) {
    axios.post(`${process.env.REACT_APP_APIURL}/check`, { userId, newList })
    .catch(err => {
      console.error(err);
      alert('저장에 실패했습니다.');
    });
  }

  // 기존 체크리스트 수정 및 삭제 (PUT)
  function updateCheckData(newList) {
    axios.put(`${process.env.REACT_APP_APIURL}/check`, { userId, newList })
    .catch(err => {
      console.error(err);
      alert('수정에 실패했습니다.');
    });
  }
  
  // 삭제 버튼 팝업 처리 및 삭제
  function handleDeleteConfirm() {
    const { index, type } = deleteTarget;
  
    const updateList = (list, index) => list.filter((_, i) => i !== index);
    const updateTrash = (trash, index) => trash.filter((_, i) => i !== index);
  
    if (type === 'need') {
      setNeedList(prev => updateList(prev, index));
      setTrashClick(prev => ({ ...prev, need: updateTrash(prev.need, index) }));
    } else if (type === 'etc') {
      setEtcList(prev => updateList(prev, index));
      setTrashClick(prev => ({ ...prev, etc: updateTrash(prev.etc, index) }));
    }
  
    setDeleteTarget({ index: null, type: null });
    setIsDelPopupOpen(false);
  }

  // 닫기 버튼
  function handleClose() {
    const isNewChecklist = location.state?.isEdit === true;

    const isDataChanged = 
      JSON.stringify(originData?.item?.Need) !== JSON.stringify(needList) ||
      JSON.stringify(originData?.item?.Etc) !== JSON.stringify(etcList);

    if(isDataChanged) {
      setIsExitPopupOpen(true);   // 변경 사항 있을 경우 팝업 open
    } else {
      exitEditMode();

      // 새 체크리스트일 경우 이전 페이지로 이동
      if(isNewChecklist) navigate(-1);
    }
  }
  
  if(!list) return <p> 해당 리스트를 찾을 수 없습니다. </p>  // 데이터 없을 때
  
  return (
    <div className='checkdetail-page'>
      <div className='titlebox'>
        <div className='checkdetail-icon-close' onClick={handleClose}>
          <Close/>
        </div>
        <h2 className='pagetitle'>체크리스트</h2>
        <p className='mytriptitle'>
          {list.title ? list.title : location.state?.title}
        </p>
        <button 
          className='detailbtn'
          onClick={() => {
            if(isEdit) {
              exitEditMode();   // 편집 모드 종료
              openSavePopup();  // 팝업 열기
            } else {
              enterEditMode();  // 편집 모드 상태로 전환
            }
          }}
        >
          {
            // 버튼 텍스트 변경
            isEdit ? '완료' : '편집'
          }
        </button>
      </div>

      {/* 필수 준비물 */}
      <div className='needitembox'>
        <Toggle title={'필수 준비물'} isOpen={isOpenNeed} setIsOpen={setIsOpenNeed} />
        {isOpenNeed && ( 
          <>
            <CheckItem
            list={needList}         // 전체 데이터
            setList={setNeedList}   // 데이터 상태 변경 함수
            isEdit={isEdit}         // 편집 모드 상태
            type={'need'}           // 데이터 유형 (필수/기타)
            trashClick={trashClick.need}         // 삭제 상태 전달
            trash={trash}                        // 삭제 버튼 클릭 핸들러 전달
            setIsPopupOpen={setIsDelPopupOpen}   // 팝업 상태 변경 함수
            />
            {
              // 편집 모드일 경우 밀어서 삭제 기능을 사용자에게 알리기 위해 모션 추가.
              isEdit ? <div className='detail-swipehand'><SwipeHand/></div> : null
            }
          </>
        )}
      </div>

      {/* 기타 준비물 */}
      <div>
        <Toggle title={'기타 준비물'} isOpen={isOpenEtc} setIsOpen={setIsOpenEtc} />
        {isOpenEtc && ( 
          <CheckItem 
            list={etcList}         // 전체 데이터
            setList={setEtcList}   // 데이터 상태 변경 함수
            isEdit={isEdit}        // 편집 모드 상태
            type={'etc'}           // 데이터 유형 (필수/기타)
            trashClick={trashClick.etc}         // 삭제 상태 전달
            trash={trash}                       // 삭제 버튼 클릭 핸들러 전달
            setIsPopupOpen={setIsDelPopupOpen}  // 팝업 상태 변경 함수
          /> 
        )}
      </div>

      {/* 저장 완료 팝업 */}
      {isSavePopupOpen && (
        <Btn1Popup
          isOpen={isSavePopupOpen}
          setIsOpen={setIsSavePopupOpen}
          type={'save'}
          onConfirm={() => {
            setIsSavePopupOpen(false); // 팝업 닫기
            exitEditMode();            // 편집 모드 나가기

            // 새 체크리스트인 경우          
            if (isNewChecklist) navigate(-1);
          }}
        />
      )}

      {/* 나가기 경고 팝업 */}
      {isExitPopupOpen && (
        <Btn2Popup
          isOpen={isExitPopupOpen}
          setIsOpen={setIsExitPopupOpen}
          type={'exit'}
          onConfirm={() => {
            setIsExitPopupOpen(false); // 팝업 닫기
            exitEditMode();            // 편집 모드 나가기

            // 수정사항 되돌리기 (원본으로 복구)
            setNeedList(JSON.parse(JSON.stringify(originData?.item?.Need || [])));
            setEtcList(JSON.parse(JSON.stringify(originData?.item?.Etc || [])));

            // 새 체크리스트인 경우          
            if (isNewChecklist) navigate(-1);
          }}
        />
      )}

      {/* 삭제 확인 팝업 */}
      {isDelPopupOpen && (
        <Btn2Popup
          isOpen={isDelPopupOpen}
          setIsOpen={setIsDelPopupOpen}
          type={'delete'}
          onConfirm={handleDeleteConfirm}
        />
      )}
        
    </div>
  )
}

export default CheckDetail