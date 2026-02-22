import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css'; 
import '../../components/common/ArchivePage.css'; 

export default function ArchivePage() {
    const [paintings, setPaintings] = useState([]); // DB 데이터를 저장할 상태

    // 1. 페이지가 열리자마자 실행 (확인)
    useEffect(() => {
        fetchAllPaintings();
    }, []);

    // 2. 전체 그림 데이터 가져오기 (가져옴)
        const fetchAllPaintings = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/archive/main');
            console.log("가져온 데이터:", response.data); // [확인] 콘솔창에 데이터가 찍히는지 보세요!
            setPaintings(response.data);
        } catch (error) {
            console.error("데이터를 불러오는 중 오류 발생:", error);
        }
    };

    // 메이슨리 열 설정 (설정)
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                {/* 상단 헤더 섹션 */}
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">{"아카이브"}</span>
                        <span className="text-black text-sm">{"더 많은 그림을 감상해보세요"}</span>
                    </div>

                    {/* 카테고리 탭 영역 */}
                    <div className="flex justify-between items-center self-stretch bg-[#E0E0E0] rounded-xl py-4 px-5">
                        <div className="flex shrink-0 items-center gap-5">
                            <button className="text-black text-base font-bold">{"전체"}</button>
                            <button className="text-black text-base">{"이름"}</button>
                            <button className="text-black text-base">{"미술사조"}</button>
                            <button className="text-black text-base">{"색상"}</button>
                        </div>
                        <div className="bg-white px-4 py-1 rounded-lg text-gray-400">{"검색창"}</div>
                    </div>

                    {/* 3. 메이슨리 그리드: DB 데이터 뿌리기 (확인) */}
                    <div className="w-full">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {paintings.map((p) => (
                                <div key={p.id} className="flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm">
                                    <img
                                        src={p.imgPath.replace('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public', '')} 
                                        className="w-full rounded-[18px] mb-4 object-cover"
                                        alt={p.paintingNameKr}
                                    />
                                    <span className="text-black font-bold text-[15px] mb-2 ml-[13px]">
                                        {p.paintingNameKr}
                                    </span>
                                    <span className="text-gray-600 text-[13px] ml-[13px]">
                                        {p.painterNameKr}
                                    </span>
                                </div>
                            ))}
                        </Masonry>
                    </div>
                </div>
            </div>
        </div>
    );
}