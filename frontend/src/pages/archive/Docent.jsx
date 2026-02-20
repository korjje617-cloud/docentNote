import React from "react";
import { useNavigate } from "react-router-dom";

export const Docent = () => {
  const navigate = useNavigate();

  // 확인: 나중에 DB에서 가져올 작품 예시 데이터
  const artwork = {
    title: "작품 한글 이름",
    engTitle: "작품 영어 이름",
    artistEng: "화가 영어 이름",
    artistKor: "화가 한글 이름",
    era: "시대사조",
    year: "제작연도",
    image: "/crawling_images/Romanticism/Constable/constable_18.jpg",
    content: `도슨트 내용`
  };

  return (
    <div className="bg-[#E5E7EB] w-full min-h-screen flex justify-center items-start pt-20 pb-20 font-notos text-black">
      <div className="w-[1000px] bg-white shadow-2xl flex flex-col px-16 py-16 relative rounded-[4px]">
        
        {/* 상단: 작품 정보 영역 */}
        <div className="flex flex-col mb-10">
          {/* 설정: 작품 이름 */}
          <h1 className="text-[42px] font-song-bold mb-4">{artwork.title}</h1>
          
          <div className="space-y-1 text-[15px] text-gray-700">
            <p className="font-medium text-black">{artwork.engTitle}</p>
            <p>{artwork.artistEng}</p>
            <p className="pt-2">{artwork.artistKor}</p>
            <p>{artwork.era}</p>
            <p>{artwork.year}</p>
          </div>
        </div>

        {/* 설정: 구분선 */}
        <div className="w-full border-t border-gray-300 mb-12"></div>

        {/* 중앙: 이미지 및 슬라이드 제어 영역 */}
        <div className="relative w-full h-[500px] bg-[#F3F3F3] flex items-center justify-center mb-12 group">
          {/* 가져옴: 작품 이미지 */}
          <img 
            src={artwork.image} 
            alt={artwork.title} 
            className="max-w-full max-h-full object-contain shadow-lg"
          />

          {/* 생성: 좌우 화살표 (이전/다음 작품 이동용) */}
          <button className="absolute left-4 w-12 h-12 flex items-center justify-center bg-black/10 hover:bg-black/30 rounded-full transition-all text-white text-2xl">
            {"<"}
          </button>
          <button className="absolute right-4 w-12 h-12 flex items-center justify-center bg-black/10 hover:bg-black/30 rounded-full transition-all text-white text-2xl">
            {">"}
          </button>

          {/* 생성: 다운로드 버튼 (오른쪽 하단 배치) */}
          <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white px-4 py-2 rounded-md text-xs font-bold border border-gray-200 shadow-sm transition-all flex items-center gap-2">
            DOWNLOAD
          </button>
        </div>

        {/* 하단: 도슨트 내용 영역 */}
        <div className="mb-16">
          <p className="text-[15px] leading-[1.8] text-gray-800 text-justify">
            {artwork.content}
          </p>
        </div>

        {/* 설정: 하단 버튼 영역 */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-8 mt-auto">
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#D1D5DB] hover:bg-gray-400 text-black px-8 py-2 rounded-[2px] text-sm font-bold transition-colors"
          >
            뒤로가기
          </button>

        </div>

      </div>
    </div>
  );
};

export default Docent;