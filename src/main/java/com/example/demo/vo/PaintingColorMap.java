package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaintingColorMap {
    private int id;
    private int paintingId; // 그림 ID
    private Integer archiveColorId; // 매칭된 사전 색상 ID
    private int raw_r; // 실제 R값
    private int raw_g; // 실제 G값
    private int raw_b; // 실제 B값
    private float score; // 색상 비중 (0~1)
}