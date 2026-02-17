package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.service.MemberService;
import com.example.demo.util.Ut;
import com.example.demo.vo.Member;
import com.example.demo.vo.ResultData;
import com.example.demo.vo.Rq;

import jakarta.servlet.http.HttpServletRequest;

// 스프링에게 "이 클래스는 사용자의 요청을 받아서 화면을 보여주는 역할" 이라고 알려주는 표시
@Controller
public class UsrMemberController {

	// 매 요청마다 필요한 도구(Rq)를 자동으로 연결함
	@Autowired
	private Rq rq;

	// 회원 관련 실제 업무(DB 조회 등)를 수행하는 서비스 객체를 연결함
	@Autowired
	private MemberService memberService;

	
	// 브라우저가 /usr/member/doLogout 주소로 요청하면 실행됨
	@RequestMapping("/usr/member/doLogout")
	
	// 결과물을 HTML 파일이 아닌, 글자(JSON/JS) 그대로 브라우저에 전달함
	@ResponseBody
	public String doLogout(HttpServletRequest req) {

		// 이전 인터셉터에서 만들어둔 rq 객체를 가방(req)에서 꺼내옴
		Rq rq = (Rq) req.getAttribute("rq");

		// rq 도구를 이용해 세션에 들어있는 로그인 정보를 삭제(로그아웃)함
		rq.logout();

		// 로그아웃 성공 메시지를 띄우고 메인 페이지("/")로 이동시키는 자바스크립트 반환
		return Ut.jsReplace("S-1", "로그아웃 성공", "/");
	}

	
	// 로그인 페이지 화면을 보여주는 메서드
	@RequestMapping("/usr/member/login")
	public String showLogin() {
		
		// /usr/member/login.jsp(또는 .html) 파일을 화면에 그림
		return "/usr/member/login";
	}

	
	// 실제 로그인 처리를 수행하는 메서드
	@RequestMapping("/usr/member/doLogin")
	
	@ResponseBody
	public String doLogin(HttpServletRequest req, String loginId, String loginPw) {

		// 가방(req)에서 rq 객체를 꺼내옴
		Rq rq = (Rq) req.getAttribute("rq");

		// 아이디가 비어있는지 도구(Ut)로 검사함
		if (Ut.isEmptyOrNull(loginId)) {
			
			// 비어있다면 경고창을 띄우고 이전 화면으로 돌려보냄
			return Ut.jsHistoryBack("F-1", "loginId 입력해");
		}
		
		// 비밀번호가 비어있는지 검사함
		if (Ut.isEmptyOrNull(loginPw)) {
			return Ut.jsHistoryBack("F-2", "loginPw 입력해");
		}

		// 서비스에게 시켜서 입력한 아이디와 일치하는 회원 정보를 DB에서 가져옴
		Member member = memberService.getMemberByLoginId(loginId);

		// 만약 회원 정보가 없다면?
		if (member == null) {
			
			// 없는 아이디라고 경고하고 돌려보냄
			return Ut.jsHistoryBack("F-3", Ut.f("%s는 없는 아이디", loginId));
		}

		// DB에 저장된 비번과 사용자가 입력한 비번이 서로 다른지 검사함
		if (member.getLoginPw().equals(loginPw) == false) {
			
			// 틀렸다면 경고하고 돌려보냄
			return Ut.jsHistoryBack("F-4", "비밀번호 x");
		}

		// 모든 검사를 통과했다면 rq를 통해 세션에 로그인 정보를 저장함
		rq.login(member);

		// 환영 메시지를 띄우고 메인 페이지("/")로 이동시킴
		return Ut.jsReplace("S-1", Ut.f("%s님 환영합니다", member.getNickname()), "/");
	}

	// 회원가입 페이지 화면을 보여주는 메서드
	@RequestMapping("/usr/member/join")
	public String showJoin() {
		return "/usr/member/join";
	}

	// 실제 회원가입 처리를 수행하는 메서드
	@RequestMapping("/usr/member/doJoin")
	@ResponseBody
	public String doJoin(HttpServletRequest req, String loginId, String loginPw, String name, String nickname,
			String cellphoneNum, String email) {

		// [입력값 체크] 아이디, 비번, 이름, 닉네임, 폰번호, 이메일이 모두 있는지 하나씩 검사함
		if (Ut.isEmptyOrNull(loginId)) {
			return Ut.jsHistoryBack("F-1", "loginId 입력해");
		}
		if (Ut.isEmptyOrNull(loginPw)) {
			return Ut.jsHistoryBack("F-2", "loginPw 입력해");
		}
		if (Ut.isEmptyOrNull(name)) {
			return Ut.jsHistoryBack("F-3", "name 입력해");
		}
		if (Ut.isEmptyOrNull(nickname)) {
			return Ut.jsHistoryBack("F-4", "nickname 입력해");
		}
		if (Ut.isEmptyOrNull(cellphoneNum)) {
			return Ut.jsHistoryBack("F-5", "cellphoneNum 입력해");
		}
		if (Ut.isEmptyOrNull(email)) {
			return Ut.jsHistoryBack("F-6", "email 입력해");
		}

		// 서비스에게 회원가입 정보를 넘겨주고 결과를 보고서(ResultData)로 받음
		ResultData joinRd = memberService.join(loginId, loginPw, name, nickname, cellphoneNum, email);

		// 회원가입이 실패했다면 (예: 중복 아이디)
		if (joinRd.isFail()) {
			
			// 실패 사유를 알림창으로 띄우고 뒤로 돌려보냄
			return Ut.jsHistoryBack(joinRd.getResultCode(), joinRd.getMsg());
		}

		// 회원가입 성공 시 보고서에서 새 회원 번호(data1)를 꺼내 회원 정보를 가져옴
		Member member = memberService.getMemberById((int) joinRd.getData1());

		// 가입 성공 메시지를 보여주고 로그인 페이지로 이동시킴
		return Ut.jsReplace(joinRd.getResultCode(), joinRd.getMsg(), "../member/login");
	}

}