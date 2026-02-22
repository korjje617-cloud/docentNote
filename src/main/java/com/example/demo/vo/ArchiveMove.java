package com.example.demo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArchiveMove {
    private int id;
    private int movementId;
    private String description;
    private String regDate;
    private String updateDate;
}