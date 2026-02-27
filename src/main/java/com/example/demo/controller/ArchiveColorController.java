package com.example.demo.controller;

import com.example.demo.service.ArchiveColorService;
import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.Painting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/archive")
@CrossOrigin(origins = "http://localhost:3000") // [check] 리액트 접근 허용
public class ArchiveColorController {

    @Autowired
    private ArchiveColorService archiveColorService;

    // [1] 버튼 목록 가져오기 (리액트의 /api/archive/colors 와 매칭)
    @GetMapping("/colors") 
    public List<ArchiveColor> getAllColors() {
        // [import] DB에서 버튼용 색상 목록을 가져옵니다.
        return archiveColorService.getAllColors();
    }

    // [2] 특정 색상 그림 가져오기 (리액트의 /api/archive/color?colorId=... 와 매칭)
    @GetMapping("/color")
    public List<Painting> getPaintingsByColorId(@RequestParam("colorId") int colorId) {
        // [set] 분석 안 된 그림 분석 + 해당 색상 그림 필터링
        return archiveColorService.getPaintingsByColorId(colorId);
    }
}