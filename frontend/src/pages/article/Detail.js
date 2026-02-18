import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import $ from 'jquery'; // -- 기존 Ajax 로직 유지를 위해 제이쿼리 사용 --

function Detail() {
  const { id } = useParams(); // -- 주소창의 id값 가져오기 --
  const navigate = useNavigate();

  // -- 1. 상태 관리 (JSP의 변수들) --
  const [article, setArticle] = useState({
    id: id,
    title: "불러오는 중...",
    body: "",
    extra__writer: "",
    regDate: "",
    hitCount: 0,
    goodReactionPoint: 0,
    badReactionPoint: 0,
    userCanModify: false,
    userCanDelete: false
  });

  const [reaction, setReaction] = useState({
    isGood: false,
    isBad: false
  });

  // -- 2. 초기 데이터 로드 (조회수 증가 및 게시글 정보) --
  useEffect(() => {
    // 조회수 증가 Ajax
    $.get('../article/doIncreaseHitCountRd', { id: id, ajaxMode: 'Y' }, function(data) {
      if(data.data1) {
        setArticle(prev => ({ ...prev, hitCount: data.data1 }));
      }
    }, 'json');

    // 게시글 상세 데이터 가져오는 로직 (나중에 실제 API 연결)
    // 지금은 JSP 구조를 유지하기 위해 틀만 잡아둡니다.
  }, [id]);

  // -- 3. 좋아요 로직 (doGoodReaction) --
  const doGoodReaction = () => {
    $.post('/usr/reactionPoint/doGoodReaction', {
      relTypeCode: 'article',
      relId: id
    }, function(data) {
      if (data.resultCode.startsWith('S-')) {
        // 성공 시 화면의 숫자와 버튼 상태 업데이트
        setArticle(prev => ({
          ...prev,
          goodReactionPoint: data.data1,
          badReactionPoint: data.data2 || prev.badReactionPoint
        }));
        setReaction({ isGood: data.resultCode === 'S-1', isBad: false });
      } else {
        alert(data.msg);
      }
    }, 'json');
  };

  // -- 4. 싫어요 로직 (doBadReaction) --
  const doBadReaction = () => {
    $.post('/usr/reactionPoint/doBadReaction', {
      relTypeCode: 'article',
      relId: id
    }, function(data) {
      if (data.resultCode.startsWith('S-')) {
        setArticle(prev => ({
          ...prev,
          badReactionPoint: data.data2,
          goodReactionPoint: data.data1 || prev.goodReactionPoint
        }));
        setReaction({ isGood: false, isBad: data.resultCode === 'S-1' });
      } else {
        alert(data.msg);
      }
    }, 'json');
  };

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto">
        <div className="article-detail" style={{ width: '800px', margin: '0 auto' }}>
          
          {/* -- 제목 -- */}
          <h2 style={{ marginBottom: '10px' }}>{article.title}</h2>

          {/* -- 메타 정보 -- */}
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            <span>작성자: {article.extra__writer}</span>
            &nbsp;|&nbsp;
            <span>작성일: {article.regDate}</span>
            &nbsp;|&nbsp;
            <span>조회수: {article.hitCount}</span>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#999' }}>게시글 번호: {article.id}</div>
          </div>

          <hr />

          {/* -- 본문 -- */}
          <div style={{ minHeight: '200px', padding: '20px 0', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {article.body}
          </div>

          <hr />

          {/* -- 좋아요 / 싫어요 영역 -- */}
          <div className="py-10 text-center">
            <span className="block mb-4">LIKE / DISLIKE</span>
            <div className="flex justify-center gap-4">
              <button 
                className={`btn ${reaction.isGood ? 'btn-success' : 'btn-outline btn-success'}`}
                onClick={doGoodReaction}
              >
                👍 LIKE <span className="ml-2">{article.goodReactionPoint}</span>
              </button>
              
              <button 
                className={`btn ${reaction.isBad ? 'btn-error' : 'btn-outline btn-error'}`}
                onClick={doBadReaction}
              >
                👎 DISLIKE <span className="ml-2">{article.badReactionPoint}</span>
              </button>
            </div>
          </div>

          {/* -- 하단 버튼 -- */}
          <div className="btns mt-10 flex gap-2">
            <button className="btn btn-outline btn-ghost" onClick={() => navigate(-1)}>뒤로가기</button>
            
            {article.userCanModify && (
              <button className="btn btn-outline btn-warning" onClick={() => navigate(`/article/modify?id=${id}`)}>수정</button>
            )}
            
            {article.userCanDelete && (
              <button className="btn btn-outline btn-error" onClick={() => {
                if(window.confirm('정말 삭제하시겠습니까?')) navigate(`/article/doDelete?id=${id}`);
              }}>삭제</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Detail;