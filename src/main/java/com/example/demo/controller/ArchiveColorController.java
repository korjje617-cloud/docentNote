package com.example.demo.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.ArchiveColorService;
import com.example.demo.vo.Painting;

@CrossOrigin(origins = "http://localhost:3000")
@RestController // JSP 경로 대신 데이터를 리턴하도록 설정
@RequestMapping("/api/archive") // API 주소임을 명시하기 위해 /api를 붙이는 것이 관례
public class ArchiveColorController {

    @Autowired
    private ArchiveColorService archiveService;

    // 4. 색상별 필터링
    @GetMapping("/color/{colorName}")
    public List<Painting> showByColor(@PathVariable("colorName") String colorName) {
        // 색상 이름을 확인하여 해당 그림 리스트를 가져옴
        return archiveService.getByColorName(colorName);
    }
    
    // 5. 분류 로직 확인용
    @GetMapping("/analyze-start")
    public String startAnalysis() {
        // 1. 서비스에 만들어둔 '기존 그림 분류 로직'을 호출함 (확인)
        archiveService.classifyExistingPaintings(); 
        
        // 2. 실행 결과를 브라우저에 표시 (확인)
        return "색상 분석 및 분류 작업이 시작되었습니다! 콘솔창을 보세요."; 

    }
    
    
}