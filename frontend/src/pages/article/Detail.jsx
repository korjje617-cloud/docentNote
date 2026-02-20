import React, { useState } from "react";

export const Detail = () => {
  // 저장: 입력 중인 댓글을 저장
  const [comment, setComment] = useState("");

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

  // 확인: 예시 댓글 데이터 확인
  const dummyComments = [
    { id: 1, writer: "예술인", date: "2026.02.20 14:20", content: "정말 유익한 정보네요! 잘 읽었습니다." },
    { id: 2, writer: "미술학도", date: "2026.02.20 15:10", content: "모네의 수련 시리즈를 실제로 봤을 때의 감동이 떠오르네요." }
  ];

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

        {/* 하단 버튼 영역 */}
        <div className="px-10 py-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">수정</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm text-red-500">삭제</button>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm">목록으로</button>
            <button className="px-6 py-2 border border-black rounded hover:bg-gray-50 text-sm">추천하기</button>
          </div>
        </div>

        {/* 생성: 댓글 섹션 시작 */}
        <div className="px-10 py-10 bg-[#FBFCFD]">
          <h3 className="font-bold text-lg mb-6">댓글 {dummyComments.length}</h3>
          
          {/* 설정: 댓글 입력창 설정 */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-10 shadow-sm">
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="따뜻한 댓글을 남겨주세요."
              className="w-full h-24 resize-none outline-none text-sm placeholder:text-gray-400"
            />
            <div className="flex justify-end pt-3 border-t border-gray-50">
              <button className="px-5 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors">
                댓글 등록
              </button>
            </div>
          </div>

          {/* 생성: 댓글 리스트 생성 */}
          <div className="flex flex-col gap-8">
            {dummyComments.map((c) => (
              <div key={c.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm">{c.writer}</span>
                    <span className="text-gray-400 text-xs">{c.date}</span>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 text-xs">삭제</button>
                </div>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 영역 */}
        <div className="py-8 flex flex-col items-center border-t border-gray-200 bg-white">
          <img src="/logo.svg" alt="Logo" className="w-14 mb-1 opacity-40" />
          <span className="text-[8px] text-gray-300 tracking-tighter uppercase">docent note archive.</span>
        </div>

      </div>
    </div>
  );
};

export default Detail;