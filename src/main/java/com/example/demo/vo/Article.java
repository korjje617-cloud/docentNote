package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Getter, Setter, ToString,
// EqualsAndHashCode, RequiredArgsConstructor를
// 한 번에 생성
@Data

// 모든 필드를 파라미터로 받는 생성자를 생성
@AllArgsConstructor

// 파라미터가 없는 기본 생성자를 생성
@NoArgsConstructor

// 빌더 패턴을 자동 생성
@Builder
public class Article {

    // 게시글의 고유 번호 (데이터베이스의 PK)
    private int id;

    // 게시글이 처음 작성된 시간
    private String regDate;

    // 게시글이 마지막으로 수정된 시간
    private String updateDate;

    // 이 글을 쓴 작성자의 번호 (Member 테이블의 id와 연결)
    private int memberId;

    // 이 글이 속한 게시판의 번호 (공지사항, 자유게시판 등)
    private int boardId;

    // 게시글의 제목
    private String title;

    // 게시글의 본문 내용
    private String body;

    // 글의 조회수
    private int hitCount;

    // 추천(좋아요) 수
    private int goodReactionPoint;

    // 비추천(싫어요) 수
    private int badReactionPoint;

    // [부가정보] 작성자의 이름 (DB JOIN을 통해 가져옴)
    private String extra__writer;

    // [부가정보] 좋아요와 싫어요를 계산한 합산 점수
    private String extra__sumReactionPoint;

    // 현재 사용자가 이 글을 수정할 수 있는지 여부
    private boolean userCanModify;

    // 현재 사용자가 이 글을 삭제할 수 있는지 여부
    private boolean userCanDelete;
}