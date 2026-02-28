import React, { useEffect, useState } from "react";
// 이전 페이지에서 보낸 데이터를 받기 위해 useLocation을 추가로 가져옴
import { useNavigate, useLocation } from "react-router-dom";
// 서버와 통신하기 위해 axios 가져옴
import axios from "axios";

export const Docent = () => {
  const navigate = useNavigate();
  // 주소창에 실려온 데이터를 받기 위한 도구 선언
  const location = useLocation();
  
  // Main이나 Total 페이지에서 넘어온 그림 데이터가 있는지 확인하고 pData에 저장
  const pData = location.state?.painting;

  // 도슨트 본문을 저장할 공간 (초기값은 빈 문자열)
  const [docentBody, setDocentBody] = useState("");
  // GPT가 글을 쓰는 동안 로딩 중임을 표시할 상태
  const [loading, setLoading] = useState(true);

  // 설정: 화면이 켜지자마자 서버에 데이터를 보내서 도슨트 글을 받아옴
  useEffect(() => {
    if (pData) {
      setLoading(true);
      // 서버로 pData 전체를 보내서 도슨트 생성을 요청함
      axios.post("http://localhost:8081/api/archive/docent", pData)
        .then(res => {
          // 서버가 만들어준 글을 docentBody에 저장함
          setDocentBody(res.data.body);
          setLoading(false);
        })
        .catch(err => {
          console.error("서버 에러:", err);
          setLoading(false);
        });
    }
  }, [pData]);

  // 예외 처리: 만약 주소창을 치고 몰래 들어오면 튕겨냄
  if (!pData) {
    return <div className="text-center pt-20">작품 정보가 없습니다. 목록에서 들어와주세요!</div>;
  }

  return (
    <div className="bg-[#E5E7EB] w-full min-h-screen flex justify-center items-start pt-20 pb-20 font-notos text-black">
      <div className="w-[1000px] bg-white shadow-2xl flex flex-col px-16 py-16 relative rounded-[4px]">
        
        {/* 상단: 작품 정보 영역 */}
        <div className="flex flex-col mb-10">
          {/* pData 안의 한글 이름 출력 */}
          <h1 className="text-[42px] font-song-bold mb-4">{pData.paintingNameKr}</h1>
          
          <div className="space-y-1 text-[15px] text-gray-700">
            {/* 각 항목에 맞는 실제 데이터 매핑 */}
            <p className="font-medium text-black">{pData.paintingNameEn}</p>
            <p>{pData.painterNameEn}</p>
            <p className="pt-2">{pData.painterNameKr}</p>
            <p>{pData.moveNameKr}</p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full border-t border-gray-300 mb-12"></div>

        {/* 중앙: 이미지 및 슬라이드 제어 영역 */}
        <div className="relative w-full h-[500px] bg-[#F3F3F3] flex items-center justify-center mb-12 group">
          {/* 작품의 실제 이미지 주소를 연결 */}
          <img 
            src={pData.imgUrl} 
            alt={pData.paintingNameKr} 
            className="max-w-full max-h-full object-contain shadow-lg"
          />

          {/* 좌우 화살표 */}
          <button className="absolute left-4 w-12 h-12 flex items-center justify-center bg-black/10 hover:bg-black/30 rounded-full transition-all text-white text-2xl">
            {"<"}
          </button>
          <button className="absolute right-4 w-12 h-12 flex items-center justify-center bg-black/10 hover:bg-black/30 rounded-full transition-all text-white text-2xl">
            {">"}
          </button>
          
        </div>

        {/* 하단: 도슨트 내용 영역 */}
        <div className="mb-16">
          <p className="text-[15px] leading-[1.8] text-gray-800 text-justify whitespace-pre-wrap">
            {/* 로딩 중이면 안내 문구를 띄우고, 끝나면 서버에서 받은 도슨트 본문을 출력 */}
            {loading ? "작품을 분석 중입니다... 🎨" : docentBody}
          </p>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-8 mt-auto">
          <button 
            onClick={() => navigate(-1)}
            className="bg-[#D1D5DB] hover:bg-gray-400 text-black px-8 py-2 rounded-[2px] text-sm font-bold transition-colors"
          >
            뒤로가기
          </button>
        </div>

      </div>
    </div>
  );
};

export default Docent;