import React from 'react';

import Search from './Search';


// 1. NavLink를 사용하면 현재 주소와 일치할 때 자동으로 스타일을 준다
import { NavLink } from 'react-router-dom';

const ArchiveMenu = () => {
    const navItems = [
        { name: "전체", path: "/api/archive/total" },
        { name: "이름", path: "/api/archive/painter" },
        { name: "미술사조", path: "/api/archive/movement" },
        { name: "색상", path: "/api/archive/color" }
    ];

    return (
        /* 2. w-full 로 가로 길이 채우기 */
        <header className="w-full h-[61px] bg-transparent flex justify-between items-center">
            <div className="flex justify-between items-center self-stretch bg-[#E0E0E0] rounded-xl py-4 px-5 w-full">
                <div className="flex shrink-0 items-center gap-10">
                    {/* navItems 에 아이템 하나가 추가되면 자동으로 여기에도 추가가 된다 */}
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            // 3. isActive 조건에 따라 폰트 두께(font-bold)를 결정
                            className={({ isActive }) =>
                                `text-base transition-all ${isActive ? "text-black font-bold" : "text-gray-500 font-normal"}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
                    {/*검색창 구현하기*/}
                    <Search />


            </div>
        </header>
    );
};

export default ArchiveMenu;