package com.example.demo.repository;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.example.demo.vo.Painting;
import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.PaintingColorMap;

@Mapper
public interface ArchiveRepository {
    // 기존 조회 메서드
    List<Painting> getPaintings();
    List<Painting> getByMovementId(int id);
    List<Painting> getByPainterId(int id);
    List<Painting> getByColorName(String colorName);

    // --- 분석용 메서드 ---

    // 1. 아직 색상 분석 데이터가 없는 그림들만 확인하여 가져옴
    List<Painting> getPaintingsToAnalyze();

    // 2. DB에 설정된 11가지 색상 카테고리 기준 정보를 가져옴
    List<ArchiveColor> getArchiveColorCategories();

    // 3. 분석된 색상 결과(RGB, Score, 카테고리ID)를 저장
    void insertColorMap(PaintingColorMap colorMap);
}