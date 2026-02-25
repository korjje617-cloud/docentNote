import React from 'react';
// 1. NavLink를 사용하면 현재 주소와 일치할 때 자동으로 스타일을 준다
import { NavLink } from 'react-router-dom';

const Folder = () => {
    const navItems = [
        { name: "전체", path: "/api/archive/total" },
        { name: "이름", path: "/api/archive/painter" },
        { name: "미술사조", path: "/api/archive/movement" },
        { name: "색상", path: "/api/archive/color" }
    ];

    return (
        /* 2. w-full 로 가로 길이 채우기 */
        <header className="w-full h-[61px] bg-transparent flex justify-between items-center">
            <div className="flex flex-col self-stretch pb-10 gap-7">
                <div className="flex items-center self-stretch gap-[30px]">
                    <div className="flex flex-1 flex-col items-start bg-[#F1F1F1] py-[13px] rounded-[18px]">
                        <img
                            src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Xkz4x9yRgw/xfjcipc6_expires_30_days.png"}
                            className="w-[265px] h-[231px] mb-[18px] ml-3 rounded-[18px] object-fill"
                        />
                        <span className="text-black text-[15px] mb-2 ml-[13px]" >
                            {"카테고리 타이틀 (이름 or 시대사조)"}
                        </span>
                        <span className="text-black text-[15px] ml-[13px]" >
                            {"항목 갯수"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Folder;