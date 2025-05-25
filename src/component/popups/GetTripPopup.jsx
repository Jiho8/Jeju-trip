import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { format } from 'date-fns';
import { mode } from '../../api';
import Close from '../icons/Close';
import Btn1Popup from './Btn1Popup';

// 체크리스트 생성 시 여행 선택을 위한 팝업 컴포넌트
function GetTripPopup({ isOpen, setIsOpen, planData, checkData }) {
    const [selectedValue, setSelectedValue] = useState('');         // select 박스에서 선택한 여행 ID 상태 관리
    const [openSelectPopup, setOpenSelectPopup] = useState(false);  // 여행 미선택 후 확인 버튼 클릭 시 띄울 팝업 상태 관리
    const { enterEditMode } = mode();   // Zustand 편집모드 상태 관리 함수

    const navigate = useNavigate();

    // 고유 id 생성 함수 (현재 시간 + 랜덤 문자열)
    const generateId = () => {
        const datePart = Date.now().toString(36);
        const randPart = Math.random().toString(36).substring(2, 5);
        return `${datePart}${randPart}`;
    }

    // 여행을 선택하지 않을 경우 사용될 타이틀 생성 함수 ('체크리스트 n' 형태)
    function generateTitle(checkData) {
        // 현재 생성된 체크리스트들의 타이틀값만 가져오기.
        const titles = checkData.map(item => item.title);

        // 중복되지 않는 가장 작은 숫자의 체크리스트 타이틀 생성.
        let i = 1;
        while (titles.includes(`체크리스트 ${i}`)) {
            i++;
        }
        return `체크리스트 ${i}`;
    }

    // 확인 버튼 클릭 시 여행 선택 여부 검사
    function checkSelect() {
        if(selectedValue) {
            // 선택값이 있으면 체크리스트 생성 처리 함수 호출
            handleSelectPlan();
        } else {
            // 없으면 선택 요청 팝업 열기
            setOpenSelectPopup(true);
        }
    }

    // 여행 선택 후 체크리스트 생성 및 상세페이지로 이동
    function handleSelectPlan() {
        // 여행 데이터 내 select 박스에서 선택된 값의 id와 일치하는 데이터 찾아 가져오기.
        const selectedPlan = planData.find(item => item.id === selectedValue);

        const newId = generateId();    // 고유 id 생성
        const date = format(new Date(), 'yyyy.MM.dd');  // format을 통해 해당 포맷으로 작성일 저장.
        
        enterEditMode();     // 편집 모드 활성화
        setIsOpen(false);    // 팝업 닫기

        // 체크리스트 디테일 페이지로 이동. state로 데이터 전달.
        navigate(`/my/checklist/checkdetail/${newId}`, { 
            state: { 
                isEdit: true,  // 편집모드
                id: newId,     // 새로 생성한 고유 id
                planId: selectedPlan.id,    // 선택한 여행 id
                title: selectedPlan.title,  // 타이틀(선택한 여행 타이틀)
                date: [date]   // 작성일
            } 
        });
    };

    // 여행 선택 없이 체크리스트 생성 및 상세페이지로 이동.
    function handleNoPlan() {
        const newId = generateId();    // 고유 id 생성
        const title = generateTitle(checkData);         // 체크리스트 타이틀 생성
        const date = format(new Date(), 'yyyy.MM.dd');  // format을 통해 해당 포맷으로 작성일 저장.

        enterEditMode();     // Zustand에서 직접 편집 모드로 전환
        setIsOpen(false);    // 팝업 닫기

        // 체크리스트 디테일 페이지로 이동. state로 데이터 전달.
        navigate(`/my/checklist/checkdetail/${newId}`, { 
            state: { 
                isEdit: true,  // 편집모드
                id: newId,     // 새로 생성한 고유 id
                title,         // 새로 생성한 title
                date: [date]   // 작성일
            } 
        });
    };

    // 팝업 배경 클릭 시 팝업 닫힘
    function closePopup(e) {
        if(e.target.classList.contains('popup-box')) {
            setIsOpen(false);
        }
    }

    // 팝업이 닫혀있으면 랜더링 하지 않음.
    if (!isOpen) return null;    
    
    return (
        <>
            <div className='popup-box' onClick={closePopup}>
                <div className='closepopup'>
                    {/* 팝업 제목 및 닫기 버튼 */}
                    <div className='popup-title'>
                        <p>여행 선택</p>
                        <div onClick={() => setIsOpen(false)}>
                            <Close className={'popup-closeicon'}/>
                        </div>
                    </div>
            
                    {/* 팝업 본문: 안내 문구 및 여행 선택 셀렉트박스 */}
                    <div className='popup-cont'>
                        <p>체크리스트를 추가할 여행을 선택해주세요.</p>
            
                        {/* selcet 영역 */}
                        <FormControl sx={{ mt: 2, mb: 3, minWidth: 120, zIndex: 10001 }} size="small">
                            <InputLabel id="dropdown-label">선택</InputLabel>
                            <Select
                                labelId="dropdown-label"
                                id="dropdown"
                                value={selectedValue}      // 현재 선택값 업데이트
                                label="선택"
                                onChange={(e) => setSelectedValue(e.target.value)}  // 선택 변경 시 상태 업데이트 함수 실행
                                MenuProps={{
                                    sx: { zIndex: 10002 }, // 팝업보다 메뉴가 위에 뜨도록 설정.
                                }}
                            >
                                {planData.map((item, i) => (
                                    <MenuItem key={i} value={item.id} className='popup-select-item'>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
            
                        {/* 버튼 1: 여행 선택 없이 체크리스트 추가  */}
                        <button
                            className='no-select-btn'
                            onClick = {()=>handleNoPlan()}
                        >
                            여행 선택하지 않고 추가하기 →
                        </button>
                    </div>
            
                    {/* 버튼 2: 취소 및 확인(여행 선택 후 체크리스트 추가) 버튼 */}
                    <div className='closepopup-btns-box'>
                        <button className='btn2popup-btn' onClick={() => setIsOpen(false)}>
                        취소
                        </button>
                        <button className='btn1popup-btn' onClick={checkSelect}>
                        확인
                        </button>
                    </div>
                </div>
            </div>

            {/* 여행 미선태 시 뜨는 알림 팝업 */}
            {openSelectPopup && (
                <Btn1Popup
                    isOpen={true}
                    setIsOpen={() => setOpenSelectPopup(false)}
                    type={'select'}
                />
            )}
        </>
    )
}

export default GetTripPopup