import React, { useState, useEffect } from 'react'; // -- useEffect 추가 [cite: 24] --
import { Link, useSearchParams } from 'react-router-dom';
import $ from 'jquery'; // -- 서버와 통신하기 위해 제이쿼리 임포트 --

function List() {
  const [searchParams] = useSearchParams();
  // -- 주소창에서 boardId와 page 값을 읽어옵니다  --
  const boardId = searchParams.get('boardId') || '1';
  const page = parseInt(searchParams.get('page') || '1');

  // -- 1. 상태 관리: 서버에서 받아올 게시글 목록 [cite: 26, 27] --
  const [articles, setArticles] = useState([]);
  const [articlesCount, setArticlesCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(1);

  // -- 💡 핵심: boardId나 page가 바뀔 때마다 실행되는 감시자  --
  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, page]); // -- 이 배열 안의 값이 변하면 중괄호 { } 안의 코드가 다시 실행됩니다  --

  // -- 2. 서버 데이터를 불러오는 함수 --
  const loadArticles = () => {
    $.get('/usr/article/getItems', {
      boardId: boardId,
      page: page
    }, function(data) {
      if (data.items) {
        setArticles(data.items);
        setArticlesCount(data.count);
        setPagesCount(data.pagesCount);
      }
    }, 'json');
  };

  // -- 3. 페이징 로직 계산 [cite: 28, 29, 30] --
  const paginationLen = 3;
  const startPage = Math.max(1, page - paginationLen);
  const endPage = Math.min(pagesCount, page + paginationLen);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto container">
        {/* -- 상단 검색바 영역 [cite: 31, 32, 33, 34] -- */}
        <div className="mb-4 flex items-center">
          <div>{articlesCount}개</div>
          <div className="flex-grow"></div>
          <form className="flex gap-2">
            <input type="hidden" name="boardId" value={boardId} />
            <select className="select select-sm select-bordered" name="searchKeywordTypeCode">
              <option value="title">title</option>
              <option value="body">body</option>
              <option value="title,body">title+body</option>
              <option value="nickname">nickname</option>
            </select>
            <label className="input input-bordered input-sm flex items-center gap-2">
              <input type="text" className="grow" placeholder="Search" name="searchKeyword" />
              <button type="submit">🔍</button>
            </label>
          </form>
        </div>

        {/* -- 게시글 테이블 [cite: 35, 36, 37, 38, 39, 40, 41, 42] -- */}
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-center border">ID</th>
                <th className="text-center border">Date</th>
                <th className="text-center border">Title</th>
                <th className="text-center border">Writer</th>
                <th className="text-center border">Hit</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-base-200">
                    <td className="text-center border">{article.id}</td>
                    <td className="text-center border">{article.regDate.substring(0, 10)}</td>
                    <td className="text-center border">
                      <Link to={`/article/detail?id=${article.id}`} className="hover:underline text-blue-600 font-bold">
                        {article.title}
                      </Link>
                    </td>
                    <td className="text-center border">{article.extra__writer}</td>
                    <td className="text-center border">{article.hitCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* -- 페이징 버튼 [cite: 43, 44, 45] -- */}
        <div className="flex justify-center mt-8">
          <div className="join">
            {pages.map((i) => (
              <Link
                key={i}
                className={`join-item btn btn-sm ${page === i ? 'btn-active' : ''}`}
                to={`?boardId=${boardId}&page=${i}`}
              >
                {i}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default List;