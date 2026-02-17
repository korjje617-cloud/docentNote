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
public class Board {

    // 게시판의 고유 번호 (예: 1번 게시판, 2번 게시판)
    private int id;

    // 게시판이 생성된 날짜와 시간
    private String regDate;

    // 게시판 설정이 마지막으로 수정된 날짜와 시간
    private String updateDate;

    // 게시판을 식별하는 코드 (예: notice, free 등 영문 이름)
    private String code;

    // 게시판의 실제 이름 (예: 공지사항, 자유게시판 등 한글 이름)
    private String name;

    // 게시판의 삭제 여부를 저장 (true면 삭제됨, false면 사용 중)
    private boolean delStatus;

    // 게시판이 삭제된 정확한 날짜와 시간
    private LocalDateTime delDate;
}