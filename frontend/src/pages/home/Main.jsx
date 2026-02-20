// src/pages/home/Main.jsx
import React from 'react';
import Header from '../../components/common/Header'; 
import Footer from '../../components/common/Footer'; 

export const Main = () => {
  return (

    <div className="bg-[#F3F3F3] w-full min-h-screen font-song flex flex-col">
      
      <Header />

      <main className="flex-1 flex justify-center items-center py-20">
        <div className="flex gap-[100px] items-start">
          <div className="font-corinthia text-[150px] leading-none mt-20">
            Today is
          </div>

          <div className="flex flex-col items-end">
            <div className="w-[40vw] bg-white p-3 shadow-2xl">
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

      <Footer />

    </div>
  );
};

export default Main;