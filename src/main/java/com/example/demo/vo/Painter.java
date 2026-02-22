package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Painter {
    private int id;
    private String painterNameEn;
    private String painterNameKr;
    private int movementId;
    private String nationality;
    private String regDate;
    private String updateDate;
}