package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.vo.Board;

//"이 인터페이스는 마이바티스(MyBatis)와 연결되어 있어"라고 알려주는 표시
//이 표시가 있어야 스프링이 SQL 쿼리가 담긴 XML 파일과 이 인터페이스를 서로 연결해줌
@Mapper
public interface BoardRepository {

	// getBoardById: 게시판의 고유 ID(번호)를 이용해 해당 게시판 정보를 가져오는 메서드
	// XML 파일에 있는 <select id="getBoardById"> 태그와 연결되어 실행
	public Board getBoardById(int id);

}