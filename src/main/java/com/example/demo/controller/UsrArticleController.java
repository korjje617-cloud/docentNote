package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.DemoApplication;
import com.example.demo.interceptor.BeforeActionInterceptor;
import com.example.demo.service.ArticleService;
import com.example.demo.service.BoardService;
import com.example.demo.service.ReactionPointService;
import com.example.demo.util.Ut;
import com.example.demo.vo.Article;
import com.example.demo.vo.Board;
import com.example.demo.vo.ResultData;
import com.example.demo.vo.Rq;

import jakarta.servlet.http.HttpServletRequest;

// @Controller: 이 클래스가 사용자의 웹 요청을 받아 처리하는 입구임을 스프링에 알림
@Controller
public class UsrArticleController {

	// 애플리케이션의 메인 설정이나 정보를 참조하기 위해 demoApplication 객체를 선언함
	private final DemoApplication demoApplication;

	// 요청 전후의 처리를 담당하는 인터셉터 객체를 저장하기 위해 선언함
	private final BeforeActionInterceptor beforeActionInterceptor;

	// @Autowired: 리액션 점수(좋아요/싫어요) 관련 로직을 사용하기 위해 서비스를 연결함
	@Autowired
	private ReactionPointService reactionPointService;
	
	// @Autowired: 리액션 처리에 대한 컨트롤러 기능을 참조하기 위해 연결함
	@Autowired
	private UsrReactionPointController usrReactionPointController;

	// @Autowired: 로그인 상태 확인 및 세션 관리를 편하게 해주는 Rq 객체를 자동으로 가져옴
	@Autowired
	private Rq rq;

	// @Autowired: 실제 게시글의 데이터를 처리하는 핵심 서비스인 ArticleService를 연결함
	@Autowired
	private ArticleService articleService;

	// @Autowired: 게시판 종류(자유, 공지 등) 정보를 관리하는 서비스를 연결함
	@Autowired
	private BoardService boardService;

	// 생성자를 통해 스프링이 관리하는 핵심 객체(인터셉터, 애플리케이션)들을 주입받아 초기화함
	UsrArticleController(BeforeActionInterceptor beforeActionInterceptor, DemoApplication demoApplication) {
		this.beforeActionInterceptor = beforeActionInterceptor;
		this.demoApplication = demoApplication;
	}

	// @RequestMapping: 브라우저가 /usr/article/detail 주소로 접근할 때 이 메서드를 실행함
		@RequestMapping("/usr/article/detail")
		public String showDetail(HttpServletRequest req, Model model, int id) {

			// 현재 요청(request) 객체에 담긴 Rq 데이터를 가져와서 사용 준비를 함
			Rq rq = (Rq) req.getAttribute("rq");

			// 서비스 레이어를 통해 화면에 보여줄 게시글 상세 정보(작성자 이름 포함 등)를 가져옴
			// 현재 로그인한 사용자의 ID를 넘겨서 수정/삭제 권한 여부도 함께 계산함
			Article article = articleService.getForPrintArticle(rq.getLoginedMemberId(), id);

			// 현재 로그인한 사용자가 이 글에 좋아요나 싫어요를 남길 수 있는 상태인지 체크함
			ResultData usersReactionRd = reactionPointService.usersReaction(rq.getLoginedMemberId(), "article", id);

			// 리액션 체크 결과가 성공적(아무것도 안 누른 상태)이라면
			if (usersReactionRd.isSuccess()) {
				// 화면단에서 리액션 버튼을 활성화할 수 있도록 성공 여부를 모델에 저장함
				model.addAttribute("userCanMakeReaction", usersReactionRd.isSuccess());
			}

			// 조회한 게시글 객체 전체를 JSP 화면으로 넘겨주기 위해 모델에 담음
			model.addAttribute("article", article);
			
			// 사용자가 이 글에 남겼던 기존 리액션 점수(1, -1, 0)를 모델에 담음
			model.addAttribute("usersReaction", usersReactionRd.getData1());
			
			// 이미 좋아요를 누른 상태인지 여부를 논리값(true/false)으로 확인하여 모델에 담음
			model.addAttribute("isAlreadyAddGoodRp",
					reactionPointService.isAlreadyAddGoodRp(rq.getLoginedMemberId(), id, "article"));
			
			// 이미 싫어요를 누른 상태인지 여부를 논리값으로 확인하여 모델에 담음
			model.addAttribute("isAlreadyAddBadRp",
					reactionPointService.isAlreadyAddBadRp(rq.getLoginedMemberId(), id, "article"));

			// 최종적으로 데이터를 가지고 보여줄 화면 경로(usr/article/detail.jsp)를 리턴함
			return "usr/article/detail";
		}

