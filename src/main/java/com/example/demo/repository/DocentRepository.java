package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.demo.vo.Docent;

@Mapper // MyBatis 매퍼 인터페이스임을 선언
public interface DocentRepository {

    // 그림 ID로 도슨트 데이터를 찾음
    Docent findByPaintingId(@Param("paintingId") int paintingId);

    // 새로운 도슨트 정보를 저장함
    void save(Docent docent);
}