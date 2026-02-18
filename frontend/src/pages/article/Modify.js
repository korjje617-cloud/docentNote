import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import $ from 'jquery'; // -- 기존 doWrite(수정 처리) 통신을 위해 사용 --

function Modify() {
  const { id } = useParams(); // -- URL에서 게시글 번호 가져오기 --
  const navigate = useNavigate();

  // -- 1. 상태 관리: 수정할 게시글 데이터 -- 
  const [article, setArticle] = useState({
    title: "", // [cite: 2]
    body: "",  // [cite: 3]
    userCanDelete: false
  });

  // -- 2. 초기 데이터 불러오기 --
  useEffect(() => {
    // 실제로는 여기서 서버 API를 호출하여 기존 제목과 내용을 가져와야 합니다.
    // 지금은 구조만 잡아두고, 나중에 백엔드 연결 시 데이터를 setArticle에 넣어주면 됩니다.
    console.log(`${id}번 게시글 데이터를 불러옵니다.`);
  }, [id]);

  // -- 3. 입력값 변경 감지 함수 (데이터 바인딩) --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -- 4. 수정 처리 함수 (doWrite) -- 
  const handleSubmit = (e) => {
    e.preventDefault(); // -- 폼 제출 시 페이지 새로고침 방지 --

    if (!article.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!article.body.trim()) {
      alert('본문을 입력해주세요.');
      return;
    }

    // -- 기존 JSP의 action="../article/doWrite" 역할을 Ajax로 처리 --
    $.post('../article/doWrite', {
      id: id,
      title: article.title,
      body: article.body
    }, function(data) {
      if (data.resultCode?.startsWith('S-')) {
        alert('수정되었습니다.');
        navigate(`/article/detail/${id}`); // -- 수정 후 상세보기로 이동 --
      } else {
        alert(data.msg || '수정에 실패했습니다.');
      }
    }, 'json');
  };

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto flex justify-center">
        {/* -- action 대신 onSubmit 이벤트 사용 -- */} 
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '800px' }}>
          <table className="table border-collapse w-full border">
            <tbody>
              {/* -- 제목 입력란 -- */} [cite: 2]
              <tr>
                <th className="bg-gray-100 p-2 border whitespace-nowrap" style={{ width: '150px' }}>제목</th>
                <td className="p-2 border">
                  <input
                    className="input input-bordered w-full"
                    name="title"
                    type="text"
                    value={article.title}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 본문 입력란 -- */} [cite: 3]
              <tr>
                <th className="bg-gray-100 p-2 border whitespace-nowrap">본문</th>
                <td className="p-2 border">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="15"
                    name="body"
                    value={article.body}
                    onChange={handleChange}
                    autoComplete="off"
                  ></textarea>
                </td>
              </tr>

              {/* -- 하단 버튼 영역 -- */}
              <tr>
                <td className="p-4 border" colSpan="2">
                  <div className="flex justify-between items-center w-full">
                    {/* -- 삭제 버튼 (조건부 렌더ing) -- */}
                    <div>
                      {article.userCanDelete && (
                        <button 
                          type="button"
                          className="btn btn-outline btn-error"
                          onClick={() => { if(window.confirm('삭제하시겠습니까?')) navigate(`/article/doDelete?id=${id}`) }}
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className="btn btn-outline btn-ghost" 
                        type="button" 
                        onClick={() => navigate(-1)}
                      >
                        뒤로가기
                      </button>
                      <input className="btn btn-outline btn-primary" type="submit" value="수정 완료" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </section>
  );
}

export default Modify;