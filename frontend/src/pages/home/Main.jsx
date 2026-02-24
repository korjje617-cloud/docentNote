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
      <div className="min-h-screen flex justify-center items-center font-song">
        그림을 불러오는 중...
      </div>
    );
  }

  // 7. 실제 화면 렌더링: 데이터가 준비되면 아래 HTML 코드가 실행
  return (
    <div className="bg-[#F3F3F3] w-full min-h-screen font-song flex flex-col">
      <main className="flex-1 flex justify-center items-center py-20">
        <div className="flex gap-[100px] items-start">

          {/* 왼쪽: 'Today is' 문구 */}
          <div className="font-corinthia text-[150px] leading-none mt-20">
            Today is
          </div>

          {/* 오른쪽: 그림 이미지와 한글 정보 섹션 */}
          <div className="flex flex-col items-end">
            {/* 액자 프레임 부분 */}
            <div className="w-[40vw] p-4 shadow-2xl bg-gradient-to-br from-gray-200 via-white to-gray-50 border border-gray-100 rounded-sm">
              {/* 실제 이미지 */}
              <div className="overflow-hidden shadow-inner border border-gray-200">
                <img
                  src={todayPainting.imgUrl}
                  alt={todayPainting.paintingNameKr}
                  className="w-full h-auto block transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* 그림 상세 정보 (오른쪽 정렬) */}
            <div className="text-right mt-8">
              {/* 작품 한글 제목 */}
              <h2 className="text-[48px] mb-2 font-normal font-song-bold">
                {todayPainting.paintingNameKr}
              </h2>
              {/* 화가 한글 이름 (JOIN으로 가져온 데이터) */}
              <p className="text-[32px] text-gray-700 font-song-bold">
                {todayPainting.painterNameKr}
              </p>
              {/* 시대사조 한글 이름 (JOIN으로 가져온 데이터) */}
              <p className="text-[20px] text-gray-400 font-song-bold">
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