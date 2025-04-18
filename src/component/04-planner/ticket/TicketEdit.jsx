import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Plane from '../../icons/Plane';
import SwipeActionMemo from '../SwipeActionMemo';
import CardItem from '../CardItem';
import Close from '../../icons/Close';
import Button from '../../_common/Button';
import { plan } from '../../../api';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SvgLine from './SvgLine';

function TicketEdit({idx, btnName, ticketdate, setEdit}) {
    const { planData, setPlanData } = plan();
    const [drag, setDrag] = useState(false); // 일정 순서 버튼 클릭 상태
    const [memoClick, setMemoClick] = useState({}); // 메모 버튼 클릭 상태
    const [trashClick, setTrashClick] = useState({}); // 삭제 버튼 클릭 상태
    const { id } = useParams(); // url에서 id 가져오기

    const path = btnName === "장소 추가" ? `/planner/plannerdetail/${id}/place/${idx}` : "#"

    const memo = (index) => {
        setMemoClick((prev) => ({
          ...prev, //기존 값 유지
          [index]: !prev[index], //index값만 변경
        }));
    };
    
    const trash = (index) => {
        setTrashClick((prev) => ({
          ...prev, //기존 값 유지
          [index]: !prev[index], //index값만 변경
        }));
    };

    //순서변경 버튼 함수
    const handleToggleDrag = () => {
        setDrag((prev) => !prev); // 버튼 클릭 시 드래그 상태 토글
    };

    // 드래그 완료 핸들러
    const handleDragEnd = (result) => {
        if (!result.destination) return;

    // 원본 배열 복사 후, 드래그된 아이템을 새로운 위치로 재배치
    const items = Array.from(planData.item.days[idx].plans);
    const [reorderedItem] = items.splice(result.source.index, 1); // 기존 아이템 제거
    items.splice(result.destination.index, 0, reorderedItem); // 새로운 위치에 삽입

    // 상태 업데이트 (zustand 사용)
    const updated = structuredClone(planData);
    updated.item.days[idx].plans = items;
    setPlanData(updated); // 상태 업데이트
    setEdit(true)
    };

    return (
    <div className="ticketline" style={{overflow:'hidden', borderRadius:"10px"}}>
        <div className='ticket'>
            <div className='tickettop'>
                <div className='ticketpadding'>
                    <div className='topbar'>
                        <span>{`Day ${idx+1}`}</span>
                        <span className='ticketdate'>{ticketdate}</span>
                        <Plane className={"plane"}/>
                        <button className='topbarright'
                        onClick={handleToggleDrag}
                        >{drag ? "완료" : "일정 순서 변경"}</button>
                    </div>
                    {drag ? ( //여기는 순서변경 모드
                    <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="plan-list">
                        {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {planData?.item?.days[idx]?.plans?.map((item, i) => (
                            <Draggable
                                key={item.id || `item-${i}`}
                                draggableId={item.id?.toString() || `item-${i}`}
                                index={i}
                            >
                                {(provided) => (
                                <ul
                                    className='tickebox'
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <li className='liItem'>
                                    <div className='liLine'>
                                        <div className='liNum'><span>{i + 1}</span></div>
                                        <svg width="2" height="100%" xmlns="http://www.w3.org/2000/svg">
                                        <line x1="1" y1="0" x2="1" y2="100%" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="2" />
                                        </svg>
                                    </div>
                                    <CardItem item={item} />
                                    </li>
                                </ul>
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                    </DragDropContext>
                    ):( //여기가 바로 편집 모드
                        <>
                            {planData?.item?.days[idx]?.plans?.map((item, i)=>(
                                !trashClick[i] &&  (
                                <SwipeActionMemo className={"swipeactionmemo"} setMemoClick={()=>{memo(i)}} setTrashClick={()=>{trash(i)}}>
                                <ul className='tickebox' key={i}> {/* Day 1 */}
                                    <li className='liItem'>
                                        <div className='liLine'>
                                            <div className='liNum'><span>{ i + 1 }</span></div>
                                            <svg width="2" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                <line x1="1" y1="0" x2="1" y2="100%" stroke="rgba(0, 0, 0, 0.3)" stroke-width="2"/>
                                            </svg>
                                        </div>
                                        <CardItem item={item}/>
                                        {memoClick[i] &&
                                        <div className='planner_memo'>
                                            <p><img src='/imgs/planner_memo_01.svg'/></p>
                                            <button className='memo_close'><Close/></button>
                                            <textarea className='memo_text' placeholder='잊기 쉬운 간단한 내용을 기록해보세요'/>
                                        </div>}
                                    </li>
                                </ul>
                                </SwipeActionMemo>
                                )
                            ))}
                        </>
                    )}
                </div>
            </div>
            <SvgLine/>
            <div className='ticketbottom'>
                <div className='ticketpadding'>
                    <NavLink to={path} className='ticketbtn'>
                        <Button btn={btnName} />
                    </NavLink>
                </div>
            </div>
        </div>
    </div>
    )
}

export default TicketEdit