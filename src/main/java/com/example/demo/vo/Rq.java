package com.example.demo.vo;

import java.io.IOException;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import com.example.demo.util.Ut;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.Setter;

//스프링에서 관리하는 객체==빈
@Component

// 이 객체는 'request(요청)'마다 하나씩 새로 만들어지고 끝나면 사라짐
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)

// 클래스 내부 변수들을 읽고 쓸 수 있는 메서드를 자동으로 만들어줌
@Getter
@Setter
public class Rq {

		// 지금 로그인한 상태인지 아닌지
		private boolean isLogined = false;
		
		// 로그인한 사람의 ID를 저장
		private int loginedMemberId = 0;

		// 브라우저가 보낸 요청 정보를 담는 변수
		private HttpServletRequest req;
		
		// 서버가 브라우저에 보낼 응답 도구를 담는 변수
		private HttpServletResponse resp;
		
		// 서버가 사용자를 기억하기 위해 사용하는 공간
		private HttpSession session;

		
		// Rq 객체가 태어나자마자(생성자) 실행되어 초기 세팅을 하는 단계
		public Rq(HttpServletRequest req, HttpServletResponse resp) {
			
			// 외부에서 들어온 요청 정보를 내 변수에 저장
			this.req = req;
			
			// 외부에서 들어온 응답 정보를 내 변수에 저장
			this.resp = resp;
			
			// 요청 정보 안에서 세션을 꺼내서 저장
			this.session = req.getSession();

			// 세션 안에 "로그인한 회원번호"라는 데이터가 있는지 확인
			if (session.getAttribute("loginedMemberId") != null) {
				
				// 데이터가 있다면 로그인 스위치를 "참(true)"으로 올림
				isLogined = true;
				
				// 세션에서 꺼낸 회원번호를 내 변수(loginedMemberId)에 저장
				loginedMemberId = (int) session.getAttribute("loginedMemberId");
			}

			// 나중에 인터셉터나 다른 곳에서 꺼내 쓸 수 있게 요청(req)에 'rq'라는 이름으로 나 자신을 넣어둠
			this.req.setAttribute("rq", this);
		}

		// 브라우저 화면에 경고창을 띄우고 "뒤로가기" 시킴
		public void printHistoryBack(String msg) throws IOException {
			
			// 응답할 내용이 HTML 문서이고 글자가 깨지지 않게 UTF-8이라고 알려줌
			resp.setContentType("text/html; charset=UTF-8");

			// 자바스크립트 명령어를 시작하겠다는 태그 작성
			println("<script>");

			// 테스트
			println("console.log(123);");

			// 만약 전달받은 메시지(msg)가 비어있지 않다면
			if (!Ut.isEmpty(msg)) {
				
				// 메시지 안에 따옴표(')가 있으면 문법 오류가 나므로 백슬래시(\')로 바꿔서 경고창(alert) 띄움
				println("alert('" + msg.replace("'", "\\'") + "');");
			}

			// 테스트용
			println("console.log(456);");

			// 브라우저에게 "방금 전 페이지로 돌아가"라고 명령
			println("history.back();");
			
			// 자바스크립트 종료 태그 작성
			println("</script>");
			
			// 지금까지 적은 내용을 브라우저로 즉시 전송
			resp.getWriter().flush();
			
			// 통신 통로를 닫음
			resp.getWriter().close();
		}

		// 문자열 뒤에 엔터(줄바꿈)를 붙여서 편하게 출력해주는 도우미 메서드
		private void println(String str) throws IOException {
			print(str + "\n");
		}

		// 실제로 응답 종이(getWriter)에 글자를 적는 도우미 메서드
		private void print(String str) throws IOException {
			resp.getWriter().append(str);
		}

		// 로그아웃 시 세션에서 로그인 정보를 지워버림
		public void logout() {
			session.removeAttribute("loginedMemberId");
		}

		// 로그인 시 세션에 로그인한 회원의 번호를 저장함
		public void login(Member member) {
			session.setAttribute("loginedMemberId", member.getId());
		}

		// "지금 잘 작동하고 있다" 라고 서버 콘솔에 빨간 글씨로 찍어보는 기능
		public void initBeforeActionInterceptor() {
			System.err.println("initBeforeActionInterceptor 실행됨");
		}

		// JSP 같은 화면단에서 경고창을 띄우고 뒤로가기를 할 수 있게 데이터만 세팅해서 보냄
		public String historyBackOnView(String msg) {
			
			// 메시지 내용을 가방(req)에 담음
			req.setAttribute("msg", msg);
			
			// 뒤로가기를 해야 한다는 신호를 가방(req)에 담음
			req.setAttribute("historyBack", true);
			
			// 이 처리를 대신 해줄 공통 JSP 파일 경로를 알려줌
			return "usr/common/js";
		}

		// 사용자가 현재 보고 있는 페이지의 전체 주소를 알아내는 기능
		public String getCurrentUri() {
			
			// 도메인 뒤의 주소(예: /usr/article/list)를 가져옴
			String currentUri = req.getRequestURI();
			
			// 물음표 뒤의 파라미터(예: boardId=1)를 가져옴
			String queryString = req.getQueryString();

			// 주소와 파라미터가 둘 다 있다면 합쳐서 전체 주소를 만듦 (예: /usr/article/list?boardId=1)
			if (currentUri != null && queryString != null) {
				currentUri += "?" + queryString;
			}

			// 완성된 전체 주소를 돌려줌
			return currentUri;
		}
	}