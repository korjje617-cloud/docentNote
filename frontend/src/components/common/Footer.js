// src/components/common/Footer.js
import React from 'react';

const Footer = () => {
  return (
    // justify-start(왼쪽 정렬)로 바꾸고, px-[50px](헤더와 같은 여백) 추가
    <footer className="w-full h-[62px] bg-white border-t border-gray-200 flex justify-start items-center px-[50px]">
      <span className="text-gray-400 font-notos text-[14px] tracking-widest">
        docent note.
      </span>
    </footer>
  );
};

export default Footer;