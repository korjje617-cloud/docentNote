package com.example.demo.vo;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//@Getter, Setter, ToString,
//EqualsAndHashCode, RequiredArgsConstructor를
//한 번에 생성
@Data

//모든 필드를 파라미터로 받는 생성자를 생성
@AllArgsConstructor

//파라미터가 없는 기본 생성자를 생성
@NoArgsConstructor

//빌더 패턴을 자동 생성
@Builder
public class Member {

    // 회원의 고유 식별 번호 (데이터베이스 PK)
    private int id;

    // 계정이 생성된(가입한) 날짜와 시간
    private LocalDateTime regDate;

    // 회원 정보가 마지막으로 수정된 날짜와 시간
    private LocalDateTime updateDate;

    // 로그인할 때 사용하는 사용자 아이디
    private String loginId;

    // 로그인 비밀번호 (보통 암호화되어 저장됨)
    private String loginPw;

    // 회원의 본명 (실명)
    private String name;

    // 서비스 내에서 사용하는 별명
    private String nickname;

    // 회원의 전화번호
    private String cellphoneNum;

    // 회원의 이메일 주소
    private String email;

    // 탈퇴 여부 상태 (true: 탈퇴함, false: 활동 중)
    private boolean delStatus;

    // 회원이 탈퇴한 실제 날짜와 시간
    private LocalDateTime delDate;
}