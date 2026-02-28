import React, { useState, useEffect } from 'react';
// 추가: 도슨트 페이지로 넘어가기 위해 useNavigate 도구 가져오기
import { useNavigate } from 'react-router-dom'; 

export const Main = () => {
  // 생성: 페이지 이동을 담당하는 navigate 함수 선언
  const navigate = useNavigate(); 
  const [todayPainting, setTodayPainting] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/main')
      .then((res) => res.json()) 
      .then((data) => {
        if (data && data.length > 0) {
          const now = new Date(); 
          const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
          const index = dateSeed % data.length;
          setTodayPainting(data[index]);
        }
      })
      .catch((err) => {
        console.error("데이터를 불러오는 중 문제가 발생했습니다:", err);
      });
  }, []); 

  if (!todayPainting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 font-song-bold">
        <div className="animate-pulse mb-6">
          <img src="/logo.svg" alt="로고" className="w-50 h-50" />
        </div>
        <div className="text-xl text-gray-600 tracking-widest">
          오늘의 그림...
        </div>
        <div className="mt-4 flex gap-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F3F3] w-full min-h-screen font-song flex flex-col">
      <main className="flex-1 flex justify-center items-center py-10 xl:py-20 overflow-x-hidden">
        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-10 mx-auto w-fit px-5">
          <div className="font-corinthia text-[100px] lg:text-[130px] xl:text-[150px] leading-[0.7] xl:mt-32 xl:mr-[40px] shrink-0 select-none text-center xl:text-left z-10">
            Today is
          </div>

          <div className="flex flex-col items-center xl:items-end shrink-0">
            {/* 설정: onClick 이벤트를 추가하여 전체 데이터(todayPainting)를 state에 담아 넘김 
              설정: 마우스를 올렸을 때 클릭 가능함을 알리기 위해 cursor-pointer 추가
            */}
            <div 
              onClick={() => {
                navigate(`/api/archive/docent?paintingId=${todayPainting.id}`, { 
                  state: { painting: todayPainting } 
                });
              }}
              className="cursor-pointer relative z-10 w-[95vw] sm:w-[500px] xl:w-[600px] card p-4 shadow-2xl bg-gradient-to-br from-gray-200 via-white to-gray-50 border border-gray-100 rounded-sm"
            >
              {/* 설정: 이미지가 클릭을 방해하지 않도록 pointer-events-none 추가 */}
              <div className="overflow-hidden shadow-inner border border-gray-200 pointer-events-none">
                <img
                  src={todayPainting.imgUrl}
                  alt={todayPainting.paintingNameKr}
                  className="w-full h-auto block transform hover:scale-105 transition-transform duration-500 pointer-events-none"
                />
              </div>
            </div>

            <div className="text-center xl:text-right mt-6 xl:mt-8 w-full">
              <h2 className="text-[32px] lg:text-[40px] xl:text-[48px] mb-2 font-normal font-song-bold leading-tight break-keep">
                {todayPainting.paintingNameKr}
              </h2>
              <p className="text-[24px] lg:text-[28px] xl:text-[32px] text-gray-700 font-song-bold">
                {todayPainting.painterNameKr}
              </p>
              <p className="text-[16px] lg:text-[18px] xl:text-[20px] text-gray-400 font-song-bold">
                {todayPainting.moveNameKr} 시대
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;