package com.example.demo.service;

import com.example.demo.repository.ArchiveColorRepository;
import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.Painting;
import com.example.demo.vo.PaintingColorMap;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ArchiveColorService {

    @Autowired
    private ArchiveColorRepository archiveColorRepository;

    // 사용자가 색상 버튼을 클릭하면 호출되는 메서드
    public List<Painting> getPaintingsByColorId(int colorId) {
        
        // painting_color_map 테이블에 아직 등록되지 않은 그림 목록을 DB에서 가져옴
        List<Painting> unanalyzed = archiveColorRepository.selectUnanalyzedPaintings();

        System.out.println(">>> 남은 분석 대상: " + (unanalyzed != null ? unanalyzed.size() : 0) + "개");

        if (unanalyzed != null && !unanalyzed.isEmpty()) {
            for (Painting p : unanalyzed) {
                try {
                    // 미분석 그림을 하나씩 Vision API로 분석하고 DB에 저장
                    analyzeAndSavePainting(p.getId(), p.getImgUrl());
                    System.out.println(p.getId() + "번 그림 성공");
                } catch (Exception e) {
                    // 특정 그림 분석 실패해도 나머지 그림은 계속 진행
                    System.err.println(p.getId() + "번 분석 실패: " + e.getMessage());
                }
            }
        }
        
        // 분석이 모두 끝나면, 사용자가 누른 색상의 그림 목록을 반환
        return archiveColorRepository.selectPaintingsByColorId(colorId);
    }

    @Transactional
    public void analyzeAndSavePainting(int paintingId, String imageUrl) throws Exception {
        
        // Vision API를 호출해서 이미지에서 색상 목록(상위 10개)을 추출
        List<PaintingColorMap> analyzedResults = extractColorsFromImage(imageUrl);
        
        // archiveColor 테이블에서 11가지 색상 범위 정보를 가져옴
        List<ArchiveColor> archives = archiveColorRepository.selectAllArchiveColors();

        // score 가중 평균을 계산하기 위한 변수 초기화
        double totalScore = 0;
        double weightedR = 0;
        double weightedG = 0;
        double weightedB = 0;

        // Vision API가 반환한 각 색상에 score를 곱해서 누적
        // score가 높은 색상일수록 평균에 더 많이 반영됨
        for (PaintingColorMap p : analyzedResults) {
            weightedR += p.getRaw_r() * p.getScore();
            weightedG += p.getRaw_g() * p.getScore();
            weightedB += p.getRaw_b() * p.getScore();
            totalScore += p.getScore();
        }

        // 색상이 하나도 없으면 처리 중단
        if (totalScore == 0) return;

        // 가중 평균 RGB 계산 → 그림 전체 분위기를 반영한 대표색
        int avgR = (int) (weightedR / totalScore);
        int avgG = (int) (weightedG / totalScore);
        int avgB = (int) (weightedB / totalScore);

        // 평균 RGB로 PaintingColorMap 객체 생성
        PaintingColorMap dominant = PaintingColorMap.builder()
                .raw_r(avgR)
                .raw_g(avgG)
                .raw_b(avgB)
                .score((float) (totalScore / analyzedResults.size()))
                .build();

        // 평균색을 11가지 색상 중 가장 가까운 색상 id로 변환
        int matchedId = getBestMatchedColorId(dominant, archives);

        System.out.println("paintingId=" + paintingId
            + " | avgR=" + avgR
            + ", avgG=" + avgG
            + ", avgB=" + avgB
            + " | → colorId(" + matchedId + ")");

        // DB에 저장할 수 있도록 paintingId와 색상id 세팅
        dominant.setPaintingId(paintingId);
        dominant.setArchiveColorId(matchedId);
        
        // painting_color_map 테이블에 1행 insert
        archiveColorRepository.insertPaintingColorMap(dominant);
    }

    // 핵심 로직: 평균색을 11가지 색상 중 하나로 분류
    private int getBestMatchedColorId(PaintingColorMap data, List<ArchiveColor> archives) {
        int bestMatchedId = -1;
        double minDistance = Double.MAX_VALUE; // 비교 기준값, 처음엔 최대로 설정

        int r1 = data.getRaw_r();
        int g1 = data.getRaw_g();
        int b1 = data.getRaw_b();

        for (ArchiveColor c : archives) {

            // [1단계: 전제조건 필터]
            // 물리적으로 말이 안 되는 색상은 후보에서 제외
            // 이 필터 없으면 베이지가 Blue로 분류되는 오류 발생

            // Blue: B가 R,G보다 10 이상 높아야 파란색 (하늘색 포함)
            if (c.getId() == 5 && !(b1 > r1 + 10 && b1 > g1 + 10)) {
                continue;
            }
            // Green: G가 R보다 15 이상 높아야 초록색
            if (c.getId() == 4 && !(g1 > r1 + 15)) {
                continue;
            }
            // Red: R이 G,B보다 30 이상 높아야 빨간색
            if (c.getId() == 1 && !(r1 > g1 + 30 && r1 > b1 + 30)) {
                continue;
            }
            // Orange: R이 높고 G가 중간, B는 낮아야 주황색
            if (c.getId() == 2 && !(r1 > 150 && g1 > 80 && b1 < 120)) {
                continue;
            }
            // Yellow: R,G 모두 높고 B가 낮아야 노란색
            if (c.getId() == 3 && !(r1 > 150 && g1 > 150 && b1 < 130)) {
                continue;
            }
            // Navy: 전체적으로 어둡고 B가 R,G보다 높아야 남색
            if (c.getId() == 6 && !(b1 > r1 && b1 > g1 && r1 < 100)) {
                continue;
            }
            // Purple: B가 G보다 5 이상 높고 R도 어느정도 있어야 보라색
            if (c.getId() == 7 && !(b1 > g1 + 5 && r1 > 60 && g1 < 130)) {
                continue;
            }
            // Brown: B가 R보다 10 이상 높으면 제외 (파랑/보라 계열 빼앗지 않도록)
            if (c.getId() == 11 && b1 > r1 + 10) {
                continue;
            }
            // Pink: R이 압도적으로 높고 G,B는 중간 이상이어야 분홍색
            if (c.getId() == 8 && !(r1 > 180 && g1 > 80 && b1 > 100 && r1 > g1 + 20)) {
                continue;
            }
            // Black: R,G,B 모두 55 미만이어야 검정색
            if (c.getId() == 9 && !(r1 < 80 && g1 < 80 && b1 < 80)) {
                continue;
            }
            // White: R,G,B 모두 충분히 밝아야 흰색
            if (c.getId() == 10 && !(r1 > 150 && g1 > 140 && b1 > 120)) {
                continue;
            }

            // [2단계: 범위 거리 계산]
            // 픽셀이 색상 범위 안에 있으면 거리 0, 밖이면 얼마나 벗어났는지 측정
            double dr = Math.max(0, Math.max(c.getMin_r() - r1, r1 - c.getMax_r()));
            double dg = Math.max(0, Math.max(c.getMin_g() - g1, g1 - c.getMax_g()));
            double db = Math.max(0, Math.max(c.getMin_b() - b1, b1 - c.getMax_b()));

            // 가중 유클리드 거리 계산 (G에 4배, R에 3배, B에 2배 - 사람 눈의 색 민감도 반영)
            double distance = Math.sqrt(3 * Math.pow(dr, 2) + 4 * Math.pow(dg, 2) + 2 * Math.pow(db, 2));

            // 지금까지 중 가장 가까운 색상이면 갱신
            if (distance < minDistance) {
                minDistance = distance;
                bestMatchedId = c.getId();
            }
        }
        
        // 모든 색상이 전제조건에서 탈락해서 후보가 없으면 White로 분류 (DB 오류 방지)
        if (bestMatchedId == -1) {
            bestMatchedId = 10;
        }

        return bestMatchedId;
    }

    private List<PaintingColorMap> extractColorsFromImage(String imageUrl) throws Exception {
        List<PaintingColorMap> results = new ArrayList<>();

        // 로컬 파일 경로 조합
        String baseDir = "C:\\jje_work\\sts-5.0.1.RELEASE-workspace\\docentNote\\frontend\\public";
        String fullPath = baseDir + imageUrl.replace("/", "\\");

        File imgFile = new File(fullPath);
        if (!imgFile.exists()) {
            throw new Exception("파일 경로 없음: " + fullPath);
        }

        try (FileInputStream fis = new FileInputStream(imgFile)) {
            
            // 이미지 파일을 바이트로 읽어서 Vision API 요청 객체 생성
            ByteString imgBytes = ByteString.readFrom(fis);
            Image img = Image.newBuilder().setContent(imgBytes).build();
            
            // IMAGE_PROPERTIES 기능 요청 (지배색 추출)
            Feature feat = Feature.newBuilder().setType(Feature.Type.IMAGE_PROPERTIES).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();

            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
                BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);

                for (AnnotateImageResponse res : response.getResponsesList()) {
                    if (res.hasError())
                        throw new Exception(res.getError().getMessage());

                    // Vision API가 반환한 지배색 목록 가져오기
                    DominantColorsAnnotation colors = res.getImagePropertiesAnnotation().getDominantColors();
                    List<ColorInfo> colorList = colors.getColorsList();

                    // 상위 10개만 사용 (score 필터 없이 전부 담아서 가중 평균에 활용)
                    int limit = Math.min(colorList.size(), 10);
                    for (int i = 0; i < limit; i++) {
                        ColorInfo color = colorList.get(i);
                        results.add(PaintingColorMap.builder()
                                .raw_r((int) color.getColor().getRed())
                                .raw_g((int) color.getColor().getGreen())
                                .raw_b((int) color.getColor().getBlue())
                                .score(color.getScore())
                                .build());
                    }
                }
            }
        }
        return results;
    }

    // 색상 버튼 목록 표시용 - archiveColor 테이블 전체 조회
    public List<ArchiveColor> getAllColors() {
        return archiveColorRepository.selectAllArchiveColors();
    }
}