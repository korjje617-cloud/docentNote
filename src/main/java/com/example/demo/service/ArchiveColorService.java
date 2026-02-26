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

    public List<Painting> getPaintingsByColorId(int colorId) {
        // 분석이 안 된 그림 목록 가져오기
        List<Painting> unanalyzed = archiveColorRepository.selectUnanalyzedPaintings();
        
        System.out.println(">>> 남은 분석 대상: " + (unanalyzed != null ? unanalyzed.size() : 0) + "개");

        if (unanalyzed != null && !unanalyzed.isEmpty()) {
            for (Painting p : unanalyzed) {
                try {
                    // 그림 하나씩 분석을 시작
                    analyzeAndSavePainting(p.getId(), p.getImgUrl());
                    System.out.println(p.getId() + "번 그림 성공!");
                } catch (Exception e) {
                    System.err.println(p.getId() + "번 분석 실패: " + e.getMessage());
                }
            }
        }
        // 분석이 모두 끝나면, 사용자가 누른 색상의 그림들을 화면에 보여준다
        return archiveColorRepository.selectPaintingsByColorId(colorId);
    }

    @Transactional
    public void analyzeAndSavePainting(int paintingId, String imageUrl) throws Exception {
        List<PaintingColorMap> analyzedResults = extractColorsFromImage(imageUrl);
        List<ArchiveColor> archives = archiveColorRepository.selectAllArchiveColors();

        // score가 가장 높은 색상 하나만 뽑기
        PaintingColorMap dominant = analyzedResults.stream()
                .max(Comparator.comparingDouble(PaintingColorMap::getScore))
                .orElse(null);

        if (dominant == null) return;
        
        // 로그 추가
        System.out.println("paintingId=" + paintingId 
            + " | R=" + dominant.getRaw_r() 
            + ", G=" + dominant.getRaw_g() 
            + ", B=" + dominant.getRaw_b() 
            + " | score=" + dominant.getScore());

        int matchedId = getBestMatchedColorId(dominant, archives);
        dominant.setPaintingId(paintingId);
        dominant.setArchiveColorId(matchedId);

        // insert 한 번만
        archiveColorRepository.insertPaintingColorMap(dominant);
    }

    // 핵심 로직: 가장 어울리는 색상 찾기 (가중 유클리드 거리 알고리즘)
    private int getBestMatchedColorId(PaintingColorMap data, List<ArchiveColor> archives) {
        int bestMatchedId = -1;
        double minDistance = Double.MAX_VALUE;

        int r1 = data.getRaw_r();
        int g1 = data.getRaw_g();
        int b1 = data.getRaw_b();

        for (ArchiveColor c : archives) {
            // midpoint 대신, 범위 내에서 가장 가까운 점까지의 거리를 잰다
            // 범위 안에 있으면 해당 채널 거리 = 0
            double dr = Math.max(0, Math.max(c.getMin_r() - r1, r1 - c.getMax_r()));
            double dg = Math.max(0, Math.max(c.getMin_g() - g1, g1 - c.getMax_g()));
            double db = Math.max(0, Math.max(c.getMin_b() - g1, b1 - c.getMax_b())); // b1 수정

            double distance = Math.sqrt(
                3 * Math.pow(dr, 2) +
                4 * Math.pow(dg, 2) +
                2 * Math.pow(db, 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                bestMatchedId = c.getId();
            }
        }
        return bestMatchedId;
    }

    private List<PaintingColorMap> extractColorsFromImage(String imageUrl) throws Exception {
        List<PaintingColorMap> results = new ArrayList<>();

        String baseDir = "C:\\jje_work\\sts-5.0.1.RELEASE-workspace\\docentNote\\frontend\\public";
        String fullPath = baseDir + imageUrl.replace("/", "\\");

        File imgFile = new File(fullPath);
        if (!imgFile.exists()) {
            throw new Exception("파일 경로 없음: " + fullPath);
        }

        try (FileInputStream fis = new FileInputStream(imgFile)) {
            ByteString imgBytes = ByteString.readFrom(fis);
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature feat = Feature.newBuilder().setType(Feature.Type.IMAGE_PROPERTIES).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();

            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
                BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);

                for (AnnotateImageResponse res : response.getResponsesList()) {
                    if (res.hasError()) throw new Exception(res.getError().getMessage());

                    DominantColorsAnnotation colors = res.getImagePropertiesAnnotation().getDominantColors();
                    List<ColorInfo> colorList = colors.getColorsList();

                    // score 필터 제거 - 전체 색상을 다 담아두고 max(score)로 뽑음
                    int limit = Math.min(colorList.size(), 10);
                    for (int i = 0; i < limit; i++) {
                        ColorInfo color = colorList.get(i);
                        results.add(PaintingColorMap.builder()
                                .raw_r((int) color.getColor().getRed())
                                .raw_g((int) color.getColor().getGreen())
                                .raw_b((int) color.getColor().getBlue())
                                .score(color.getScore()).build());
                    }
                }
            }
        }
        return results;
    }

    public List<ArchiveColor> getAllColors() {
        return archiveColorRepository.selectAllArchiveColors();
    }
}