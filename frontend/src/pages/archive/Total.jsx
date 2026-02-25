import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css'; 
import '../../components/common/Archive.css'; 

export default function ArchivePage() {
    const [paintings, setPaintings] = useState([]); 

    useEffect(() => {
        fetchAllPaintings();
    }, []);

    const fetchAllPaintings = async () => {
        try {
            // 메인 페이지와 동일한 서버 포트와 데이터를 확인
            const response = await axios.get('http://localhost:8081/api/main');
            console.log("서버 응답 데이터:", response.data);
            
            // 데이터 저장
            setPaintings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">{"아카이브"}</span>
                        <span className="text-black text-sm">{"더 많은 그림을 감상해보세요"}</span>
                    </div>

                    <div className="flex justify-between items-center self-stretch bg-[#E0E0E0] rounded-xl py-4 px-5">
                        <div className="flex shrink-0 items-center gap-5">
                            <button className="text-black text-base font-bold">{"전체"}</button>
                            <button className="text-black text-base">{"이름"}</button>
                            <button className="text-black text-base">{"미술사조"}</button>
                            <button className="text-black text-base">{"색상"}</button>
                        </div>
                        <div className="bg-white px-4 py-1 rounded-lg text-gray-400">{"검색창"}</div>
                    </div>

                    <div className="w-full">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {paintings.map((p) => (
                                <div key={p.id} className="flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm">
                                    <img
                                        /* 🌟 메인 페이지처럼 replace 없이 그대로 사용하세요 */
                                        src={p.imgUrl} 
                                        className="w-full rounded-[18px] mb-4 object-cover"
                                        alt={p.paintingNameKr}
                                        /* 이미지 주소가 잘못되었을 경우를 대비한 보험 */
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                                        }}
                                    />
                                    <span className="text-black font-bold text-[15px] mb-2 ml-[13px]">
                                        {p.paintingNameKr || "제목 없음"}
                                    </span>
                                    <span className="text-gray-600 text-[13px] ml-[13px]">
                                        {p.painterNameKr || "작가 미상"}
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