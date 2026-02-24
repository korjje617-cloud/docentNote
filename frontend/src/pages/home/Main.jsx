import React, { useState, useEffect } from 'react';

export const Main = () => {
  // 1. 상태 변수 선언: DB에서 가져온 "오늘의 그림" 정보를 담아둘 바구니
  // 처음에는 데이터가 없으므로 null로 시작
  const [todayPainting, setTodayPainting] = useState(null);

  // 2. useEffect: 페이지가 처음 화면에 나타날 때 딱 한 번만 실행되는 함수
  useEffect(() => {
    // 스프링 부트 서버(8080포트)에 그림 목록 요청
    fetch('http://localhost:8081/api/main')
      .then((res) => res.json()) // 서버가 보내준 응답을 자바스크립트 객체(JSON)로 변환
      .then((data) => {
        // 데이터가 정상적으로 들어있을 때만 로직을 실행
        if (data && data.length > 0) {

          // 3. 날짜 기반 랜덤 로직: 매일 다른 그림을 뽑기 위한 "기준값(Seed)"을 만듦
          const now = new Date(); // 현재 시간/날짜 정보 가져오기
          // 년, 월, 일을 합쳐서 숫자 하나로 (예: 2026년 2월 24일 -> 20260224)
          const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

          // 4. 인덱스 계산: 날짜 숫자를 전체 그림 개수로 나눈 '나머지'를 구함
          // 예: 오늘 숫자가 24이고 그림이 10개면, 24 % 10 = 4 (항상 0~9 사이의 숫자만 나옴)
          const index = dateSeed % data.length;

          // 5. 상태 업데이트: 계산된 인덱스에 해당하는 그림 한 장을 바구니(todayPainting)에 넣기
          setTodayPainting(data[index]);
        }
      })
      .catch((err) => {
        // 서버가 꺼져있거나 주소가 틀렸을 때 에러를 출력
        console.error("데이터를 불러오는 중 문제가 발생했습니다:", err);
      });
  }, []); // []는 페이지가 처음 로딩될 때만 실행하겠다는 의미

  // 6. 예외 처리: 서버에서 데이터를 가져오는 동안(todayPainting이 null일 때) 보여줄 화면
  if (!todayPainting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 font-song-bold">
        {/* 1. 로고: 천천히 커졌다 작아지는 애니메이션 적용 */}
        <div className="animate-pulse mb-6">
          <img src="/logo.svg" alt="로고" className="w-50 h-50" />
        </div>

        {/* 2. 안내 문구: 부드러운 색상과 크기 조절 */}
        <div className="text-xl text-gray-600 tracking-widest">
          오늘의 그림...
        </div>

        {/* 3. 하단에 작은 점들이 움직이는 로딩바 (선택사항) */}
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
        {/* 1. xl:flex-row : 1280px 이상에서만 가로 배치. 그 이하에선 바로 세로(flex-col) 전환!
          2. gap-0 : 기본 간격을 없애고 마이너스 마진으로 더 붙입니다.
        */}
        <div className="flex flex-col xl:flex-row items-center xl:items-start gap-10 mx-auto w-fit px-5">

          {/* 왼쪽: 'Today is' 
              - xl:mr-[40px] : 가로일 때 그림과의 간격
              - xl:mt-32 : 가로 배치 시 그림 위치와 밸런스 조정
          */}
          <div className="font-corinthia text-[100px] lg:text-[130px] xl:text-[150px] leading-[0.7] xl:mt-32 xl:mr-[40px] shrink-0 select-none text-center xl:text-left z-10">
            Today is
          </div>

          {/* 오른쪽: 그림 + 정보 세트 */}
          <div className="flex flex-col items-center xl:items-end shrink-0">
            {/* - w-[600px] : 그림 크기 절대 유지
               - max-w-[95vw] : 아주 작은 화면에서만 살짝 줄어들게 방어
            */}
            <div className="w-[95vw] sm:w-[500px] xl:w-[600px] p-4 shadow-2xl bg-gradient-to-br from-gray-200 via-white to-gray-50 border border-gray-100 rounded-sm">
              <div className="overflow-hidden shadow-inner border border-gray-200">
                <img
                  src={todayPainting.imgUrl}
                  alt={todayPainting.paintingNameKr}
                  className="w-full h-auto block transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* 그림 상세 정보 (세로일 땐 중앙, 가로일 땐 오른쪽 정렬) */}
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