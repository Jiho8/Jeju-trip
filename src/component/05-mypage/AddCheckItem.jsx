import React, { useState } from 'react'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

function AddCheckItem({ onAdd }) {
    const [value, setValue] = useState('');    // 입력창(input)에 입력한 값 상태 관리.

    // form 제출 시 실행되는 함수
    const handleSubmit = (e) => {
        e.preventDefault()           // 페이지 새로고침 방지
        if (!value.trim()) return    // 입력값이 없거나 공백이면 return.
        onAdd(value)                 // 입력값을 부모 함수(onAdd)에 전달
        setValue('')                 // 입력된 내용 초기화
    }
    
    return (
        <form onSubmit={handleSubmit} className='Addcheckitem-form'>
            {/* 체크박스 아이콘 */}
            <div className="Addcheckitem-icon">
                <RadioButtonUncheckedIcon className="add-icon" />
            </div>

            {/* 입력란 */}
            <input
                type="text"
                placeholder="아이템 추가"
                value={value}                                // 입력값
                onChange={(e) => setValue(e.target.value)}   // 입력 변경 시 상태 업데이트
                className='Addcheckitem-input'
            />
        </form>
    )
}

export default AddCheckItem