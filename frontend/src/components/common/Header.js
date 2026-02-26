import React from 'react';
// 🌟 1. Link 컴포넌트를 불러옵니다.
import { Link } from 'react-router-dom';

const Header = () => {
  // 🌟 2. 텍스트와 이동할 경로(path)를 짝지어줍니다.
  const navItems = [
    { name: "탐색", path: "/api/explorer" },
    { name: "아카이브", path: "/api/archive/total" },
    { name: "미술관 지도", path: "/api/map/museum" }
  ];

  const userItems = [
    { name: "회원정보", path: "/" },
    { name: "로그아웃", path: "/" },
    { name: "로그인", path: "/usr/member/login" },
    { name: "회원가입", path: "/usr/member/join" }
  ];

  return (
    <header className="w-full h-[61px] bg-white flex justify-between items-center px-[50px] shadow-sm font-song-bold">
      <div className="flex items-center gap-[40px] font-song-bold">

        {/* 로고 영역: 클릭하면 메인으로 이동 */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img src="/logo.svg" className="h-[56px] w-auto object-contain" alt="로고" />
        </Link>
        
        {/* 왼쪽 메뉴 */}
        <nav className="flex gap-[30px]">
          {navItems.map((item) => (
            // 🌟 3. span 대신 Link를 사용합니다.
            <Link 
              key={item.name} 
              to={item.path} 
              className="text-[20px] cursor-pointer hover:text-gray-400 transition-colors font-song-bold text-black no-underline"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* 오른쪽 메뉴 */}
      <nav className="flex gap-[25px]">
        {userItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path} 
            className="text-[18px] cursor-pointer text-gray-600 hover:text-black font-song-bold no-underline"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;