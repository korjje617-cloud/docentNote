package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.service.ArticleService;
import com.example.demo.service.ReactionPointService;
import com.example.demo.vo.ResultData;
import com.example.demo.vo.Rq;

// 이 클래스가 사용자의 웹 요청을 처리하는 컨트롤러임을 스프링에 등록함
@Controller
public class UsrReactionPointController {

	// @Autowired: 로그인 정보나 세션 상태를 담고 있는 Rq 객체를 자동으로 가져옴
	@Autowired
	private Rq rq;

	// @Autowired: 리액션(좋아요/싫어요) 처리 전문 서비스를 연결함
	@Autowired
	private ReactionPointService reactionPointService;

	// @Autowired: 게시글의 전체 점수를 조회하거나 수정하기 위해 게시글 서비스를 연결함
	@Autowired
	private ArticleService articleService;

	// @RequestMapping: 브라우저가 /usr/reactionPoint/doGoodReaction 주소로 들어올 때 실행됨
	// @ResponseBody: 리턴되는 ResultData 객체를 JSON 문자열로 변환하여 브라우저에 그대로 전송함
	@RequestMapping("/usr/reactionPoint/doGoodReaction")
	@ResponseBody
	public ResultData doGoodReaction(String relTypeCode, int relId, String replaceUri) {

		// 1단계: 현재 로그인한 사용자가 리액션을 할 수 있는 상태인지 검증함
		// reactionPointService의 usersReaction 메서드를 호출하여 결과(ResultData)를 받아옴
		ResultData usersReactionRd = reactionPointService.usersReaction(rq.getLoginedMemberId(), relTypeCode, relId);

		// 2단계: 결과 데이터(data1)에서 리액션 상태 숫자(1:좋아요, -1:싫어요, 0:없음)를 추출함
		int usersReaction = (int) usersReactionRd.getData1();

		// 3단계: [좋아요 취소 상황] 이미 좋아요(1)를 눌렀던 경우 처리함
		if (usersReaction == 1) {
			// DB에서 해당 좋아요 기록을 삭제함
			ResultData rd = reactionPointService.deleteGoodReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 취소 후 게시글 테이블에 저장된 실시간 좋아요 총점을 다시 계산해서 가져옴
			int goodRP = articleService.getGoodRP(relId);
			// 취소 후 게시글 테이블에 저장된 실시간 싫어요 총점을 다시 계산해서 가져옴
			int badRP = articleService.getBadRP(relId);
			// 최종적으로 좋아요가 취소되었다는 성공 코드(S-1)와 갱신된 점수 정보를 리턴함
			return ResultData.from("S-1", "좋아요 취소", "goodRP", goodRP, "badRP", badRP);
		} 
		
		// 4단계: [반대 리액션 교체 상황] 싫어요(-1)를 눌렀던 경우 처리함
		else if (usersReaction == -1) {
			// 먼저 기존에 있던 싫어요 기록을 삭제하여 초기화함
			ResultData rd = reactionPointService.deleteBadReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 깨끗해진 상태에서 다시 좋아요 기록을 새롭게 추가함
			rd = reactionPointService.addGoodReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 교체 후 변경된 게시글의 최신 좋아요 합계를 가져옴
			int goodRP = articleService.getGoodRP(relId);
			// 교체 후 변경된 게시글의 최신 싫어요 합계를 가져옴
			int badRP = articleService.getBadRP(relId);
			// 싫어요가 좋아요로 바뀌었다는 코드(S-2)와 함께 전체 점수를 리턴함
			return ResultData.from("S-2", "싫어요 했었음", "goodRP", goodRP, "badRP", badRP);
		}

		// 5단계: [신규 리액션 상황] 아무것도 안 눌렀던 경우 바로 좋아요를 저장함
		ResultData reactionRd = reactionPointService.addGoodReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);

