package com.example.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.demo.vo.Rq;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// 스프링에서 관리하는 객체==빈
@Component

//이 클래스는 HandlerInterceptor 인터페이스를 상속받았다
// BeforeActionInterceptor 다음에 실행된다
public class NeedLoginInterceptor implements HandlerInterceptor {

	// 스프링 빈 자동 주입, 의존성 주입
	@Autowired

	// Rq 클래스로 만든 rq 객체를 주입받아서 가져왔다
	private Rq rq;

	// 부모 클래스의 메서드를 자식 클래스에서 재정의한다
	@Override

	// req: 요청 정보, resp: 응답 정보, Handler: 실행될 컨트롤러 정보
	// true를 반환하면 컨트롤러 실행, false를 반환하면 중단
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object Handler) throws Exception {

		// 1. [객체 가져오기]
		// BeforeActionInterceptor가 요청(req)을 받고 미리 담아둔 rq 객체를 꺼내옴
		Rq rq = (Rq) req.getAttribute("rq");

		// 2. [권한 검사]
		// rq 객체에게 로그인 상태를 물어봄
		if (!rq.isLogined()) {

			// 3. [입구 컷 및 알림]
			// 로그인이 안 되어 있다면 경고 메시지를 띄우고 이전 페이지로 돌려보냄
			rq.printHistoryBack("로그인 하고 사용해야함(NeedLoginInterceptor)");

			// 4. [중단]
			// false를 반환하여 실제 컨트롤러 기능이 실행되지 않게 막음
			return false;
		}

		// 5. [통과]
		// 로그인된 사용자라면 true를 반환하여 다음 단계(컨트롤러)로 보내줌
		return HandlerInterceptor.super.preHandle(req, resp, Handler);
	}
}