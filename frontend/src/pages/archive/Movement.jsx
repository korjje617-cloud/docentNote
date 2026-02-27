import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css'; 
import '../../components/common/Archive.css'; 
import ArchiveMenu from '../../components/common/ArchiveMenu.js';
import Folder from '../../components/common/Folder.js';

export default function Movement() {
    const [paintings, setPaintings] = useState([]); // 전체 그림 데이터
    const [movements, setMovements] = useState([]); // 사조 목록 데이터
    const [selectedMovementId, setSelectedMovementId] = useState(null); // 선택된 사조 ID

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // 메인 API 호출 (현재 구조상 사조 정보가 포함된 painting 목록을 가져온다고 가정)
            const response = await axios.get('http://localhost:8081/api/main');
            const data = Array.isArray(response.data) ? response.data : [];
            setPaintings(data);

            // 데이터에서 중복 없는 사조 목록 추출 (또는 별도의 사조 API가 있다면 그것을 사용)
            // p.movementId와 p.moveNameKr 정보를 활용합니다.
            const uniqueMovements = [];
            const map = new Map();
            for (const item of data) {
                if (!map.has(item.movementId)) {
                    map.set(item.movementId, true);
                    uniqueMovements.push({
                        id: item.movementId,
                        name: item.moveNameKr,
                        enName: item.moveNameEn,
                        // 폴더 커버 이미지로 해당 사조의 첫 번째 그림 사용
                        coverImg: item.imgUrl 
                    });
                }
            }
            setMovements(uniqueMovements);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    // 선택된 사조에 해당하는 그림들만 필터링
    const filteredPaintings = paintings.filter(p => p.movementId === selectedMovementId);

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="flex flex-col bg-white min-h-screen">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    {/* 상단 타이틀 영역 */}
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">
                            {selectedMovementId ? movements.find(m => m.id === selectedMovementId)?.name : "미술사조 아카이브"}
                        </span>
                        <span className="text-black text-sm">
                            {selectedMovementId ? "해당 사조의 작품들을 감상해보세요" : "시대사조별로 감상해보세요"}
                        </span>
                        {selectedMovementId && (
                            <button 
                                onClick={() => setSelectedMovementId(null)}
                                className="ml-5 px-4 py-1 bg-white rounded-full shadow-sm text-sm hover:bg-gray-100 transition-colors"
                            >
                                ← 목록으로 돌아가기
                            </button>
                        )}
                    </div>

                    <ArchiveMenu/>
                    
                    <div className="w-full">
                        {/* 🌟 조건부 렌더링: 선택된 사조가 없으면 폴더 목록, 있으면 메이슨리 */}
                        {!selectedMovementId ? (
                            /* --- 📁 시대사조 폴더 목록 화면 --- */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
                                {movements.map((m) => (
                                    <div key={m.id} onClick={() => setSelectedMovementId(m.id)}>
                                        <Folder 
                                            imgUrl={m.coverImg} 
                                            title={m.name} 
                                            itemCount={`${paintings.filter(p => p.movementId === m.id).length}점`} 
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* --- 🖼️ 선택된 사조의 그림 메이슨리 화면 --- */
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column"
                            >
                                {filteredPaintings.map((p) => (
                                    <div key={p.id} className="flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm">
                                        <img
                                            src={p.imgUrl} 
                                            className="w-full rounded-[18px] mb-4 object-cover"
                                            alt={p.paintingNameKr}
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}