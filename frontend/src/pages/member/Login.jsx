import React, { useState } from "react";

export const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-[#E5E7EB] w-full min-h-screen flex justify-center items-start pt-20 pb-10 ">
      <div className="flex gap-[10px] scale-110">
        
        {/* 왼쪽 티켓: 명화 영역 */}
        <div className="w-[350px] h-[650px] stamp-edge bg-gray-900 shadow-2xl relative overflow-hidden">
          <img 
            src="/crawling_images/Romanticism/Constable/constable_18.jpg" 
            alt="Art" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" 
          />
          
          {/* 🖋️ 필기체 이름: 왼쪽 상단에서 시작, 글자 바닥이 왼쪽 벽면을 향함 */}
          <div className="absolute top-10 left-6 z-50 pointer-events-none">
            <span 
              className="inline-block text-[#F3F4F6] text-[52px] whitespace-nowrap tracking-widest drop-shadow-2xl"
              style={{ 
                fontFamily: "'Corinthia', cursive",
                transform: "rotate(90deg)",
                transformOrigin: "top left",
                marginLeft: "52px" // 회전 후 벽면에 붙이기 위한 보정값
              }}
            >
              Helen Galloway McNicoll
            </span>
          </div>
          
          <div className="absolute bottom-14 right-8 text-right text-white font-song z-20">
            <p className="text-lg mb-1 font-song-bold">꽃을 따는 아이들</p>
            <p className="text-xs text-gray-300 opacity-90">헬렌 맥니콜</p>
          </div>
        </div>

        {/* 오른쪽 티켓: 로그인 폼 영역 */}
        <div className="w-[350px] h-[650px] stamp-edge bg-white shadow-2xl flex flex-col px-8 py-10 relative">
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
            <div className="flex gap-2 text-[8px] text-gray-400 mt-2 tracking-widest font-notos">
              <span>회원가입</span>
              <span>|</span>
              <span>아이디 / 비밀번호 찾기</span>
            </div>
          </div>

          <div className="flex flex-col justify-end mt-auto">
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