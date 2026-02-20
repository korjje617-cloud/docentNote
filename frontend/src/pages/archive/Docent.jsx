import React from "react";
// 루트 추가 안했음

export const Docent = () => {
  // 예시 데이터
  const post = {
    category: "자유",
    title: "인상주의 화가들의 특징에 대하여",
    writer: "김도슨",
    date: "2026.02.20",
    views: 124,
    likes: 15,
    content: `인상주의는 19세기 후반 프랑스를 중심으로 일어난 근대 예술 운동입니다. 
    당시 화가들은 사물의 고유색보다는 빛에 의해 시시각각 변하는 색채의 변화를 포착하려 노력했습니다.
    
    주요 화가로는 클로드 모네, 에드가 드가, 피에르 오귀스트 르누아르 등이 있으며, 
    이들의 화풍은 이후 현대 미술의 탄생에 결정적인 역할을 하게 됩니다...`
  };

  return (
    <div className="bg-[#F8F9FA] w-full min-h-screen flex justify-center items-start pt-20 pb-20 font-notos text-black">
      <div className="w-[1000px] bg-white shadow-sm border border-gray-200 flex flex-col">
        
        {/* 상단 헤더 영역 */}
        <div className="px-10 py-8 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{post.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex justify-between items-center text-gray-500 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-medium text-black">{post.writer}</span>
              <span className="w-[1px] h-3 bg-gray-300"></span>
              <span>{post.date}</span>
            </div>
            <div className="flex gap-4">
              <span>조회 {post.views}</span>
              <span>좋아요 {post.likes}</span>
            </div>
          </div>
        </div>

        {/* 본문 영역 */}
        <div className="px-10 py-12 min-h-[400px] leading-relaxed text-lg text-gray-800 border-b border-gray-100">
          {post.content.split('\n').map((line, i) => (
            <p key={i} className="mb-4">{line}</p>
          ))}
        </div>

        {/* 하단 버튼 및 댓글 영역 상단 */}
        <div className="px-10 py-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">수정</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm text-red-500">삭제</button>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm">목록으로</button>
            <button className="px-6 py-2 border border-black rounded hover:bg-gray-50 text-sm">추천하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docent;