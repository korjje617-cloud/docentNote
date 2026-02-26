import React from 'react';

const Folder = ({ imgUrl, title, itemCount }) => {
  return (
    <div className="group flex flex-col items-start w-[280px] cursor-pointer">
      
      {/* 1. 폴더 상단 탭 (Window Folder Tab) */}
      {/* 왼쪽만 둥글게 하고, 본체와 연결되는 오른쪽 아래는 직각으로 처리 */} 
      <div className="w-[100px] h-[28px] bg-[#E5E5E5] rounded-t-[18px] ml-1 transition-colors group-hover:bg-[#c9c9c9]"></div>
      
      {/* 2. 폴더 메인 카드 본체 */}
      {/* 상단 탭과 만나는 왼쪽 위(tl)만 직각(none)으로 설정하여 자연스럽게 연결 */}
      <div className="w-full bg-[#E5E5E5] rounded-[24px] rounded-tl-none p-4 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        
        {/* 내부 이미지 컨테이너 */}
        <div className="w-full h-[220px] bg-white rounded-[18px] overflow-hidden mb-5 border border-black/5">
          <img
            src={imgUrl || "https://via.placeholder.com/265x231?text=No+Image"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={title}
          />
        </div>

        {/* 하단 텍스트 정보 */}
        <div className="flex flex-col gap-1 px-1 text-left">
          <span className="text-[#1A1A1A] text-[16px] font-bold tracking-tight truncate">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#666666] text-[13px] font-medium">
              {itemCount}
            </span>
            <div className="w-1 h-1 bg-[#B0B0B0] rounded-full"></div>
            <span className="text-[#888888] text-[15px]">미술사조 이름</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Folder;