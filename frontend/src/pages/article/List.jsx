import React, { useState } from "react";

export const BoardList = () => {
  const [category, setCategory] = useState("전체");
  
  // 저장: 나중에 서버에서 가져올 데이터를 담을 공간. 지금은 빈 상태
  const posts = []; 

  return (
    <div className="w-full min-h-screen bg-white font-notos text-black flex flex-col items-center">
      
      {/* 설정: 페이지 제목 */}
      <h1 className="text-4xl font-song-bold mt-20 mb-10 w-[1200px] px-4">커뮤니티</h1>

      {/* 설정: 카테고리 탭 영역 */}
      <div className="w-[1200px] bg-[#F8F9FA] border-t border-b border-gray-200 py-6 px-10 flex gap-10 text-lg mb-8">
        {["전체", "자유", "QnA", "공지"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`${category === cat ? "font-bold text-black" : "text-gray-400 hover:text-black"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 생성: 게시글 목록 테이블 영역 */}
      <div className="w-[1200px] px-4">
        <div className="border-t-[2px] border-black">
          {/* 확인: 게시글 데이터가 있을 때와 없을 때를 구분하여 렌더링 */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="flex border-b border-gray-200 py-4 px-4 hover:bg-gray-50 transition-colors cursor-pointer text-[15px]">
                <span className="w-20 text-gray-500 text-sm">No.{post.id}</span>
                <span className="flex-1 font-medium truncate pr-10">{post.title}</span>
                <span className="w-24 text-center">{post.nickname}</span>
                <span className="w-28 text-center text-gray-400">{post.date}</span>
                <span className="w-20 text-center">{post.views}</span>
                <span className="w-20 text-center">{post.likes}</span>
              </div>
            ))
          ) : (
            /* 생성: 데이터가 없을 때 사용자에게 보여줄 안내 문구 */
            <div className="py-32 text-center text-gray-400 border-b border-gray-200 text-lg">
              등록된 게시글이 없습니다.
            </div>
          )}
        </div>

        {/* 설정: 하단 기능 영역 (검색 및 페이지네이션) */}
        <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-8 pb-20">
          
          <div className="flex items-center">
            <div className="bg-[#EEEEEE] px-4 py-2 rounded-[4px] flex items-center w-64">
              <input 
                type="text" 
                placeholder="검색어 입력" 
                className="bg-transparent outline-none w-full text-sm" 
              />
            </div>
          </div>

          <div className="flex items-center border border-gray-300 divide-x divide-gray-300">
            <button className="px-3 py-2 hover:bg-gray-50 text-gray-400">{"<"}</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button 
                key={num} 
                className={`px-4 py-2 text-sm ${num === 1 ? "bg-gray-100 font-bold" : "hover:bg-gray-50"}`}
              >
                {num}
              </button>
            ))}
            <button className="px-3 py-2 hover:bg-gray-50 text-gray-400">{">"}</button>
          </div>

          <div className="w-64 flex justify-end">
            {/* 생성: 글쓰기 페이지로 연결될 버튼 미리 생성 */}
            <button className="bg-black text-white px-6 py-2 rounded-[4px] text-sm hover:bg-gray-800 transition-colors">
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardList;