package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArchivePainter {
    private int id;
    private int painterId;
    private String painterNameEn;
    private String painterNameKr;
    private int movementId;
    private String regDate;
    private String updateDate;
}