		// @RequestMapping: 브라우저가 /usr/article/doIncreaseHitCountRd 주소로 요청을 보낼 때 실행됨
		// @ResponseBody: 결과 데이터를 JSON 형식으로 변환하여 화면 새로고침 없이 데이터만 전달함
		@RequestMapping("/usr/article/doIncreaseHitCountRd")
		@ResponseBody
		public ResultData doIncreaseHitCount(int id) {

			// 1단계: 서비스 레이어를 호출하여 해당 번호(id) 게시글의 조회수를 DB에서 1 증가시킴
			ResultData increaseHitCountRd = articleService.increaseHitCount(id);

			// 2단계: 만약 게시글이 존재하지 않는 등 조회수 올리기에 실패했다면
			if (increaseHitCountRd.isFail()) {
				// 실패했다는 정보가 담긴 결과 데이터를 그대로 리턴함
				return increaseHitCountRd;
			}

			// 3단계: 성공했다면 기존 결과 데이터에 '현재 실시간 조회수' 수치를 추가로 담아서 리턴함
			// articleService.getArticleHitCount(id)를 통해 최신 조회수 숫자를 가져옴
			return ResultData.newData(increaseHitCountRd, "hitCount", articleService.getArticleHitCount(id));
		}

		// [수정 페이지 폼] 사용자가 수정 버튼을 눌렀을 때 입력창이 있는 화면을 보여줌
		@RequestMapping("/usr/article/modify")
		public String showModify(HttpServletRequest req, Model model, int id) {
			// 현재 요청에서 로그인 정보가 담긴 Rq 객체를 꺼내옴
			Rq rq = (Rq) req.getAttribute("rq");

			// DB에서 수정할 글의 정보를 가져옴 (작성자 정보 포함)
			Article article = articleService.getForPrintArticle(rq.getLoginedMemberId(), id);

			// 찾으려는 게시글이 없으면 경고창을 띄우고 이전 페이지로 되돌려보냄
			if (article == null) {
				return Ut.jsHistoryBack("F-1", Ut.f("%d번 게시글은 없어", id));
			}

			// 가져온 글 정보를 모델에 담아 JSP(화면)로 보냄
			model.addAttribute("article", article);

			// 수정 페이지 파일 경로를 리턴함
			return "/usr/article/modify";
		}

		// [실제 수정 실행] 사용자가 수정을 마치고 '완료' 버튼을 눌렀을 때 DB를 업데이트함
		@RequestMapping("/usr/article/doModify")
		@ResponseBody
		public String doModify(HttpServletRequest req, int id, String title, String body) {

			// 현재 요청에서 로그인한 회원의 정보를 가져옴
			Rq rq = (Rq) req.getAttribute("rq");

			// 수정하기 전, 해당 번호의 글이 진짜 존재하는지 먼저 확인함
			Article article = articleService.getArticleById(id);

			// 게시글이 존재하지 않으면 에러 메시지와 함께 뒤로 보냄
			if (article == null) {
				return Ut.jsHistoryBack("F-1", Ut.f("%d번 게시글은 없어", id));
			}

			// 현재 로그인한 사용자가 이 글을 수정할 권한(작성자 본인)이 있는지 확인함
			ResultData userCanModifyRd = articleService.userCanModify(rq.getLoginedMemberId(), article);

			// 권한이 없으면(실패하면) 이유를 설명하고 뒤로 보냄
			if (userCanModifyRd.isFail()) {
				return Ut.jsHistoryBack(userCanModifyRd.getResultCode(), userCanModifyRd.getMsg());
			}

			// 권한 확인을 통과하면 서비스 레이어를 호출하여 DB의 제목과 내용을 고침
			if (userCanModifyRd.isSuccess()) {
				articleService.modifyArticle(id, title, body);
			}

			// 수정이 완료된 후 최신 정보를 확인하기 위해 글 데이터를 다시 가져옴
			article = articleService.getArticleById(id);

			// 수정을 성공했다는 알림을 띄운 뒤, 수정한 글의 상세 페이지로 자동 이동시킴
			return Ut.jsReplace(userCanModifyRd.getResultCode(), userCanModifyRd.getMsg(), "../article/detail?id=" + id);
		}

