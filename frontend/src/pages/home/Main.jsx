// src/pages/home/Main.jsx
import React from 'react';
import Header from '../../components/common/Header'; // 헤더 파일 불러오기

export const Main = () => {
  return (
    <div className="bg-[#F3F3F3] w-full min-h-screen font-song">
      
      {/* 지저분한 헤더 코드 대신 한 줄로 끝 */}
      <Header />

      {/* 메인 섹션 디자인만 남김 */}
      <main className="flex justify-center items-center pt-[100px]">
        <div className="flex gap-[100px] items-start">
          <div className="font-corinthia text-[150px] leading-none mt-20">
            Today is
          </div>

          <div className="flex flex-col items-end">
            <div className="w-[500px] bg-white p-3 shadow-2xl">
              <img 
                src="/crawling_images/Romanticism/Constable/constable_18.jpg" 
                alt="Main"
                className="w-full object-cover"
              />
            </div>
            <div className="text-right mt-8">
              <h2 className="text-[48px] mb-2 font-normal font-song-bold">그림 제목</h2>
              <p className="text-[32px] text-gray-700 font-song-bold">화가 이름</p>
              <p className="text-[20px] text-gray-400 font-song-bold">시대사조</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;