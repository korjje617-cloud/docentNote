package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.HomeService;
import com.example.demo.vo.Painting;

import java.util.List;

// @Controller + @ResponseBody = @RestController (데이터만 주는 컨트롤러)
@RestController
@CrossOrigin(origins = "http://localhost:3000") // 리액트 서버의 접속을 허용
public class UsrHomeController {

	// 1. 연결 도구
	@Autowired
	private HomeService homeService;

	// 2. 리액트에서 'http://localhost:8080/api/main/arts'로 요청하면 작동
	@GetMapping("/api/main")
	public List<Painting> getpaintings() {
		return homeService.getPaintingList();
	}
}

