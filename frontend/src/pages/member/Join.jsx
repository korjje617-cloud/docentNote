import React, { useState } from "react";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  return (
    <div className="bg-[#E5E7EB] w-full min-h-screen flex justify-center items-start pt-20 pb-10 font-notos text-black">
      <div className="flex gap-[12px]">
        
        {/* 왼쪽: 회원가입 입력 폼 */}
        <div className="w-[350px] h-[680px] stamp-edge bg-white shadow-2xl flex flex-col px-8 py-8 relative">
          <div className="flex flex-col items-center mb-2 text-center">
            <span className="text-[65px] font-corinthia tracking-widest mt-1">Invitation</span>
          </div>

          <div className="w-full border-t border-black mb-[2px]"></div>
          <div className="w-full border-t border-black mb-4"></div>

          <div className="w-full flex flex-col flex-1 gap-0">
            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">이름 :</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>
            
            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">생년월일 :</span>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs text-gray-500" />
            </div>

            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">ID :</span>
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>

            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">PW :</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>

            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">PW 확인 :</span>
              <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>

            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">전화번호 :</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>

            <div className="flex items-center border-t border-black py-3">
              <span className="font-bold w-[72px] ml-1 text-[11px]">이메일 :</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>

            <div className="flex items-center border-t border-b border-black py-3 mb-4">
              <span className="font-bold w-[72px] ml-1 text-[11px]">닉네임 :</span>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="flex-1 bg-[#E5E5E5] px-3 py-1 rounded-full outline-none text-xs" />
            </div>
          </div>

          {/* 수정 영역: SIGNUP-TICKET 위치를 올리고 하단에 로고 추가 */}
          <div className="flex flex-col items-center justify-end mt-auto pb-2">
            <button className="font-barcode text-[36px] leading-none tracking-widest hover:opacity-70 mb-1">
              SIGNUP-TICKET
            </button>
            <div className="flex flex-col items-center">
              <img src="/logo.svg" alt="Logo" className="w-10 object-contain opacity-80" />
              <span className="text-[8px] font-notos tracking-tighter text-gray-400"></span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 명화 티켓 */}
        <div className="w-[350px] h-[680px] stamp-edge bg-gray-900 shadow-2xl relative overflow-hidden">
          <img 
            src="/crawling_images/Romanticism/Constable/constable_18.jpg" 
            alt="Art" 
            className="absolute inset-0 w-full h-full object-cover opacity-80" 
          />
          
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
              Helen Galloway McNicoll
            </span>
          </div>
          
          <div className="absolute bottom-14 right-8 text-right text-white z-20">
            <p className="text-lg mb-1 font-bold font-song">꽃을 따는 아이들</p>
            <p className="text-xs text-gray-300 opacity-90 font-song">헬렌 맥니콜</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;