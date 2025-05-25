import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CmtItem from '../../component/05-mypage/CmtItem';
import TabPage from '../../component/_common/TabPage';
import TabItem from '../../component/_common/TabItem';
import NoWritePost from '../../component/_common/NoWritePost';
import NoWriteReply from '../../component/_common/NoWriteReply';
import DataLoading from '../../component/_common/DataLoading';
import { format } from 'date-fns';
import "../../styles/05-mypage/activity.scss";

function Activity() {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(0);        // 탭 상태 관리
  const [postData, setPostData] = useState([]);             // 작성 게시물 데이터
  const [cmtData, setCmtData] = useState([]);               // 작성 댓글 데이터 (게시물 id 포함)
  const [cmtOriginData, setCmtOriginData] = useState([]);   // 작성 댓글 데이터 원본

  const [loading, setLoading] = useState(true);             // 로딩 상태 관리

  // 세션에서 사용자 ID 가져오기
  const userId = String(JSON.parse(sessionStorage.getItem('user'))?.id);

  // 탭에 따라 다른 콘텐츠 렌더링
  const renderContent = () => {
    switch (selectedTab) {
      case 0: // 작성한 게시물 탭
        // 작성일 기준 최신순 정렬
        const sortedPosts = [...postData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return sortedPosts.length > 0
          ? sortedPosts.map((item) => (
            <div
              key={item._id}
              onClick={async() => {
                // 사용자가 좋아요한 게시물 목록을 서버에서 가져오기
                const res = await fetch(`${process.env.REACT_APP_APIURL}/like/user-liked?userId=${userId}`);
                const data = await res.json();
                let hasVote = data.likedPostIds.includes(item._id);
                
                // 게시물 데이터와 좋아요 여부를 localStorage에 저장
                localStorage.post = JSON.stringify({...item,hasVote});
                navigate(`/community/cmdetail/${item._id}`)  // 게시물 상세 페이지로 이동
              }}
            >
              <TabItem
                imgUrl={item.imageUrls[0]}   // 0번째 이미지 보여주기
                title={item.title}
                dateTime={format(item.createdAt, 'yyyy.MM.dd')}
              />
            </div>
          ))
          : <NoWritePost/>  // 작성한 글이 없는 경우
      case 1: // 작성한 댓글 탭
        // 작성일 기준 최신순 정렬
        const sortedCmts = [...cmtData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return sortedCmts.length > 0
        ? sortedCmts.map((item) => (
          <div
            key={item._id}
            className='tab-content-reply'
            onClick={async () => {
              try {
                // 사용자가 좋아요한 게시물 목록을 서버에서 가져오기
                const res = await fetch(`${process.env.REACT_APP_APIURL}/like/user-liked?userId=${userId}`);
                const data = await res.json();
                let hasVote = data.likedPostIds.includes(item.postInfo._id);
                
                // 게시물 데이터와 좋아요 여부를 localStorage에 저장
                localStorage.post = JSON.stringify({...item.postInfo,hasVote});
                navigate(`/community/cmdetail/${item.postInfo._id}`)  // 게시물 상세 페이지로 이동
              } catch (err) {
                console.error('게시물 데이터 불러오기 실패:', err);
              }
            }}
          >
            <CmtItem
              title={item.text}
              dateTime={format(item.createdAt, 'yyyy.MM.dd') + '  ' + format(item.createdAt, 'hh:mm')}
              postTitle={item.postInfo.title}
            />
          </div>
        ))
        : <NoWriteReply/>  // 작성한 댓글이 없는 경우
    }
  };
  
  // 컴포넌트 마운트 시 데이터 요청
  useEffect(() => {
    async function fetchData() {
      try {
        // 사용자별 게시물 데이터 요청
        const postRes = await axios.get(`${process.env.REACT_APP_APIURL}/post/user/${userId}`);
        setPostData(postRes.data || []);

        // 사용자별 댓글 데이터 요청
        const cmtRes = await axios.get(`${process.env.REACT_APP_APIURL}/reply/user/${userId}`);
        const getCommentData = cmtRes.data || [];
        setCmtOriginData(getCommentData);
  
        // 댓글들이 작성된 게시물들의 Id만 모아 중복 제거
        const uniquePostIds = [...new Set(getCommentData.map(item => item.postId))];
        const postIdToPostDetail = {};
  
        // 각 postId에 대해 게시물 정보 요청
        await Promise.all(
          uniquePostIds.map(async (postId) => {
            try {
              const res = await axios.get(`${process.env.REACT_APP_APIURL}/post/update/${postId}`);
              postIdToPostDetail[postId] = res.data;
            } catch {
              // 실패한 경우 기본 정보로 대체
              postIdToPostDetail[postId] = {title: '제목 없음', createdAt: 'null'};
            }
          })
        );

        // 댓글마다 관련 게시물 정보를 추가
        const updatedComments = getCommentData.map(comment => ({
          ...comment,
          postInfo: postIdToPostDetail[comment.postId] || {},
        }));
        setCmtData(updatedComments);
      } catch (err) {
        console.error(err);
        setPostData([]);
        setCmtData([]);
      } finally {
        setLoading(false); // 데이터를 다 가져온 후 로딩 종료
      }
    }
    fetchData();
  }, [userId]);
  
  return (
    <>
      <div className='activity-page'>
        {/* 상단 탭 (작성한 게시물 / 댓글) */}
        <TabPage type='activity' onTabChange={setSelectedTab} selectedTab={selectedTab}/>
        <div className='tab-content'>
          {/* 데이터 로딩 중일 경우 로딩 컴포넌트 표시 */}
          {loading ? <DataLoading className={'activity-loading'}/> : renderContent()}
        </div>
      </div>
    </>
  )
} 

export default Activity 
