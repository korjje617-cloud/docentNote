import React, { useState, useEffect } from 'react';

// 예시 데이터 (실제로는 DB나 API에서 가져온 값이어야 합니다)
const artData = [
  { id: 1, title: "건초 수레", artist: "존 컨스터블", period: "낭만주의", src: "/crawling_images/Art Nouveau/Cheret/Bals_Bullier._Skating_Rink_du_Luxembourg_(1876).jpg"},
  { id: 2, title: "별이 빛나는 밤", artist: "빈센트 반 고흐", period: "후기 인상주의", src: "/images/gogh_starry_night.jpg" },
  { id: 3, title: "기억의 지속", artist: "살바도르 달리", period: "초현실주의", src: "/images/dali_memory.jpg" },
];

export const Main = () => {
  const [todayArt, setTodayArt] = useState(null);

  useEffect(() => {
    // 1. 오늘 날짜 정보 가져오기 📅
    const now = new Date();
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    // 2. 날짜를 기반으로 랜덤처럼 보이는 고정 인덱스 계산 🔢
    // (날짜 숫자 % 이미지 총 개수)
    const index = dateSeed % artData.length;

    // 3. 오늘의 그림 설정 🖼️
    setTodayArt(artData[index]);
  }, []);

  // 데이터가 로딩 전일 때를 대비한 예외 처리
  if (!todayArt) return <div className="text-center mt-20">오늘의 그림 고르는 중...</div>;

  return (
    <div className="bg-[#F3F3F3] w-full min-h-screen font-song flex flex-col">
      <main className="flex-1 flex justify-center items-center py-20">
        <div className="flex gap-[100px] items-start">
          <div className="font-corinthia text-[150px] leading-none mt-20">
            Today is
          </div>

          <div className="flex flex-col items-end">
            <div className="w-[40vw] bg-white p-3 shadow-2xl">
              <img 
                src={todayArt.src} 
                alt={todayArt.title}
                className="w-full"
              />
            </div>
            <div className="text-right mt-8">
              <h2 className="text-[48px] mb-2 font-normal font-song-bold">{todayArt.title}</h2>
              <p className="text-[32px] text-gray-700 font-song-bold">{todayArt.artist}</p>
              <p className="text-[20px] text-gray-400 font-song-bold">{todayArt.period}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;