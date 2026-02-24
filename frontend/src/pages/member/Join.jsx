import React, { useState, useEffect } from "react";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

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

      </div>
    </div>
  );
};

export default SignUp;