		// @RequestMapping: 사용자가 /usr/article/doDelete 주소로 삭제 요청을 보내면 실행됨
		// @ResponseBody: 처리 결과를 HTML 페이지가 아닌 문자열(스크립트) 형태로 직접 응답함
		@RequestMapping("/usr/article/doDelete")
		@ResponseBody
		public String doDelete(HttpServletRequest req, int id) {

			// 현재 요청에서 로그인한 사용자의 정보를 담고 있는 Rq 객체를 꺼내옴
			Rq rq = (Rq) req.getAttribute("rq");

			// 삭제하기 전에 해당 번호(id)의 게시글이 실제로 존재하는지 DB에서 가져옴
			Article article = articleService.getArticleById(id);

			// 만약 삭제하려는 게시글이 DB에 없다면
			if (article == null) {
				// 글이 없다는 메시지를 알림창으로 띄우고 이전 페이지로 돌려보냄
				return Ut.jsHistoryBack("F-1", Ut.f("%d번 게시글은 없어", id));
			}

			// 현재 로그인한 사람이 이 글을 삭제할 수 있는 권한(작성자 본인 여부)이 있는지 체크함
			ResultData userCanDeleteRd = articleService.userCanDelete(rq.getLoginedMemberId(), article);

			// 삭제 권한이 없는 경우(작성자가 아닌 경우 등)
			if (userCanDeleteRd.isFail()) {
				// 권한이 없다는 사유를 알림창으로 보여주고 이전 페이지로 돌려보냄
				return Ut.jsHistoryBack(userCanDeleteRd.getResultCode(), userCanDeleteRd.getMsg());
			}

			// 권한 확인을 성공적으로 통과했다면
			if (userCanDeleteRd.isSuccess()) {
				// 서비스 레이어를 호출하여 실제 DB에서 해당 게시글 데이터를 삭제함
				articleService.deleteArticle(id);
			}

			// 삭제 처리가 완료되었다는 메시지를 띄운 후, 게시글 목록 페이지(../article/list)로 강제 이동시킴
			return Ut.jsReplace(userCanDeleteRd.getResultCode(), userCanDeleteRd.getMsg(), "../article/list");
		}

		// @RequestMapping: 사용자가 /usr/article/list 주소로 접속하면 이 메서드를 실행함
		// @RequestParam: URL 파라미터가 없어도 기본값(defaultValue)을 설정하여 오류를 방지함
		@RequestMapping("/usr/article/list")
		public String showList(Model model, 
				@RequestParam(defaultValue = "1") int boardId, // 기본 게시판 번호를 1로 설정함
				@RequestParam(defaultValue = "1") int page, // 기본 페이지 번호를 1로 설정함
				@RequestParam(defaultValue = "title") String searchKeywordTypeCode, // 기본 검색 타입을 제목으로 설정함
				@RequestParam(defaultValue = "") String searchKeyword) { // 검색어는 기본적으로 빈 값을 설정함

			// 현재 선택된 게시판 번호로 게시판 정보(공지사항, 자유게시판 등)를 가져옴
			Board board = boardService.getBoardById(boardId);

			// 만약 DB에 해당 게시판 번호가 존재하지 않는다면
			if (board == null) {
				// 존재하지 않는 게시판이라는 메시지를 띄우고 이전 화면으로 돌려보냄
				return rq.historyBackOnView("존재하지 않는 게시판입니다");
			}

			// 검색 조건에 맞는 게시글이 총 몇 개인지 DB에서 숫자를 세어옴
			int articlesCount = articleService.getArticlesCount(boardId, searchKeywordTypeCode, searchKeyword);

			// 한 페이지에 보여줄 게시글의 개수를 10개로 고정함
			int itemsInAPage = 10;

			// 전체 페이지 개수를 계산함 (예: 글 25개면 3페이지가 되도록 올림 처리함)
			// Math.ceil을 사용하여 소수점 발생 시 무조건 정수 윗단위로 올림함
			int pagesCount = (int) Math.ceil(articlesCount / (double) itemsInAPage);

			// 실제 화면에 출력할 게시글 리스트를 서비스에서 가져옴
			// 게시판 ID, 페이지당 개수, 현재 페이지 번호, 검색어 등을 모두 전달함
			List<Article> articles = articleService.getForPrintArticles(boardId, itemsInAPage, page, searchKeywordTypeCode,
					searchKeyword);

			// 계산된 총 페이지 수를 모델에 담아 화면으로 보냄
			model.addAttribute("pagesCount", pagesCount);
			// 검색된 총 게시글 수를 모델에 담음
			model.addAttribute("articlesCount", articlesCount);
			// 조회된 게시글 목록 리스트를 모델에 담음
			model.addAttribute("articles", articles);
			// 현재 선택된 게시판 번호를 모델에 담음
			model.addAttribute("boardId", boardId);
			// 사용자가 선택한 검색 타입을 모델에 담음 (유지용)
			model.addAttribute("searchKeywordTypeCode", searchKeywordTypeCode);
			// 사용자가 입력한 검색어를 모델에 담음 (유지용)
			model.addAttribute("searchKeyword", searchKeyword);
			// 현재 게시판 객체 정보를 모델에 담음
			model.addAttribute("board", board);
			// 현재 내가 보고 있는 페이지 번호를 모델에 담음
			model.addAttribute("page", page);

			// 최종적으로 리스트 화면이 그려진 JSP 경로(/usr/article/list.jsp)를 리턴함
			return "/usr/article/list";
		}

