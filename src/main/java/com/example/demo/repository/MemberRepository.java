package com.example.demo.repository;

import org.apache.ibatis.annotations.Mapper;
import com.example.demo.vo.Member;

// "이 인터페이스는 마이바티스(MyBatis)와 연결되어 있어"라고 알려주는 표시
// 이 표시가 있어야 스프링이 SQL 쿼리가 담긴 XML 파일과 이 인터페이스를 서로 연결해줌
@Mapper
public interface MemberRepository {

	// [회원 데이터 추가] DB에 사용자가 입력한 정보를 넣고(INSERT), 성공한 행의 개수를 반환함
	public int doJoin(String loginId, String loginPw, String name, String nickname, String cellphoneNum, String email);

	// [회원 번호로 찾기] 고유 번호(id)를 주면 그에 맞는 회원 정보를 DB에서 가져와서 Member 객체에 담음
	public Member getMemberById(int id);

	// [마지막 번호 가져오기] 방금 DB에 저장된(INSERT 된) 데이터의 고유 번호(id)가 몇 번인지 물어봄
	public int getLastInsertId();

	// [아이디로 찾기] 로그인할 때 쓴 아이디를 주면 해당 회원의 전체 정보를 DB에서 찾아옴
	public Member getMemberByLoginId(String loginId);

	// [이름과 이메일로 찾기] 중복 가입을 막기 위해 이름과 이메일이 동시에 일치하는 사람이 있는지 DB에서 조회함
	public Member getMemberByNameAndEmail(String name, String email);

}