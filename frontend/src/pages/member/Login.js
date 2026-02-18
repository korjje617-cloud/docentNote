import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery'; // -- 기존 doLogin 통신을 위해 사용 --

function Login() {
  const navigate = useNavigate();

  // -- 1. 상태 관리: 로그인 입력 정보 --
  const [loginInfo, setLoginInfo] = useState({
    loginId: "",
    loginPw: ""
  });

  // -- 2. 입력값 변경 감지 함수 (데이터 바인딩) --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -- 3. 로그인 처리 함수 (doLogin) --
  const handleSubmit = (e) => {
    e.preventDefault(); // -- 폼 제출 시 페이지 새로고침 방지 -- 

    // -- 간단한 유효성 검사 --
    if (!loginInfo.loginId.trim()) return alert('아이디를 입력해주세요.');
    if (!loginInfo.loginPw.trim()) return alert('비밀번호를 입력해주세요.');

    // -- 기존 JSP의 action="../member/doLogin" 역할을 Ajax로 처리 -- 
    $.post('../member/doLogin', loginInfo, function(data) {
      if (data.resultCode?.startsWith('S-')) {
        alert(data.msg || '로그인 되었습니다.');
        // -- 로그인 성공 시 메인 화면으로 이동 --
        navigate('/'); 
      } else {
        alert(data.msg || '로그인 정보가 일치하지 않습니다.');
      }
    }, 'json');
  };

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto flex justify-center">
        {/* -- action 대신 onSubmit 이벤트 사용 --  */}
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '800px' }}>
          <table className="table border-collapse w-full border">
            <tbody>
              {/* -- 아이디 입력 --  */}
              <tr>
                <th className="bg-gray-100 p-2 border" style={{ width: '150px' }}>아이디</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-neutral w-full"
                    name="loginId"
                    type="text"
                    placeholder="아이디 입력"
                    value={loginInfo.loginId}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 비밀번호 입력 --  */}
              <tr>
                <th className="bg-gray-100 p-2 border">비밀번호</th>
                <td className="p-2 border text-center">
                  <input
                    className="input input-neutral w-full"
                    name="loginPw"
                    type="password"
                    placeholder="비번 입력"
                    value={loginInfo.loginPw}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                </td>
              </tr>

              {/* -- 로그인 버튼 --  */}
              <tr>
                <th className="border"></th>
                <td className="p-4 border text-center">
                  <button className="btn btn-outline btn-ghost w-full">로그인</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* -- 하단 버튼 (뒤로가기) --  */}
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

export default Login;