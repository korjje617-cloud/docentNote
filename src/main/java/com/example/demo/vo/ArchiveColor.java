package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArchiveColor {
    private int id;
    private String colorName; // 예: Red, Deep Blue
    private int min_r;
    private int max_r;
    private int min_g;
    private int max_g;
    private int min_b;
    private int max_b;
    private String regDate;
}