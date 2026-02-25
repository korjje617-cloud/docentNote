package com.example.demo.repository;

import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.Painting;
import com.example.demo.vo.PaintingColorMap;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ArchiveColorRepository {
    // [check] 모든 색상 기준 가져오기
    List<ArchiveColor> selectAllArchiveColors();

    // [save] 분석된 색상 결과 저장
    void insertPaintingColorMap(PaintingColorMap colorMap);

    // [select] 특정 색상 ID를 가진 그림 목록 가져오기 (Join)
    List<Painting> selectPaintingsByColorId(@Param("colorId") int colorId);
    
    List<Painting> selectUnanalyzedPaintings();
}