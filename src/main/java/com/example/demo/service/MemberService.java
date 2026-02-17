package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.MemberRepository;
import com.example.demo.util.Ut;
import com.example.demo.vo.Member;
import com.example.demo.vo.ResultData;

//이 클래스가 '비즈니스 로직'을 담당하는 서비스 객체임을 스프링에 알림
//스프링이 시작될 때 이 어노테이션을 보고 객체를 스스로 만들어 관리함
@Service
public class MemberService {

	// DB와 직접 대화하는 창구인 Repository를 자동으로 연결함
	@Autowired
	private MemberRepository memberRepository;

	// 서비스 객체가 생성될 때 리포지토리를 넘겨받아 초기화
	public MemberService(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;

	}

	// 실제 회원가입 로직을 수행하는 메서드 (각종 중복 체크 포함)
	public ResultData<Integer> join(String loginId, String loginPw, String name, String nickname, String cellphoneNum,
			String email) {
		
		// 1. [아이디 중복 체크] 입력된 아이디로 기존 회원이 있는지 찾아봄
		Member existsMember = getMemberByLoginId(loginId);

		// 이미 같은 아이디를 쓰는 회원이 있다면?
		if (existsMember != null) {
			// 실패 보고서(F-7)를 작성해서 돌려보냄
			return ResultData.from("F-7", Ut.f("이미 사용중인 loginId(%s) 입니다", loginId));
		}
		
		// 2. [이름과 이메일 중복 체크] 동일한 이름과 이메일 조합이 있는지 확인
		existsMember = getMemberByNameAndEmail(name, email);

		// 이미 가입된 정보가 있다면?
		if (existsMember != null) {
			// 실패 보고서(F-8)를 작성해서 돌려보냄
			return ResultData.from("F-8", Ut.f("이미 사용중인 name(%s)과 email(%s) 입니다", name, email));
		}

		// 3. [회원 저장] 모든 검사를 통과했다면 DB에 회원 정보를 저장함
		memberRepository.doJoin(loginId, loginPw, name, nickname, cellphoneNum, email);

		// 4. [신규 번호 획득] 방금 가입한 회원의 고유 번호(ID)를 가져옴
		int id = memberRepository.getLastInsertId();

		// 성공 보고서(S-1)에 새 회원 번호를 담아서 반환함
		return ResultData.from("S-1", "회원가입 성공", "이번에 가입한 회원의 번호", id);
	}

	// 이름과 이메일로 회원을 찾는 내부 보조 메서드
	private Member getMemberByNameAndEmail(String name, String email) {
		return memberRepository.getMemberByNameAndEmail(name, email);
	}

	// 회원 고유 번호(ID)로 회원 정보를 가져오는 메서드
	public Member getMemberById(int id) {
		return memberRepository.getMemberById(id);
	}

	// 로그인 아이디(loginId)로 회원 정보를 가져오는 메서드
	public Member getMemberByLoginId(String loginId) {
		return memberRepository.getMemberByLoginId(loginId);
	}

}