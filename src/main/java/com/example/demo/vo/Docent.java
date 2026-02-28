package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data // Getter, Setter 등을 자동으로 만듦
@AllArgsConstructor // 모든 필드 생성자
@NoArgsConstructor // 기본 생성자
@Builder // 빌더 패턴 적용
public class Docent {
    private int id; // PK
    private int paintingId; // 그림 고유 번호
    private String body; // 도슨트 내용
    private LocalDateTime regDate; // 등록일
    private LocalDateTime updateDate; // 수정일
}