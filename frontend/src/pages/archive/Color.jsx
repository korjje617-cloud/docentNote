import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css';
import { useSearchParams } from 'react-router-dom';
import '../../components/common/Archive.css';
import ArchiveMenu from '../../components/common/ArchiveMenu.js';

export default function Color() {
    const [paintings, setPaintings] = useState([]);
    const [colors, setColors] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    const colorId = searchParams.get('colorId');

    useEffect(() => {
        fetchColors();
    }, []);

    useEffect(() => {
        if (colorId) {
            fetchPaintingsByColor(colorId);
        } else {
            fetchAllPaintings();
        }
    }, [colorId]);

    const fetchColors = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/archive/colors');
            setColors(response.data);
        } catch (error) {
            console.error("색상 목록 실패:", error);
        }
    };

    const fetchAllPaintings = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/main');
            setPaintings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("전체 데이터 로딩 실패:", error);
        }
    };

    const fetchPaintingsByColor = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/archive/color?colorId=${colorId}`);
            setPaintings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("필터링 실패:", error);
            setPaintings([]);
        }
    };

    const handleColorClick = (id) => {
        setSearchParams({ colorId: id });
    };

    const handleAllClick = () => {
        setSearchParams({});
    };

    const breakpointColumnsObj = { default: 4, 1100: 3, 700: 2, 500: 1 };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">{"아카이브"}</span>
                        <span className="text-black text-sm">{"원하는 색상의 그림을 찾아보세요"}</span>
                    </div>

                    <ArchiveMenu />

                    {/* 컬러 버튼 섹션 */}
                    <div className="flex flex-wrap gap-[2px] w-full">

                        {/* 구이(Gooey) 필터 SVG (화면엔 안 보임) */}
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
                            <defs>
                                <filter id="goo">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
                                    <feBlend in="SourceGraphic" in2="goo"></feBlend>
                                </filter>
                            </defs>
                        </svg>

                        {/* 🌟 전체보기 버튼 */}
                        <button
                            onClick={handleAllClick}
                            // [check] colorId가 없으면(null) 전체보기가 활성화된 상태입니다.
                            className={`c-button c-button--gooey ${!colorId ? 'active' : ''}`}
                            style={{ '--btn-color': '#4B5563', '--text-color': '#ffffff' }}
                        >
                            전체보기
                            <div className="c-button__blobs"><div></div><div></div><div></div></div>
                        </button>

                        {/* 🌟 색상별 버튼 */}
                        {colors.map((c) => {
                            const isLightColor = ['White', 'Yellow'].includes(c.colorName);

                            return (
                                <button
                                    key={c.id}
                                    onClick={() => handleColorClick(c.id)}
                                    // [check] 주소창의 colorId(문자열)와 현재 버튼의 id(숫자)를 비교해서 같으면 활성화시킵니다.
                                    className={`c-button c-button--gooey shadow-sm ${Number(colorId) === c.id ? 'active' : ''}`}
                                    style={{
                                        '--btn-color': c.colorName,
                                        '--text-color': isLightColor ? 'black' : 'white'
                                    }}
                                >
                                    {c.colorName}
                                    <div className="c-button__blobs"><div></div><div></div><div></div></div>
                                </button>
                            );
                        })}
                    </div>

                    {/* 갤러리 섹션 */}
                    <div className="w-full">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {paintings.map((p) => (
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
                    </div>
                </div>
            </div>
        </div>
    );
}