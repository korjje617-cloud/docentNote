import React from 'react';
import { Link } from 'react-router-dom'; // -- 페이지 새로고침 방지를 위해 사용 --

function Header() {
  // -- 로그인 상태를 확인하는 임시 변수 (나중에 서버와 연결) --
  const isLogined = false; 

  // -- 로그아웃 클릭 시 확인창 --
  const handleLogout = (e) => {
    if (!window.confirm('로그아웃 하시겠습니까?')) {
      e.preventDefault(); // -- 취소 클릭 시 페이지 이동 방지 --
    }
  };

  return (
    <header>
      {/* -- class -> className으로 변경 -- */}
      <div className="flex h-20 mx-auto items-center text-3xl container">
        {/* -- a href -> Link to로 변경 (리액트 방식) -- */}
        <Link to="/">LOGO</Link>
        <div className="flex-grow"></div>
        <ul className="flex gap-4">
          <li className="hover:underline">
            <Link to="/">HOME</Link>
          </li>
          <li className="hover:underline">
            <div className="dropdown dropdown-hover">
              {/* -- tabindex 등 속성 이름 유지 -- */}
              <div tabIndex="0" role="button">LIST</div>
              <ul tabIndex="0" className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow text-sm">
                <li><Link to="/usr/article/list?boardId=1">NOTICE</Link></li>
                <li><Link to="/usr/article/list?boardId=2">FREE</Link></li>
                <li><Link to="/usr/article/list?boardId=3">QnA</Link></li>
              </ul>
            </div>
          </li>

          {/* -- <c:if> 대신 삼항 연산자나 논리 연산자 사용 -- */}
          {!isLogined ? (
            <>
              <li className="hover:underline">
                <Link to="/usr/member/login">LOGIN</Link>
              </li>
              <li className="hover:underline">
                <Link to="/usr/member/join">JOIN</Link>
              </li>
            </>
          ) : (
            <>
              <li className="hover:underline">
                <Link to="/usr/article/write">WRITE</Link>
              </li>
              <li className="hover:underline">
                {/* -- onclick -> onClick으로 변경 -- */}
                <Link to="/usr/member/doLogout" onClick={handleLogout}>LOGOUT</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;