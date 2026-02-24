import React, { useState, useEffect } from "react";

export const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // 랜덤 명화 데이터를 담을 상태
  const [randomPainting, setRandomPainting] = useState(null);

  // 페이지 로드 시 DB에서 랜덤으로 한 장 가져오기
  useEffect(() => {
    fetch('http://localhost:8081/api/main')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // 들어올 때마다 무작위로 하나 선택
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomPainting(data[randomIndex]);
        }
      })
      .catch((err) => console.error("명화 데이터를 가져오는 데 실패했습니다:", err));
  }, []);

  return (
    <div className="bg-[#E5E7EB] w-full min-h-screen flex justify-center items-start pt-20 pb-10 ">
      <div className="flex gap-[10px]">

        {/* 명화 영역 (랜덤 로직 적용) */}
        <div className="w-[350px] h-[680px] stamp-edge bg-gray-900 shadow-2xl relative overflow-hidden">
          {randomPainting ? (
            <>
              {/* 1. 랜덤 이미지 배경 */}
              <img 
                src={randomPainting.imgUrl} 
                alt={randomPainting.paintingNameKr} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" 
              />
              
              {/* 2. 필기체 이름 (영문 이름이 있으면 바인딩, 없으면 기본값) */}
              <div className="absolute top-10 left-6 z-50 pointer-events-none">
                <span 
                  className="inline-block text-[#F3F4F6] text-[52px] whitespace-nowrap tracking-widest drop-shadow-2xl"
                  style={{ 
                    fontFamily: "'Corinthia', cursive",
                    transform: "rotate(90deg)",
                    transformOrigin: "top left",
                    marginLeft: "52px" 
                  }}
                >
                  {randomPainting.painterNameEn}
                </span>
              </div>
              
              {/* 3. 작품 정보 (한글 제목 및 화가) */}
              <div className="absolute bottom-14 right-8 text-right text-white font-song z-20">
                <p className="text-lg mb-1 font-song-bold">{randomPainting.paintingNameKr}</p>
                <p className="text-xs text-gray-300 opacity-90">{randomPainting.painterNameKr}</p>
              </div>
            </>
          ) : (
            // 데이터 로딩 중일 때 보여줄 임시 배경
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
              티켓 발급중...
            </div>
          )}
        </div>

        {/* 오른쪽 티켓: 로그인 폼 영역 */}
        <div className="w-[350px] h-[680px] stamp-edge bg-white shadow-2xl flex flex-col px-8 py-10 relative">
          <div className="flex flex-col items-center mb-4 text-center">
            <img src="/logo.svg" alt="Docent Note" className="w-24 object-contain" />
            <span className="text-[9px] font-notos mt-1 tracking-tighter block w-full"></span>
          </div>

          <div className="w-full border-t border-black mb-[2px]"></div>
          <div className="w-full border-t border-black mb-8"></div>

          <div className="w-full flex flex-col mb-4 gap-0">
            <div className="flex items-center border-t border-black py-4">
              <span className="font-bold w-10 text-black ml-1 font-notos text-xs">ID :</span>
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="flex-1 bg-[#E5E5E5] px-4 py-2 rounded-full outline-none text-xs font-notos" />
            </div>
            <div className="flex items-center border-t border-b border-black py-4">
              <span className="font-bold w-10 text-black ml-1 font-notos text-xs">PW :</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-[#E5E5E5] px-4 py-2 rounded-full outline-none text-xs font-notos" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 ml-1">
            <div className="w-2.5 h-2.5 bg-[#D1D5DB]"></div>
            <span className="text-[11px] text-gray-500 font-notos tracking-tight">로그인 상태 유지</span>
          </div>

          <div className="flex flex-col items-center mb-6">
            <button className="font-barcode text-[36px] leading-none text-black tracking-widest hover:opacity-70">
              LOGIN-TICKET
            </button>
            <div className="flex gap-2 text-[10px] text-gray-400 mt-2 tracking-widest font-notos">
              <span>회원가입</span>
              <span>|</span>
              <span>아이디 / 비밀번호 찾기</span>
            </div>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-[10px] text-gray-400 font-notos">또는</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <div className="w-full flex flex-col">
              <div className="border-t border-black">
                <button className="w-full flex items-center py-3 px-2 hover:bg-gray-50">
                  <img src="/google.svg" className="w-4 h-4 ml-1 mr-3" alt="G" />
                  <span className="text-[10px] font-medium font-notos flex-1 text-center pr-7">구글 계정으로 로그인</span>
                </button>
              </div>
              <div className="border-t border-black">
                <button className="w-full flex items-center py-3 px-2 hover:bg-gray-50">
                  <img src="/naver.svg" className="w-4 h-4 ml-1 mr-3" alt="N" />
                  <span className="text-[10px] font-medium font-notos flex-1 text-center pr-7">네이버 계정으로 로그인</span>
                </button>
              </div>
              <div className="border-t border-b border-black">
                <button className="w-full flex items-center py-3 px-2 hover:bg-gray-50">
                  <img src="/kakao-talk 1.svg" className="w-4 h-4 ml-1 mr-3" alt="K" />
                  <span className="text-[10px] font-medium font-notos flex-1 text-center pr-7">카카오 계정으로 로그인</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;