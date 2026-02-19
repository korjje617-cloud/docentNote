// src/pages/home/Header.jsx
import React from 'react';

const Header = () => {
  // 디자인 확인용 데이터
  const navItems = ["탐색", "컨텐츠", "아카이브", "커뮤니티"];
  const userItems = ["회원정보", "로그아웃", "로그인", "회원가입"];

  return (
    // 🏠 피그마 스타일 헤더 디자인
    <header className="w-full h-[62px] bg-white flex justify-between items-center px-[50px] shadow-sm font-song-bold">
      <div className="flex items-center gap-[40px] font-song-bold">
        {/* 로고 영역 (나중에 이미지를 넣으려면 <img> 태그로 바꾸기) */}
        <div className="flex items-center cursor-pointer">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            /* h-[80%] : 부모(62px)의 80% 높이로 설정
            w-auto  : 가로 비율은 깨지지 않게 자동으로 맞춤
            object-contain : 이미지가 잘리지 않고 박스 안에 쏙 들어가게 함
            */
            className="h-[56px] w-auto object-contain" />
        </div>
        
        {/* 중앙 메뉴 */}
        <nav className="flex gap-[30px]">
          {navItems.map((item) => (
            <span key={item} className="text-[20px] cursor-pointer hover:text-gray-400 transition-colors font-song-bold">
              {item}
            </span>
          ))}
        </nav>
      </div>

      {/* 우측 사용자 메뉴 */}
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

export default Header;