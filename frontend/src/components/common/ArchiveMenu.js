import React from 'react';
import Search from './Search';
import { NavLink } from 'react-router-dom';

// 부모로부터 showSearch 와 onSearch 를 받아옴
// onSearch == UI 프레임워크에서 사용자의 검색 입력 및 제출 이벤트를 처리하는 콜백 함수
// showSearch == 검색창을 보일지 말지 결정하는 boolean
const ArchiveMenu = ({ showSearch, onSearch }) => {

    const navItems = [
        { name: "전체", path: "/api/archive/total" },
        { name: "이름", path: "/api/archive/painter" },
        { name: "미술사조", path: "/api/archive/movement" },
        { name: "색상", path: "/api/archive/color" }
    ];

    return (
        <header className="w-full flex flex-col items-center">
            <div className="h-16 flex justify-between items-center bg-[#E0E0E0] rounded-xl py-4 px-5 w-full">
                <div className="flex gap-10">
                    {navItems.map((item, index) => (
                        <NavLink 
                            key={index} 
                            to={item.path} 
                            className={({ isActive }) => `text-base transition-all ${isActive ? "text-black font-bold" : "text-gray-500 font-normal"}`}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                {/* showSearch가 true 라면 검색창을 보여준다
                    그리고 검색 입력 함수를 Search 컴포넌트에게 넘겨준다 */}
                {showSearch && <Search onSearch={onSearch} />}
            </div>
        </header>
    );
};

export default ArchiveMenu;