		// [글쓰기 페이지 폼] 사용자가 글쓰기 버튼을 눌렀을 때 작성 화면을 보여줌
		@RequestMapping("/usr/article/write")
		public String showWrite() {

			// 글을 작성할 수 있는 입력란이 있는 JSP 파일 경로를 리턴함
			return "usr/article/write";
		}

		// [실제 글쓰기 실행] 사용자가 제목과 내용을 다 적고 '작성' 버튼을 눌렀을 때 DB에 저장함
		@RequestMapping("/usr/article/doWrite")
		@ResponseBody
		public String doWrite(HttpServletRequest req, String title, String body, String boardId) {

			// 현재 요청에서 로그인 정보가 담긴 Rq 객체를 꺼내옴
			Rq rq = (Rq) req.getAttribute("rq");

			// 제목이 비어있는지 혹은 공백만 있는지 유틸리티 함수(Ut)로 체크함
			if (Ut.isEmptyOrNull(title)) {
				// 제목이 없으면 경고창을 띄우고 다시 입력창으로 되돌려보냄
				return Ut.jsHistoryBack("F-1", "제목써");
			}
			
			// 본문 내용이 비어있는지 체크함
			if (Ut.isEmptyOrNull(body)) {
				// 내용이 없으면 경고창을 띄우고 다시 입력창으로 되돌려보냄
				return Ut.jsHistoryBack("F-2", "내용써");
			}

			// 어떤 게시판(공지사항, 자유게시판 등)에 쓸지 선택했는지 체크함
			if (Ut.isEmptyOrNull(boardId)) {
				// 게시판이 선택되지 않았으면 경고창을 띄우고 되돌려보냄
				return Ut.jsHistoryBack("F-3", "게시판을 선택하세요");
			}

			// 서비스 레이어를 호출하여 작성자 번호, 제목, 내용, 게시판 ID를 DB에 저장함
			ResultData doWriteRd = articleService.writeArticle(rq.getLoginedMemberId(), title, body, boardId);

			// 저장 성공 후 생성된 게시글의 번호(id)를 결과 데이터에서 추출함
			int id = (int) doWriteRd.getData1();

			// 방금 만들어진 따끈따끈한 게시글 정보를 DB에서 다시 한 번 가져옴
			Article article = articleService.getArticleById(id);

			// 글 작성이 완료되었다는 알림을 띄운 뒤, 방금 쓴 글의 상세 페이지로 자동 이동시킴
			return Ut.jsReplace(doWriteRd.getResultCode(), doWriteRd.getMsg(), "../article/detail?id=" + id);
		}

	}