		// 만약 저장 과정에서 오류가 발생했다면 서비스에서 보낸 실패 코드를 그대로 전달함
		if (reactionRd.isFail()) {
			return ResultData.from(reactionRd.getResultCode(), reactionRd.getMsg());
		}

		// 6단계: 저장 성공 후 화면 갱신을 위해 최신 점수 정보를 조회함
		int goodRP = articleService.getGoodRP(relId);
		int badRP = articleService.getBadRP(relId);

		// 최종적으로 성공 코드와 메시지, 현재 게시글의 점수들을 모두 묶어서 리턴함
		return ResultData.from(reactionRd.getResultCode(), reactionRd.getMsg(), "goodRP", goodRP, "badRP", badRP);
	}

	// @RequestMapping: 브라우저가 /usr/reactionPoint/doBadReaction 주소로 들어올 때 실행됨
	@RequestMapping("/usr/reactionPoint/doBadReaction")
	@ResponseBody
	public ResultData doBadReaction(String relTypeCode, int relId, String replaceUri) {

		// 1단계: 로그인 세션 ID를 넘겨서 리액션 가능 여부 및 기존 기록을 확인함
		ResultData usersReactionRd = reactionPointService.usersReaction(rq.getLoginedMemberId(), relTypeCode, relId);

		// 2단계: 기존 리액션 값(data1)을 숫자로 저장함
		int usersReaction = (int) usersReactionRd.getData1();

		// 3단계: [싫어요 취소 상황] 이미 싫어요(-1)를 눌렀던 경우 처리함
		if (usersReaction == -1) {
			// DB에서 해당 싫어요 기록을 지움
			ResultData rd = reactionPointService.deleteBadReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 삭제 완료 후 동기화된 게시글의 좋아요 점수를 조회함
			int goodRP = articleService.getGoodRP(relId);
			// 삭제 완료 후 동기화된 게시글의 싫어요 점수를 조회함
			int badRP = articleService.getBadRP(relId);
			// 싫어요 취소 성공 메시지와 갱신된 점수를 리턴함
			return ResultData.from("S-1", "싫어요 취소", "goodRP", goodRP, "badRP", badRP);
		} 
		
		// 4단계: [반대 리액션 교체 상황] 좋아요(1)를 눌렀던 경우 처리함
		else if (usersReaction == 1) {
			// 기존 좋아요 기록을 먼저 제거함
			ResultData rd = reactionPointService.deleteGoodReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 싫어요 기록을 새롭게 DB에 등록함
			rd = reactionPointService.addBadReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);
			// 업데이트된 게시글의 좋아요 총점을 가져옴
			int goodRP = articleService.getGoodRP(relId);
			// 업데이트된 게시글의 싫어요 총점을 가져옴
			int badRP = articleService.getBadRP(relId);
			// 좋아요 상태에서 싫어요로 변경되었다는 코드와 점수를 리턴함
			return ResultData.from("S-2", "좋아요 했었음", "goodRP", goodRP, "badRP", badRP);
		}

		// 5단계: [신규 리액션 상황] 신규 싫어요 데이터를 DB에 저장함
		ResultData reactionRd = reactionPointService.addBadReactionPoint(rq.getLoginedMemberId(), relTypeCode, relId);

		// 서비스 레이어에서 저장 실패 처리가 내려오면 즉시 중단하고 알림
		if (reactionRd.isFail()) {
			return ResultData.from(reactionRd.getResultCode(), reactionRd.getMsg());
		}

		// 6단계: 성공적으로 저장된 후 최신화된 점수 데이터를 수집함
		int goodRP = articleService.getGoodRP(relId);
		int badRP = articleService.getBadRP(relId);

		// 최종적으로 싫어요 완료 정보와 최신 점수 데이터를 취합하여 리턴함
		return ResultData.from(reactionRd.getResultCode(), reactionRd.getMsg(), "goodRP", goodRP, "badRP", badRP);
	}

}