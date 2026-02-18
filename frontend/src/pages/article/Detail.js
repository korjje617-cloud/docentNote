import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import $ from 'jquery';

function Detail() {
  const [searchParams] = useSearchParams(); // useParams 대신
  const id = searchParams.get('id'); // 주소창의 ?id=값을 가져옴
  const navigate = useNavigate();

  // -- 데이터 상태 관리 --
  const [article, setArticle] = useState(null);
  const [reaction, setReaction] = useState({
    isGood: false,
    isBad: false,
    point: 0
  });
  const [loading, setLoading] = useState(true);

  // -- 1. 데이터 가져오기 (useEffect) --
  useEffect(() => {
    if (!id) return; // id가 없으면 실행 안 함

    // 조회수 증가 요청
    $.get('http://localhost:8081/usr/article/doIncreaseHitCountRd', { id, ajaxMode: 'Y' });

    // 상세보기 데이터 요청
    $.get('http://localhost:8081/usr/article/detail', { id }, function(res) {
      if (res.resultCode.startsWith('S-')) {
        setArticle(res.article);
        setReaction({
          isGood: res.isAlreadyAddGoodRp,
          isBad: res.isAlreadyAddBadRp,
          point: res.usersReaction
        });
      } else {
        alert(res.msg);
        navigate(-1);
      }
      setLoading(false);
    }, 'json');
  }, [id, navigate]);

  // -- 2. 좋아요 처리 (doGoodReaction) --
  const doGoodReaction = () => {
    $.post('http://localhost:8081/usr/reactionPoint/doGoodReaction', { relTypeCode: 'article', relId: id }, function(data) {
      if (data.resultCode.startsWith('S-')) {
        // 성공 시 화면의 숫자와 버튼 상태 업데이트
        setArticle({ ...article, goodReactionPoint: data.data1, badReactionPoint: data.data2 });
        setReaction({ ...reaction, isGood: data.resultCode === 'S-1', isBad: false });
      } else { alert(data.msg); }
    }, 'json');
  };

  // -- 3. 싫어요 처리 (doBadReaction) --
  const doBadReaction = () => {
    $.post('http://localhost:8081/usr/reactionPoint/doBadReaction', { relTypeCode: 'article', relId: id }, function(data) {
      if (data.resultCode.startsWith('S-')) {
        setArticle({ ...article, goodReactionPoint: data.data1, badReactionPoint: data.data2 });
        setReaction({ ...reaction, isGood: false, isBad: data.resultCode === 'S-1' });
      } else { alert(data.msg); }
    }, 'json');
  };

  if (loading) return <div className="mt-24 text-center">불러오는 중...</div>;

  // -- 4. 화면 HTML (JSP 내용 복사) --
  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto" style={{ width: '800px' }}>
        <h2 className="font-bold text-3xl mb-4">{article.title}</h2>
        
        <div className="flex justify-between text-sm text-gray-500 mb-5">
          <div>
            <span>작성자: {article.extra__writer}</span> | 
            <span> 작성일: {article.regDate}</span> | 
            <span> 조회수: {article.hitCount}</span>
          </div>
          <div>게시글 번호: {article.id}</div>
        </div>
        <hr />

        <div className="py-10 min-h-[200px] text-lg leading-relaxed whitespace-pre-line">
          {article.body}
        </div>
        <hr />

        {/* 좋아요 / 싫어요 버튼 영역 */}
        <div className="py-10 text-center">
          <div className="mb-4">LIKE / DISLIKE / {reaction.point}</div>
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

        {/* 하단 버튼 */}
        <div className="flex gap-2 mt-10">
          <button className="btn btn-outline" onClick={() => navigate(-1)}>뒤로가기</button>
          {article.userCanModify && (
            <button className="btn btn-warning" onClick={() => navigate(`/article/modify/${id}`)}>수정</button>
          )}
          {article.userCanDelete && (
            <button className="btn btn-error" onClick={() => { if(window.confirm('삭제하시겠습니까?')) navigate(`/article/doDelete/${id}`) }}>삭제</button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Detail;