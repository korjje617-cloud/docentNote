package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.demo.service.ArchiveColorService;
import com.example.demo.vo.Painting;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/map")
public class MapController {

	@GetMapping("/museum")
	public String getMuseumData() {
		// 설정: 공공데이터 포탈에서 복사한 End Point 주소
		String url = "주소 삭제";

		// 설정: 본인이 발급받은 일반 인증키(Decoding)
		String serviceKey = "인증키 삭제";

		// 설정: 요청에 필요한 파라미터(인증키, 타입, 개수 등)를 주소 뒤에 붙임
		String fullUrl = url + "?serviceKey=" + serviceKey + "&type=json&pageNo=1&numOfRows=213";

		// 생성: 외부 API와 통신하기 위한 도구를 만듬
		RestTemplate restTemplate = new RestTemplate();

		// 확인: 데이터를 가져와서 결과물(String)을 받음
		String result = restTemplate.getForObject(fullUrl, String.class);

		// 저장: 리액트로 데이터를 보내줌
		return result;
	}
}