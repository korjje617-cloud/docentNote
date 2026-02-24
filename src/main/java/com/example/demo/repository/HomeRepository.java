package com.example.demo.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.Painting;

//"이 인터페이스는 마이바티스(MyBatis)와 연결되어 있어"라고 알려주는 표시
//이 표시가 있어야 스프링이 SQL 쿼리가 담긴 XML 파일과 이 인터페이스를 서로 연결해줌
@Mapper
public interface HomeRepository {

	public List<Painting> getPaintingList();

}
