// 테일윈드 코드를 브라우저가 읽을 수 있는 표준 CSS로 변환하는 설정
module.exports = {
  // 사용할 도구(플러그인)들을 나열
  plugins: {

    // 1. 테일윈드 엔진 실행
    tailwindcss: {},

    // 2. 오토프리픽서(Autoprefixer)를 실행
    // 브라우저마다(크롬, 사파리, 엣지 등) 스타일이 다르게 보이는 것을 막기 위해 
    // 자동으로 앞에 '-webkit-' 같은 접두사를 붙여줌
    autoprefixer: {},
  },
}