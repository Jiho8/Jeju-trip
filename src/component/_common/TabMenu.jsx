import React, { useEffect, useState } from 'react'

function TabMenu({ tabTitle, onTabChange, selectedTab }) {
    const [addClass, setAddClass] = useState(0);    // 클래스 상태 관리.
    
    // selectedTab 상태 변경 시 addClass 상태 업데이트 (초기 선택값 반영)
    useEffect(() => {
        if (selectedTab !== undefined) {
            setAddClass(selectedTab);
        }
    }, [selectedTab]);

    // 탭 클릭 시 실행될 함수
    function clickEvent(index) {
        setAddClass(index);           // 클릭한 탭 인덱스로 활성 탭 상태 변경
        if (onTabChange) {
            onTabChange(index);       // 부모 콜백 함수(onTabChange prop)가 있으면 호출하여 탭 변경 알림
        }
    }

    return (
        <div className='tabmenu'>
            {
                tabTitle.map((item, i) => (
                    <div key={i}
                         className={i === addClass ? 'active' : ''}   // 선택된 탭에 클래스 추가.
                         onClick={() => clickEvent(i)}>
                        {item}
                    </div>
                ))
            }
        </div>
    )
}

export default TabMenu