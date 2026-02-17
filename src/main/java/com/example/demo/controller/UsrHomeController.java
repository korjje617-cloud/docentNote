package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

// 스프링에게 "이 클래스는 사용자의 요청을 받아서 화면을 보여주는 역할" 이라고 알려주는 표시
@Controller
public class UsrHomeController {

	// 브라우저 주소창에 '.../usr/home/main'이라고 치면 이 메서드가 실행됨
	@RequestMapping("/usr/home/main")
	public String showMain() {
		
		// "/usr/home/main"이라는 이름의 HTML 파일(JSP 등)을 찾아서 사용자 화면에 보여줌
		return "/usr/home/main";
	}

	// @RequestMapping("/"): 브라우저 주소창에 아무것도 안 붙이고 그냥 접속했을 때 실행됨
	@RequestMapping("/")
	public String showMain2() {
		
		// "redirect:/usr/home/main": 다른 주소인 '/usr/home/main'으로 강제로 이동(재요청)시킴
		// 즉, 홈페이지 첫 화면을 무조건 메인 페이지로 연결해주는 역할임
		return "redirect:/usr/home/main";
	}
}