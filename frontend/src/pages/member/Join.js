import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery'; // -- 기존 doJoin 통신을 위해 사용 --

function Join() {
  const navigate = useNavigate();

  // -- 1. 상태 관리: 회원가입 입력 정보  --
  const [member, setMember] = useState({
    loginId: "",
    loginPw: "",
    name: "",
    nickname: "",
    cellphoneNum: "",
    email: ""
  });

  // -- 2. 입력값 변경 감지 함수 (데이터 바인딩) --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -- 3. 회원가입 처리 함수 (doJoin) --
  const handleSubmit = (e) => {
    e.preventDefault(); // -- 폼 제출 시 페이지 새로고침 방지  --

    // -- 간단한 유효성 검사 (필요 시 추가) --
    if (!member.loginId.trim()) return alert('아이디를 입력해주세요.');
    if (!member.loginPw.trim()) return alert('비밀번호를 입력해주세요.');
    if (!member.name.trim()) return alert('이름을 입력해주세요.');

    // -- 기존 JSP의 action="../member/doJoin" 역할을 Ajax로 처리  --
    $.post('../usr/member/doJoin', member, function(data) {
      if (data.resultCode?.startsWith('S-')) {
        alert(data.msg || '회원가입이 완료되었습니다.');
        navigate('/usr/member/login'); // -- 가입 성공 시 로그인 페이지로 이동 --
      } else {
        alert(data.msg || '회원가입에 실패했습니다.');
      }
    }, 'json');
  };

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto flex justify-center">
        {/* -- action 대신 onSubmit 이벤트 사용  -- */}
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '800px' }}>
          <table className="table border-collapse w-full border">
            <tbody>
              {/* -- 아이디 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border" style={{ width: '150px' }}>아이디</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="loginId"
                    type="text"
                    placeholder="loginId 입력"
                    value={member.loginId}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 비밀번호 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border">비밀번호</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="loginPw"
                    type="password"
                    placeholder="loginPw 입력"
                    value={member.loginPw}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 이름 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border">이름</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="name"
                    type="text"
                    placeholder="name 입력"
                    value={member.name}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 닉네임 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border">닉네임</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="nickname"
                    type="text"
                    placeholder="nickname 입력"
                    value={member.nickname}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 전화번호 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border">전화번호</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="cellphoneNum"
                    type="text"
                    placeholder="cellphoneNum 입력"
                    value={member.cellphoneNum}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 이메일 입력  -- */}
              <tr>
                <th className="bg-gray-100 p-2 border">이메일</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-bordered w-full"
                    name="email"
                    type="email"
                    placeholder="email 입력"
                    value={member.email}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 가입 버튼  -- */}
              <tr>
                <th className="border"></th>
                <td className="p-4 border text-center">
                  <input className="btn btn-outline btn-success w-full" type="submit" value="가입" />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* -- 하단 버튼 (뒤로가기) [cite: 1, 2] -- */}
      <div className="flex justify-center mt-4">
        <button 
          className="btn btn-outline btn-ghost" 
          type="button" 
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    </section>
  );
}

export default Join;