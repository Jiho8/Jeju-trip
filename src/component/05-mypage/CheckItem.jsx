import React from 'react'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCheckItem from './AddCheckItem';
import SwipeAction from '../_common/SwipeAction';
import "../../styles/05-mypage/check/checkDetail.scss";

function CheckItem({ list, setList, isEdit, type, trashClick, trash, setIsPopupOpen }) {

  return (
      <div>
        {/* 체크박스 그룹 */}
        <FormGroup>
          {
            list.map((item, i)=>(
              // 삭제 대기 중인 항목(서버에는 존재하지만 화면에서 삭제 요청된 항목) 제외하고 렌더링
              !trashClick[i] && (
                // 수정모드가 아니면 입력 불가.
                <div key={`${i}-${Math.random()}`} style={{ pointerEvents: isEdit ? 'auto' : 'none' }}>
                  <SwipeAction 
                    setTrashClick={() => trash(i, type)}   // 삭제버튼 클릭 시 호출
                    setIsPopupOpen={setIsPopupOpen}        // 삭제 확인 팝업 상태 변경
                  >

                    {/* 체크박스 + 라벨 */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={!isEdit}           // 수정모드일 때만 체크 가능.
                          checked={item.checked}       // 체크 상태
                          onChange={() => {
                            const newList = [...list];
                            newList[i].checked = !newList[i].checked;   // 체크 상태 토글
                            setList(newList);                           // 아이템 상태 업데이트
                          }} 
                          icon={<RadioButtonUncheckedIcon/>}            // 체크X 아이콘
                          checkedIcon={<CheckCircleIcon/>}              // 체크O 아이콘
                          sx={{
                            color: 'rgba(0, 0, 0, 0.3)',              // 체크X 아이콘 색상
                            '&.Mui-checked': {color: '#2288FD'},        // 체크O 아이콘 색상
                            py: '16px',                                 // 상하 패딩값 조절
                          }}
                        />
                      }
                      label={item.name}      // 체크박스 옆 텍스트
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontFamily: 'NanumSquare, Roboto'
                        },
                      }}
                      className='checkitem'
                    />
                  </SwipeAction>
                </div>
              )
            ))}
        </FormGroup>
        
        {/* 수정모드일 때만 표시할 아이템 추가 컴포넌트 */}
        {isEdit && (
          <AddCheckItem onAdd={(newItem) => {
            if (newItem.trim()){
              // 새 아이템을 리스트에 추가, 기본 체크 상태는 false
              setList((prev) => [...prev, { name: newItem, checked: false }])
            }
          }} />
        )}
      </div>
  )
}

export default CheckItem