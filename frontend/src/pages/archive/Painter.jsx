import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css';
import '../../components/common/Archive.css';
import ArchiveMenu from '../../components/common/ArchiveMenu.js';
import Folder from '../../components/common/Folder.js';

export default function Painter() {
    const [paintings, setPaintings] = useState([]); // 전체 그림 데이터
    const [painters, setPainters] = useState([]); // 화가 목록 데이터
    const [selectedPainterId, setSelectedPainterId] = useState(null); // 선택된 화가 ID

    // 이건 데이터 불러오기
    useEffect(() => {
        fetchInitialData();
    }, []);

    // 이건 폴더 눌러서 메이슨리 페이지로 들어갔을 때 스크롤을 최상단으로 올리는거
    useEffect(() => {
        if (selectedPainterId !== null) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [selectedPainterId]);

    const fetchInitialData = async () => {
        try {
            // API 호출 (화가 정보를 가져온다는 시나리오)
            const response = await axios.get('http://localhost:8081/api/main');
            const data = Array.isArray(response.data) ? response.data : [];
            setPaintings(data);

            // 중복 없는 화가(Painter) 목록 추출 로직
            const uniquePainters = [];
            const map = new Map();

            for (const item of data) {
                // item.painterId를 기준으로 중복 체크
                if (item.painterId && !map.has(item.painterId)) {
                    map.set(item.painterId, true);
                    uniquePainters.push({
                        id: item.painterId,
                        name: item.painterNameKr,
                        enName: item.painterNameEn,
                        nationality: item.nationality,
                        // 화가의 폴더 커버로 해당 화가의 첫 번째 그림 사용
                        coverImg: item.imgUrl
                    });
                }
            }
            setPainters(uniquePainters);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    // 선택된 화가에 해당하는 그림들만 필터링
    const filteredPaintings = paintings.filter(p => p.painterId === selectedPainterId);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div id="scroll-top" className="flex flex-col bg-white min-h-screen">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    {/* 타이틀 영역 */}
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">
                            {selectedPainterId ? painters.find(p => p.id === selectedPainterId)?.name : "화가 아카이브"}
                        </span>
                        <span className="text-black text-sm">
                            {selectedPainterId ? "작가의 작품 세계를 감상해보세요" : "거장들의 작품을 화가별로 만나보세요"}
                        </span>
                        {selectedPainterId && (
                            <button
                                onClick={() => setSelectedPainterId(null)}
                                className="ml-5 px-4 py-1 bg-white rounded-full shadow-sm text-sm hover:bg-gray-100 transition-colors">
                                ← 목록으로 돌아가기
                            </button>
                        )}
                    </div>

                    <ArchiveMenu />

                    <div className="w-full">
                        {!selectedPainterId ? (
                            /* --- 화가 폴더 목록 화면 --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
                                {painters.map((painter) => (
                                    <div key={painter.id} onClick={() => setSelectedPainterId(painter.id)}>
                                        <Folder
                                            imgUrl={painter.coverImg}
                                            title={painter.name}
                                            itemCount={`${paintings.filter(p => p.painterId === painter.id).length}점의 작품`}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* --- 선택된 화가의 그림 메이슨리 화면 --- */


                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {filteredPaintings.map((p) => (
                                    <div key={p.id} className="flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm">
                                        <img
                                            src={p.imgUrl}
                                            className="w-full rounded-[18px] mb-4 object-cover hover:scale-[1.02] transition-transform duration-300"
                                            alt={p.paintingNameKr}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                                            }}
                                        />
                                        <span className="text-black font-bold text-[15px] mb-2 ml-[13px]">
                                            {p.paintingNameKr}
                                        </span>
                                        <span className="text-gray-600 text-[13px] ml-[13px]">
                                            {p.moveNameKr}
                                        </span>
                                    </div>
                                ))}
                            </Masonry>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}