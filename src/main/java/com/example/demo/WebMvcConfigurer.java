package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

import com.example.demo.interceptor.BeforeActionInterceptor;
import com.example.demo.interceptor.NeedLoginInterceptor;
import com.example.demo.interceptor.NeedLogoutInterceptor;

// 스프링 설정 클래스 및 수동 빈 등록
@Configuration
public class WebMvcConfigurer implements org.springframework.web.servlet.config.annotation.WebMvcConfigurer {
	
	// 스프링 빈 자동 주입, 의존성 주입
	// 미리 만들어둔 인터셉터 객체들을 자동으로 가져와서 연결
	@Autowired
	BeforeActionInterceptor beforeActionInterceptor;

	@Autowired
	NeedLoginInterceptor needLoginInterceptor;

	@Autowired
	NeedLogoutInterceptor needLogoutInterceptor;

	// 부모 클래스의 메서드를 자식 클래스에서 재정의한다
	// addInterceptors: 어떤 인터셉터를 어떤 주소(URL)에 적용할지 등록하는 메서드
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		
		// 특정 인터셉터를 등록하고
		// 해당 인터셉터가 적용될 URL 경로와
		// 제외될 URL 경로를 세부적으로 설정하는 기능
		InterceptorRegistration ir;

		// 1️. 비서 등록: BeforeActionInterceptor
		ir = registry.addInterceptor(beforeActionInterceptor);
		ir.addPathPatterns("/**"); // 모든 페이지(/**)에 다 적용해
		ir.addPathPatterns("/favicon.ico"); // 아이콘 로딩 때도 적용해
		ir.excludePathPatterns("/resource/**"); // 이미지, CSS 같은 리소스 파일은 제외해
		ir.excludePathPatterns("/error"); // 에러 페이지도 제외해

		// 2️⃣. 로그인 체크 문지기 등록: NeedLoginInterceptor
		ir = registry.addInterceptor(needLoginInterceptor);
		// 아래 적힌 주소들은 "로그인을 해야만" 들어갈 수 있는 페이지들이야
		ir.addPathPatterns("/usr/article/write");    // 글쓰기
		ir.addPathPatterns("/usr/article/doWrite");  // 글저장
		ir.addPathPatterns("/usr/article/modify");   // 글수정
		ir.addPathPatterns("/usr/article/doModify"); // 수정저장
		ir.addPathPatterns("/usr/article/doDelete"); // 글삭제
		ir.addPathPatterns("/usr/member/doLogout");  // 로그아웃
		ir.addPathPatterns("/usr/reactionPoint/doGoodReaction"); // 좋아요
		ir.addPathPatterns("/usr/reactionPoint/doBadReaction");  // 싫어요

		// 3️. 로그아웃 체크 문지기 등록: NeedLogoutInterceptor
		ir = registry.addInterceptor(needLogoutInterceptor);
		// 아래 주소들은 이미 로그인한 사람은 "또 들어갈 필요가 없는" 페이지들이야
		ir.addPathPatterns("/usr/member/login");   // 로그인 페이지
		ir.addPathPatterns("/usr/member/doLogin"); // 로그인 처리
		ir.addPathPatterns("/usr/member/join");    // 회원가입 페이지
		ir.addPathPatterns("/usr/member/doJoin");  // 회원가입 처리

	}
}