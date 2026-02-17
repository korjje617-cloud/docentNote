package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.ArticleRepository;
import com.example.demo.util.Ut;
import com.example.demo.vo.Article;
import com.example.demo.vo.ResultData;

//이 클래스가 '비즈니스 로직'을 담당하는 서비스 객체임을 스프링에 알림
//스프링이 시작될 때 이 어노테이션을 보고 객체를 스스로 만들어 관리함
@Service
public class ArticleService {

	// 게시판 서비스 객체를 저장할 변수를 선언함
	private final BoardService boardService;

	// @Autowired: 게시글 리포지토리 객체를 자동으로 가져와서 연결함
	@Autowired
	private ArticleRepository articleRepository;

	// 생성자를 통해 리포지토리와 다른 서비스를 주입받아 초기화함
	public ArticleService(ArticleRepository articleRepository, BoardService boardService) {
		this.articleRepository = articleRepository;
		this.boardService = boardService;
	}

	// 사용자가 작성한 내용을 바탕으로 게시글을 저장함
	public ResultData writeArticle(int loginedMemberId, String title, String body, String boardId) {

		// 리포지토리를 통해 DB에 게시글 데이터를 저장함
		articleRepository.writeArticle(loginedMemberId, title, body, boardId);

		// 방금 저장된 글의 번호(id)를 가져옴
		int id = articleRepository.getLastInsertId();

		// 작성된 글 번호와 성공 메시지를 묶어서 리턴함
		return ResultData.from("S-1", Ut.f("%d번 게시글 작성", id), "이번에 쓰여진 글의 id", id);
	}

	// 현재 로그인한 사람이 게시글을 수정할 수 있는지 권한을 체크함
	public ResultData userCanModify(int loginedMemberId, Article article) {

		// 글 작성자 번호와 내 번호가 다르면 실패 데이터를 리턴함
		if (article.getMemberId() != loginedMemberId) {
			return ResultData.from("F-A2", Ut.f("%d번 게시글에 대한 수정 권한 없음", article.getId()));
		}

		// 권한이 있으면 성공 데이터를 리턴함
		return ResultData.from("S-1", Ut.f("%d번 게시글을 수정 가능", article.getId()));
	}

	// 현재 로그인한 사람이 게시글을 삭제할 수 있는지 권한을 체크함
	public ResultData userCanDelete(int loginedMemberId, Article article) {
		// 작성자가 아니면 삭제 권한이 없다는 결과를 리턴함
		if (article.getMemberId() != loginedMemberId) {
			return ResultData.from("F-A2", Ut.f("%d번 게시글에 대한 삭제 권한 없음", article.getId()));
		}

		// 권한 확인 성공 시 결과를 리턴함
		return ResultData.from("S-1", Ut.f("%d번 게시글을 삭제 가능", article.getId()));
	}

	// 글 번호를 전달받아 리포지토리에서 게시글을 지움
	public void deleteArticle(int id) {
		articleRepository.deleteArticle(id);
	}

	// 출력용 게시글 정보를 가져오고 수정/삭제 권한 여부까지 체크함
	public Article getForPrintArticle(int loginedMemberId, int id) {

		// 작성자 이름 등이 포함된 출력용 게시글 데이터를 가져옴
		Article article = articleRepository.getForPrintArticle(id);

		// 현재 로그인한 사용자의 수정/삭제 권한을 데이터에 주입함
		controlForPrintData(loginedMemberId, article);

		// 권한 정보가 포함된 게시글 객체를 리턴함
		return article;
	}

	// 출력용 데이터에서 권한 관련 정보를 세팅함
	private void controlForPrintData(int loginedMemberId, Article article) {
		// 게시글이 존재하지 않으면 처리를 중단함
		if (article == null) {
			return;
		}

		// 수정 권한 여부를 확인하고 결과를 객체에 저장함
		ResultData userCanModifyRd = userCanModify(loginedMemberId, article);
		article.setUserCanModify(userCanModifyRd.isSuccess());

		// 삭제 권한 여부를 확인하고 결과를 객체에 저장함
		ResultData userCanDeleteRd = userCanDelete(loginedMemberId, article);
		article.setUserCanDelete(userCanDeleteRd.isSuccess());
	}

	// 게시글의 제목과 본문 내용을 수정함
	public void modifyArticle(int id, String title, String body) {
		articleRepository.modifyArticle(id, title, body);
	}

