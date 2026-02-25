import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// -- 공통 컴포넌트 불러오기 --
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// -- 각 페이지 컴포넌트 불러오기 --
import Main from './pages/home/Main';

//import List from './pages/article/List';
//import Detail from './pages/article/Detail';
//import Write from './pages/article/Write';
//import Modify from './pages/article/Modify';

import Login from './pages/member/Login';
import Join from './pages/member/Join';

import Docent from './pages/archive/Docent';
import Total from './pages/archive/Total';
import Painter from './pages/archive/Painter';
import Movement from './pages/archive/Movement';
import Color from './pages/archive/Color';

import Map from './pages/map/Map';


function App() {
  return (
    <Router>
      <div className="App">
        {/* -- 모든 페이지에서 공통으로 보이는 상단바 -- */}
        <Header />

        {/* -- 주소에 따라 바뀌는 콘텐츠 영역 -- */}
        <Routes>

          {/* localhost:3000/ 접속 시 메인 페이지 */}
          <Route path="/" element={<Main />} />
          
          {/* 게시판 관련 주소들 xxx
          <Route path="/usr/article/list" element={<List />} />
          <Route path="/usr/article/detail" element={<Detail />} />
          <Route path="/usr/article/write" element={<Write />} />
          <Route path="/usr/article/modify" element={<Modify />} />
          */}
          
          
          {/* 회원 관련 주소들 */}
          <Route path="/usr/member/login" element={<Login />} />
          <Route path="/usr/member/join" element={<Join />} />
          {/*<Route path="/usr/member/info" element={<Info />} />*/}

          {/* 아카이브 관련 주소들 */}
          <Route path="/api/archive/docent" element={<Docent />} />
          <Route path="/api/archive/total" element={<Total />} />
          <Route path="/api/archive/painter" element={<Painter />} />
          <Route path="/api/archive/movement" element={<Movement />} />
          <Route path="/api/archive/color" element={<Color />} />

          {/* 미술관 지도 */}
          <Route path="/api/map/museum" element={<Map />} />

        </Routes>

        {/* -- 모든 페이지에서 공통으로 보이는 하단바 -- */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;