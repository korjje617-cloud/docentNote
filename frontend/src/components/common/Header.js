// src/pages/home/Header.jsx
import React from 'react';

const Header = () => {
  // 메뉴 텍스트 목록 상자 2개
  const navItems = ["탐색", "컨텐츠", "아카이브", "커뮤니티"];
  const userItems = ["회원정보", "로그아웃", "로그인", "회원가입"];

  // 모든 클래스 이름은 테일윈드 치트시트에서 찾아볼 수 있다

  return (
    // 헤더 디자인
    <header className="w-full h-[61px] bg-white flex justify-between items-center px-[50px] shadow-sm font-song-bold">
      <div className="flex items-center gap-[40px] font-song-bold">

        {/* 로고 영역*/}
        <div className="flex items-center cursor-pointer">
          <img src="/logo.svg" className="h-[56px] w-auto object-contain" />
        </div>
        
        {/* 왼쪽 메뉴 */}
        <nav className="flex gap-[30px]">
          {navItems.map((item) => (
            <span key={item} className="text-[20px] cursor-pointer hover:text-gray-400 transition-colors font-song-bold">
              {item}
            </span>
          ))}
        </nav>
      </div>

      {/* 오른쪽 메뉴 */}
      <nav className="flex gap-[25px]">
        {userItems.map((item) => (
          <span key={item} className="text-[18px] cursor-pointer text-gray-600 hover:text-black font-song-bold">
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
};

// 이 파일을 다른 곳에서 불러다 쓸 수 있도록 열어둔다
export default Header;