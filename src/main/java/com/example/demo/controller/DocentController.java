package com.example.demo.controller;

import com.example.demo.service.ArchiveColorService;
import com.example.demo.service.DocentService;
import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.Docent;
import com.example.demo.vo.Painting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // 컨트롤러 선언
@RequestMapping("/api/archive/docent") // 요청 경로 지정
@CrossOrigin(origins = "http://localhost:3000") // 리액트 포트 허용
public class DocentController {

	@Autowired // 서비스 주입
	private DocentService docentService;

	// Painting 객체를 받아서 Docent 객체를 바로 반환함
	@PostMapping
	public Docent getDocent(@RequestBody Painting painting) {

		// 서비스에서 결과(Docent)를 가져와서 그대로 리턴함
		return docentService.getOrCreateDocent(painting);
	}
}