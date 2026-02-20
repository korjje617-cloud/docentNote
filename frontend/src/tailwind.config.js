/** @type {import('tailwindcss').Config} */
// 테일윈드 엔진이 어떻게 작동할지 정의하는 설정 파일

module.exports = {

  // 1. 감시 경로 설정 content
  // 테일윈드가 디자인 코드를 찾아낼 파일들의 위치 정함
  // src 폴더 안의 모든 js, jsx, ts, tx 파일들을 낱낱이 보겠다
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  // 2. 디자인 테마 설정 theme
  theme: {

    // extend: 기본 테일윈드 설정을 유지하면서 디자인을 추가하고 싶을 때 사용
    extend: {
      
      // 폰트 추가 fontFamily
      // 피그마에서 가져온 폰트 이름들을 등록
      // className="font-song" 또는 "font-corinthia"로 바로 쓸 수 있다
      fontFamily: {
        song: ['Song Myung', 'serif'], // 'Song Myung' 폰트가 없으면 기본 명조체(serif) 사용
        corinthia: ['Corinthia', 'cursive'], // 'Corinthia' 폰트가 없으면 기본 필기체(cursive) 사용
        notos: ['Noto Sans KR', 'san-serif'], // 'Noto Sans KR' 폰트가 없으면 기본 고딕체(san-serif) 사용
      },

      // 색상 추가 colors
      // 피그마 디자인에서 뽑아낸 전용 색상값을 이름으로 등록
      // className="bg-docent-bg"라고 쓰면 #F3F3F3 색상이 적용
      colors: {
        'docent-bg': '#F3F3F3', // 피그마 배경색
      },
    },
  },

  // 플러그인 설정 Plugins
  // 추가적인 기능(스크롤바 숨기기, 폼 스타일링 등)을 넣고 싶을 때 사용
  // 지금은 비어있는 상태
  plugins: [],
};