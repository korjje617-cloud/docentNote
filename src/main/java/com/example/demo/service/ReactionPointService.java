package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.ReactionPointRepository;
import com.example.demo.vo.ResultData;

// 이 클래스가 '비즈니스 로직'을 담당하는 서비스 객체임을 스프링에 알림
// 스프링이 시작될 때 이 어노테이션을 보고 객체를 스스로 만들어 관리함
@Service
public class ReactionPointService {

	// @Autowired: 스프링이 관리하는 다른 객체(Bean)를 자동으로 연결해줌
	// 여기서는 ArticleService 객체를 찾아 이 변수에 자동으로 넣어줌
	@Autowired
	private ArticleService articleService;

	// 리포지토리 객체도 자동으로 주입받아 사용할 준비를 마침
	@Autowired
	private ReactionPointRepository reactionPointRepository;

	// 생성자를 통해 필요한 리포지토리를 연결함
	public ReactionPointService(ReactionPointRepository reactionPointRepository) {
		this.reactionPointRepository = reactionPointRepository;
	}

	// 로그인 여부와 기존 리액션 기록을 확인하여 권한을 체크함
	public ResultData usersReaction(int loginedMemberId, String relTypeCode, int relId) {

		// 로그인이 안 되어 있으면 즉시 차단함
		if (loginedMemberId == 0) {
			return ResultData.from("F-L", "로그인 하고 써야해");
		}

		// 사용자가 과거에 이 글에 남긴 점수가 있는지 DB에서 가져옴
		int sumReactionPointByMemberId = reactionPointRepository.getSumReactionPoint(loginedMemberId, relTypeCode,
				relId);

		// 점수가 0이 아니면 이미 리액션을 한 상태이므로 중복을 차단함
		if (sumReactionPointByMemberId != 0) {
			return ResultData.from("F-1", "추천 불가능", "sumReactionPointByMemberId", sumReactionPointByMemberId);
		}

		// 위 필터를 다 통과하면 성공 결과를 보냄
		return ResultData.from("S-1", "추천 가능", "sumReactionPointByMemberId", sumReactionPointByMemberId);
	}

	// 좋아요 점수를 저장하고 게시글 테이블의 총점 수치도 올림
	public ResultData addGoodReactionPoint(int loginedMemberId, String relTypeCode, int relId) {

		// 리액션 기록 테이블에 좋아요(+1) 행을 저장함
		int affectedRow = reactionPointRepository.addGoodReactionPoint(loginedMemberId, relTypeCode, relId);

		// DB 저장에 문제가 생기면 실패 리턴함
		if (affectedRow != 1) {
			return ResultData.from("F-1", "좋아요 실패");
		}

		// 대상이 게시글이면 ArticleService를 통해 해당 글의 좋아요 컬럼 값을 올림
		switch (relTypeCode) {
		case "article":
			articleService.increaseGoodReactionPoint(relId);
			break;
		}
		// 좋아요 처리가 정상적으로 완료되었음을 알리는 성공 데이터를 리턴함
		return ResultData.from("S-1", "좋아요!");
	}

	// 싫어요 점수를 저장하고 게시글 테이블의 총점 수치도 올림
	public ResultData addBadReactionPoint(int loginedMemberId, String relTypeCode, int relId) {
		// 리액션 기록 테이블에 싫어요(-1) 행을 저장함
		int affectedRow = reactionPointRepository.addBadReactionPoint(loginedMemberId, relTypeCode, relId);

		if (affectedRow != 1) {
			return ResultData.from("F-1", "싫어요 실패");
		}

		// 게시글 테이블의 싫어요 컬럼 값을 올림
		switch (relTypeCode) {
		case "article":
			articleService.increaseBadReactionPoint(relId);
			break;
		}
		//싫어요 처리가 완료되었음을 알리는 성공 코드를 리턴함
		return ResultData.from("S-1", "싫어요!");
	}

	// 좋아요 기록을 삭제하고 게시글 테이블의 수치를 차감함
	public ResultData deleteGoodReactionPoint(int loginedMemberId, String relTypeCode, int relId) {
		// 해당 리액션 행을 DB에서 삭제함
		reactionPointRepository.deleteReactionPoint(loginedMemberId, relTypeCode, relId);

		// 게시글 테이블의 좋아요 수치를 다시 내림
		switch (relTypeCode) {
		case "article":
			articleService.decreaseGoodReactionPoint(relId);
			break;
		}
		//좋아요 취소 로직이 무사히 끝났음을 알리는 메시지를 리턴함
		return ResultData.from("S-1", "좋아요 취소 됨");
	}

	// 싫어요 기록을 삭제하고 게시글 테이블의 수치를 차감함
	public ResultData deleteBadReactionPoint(int loginedMemberId, String relTypeCode, int relId) {
		// 리액션 기록 테이블에서 데이터를 삭제함
		reactionPointRepository.deleteReactionPoint(loginedMemberId, relTypeCode, relId);

		// 게시글 테이블의 싫어요 수치를 다시 내림
		switch (relTypeCode) {
		case "article":
			articleService.decreaseBadReactionPoint(relId);
			break;
		}
		//싫어요 취소 로직이 무사히 끝났음을 알리는 메시지를 리턴함
		return ResultData.from("S-1", "싫어요 취소 됨");
	}

	// 이미 좋아요를 누른 기록이 있는지 점수로 판단함
	public boolean isAlreadyAddGoodRp(int memberId, int relId, String relTypeCode) {
		// 사용자의 리액션 점수 정보를 가져옴
		int getPointTypeCodeByMemberId = reactionPointRepository.getSumReactionPoint(memberId, relTypeCode, relId);

		// 0보다 크면(즉, 1이면) 좋아요 상태로 판단함
		if (getPointTypeCodeByMemberId > 0) {
			return true;
		}
		// 좋아요 상태가 아니라는 뜻의 false를 리턴함
		return false;
	}

	// 이미 싫어요를 누른 기록이 있는지 점수로 판단함
	public boolean isAlreadyAddBadRp(int memberId, int relId, String relTypeCode) {
		// 사용자의 리액션 점수 정보를 가져옴
		int getPointTypeCodeByMemberId = reactionPointRepository.getSumReactionPoint(memberId, relTypeCode, relId);

		// 0보다 작으면(즉, -1이면) 싫어요 상태로 판단함
		if (getPointTypeCodeByMemberId < 0) {
			return true;
		}
		//싫어요 상태가 아니라는 뜻의 false를 리턴함
		return false;
	}

}