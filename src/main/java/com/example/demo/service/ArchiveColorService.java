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
					System.out.println(p.getId() + "번 그림 성공");
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

		// score 내림차순 정렬
		analyzedResults.sort(Comparator.comparingDouble(PaintingColorMap::getScore).reversed());

		PaintingColorMap dominant = null;
		int matchedId = -1;

		for (PaintingColorMap candidate : analyzedResults) {
			int candidateMatchedId = getBestMatchedColorId(candidate, archives);

			// White(10), Brown(11)이 아닌 색상이 나오면 그걸로 확정
			if (candidateMatchedId != 10 && candidateMatchedId != 11) {
				dominant = candidate;
				matchedId = candidateMatchedId;
				break;
			}

			// 아직 dominant가 없으면 일단 1위로 설정
			if (dominant == null) {
				dominant = candidate;
				matchedId = candidateMatchedId;
			}
		}

		if (dominant == null)
			return;

		System.out.println("paintingId=" + paintingId + " | R=" + dominant.getRaw_r() + ", G=" + dominant.getRaw_g()
				+ ", B=" + dominant.getRaw_b() + " | score=" + dominant.getScore() + " | → colorId(" + matchedId + ")");

		dominant.setPaintingId(paintingId);
		dominant.setArchiveColorId(matchedId);
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

			// Blue: B가 R,G보다 10 이상 높아야 함 (하늘색 포함)
			if (c.getId() == 5 && !(b1 > r1 + 10 && b1 > g1 + 10)) {
				continue;
			}
			// Green: G가 R보다 15 이상 높아야 함
			if (c.getId() == 4 && !(g1 > r1 + 15)) {
				continue;
			}
			// Red: R이 G,B보다 30 이상 높아야 함
			if (c.getId() == 1 && !(r1 > g1 + 30 && r1 > b1 + 30)) {
				continue;
			}
			// Orange: R이 높고 G가 중간, B는 낮아야 함
			if (c.getId() == 2 && !(r1 > 150 && g1 > 80 && b1 < 120)) {
				continue;
			}
			// Yellow: R,G 모두 높고 B는 낮아야 함
			if (c.getId() == 3 && !(r1 > 150 && g1 > 150 && b1 < 130)) {
				continue;
			}
			// Navy: 전체적으로 어둡고 B가 R,G보다 높아야 함
			if (c.getId() == 6 && !(b1 > r1 && b1 > g1 && r1 < 100)) {
				continue;
			}
			// Purple: B가 R,G보다 높고 R도 어느정도 있으면 허용 (조건 완화)
			if (c.getId() == 7 && !(b1 > g1 + 5 && r1 > 60 && g1 < 130)) {
				continue;
			}
			// Brown: B가 너무 높으면 제외 (보라/파랑 계열 빼앗지 않도록)
			if (c.getId() == 11 && b1 > r1 + 10) {
				continue;
			}
			// Pink: R이 압도적으로 높고 G,B는 중간 이상
			if (c.getId() == 8 && !(r1 > 180 && g1 > 80 && b1 > 100 && r1 > g1 + 20)) {
				continue;
			}
			// Black: 전체적으로 어두워야 함
			if (c.getId() == 9 && !(r1 < 80 && g1 < 80 && b1 < 80)) {
				continue;
			}
			// White: 전체적으로 밝아야 함
			if (c.getId() == 10 && !(r1 > 150 && g1 > 140 && b1 > 120)) {
				continue;
			}

			double dr = Math.max(0, Math.max(c.getMin_r() - r1, r1 - c.getMax_r()));
			double dg = Math.max(0, Math.max(c.getMin_g() - g1, g1 - c.getMax_g()));
			double db = Math.max(0, Math.max(c.getMin_b() - b1, b1 - c.getMax_b()));

			double distance = Math.sqrt(3 * Math.pow(dr, 2) + 4 * Math.pow(dg, 2) + 2 * Math.pow(db, 2));

			if (distance < minDistance) {
				minDistance = distance;
				bestMatchedId = c.getId();
			}

		}
		// 전부 다 맞는게 없으면 White 로 이동
		if (bestMatchedId == -1) {
			bestMatchedId = 10;
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
					if (res.hasError())
						throw new Exception(res.getError().getMessage());

					DominantColorsAnnotation colors = res.getImagePropertiesAnnotation().getDominantColors();
					List<ColorInfo> colorList = colors.getColorsList();

					// score 필터 제거 - 전체 색상을 다 담아두고 max(score)로 뽑음
					int limit = Math.min(colorList.size(), 10);
					for (int i = 0; i < limit; i++) {
						ColorInfo color = colorList.get(i);
						results.add(PaintingColorMap.builder().raw_r((int) color.getColor().getRed())
								.raw_g((int) color.getColor().getGreen()).raw_b((int) color.getColor().getBlue())
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