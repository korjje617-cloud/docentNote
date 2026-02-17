package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;

//"이 인터페이스는 마이바티스(MyBatis)와 연결되어 있어"라고 알려주는 표시
//이 표시가 있어야 스프링이 SQL 쿼리가 담긴 XML 파일과 이 인터페이스를 서로 연결해줌
@Mapper
public interface ReactionPointRepository {

	// 내가 이 글에 리액션을 남겼는지, 남겼다면 어떤 점수(좋아요 1, 싫어요 -1)인지 가져온다
	public int getSumReactionPoint(int memberId, String relTypeCode, int relId);

	// "좋아요(+1)" 기록을 DB에 새롭게 추가
	public int addGoodReactionPoint(int memberId, String relTypeCode, int relId);

	// "싫어요(-1)" 기록을 DB에 새롭게 추가
	public int addBadReactionPoint(int memberId, String relTypeCode, int relId);

	// 취소 버튼을 눌렀을 때, 남겼던 리액션 기록을 DB에서 지운다
	public void deleteReactionPoint(int memberId, String relTypeCode, int relId);

}