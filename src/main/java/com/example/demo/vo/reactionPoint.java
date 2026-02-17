package com.example.demo.vo;

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
public class reactionPoint {
    // 리액션 기록의 고유 번호 (PK)
    private int id;

    // 리액션(좋아요/싫어요)을 처음 남긴 시간
    private String regDate;

    // 리액션 상태를 수정한 시간
    private String updateDate;

    // 리액션을 남긴 회원의 번호 (누가 했는지)
    private int memberId;

    // 리액션 대상의 종류 (예: 'article'은 게시글, 'reply'는 댓글)
    private String relTypeCode;

    // 리액션 대상의 고유 번호 (예: 5번 게시글에 좋아요를 눌렀다면 5)
    private int relId;

    // 리액션 점수 (예: 좋아요는 1, 싫어요는 -1)
    private int point;
}

/**
relTypeCode 정보는
게시글 컨트롤러에서 메서드로 받아간다
showDetail 부분 보면 메서드 인자로 보내주고 있음
댓글 좋아요도 그것처럼 하면 될까??
**/