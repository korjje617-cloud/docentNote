import React, { useState, useEffect } from 'react';
import Search from './Search';
import { NavLink } from 'react-router-dom';
import axios from "axios";

const ArchiveMenu = () => {
    // 1. 사용자가 입력한 검색어를 임시로 저장할 상태
    const [searchTerm, setSearchTerm] = useState("");

    const navItems = [
        { name: "전체", path: "/api/archive/total" },
        { name: "이름", path: "/api/archive/painter" },
        { name: "미술사조", path: "/api/archive/movement" },
        { name: "색상", path: "/api/archive/color" }
    ];

    // 2. 실시간 검색어를 상태에 저장하는 함수
    const handleSearchChange = (keyword) => {
        setSearchTerm(keyword);
    };

    // 3. 디바운싱 로직 (핵심!)
    useEffect(() => {
        // 사용자가 입력을 멈추고 500ms(0.5초) 기다린다
        const timer = setTimeout(() => {
            if (searchTerm) {
                const fetchAllPaintings = async () => {
                    try {
                        // 여기도 메인 페이지와 동일한 서버 주소 활용
                        // axios.get('주소'): 지정된 주소에 있는 서버에게 "데이터 좀 보내달라고 요청
                        const response = await axios.get('http://localhost:8081/api/main');
                        console.log("서버 응답 데이터:", response.data);

                        // 데이터 저장
                        // 안전성 검사 : Array.isArray(response.data)
                        // 서버가 보낸 결과가 진짜 배열인지 확인
                        setPaintings(Array.isArray(response.data) ? response.data : []);
                    } catch (error) {
                        console.error("데이터 로딩 실패:", error);
                    }
                };

            }
        }, 500);

        // 0.5초가 지나기 전에 또 글자를 치면 이전 타이머를 취소
        return () => clearTimeout(timer);
    }, [searchTerm]); // searchTerm이 바뀔 때마다 이 효과가 실행

    return (
        <header className="w-full h-[61px] bg-transparent flex justify-between items-center">
            <div className="flex justify-between items-center self-stretch bg-[#E0E0E0] rounded-xl py-4 px-5 w-full">
                <div className="flex shrink-0 items-center gap-10">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-base transition-all ${isActive ? "text-black font-bold" : "text-gray-500 font-normal"}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                {/* 자식 컴포넌트에 상태 변경 함수 전달 */}
                <Search onSearch={handleSearchChange} />
            </div>
        </header>
    );
};

export default ArchiveMenu;