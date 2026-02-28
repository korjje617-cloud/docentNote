import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css';
import '../../components/common/Archive.css';
import ArchiveMenu from '../../components/common/ArchiveMenu.js';
// 추가: 도슨트 페이지로 넘어가기 위해 useNavigate 도구 가져오기
import { useNavigate } from 'react-router-dom';

export default function Total() {
    // 페이지 이동을 실행할 navigate 도구를 준비함
    const navigate = useNavigate();
    const [paintings, setPaintings] = useState([]); // 원본 데이터
    const [searchTerm, setSearchTerm] = useState(""); // 입력창의 실시간 값
    const [debouncedTerm, setDebouncedTerm] = useState(""); // 실제로 필터링에 사용할 값

    // 화면이 처음 나타날 때 전체 데이터 가져오기
    useEffect(() => {
        const fetchAllPaintings = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/main');
                setPaintings(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchAllPaintings();
    }, []);

    // 디바운싱 로직: searchTerm이 바뀌고 0.3초 뒤에 debouncedTerm을 바꾼다
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer); // 0.3초 이전에 또 입력하면 이전 타이머 취소
    }, [searchTerm]);

    // 필터링 로직: 'debouncedTerm'을 기준으로 필터링
    // 원본 데이터가 아니라 "검색 결과만 걸러진 데이터"
    const displayPaintings = paintings.filter((p) => {
        if (!debouncedTerm.trim()) return true;

        const nameKr = p.paintingNameKr || "";
        const nameEn = p.paintingNameEn || "";
        const keyword = debouncedTerm.toLowerCase();

        return nameKr.toLowerCase().includes(keyword) || nameEn.toLowerCase().includes(keyword);
    });

    // 너비에 따라 칸 맞춰주기
    const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

    // return 부터가 화면에 보여줄 부분
    return (
        <div className="flex flex-col bg-white">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">{"전체 아카이브"}</span>
                        <span className="text-black text-sm">{"더 많은 그림을 감상해보세요"}</span>
                    </div>

                    {/* 자식(ArchiveMenu)은 setSearchTerm만 실행
                        showSearch 가 true 이면 검색창을 보인다는 로직
                        검색어가 입력되면 SearchTerm 이라는 변수에 넣어라*/}
                    <ArchiveMenu showSearch={true} onSearch={setSearchTerm} />

                    <div className="w-full">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {/*검색결과로 나온 데이터만 넣는다*/}
                            {/*투명막에 가려져 클릭이 안 되던 문제를 해결하기 위해 relative z-50을 부여함
                            클릭 시 도슨트 페이지로 이동하며 p 데이터를 바구니(state)에 담아 보냄*/}
                            {displayPaintings.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => {
                                    navigate(`/api/archive/docent?paintingId=${p.id}`, {
                                        state: { painting: p }
                                    });
                                }}
                                className="relative z-50 flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm cursor-pointer"
                            >
                                {/* 이미지가 클릭 신호를 가로채지 못하도록 pointer-events-none을 유지함 */}
                                <img
                                    src={p.imgUrl}
                                    className="w-full rounded-[18px] mb-4 object-cover pointer-events-none"
                                    alt={p.paintingNameKr}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                                    }}
                                />
                                {/* 텍스트들도 클릭을 방해하지 못하게 pointer-events-none을 유지함 */}
                                <span className="text-black font-bold text-[15px] mb-2 ml-[13px] pointer-events-none">
                                    {p.paintingNameKr || "제목 없음"}
                                </span>
                                {/* 작가 이름 역시 클릭 방해 금지 처리를 해둠 */}
                                <span className="text-gray-600 text-[13px] ml-[13px] pointer-events-none">
                                    {p.painterNameKr || "작가 미상"}
                                </span>
                            </div>
))}
                        </Masonry>

                        {debouncedTerm && displayPaintings.length === 0 && (
                            <div className="w-full text-center py-20 text-gray-500">
                                "{debouncedTerm}"에 대한 검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}