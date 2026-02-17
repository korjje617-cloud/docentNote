package com.example.demo.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.demo.vo.Rq;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

// 스프링에서 관리하는 객체==빈
@Component

// 이 클래스는 HandlerInterceptor 인터페이스를 상속받았다
// 모든 요청이 컨트롤러로 가기 전에 잠깐 정지하고 공통 준비를 한다
public class BeforeActionInterceptor implements HandlerInterceptor {
	
	// 스프링 빈 자동 주입, 의존성 주입
	@Autowired
	
	// Rq 클래스로 만든 rq 객체를 주입받아서 가져왔다
	private Rq rq;
	
	// 부모 클래스의 메서드를 자식 클래스에서 재정의한다
	@Override
	
	// req: 요청 정보, resp: 응답 정보, Handler: 실행될 컨트롤러 정보
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object Handler) throws Exception {

		// 1. [데이터 세팅] 
		// 사용자가 누구인지, 로그인은 했는지 등의 정보를 확인해서 rq 객체 안에 정리
		// 이 작업이 미리 되어 있어야 다음 인터셉터나 컨트롤러가 편하게 일할 수 있다
		rq.initBeforeActionInterceptor();
		
		// 2. [통과] 
		// 준비가 끝났으니 다음 단계로
		return HandlerInterceptor.super.preHandle(req, resp, Handler);
	}
}