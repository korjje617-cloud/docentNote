package com.example.demo.service;


import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.ColorInfo;
import com.google.cloud.vision.v1.DominantColorsAnnotation;
import com.google.cloud.vision.v1.Feature;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class ColorAnalysisService {

    // 이미지 경로를 받아 구글 API로 색상을 분석하고 리스트를 가져옴
    public List<ColorInfo> extractColors(String filePath) throws Exception {
        
        List<AnnotateImageRequest> requests = new ArrayList<>();

        // 1. 이미지 파일을 읽어와서 바이트 데이터로 변환 (가져옴)
        Path path = Paths.get(filePath);
        byte[] data = Files.readAllBytes(path);
        ByteString imgBytes = ByteString.copyFrom(data);

        // 2. 구글 API에 보낼 이미지 객체 생성
        Image img = Image.newBuilder().setContent(imgBytes).build();
        
        // 3. 분석할 기능(색상 검출)을 설정 (설정)
        Feature feat = Feature.newBuilder().setType(Feature.Type.IMAGE_PROPERTIES).build();
        
        // 4. 요청서 작성 (생성)
        AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                .addFeatures(feat)
                .setImage(img)
                .build();
        requests.add(request);

        // 5. 구글 비전 API 클라이언트를 통해 분석 실행 (확인)
        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    throw new Exception("구글 API 오류: " + res.getError().getMessage());
                }

                // 6. 이미지의 지배적인 색상(Dominant Colors) 정보를 가져옴 (가져옴)
                DominantColorsAnnotation colors = res.getImagePropertiesAnnotation().getDominantColors();
                
                // 분석된 색상 리스트를 반환
                return colors.getColorsList();
            }
        }
        return new ArrayList<>();
    }
}