	// 단순하게 글 번호로 게시글 정보를 가져옴
	public Article getArticleById(int id) {
		return articleRepository.getArticleById(id);
	}

	// 전체 게시글 목록을 리스트 형태로 가져옴
	public List<Article> getArticles() {
		return articleRepository.getArticles();
	}

	// 게시판별 목록을 가져오며 페이지네이션과 검색 기능을 처리함
	public List<Article> getForPrintArticles(int boardId, int itemsInAPage, int page, String searchKeywordTypeCode,
			String searchKeyword) {

		// 페이지 번호를 기반으로 조회를 시작할 행 번호를 계산함
		int limitFrom = (page - 1) * itemsInAPage;
		// 한 페이지에 보여줄 개수를 설정함
		int limitTake = itemsInAPage;

		// 계산된 범위와 검색 조건을 적용한 글 목록을 리턴함
		return articleRepository.getForPrintArticles(boardId, limitFrom, limitTake, searchKeywordTypeCode,
				searchKeyword);
	}

	// 특정 게시판 및 검색 조건에 맞는 글의 총 개수를 가져옴
	public int getArticlesCount(int boardId, String searchKeywordTypeCode, String searchKeyword) {
		return articleRepository.getArticlesCount(boardId, searchKeywordTypeCode, searchKeyword);
	}

	// 게시글의 조회수를 1 올림
	public ResultData increaseHitCount(int id) {

		// 조회수 업데이트 후 영향받은 행의 개수를 가져옴
		int affectedRow = articleRepository.increaseHitCount(id);

		// 업데이트된 행이 없으면 게시글이 없는 것으로 판단하여 실패를 리턴함
		if (affectedRow == 0) {
			return ResultData.from("F-1", "해당 게시글은 없음", "id", id);
		}

		// ↩조회수가 성공적으로 올라갔음을 리턴함
		return ResultData.from("S-1", "조회수 증가", "id", id);
	}

	// 특정 게시글의 현재 조회수를 가져옴
	public Object getArticleHitCount(int id) {
		return articleRepository.getArticleHitCount(id);
	}

	// 게시글의 좋아요 점수를 1 올림
	public ResultData increaseGoodReactionPoint(int relId) {
		int affectedRow = articleRepository.increaseGoodReactionPoint(relId);

		if (affectedRow == 0) {
			return ResultData.from("F-1", "없는 게시물");
		}

		// ↩좋아요 수치 증가 완료 결과를 리턴함
		return ResultData.from("S-1", "좋아요 증가", "affectedRow", affectedRow);
	}

	// 게시글의 싫어요 점수를 1 올림
	public ResultData increaseBadReactionPoint(int relId) {
		int affectedRow = articleRepository.increaseBadReactionPoint(relId);

		if (affectedRow == 0) {
			return ResultData.from("F-1", "없는 게시물");
		}

		// ↩싫어요 수치 증가 완료 결과를 리턴함
		return ResultData.from("S-1", "싫어요 증가", "affectedRow", affectedRow);
	}

	// 게시글의 좋아요 점수를 1 내림
	public ResultData decreaseGoodReactionPoint(int relId) {
		int affectedRow = articleRepository.decreaseGoodReactionPoint(relId);

		if (affectedRow == 0) {
			return ResultData.from("F-1", "없는 게시물");
		}

		// 좋아요 수치 감소 완료 결과를 리턴함
		return ResultData.from("S-1", "좋아요 감소", "affectedRow", affectedRow);
	}

	// 게시글의 싫어요 점수를 1 내림
	public ResultData decreaseBadReactionPoint(int relId) {
		int affectedRow = articleRepository.decreaseBadReactionPoint(relId);

		if (affectedRow == 0) {
			return ResultData.from("F-1", "없는 게시물");
		}

		// ↩싫어요 수치 감소 완료 결과를 리턴함
		return ResultData.from("S-1", "싫어요 감소", "affectedRow", affectedRow);
	}
	
	// 특정 게시글의 총 좋아요 개수를 가져옴
	public int getGoodRP(int relId) {
		return articleRepository.getGoodRP(relId);
	}

	// 특정 게시글의 총 싫어요 개수를 가져옴
	public int getBadRP(int relId) {
		return articleRepository.getBadRP(relId);
	}
}