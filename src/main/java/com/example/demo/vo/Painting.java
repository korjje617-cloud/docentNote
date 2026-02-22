package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // @Getter, Setter, ToString, EqualsAndHashCode, RequiredArgsConstructor 포함
@AllArgsConstructor // 모든 필드를 파라미터로 받는 생성자
@NoArgsConstructor // 파라미터가 없는 기본 생성자
@Builder // 빌더 패턴 적용
public class Painting {
    private int id; // 고유 번호
    private String paintingNameEn; // 영문 제목
    private String paintingNameKr; // 한글 제목
    private int painterId; // 화가 ID (외래키)
    private int movementId; // 사조 ID (외래키)
    private int createYear; // 제작 연도
    private String imgPath; // 이미지 파일 경로
    private String regDate; // 등록 날짜
    private String updateDate; // 수정 날짜
}