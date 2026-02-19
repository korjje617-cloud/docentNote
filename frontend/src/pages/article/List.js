import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom'; // 👈 URL 파라미터를 읽기 위해 추가!

const ArticleList = () => {
  // 🔍 1. URL의 쿼리 스트링(?boardId=2&page=1 등)을 읽어오는 도구
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 값을 읽어오되, 없으면 기본값(1)을 사용함
  const boardId = parseInt(searchParams.get('boardId')) || 1;
  const page = parseInt(searchParams.get('page')) || 1;
  const searchKeywordTypeCode = searchParams.get('searchKeywordTypeCode') || 'title';
  const searchKeyword = searchParams.get('searchKeyword') || '';

  const [articles, setArticles] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  // 📡 2. 데이터 불러오기 함수
  const fetchArticles = async () => {
    setLoading(true);
    try {
      // 현재 URL에 있는 파라미터들을 그대로 서버에 전달함
      const response = await axios.get(`http://localhost:8081/usr/article/list`, {
        params: { boardId, page, searchKeywordTypeCode, searchKeyword }
      });
      
      if (response.data.resultCode.startsWith('S-')) {
        setArticles(response.data.articles);
        setData(response.data);
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
    setLoading(false);
  };

  // 🔄 3. 핵심 로직: URL(searchParams)이 바뀔 때마다 실행됨!
  // 이제 메뉴를 클릭해서 URL의 boardId가 바뀌면 이 useEffect가 즉시 감지하고 데이터를 새로 가져온다
  useEffect(() => {
    fetchArticles();
  }, [searchParams]); // 👈 URL이 변하면 무조건 다시 실행

  // 🖱️ 4. 검색 버튼 클릭 시 (URL을 변경함)
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // URL을 업데이트함 (그러면 위의 useEffect가 감지해서 fetchArticles를 실행함)
    setSearchParams({
      boardId,
      page: 1,
      searchKeywordTypeCode: formData.get('searchKeywordTypeCode'),
      searchKeyword: formData.get('searchKeyword')
    });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto">
        <div className="mb-4 flex">
          <div>{data.articlesCount}개 (게시판: {data.board?.name})</div>
          <div className="flex-grow"></div>
          
          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="flex">
            <select 
              name="searchKeywordTypeCode"
              className="select select-sm select-bordered"
              defaultValue={searchKeywordTypeCode}
            >
              <option value="title">title</option>
              <option value="body">body</option>
              <option value="title,body">title+body</option>
              <option value="nickname">nickname</option>
            </select>
            <label className="ml-3 input input-bordered input-sm flex items-center gap-2">
              <input 
                type="text" 
                name="searchKeyword"
                placeholder="Search" 
                defaultValue={searchKeyword}
              />
              <button type="submit">🔍</button>
            </label>
          </form>
        </div>

        {/* 게시글 테이블 (기존과 동일) */}
        <table className="table w-full border-collapse">
          <thead>
            <tr className="text-center">
              <th>ID</th>
              <th>Registration date</th>
              <th>Title</th>
              <th>Writer</th>
              <th>Hit</th>
              <th>goodRP</th>
            </tr>
          </thead>
          <tbody>
            {articles.length > 0 ? (
              articles.map(article => (
                <tr key={article.id} className="hover:bg-base-300 text-center">
                  <td>{article.id}</td>
                  <td>{article.regDate.substring(0, 10)}</td>
                  <td>
                    <a href={`/usr/article/detail?id=${article.id}`}>{article.title}</a>
                  </td>
                  <td>{article.extra__writer}</td>
                  <td>{article.hitCount}</td>
                  <td>{article.goodReactionPoint}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center">게시글이 없습니다</td></tr>
            )}
          </tbody>
        </table>

        {/* 📟 페이징 영역 (URL을 변경하는 방식) */}
        <div className="flex justify-center mt-4 btn-group join">
          {(() => {
            const paginationLen = 3;
            const startPage = Math.max(1, data.page - paginationLen);
            const endPage = Math.min(data.pagesCount, data.page + paginationLen);
            const pages = [];

            const changePage = (p) => {
              setSearchParams({ boardId, page: p, searchKeywordTypeCode, searchKeyword });
            };

            if (startPage > 1) pages.push(<button key={1} onClick={() => changePage(1)} className="join-item btn btn-sm">1</button>);
            
            for (let i = startPage; i <= endPage; i++) {
              pages.push(
                <button 
                  key={i} 
                  onClick={() => changePage(i)}
                  className={`join-item btn btn-sm ${data.page === i ? 'btn-active' : ''}`}
                >
                  {i}
                </button>
              );
            }

            if (endPage < data.pagesCount) pages.push(<button key={data.pagesCount} onClick={() => changePage(data.pagesCount)} className="join-item btn btn-sm">{data.pagesCount}</button>);

            return pages;
          })()}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;