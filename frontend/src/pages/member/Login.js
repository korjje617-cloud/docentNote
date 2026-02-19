import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function Login() {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ loginId: "", loginPw: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 💡 핵심: 주소는 반드시 http://localhost:8081... 
    $.ajax({
      url: 'http://localhost:8081/usr/member/doLogin',
      type: 'POST',
      data: loginInfo,
      dataType: 'json',
      xhrFields: { withCredentials: true }, // 세션 유지를 위해 필수
      success: function(res) {
        if (res.resultCode?.startsWith('S-')) {
          alert(res.msg);
          window.location.href = "/"; // 성공 시 메인으로 이동
        } else {
          alert(res.msg);
        }
      },
      error: function() {
        alert("서버 연결 실패! 스프링이 켜져 있는지 확인하세요.");
      }
    });
  };

  return (
    <section className="mt-24 text-xl px-4">
      <div className="mx-auto flex justify-center">
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '800px' }}>
          <table className="table border-collapse w-full border">
            <tbody>
              <tr>
                <th className="bg-gray-100 p-2 border" style={{ width: '150px' }}>ID</th>
                <td className="p-2 border"><input className="input input-neutral w-full" name="loginId" type="text" onChange={handleChange} /></td>
              </tr>
              <tr>
                <th className="bg-gray-100 p-2 border">PW</th>
                <td className="p-2 border"><input className="input input-neutral w-full" name="loginPw" type="password" onChange={handleChange} /></td>
              </tr>
              <tr>
                <td colSpan="2" className="p-4 border text-center">
                  <button type="submit" className="btn btn-outline w-full">LOGIN</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </section>
  );
}

export default Login;