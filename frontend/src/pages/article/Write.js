import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery'; // -- 기존 doWrite 통신을 위해 사용 --

function Write() {
  const navigate = useNavigate();

  // -- 1. 상태 관리: 입력할 게시글 데이터 --
  const [article, setArticle] = useState({
    boardId: "",
    title: "",
    body: ""
  });

  // -- 2. 입력값 변경 감지 함수 (데이터 바인딩) --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -- 3. 게시글 작성 처리 함수 (doWrite) --
  const handleSubmit = (e) => {
    e.preventDefault(); // -- 폼 제출 시 페이지 새로고침 방지 --

    // -- 유효성 검사 --
    if (!article.boardId) {
      alert('게시판을 선택해주세요.');
      return;
    }
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
      boardId: article.boardId,
      title: article.title,
      body: article.body
    }, function(data) {
      if (data.resultCode?.startsWith('S-')) {
        alert(data.msg || '게시글이 작성되었습니다.');
        navigate(`/article/detail?id=${data.data1}`); // -- 작성 후 상세페이지로 이동 --
      } else {
        alert(data.msg || '작성에 실패했습니다.');
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
              {/* -- 게시판 선택 -- */}
              <tr>
                <th className="bg-gray-100 p-2 border" style={{ width: '150px' }}>게시판</th>
                <td className="p-2 border">
                  <select 
                    className="select select-bordered w-full" 
                    name="boardId"
                    value={article.boardId}
                    onChange={handleChange}
                  >
                    <option value="" disabled>게시판을 선택해주세요</option>
                    <option value="1">공지</option>
                    <option value="2">자유</option>
                    <option value="3">QnA</option>
                  </select>
                </td>
              </tr>

              {/* -- 제목 입력란 -- */}
              <tr>
                <th className="bg-gray-100 p-2 border whitespace-nowrap">제목</th>
                <td className="p-2 border">
                  <input
                    className="input input-bordered w-full"
                    name="title"
                    type="text"
                    placeholder="제목"
                    value={article.title}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 본문 입력란 -- */}
              <tr>
                <th className="bg-gray-100 p-2 border whitespace-nowrap">본문</th>
                <td className="p-2 border">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows="15"
                    name="body"
                    placeholder="내용"
                    value={article.body}
                    onChange={handleChange}
                    autoComplete="off"
                  ></textarea>
                </td>
              </tr>

              {/* -- 하단 버튼 영역 -- */}
              <tr>
                <td className="p-4 border">
                  <button 
                    className="btn btn-outline btn-ghost whitespace-nowrap" 
                    type="button" 
                    onClick={() => navigate(-1)}
                  >
                    뒤로가기
                  </button>
                </td>
                <td className="p-4 border text-right">
                  <input className="btn btn-outline btn-primary" type="submit" value="작성" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </section>
  );
}

export default Write;