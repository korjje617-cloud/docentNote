package com.example.demo.repository;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.example.demo.vo.Article;

@Mapper
public interface ArticleRepository {

	// [쓰기/수정/삭제 관련]--------------------------------------------------
	// 새 글을 작성. 작성자 번호, 제목, 본문, 게시판 번호를 받아 저장
	public int writeArticle(int memberId, String title, String body, String boardId);

	// 글 번호를 받아 해당 게시글을 삭제
	public void deleteArticle(int id);

	// 글 번호를 기준으로 제목과 본문 내용을 수정
	public void modifyArticle(int id, String title, String body);

	
	// [조회 관련]--------------------------------------------------
	// 글 번호 하나로 게시글의 모든 정보를 딱 하나만 가져온다 (상세보기)
	public Article getArticleById(int id);

	// 아무 조건 없이 모든 게시글 목록을 리스트 형태로 가져온다 (리스트)
	public List<Article> getArticles();

	// 방금 막 작성된 글의 번호(자동 생성된 ID)가 몇 번인지 확인 (게시글 작성 직후 상세보기)
	public int getLastInsertId();

	
	// [화면 출력용 조회]--------------------------------------------------
	// 화면에 보여주기 적합하도록 작성자 이름 등이 포함된 상세 정보를 가져온다
	public Article getForPrintArticle(int id);

	// 검색어, 페이지 나누기(limit) 등을 적용해서 화면에 보여줄 글 목록을 가져온다
	public List<Article> getForPrintArticles(int boardId, int limitFrom, int limitTake, String searchKeywordTypeCode, String searchKeyword);

	// 검색 조건에 맞는 글이 총 몇 개인지 숫자를 센다 (페이지네이션)
	public int getArticlesCount(int boardId, String searchKeywordTypeCode, String searchKeyword);

	
	// [조회수 및 리액션 점수 업데이트]--------------------------------------------------
	// 글을 읽을 때마다 조회수를 1씩 올린다
	public int increaseHitCount(int id);

	// 현재 이 글의 조회수가 얼마인지 가져온다
	public int getArticleHitCount(int id);

	// 이 글의 '좋아요' 총점을 1 올린다
	public int increaseGoodReactionPoint(int relId);

	// 이 글의 '좋아요' 총점을 1 내린다 (좋아요 취소 시 사용)
	public int decreaseGoodReactionPoint(int relId);

	// 이 글의 '싫어요' 총점을 1 올린다
	public int increaseBadReactionPoint(int relId);

	// 이 글의 '싫어요' 총점을 1 내린다 (싫어요 취소 시 사용)
	public int decreaseBadReactionPoint(int relId);

	// 현재 이 글에 달린 '좋아요'의 총합이 몇 점인지 가져온다
	public int getGoodRP(int relId);

	// 현재 이 글에 달린 '싫어요'의 총합이 몇 점인지 가져온다
	public int getBadRP(int relId);

}