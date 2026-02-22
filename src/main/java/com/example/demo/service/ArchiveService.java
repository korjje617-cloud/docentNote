package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.vo.Painting;
import com.example.demo.repository.ArchiveRepository;
import com.example.demo.vo.ArchiveColor;
import com.example.demo.vo.PaintingColorMap;
import com.google.cloud.vision.v1.ColorInfo; // 구글 API 색상 정보 클래스

@Service
public class ArchiveService {

	@Autowired
	private ArchiveRepository archiveRepository;

	@Autowired
	private ColorAnalysisService colorAnalysisService; // 구글 비전 API 호출 전용 서비스

	// ==========================================
	// 1. 기존 조회 로직 (React 전달용)
	// ==========================================

	// 전체 그림 목록을 가져옴
	public List<Painting> getPaintings() {
		return archiveRepository.getPaintings();
	}

	// 특정 미술 사조의 그림들을 확인하고 가져옴
	public List<Painting> getByMovementId(int id) {
		return archiveRepository.getByMovementId(id);
	}

	// 특정 화가의 그림들을 확인하고 가져옴
	public List<Painting> getByPainterId(int id) {
		return archiveRepository.getByPainterId(id);
	}

	// 색상 카테고리 이름으로 매칭된 그림들을 확인하고 가져옴
	public List<Painting> getByColorName(String colorName) {
		return archiveRepository.getByColorName(colorName);
	}

	// ==========================================
	// 2. 새로운 색상 분석 및 분류 로직 (Batch 처리용)
	// ==========================================

	// [수정된 핵심 로직]
	public void classifyExistingPaintings() {
		// 1. 분석 대상을 한 번에 가져옴
		List<Painting> targets = archiveRepository.getPaintingsToAnalyze();

		// ⚠️ [중요 수정] 색상 카테고리 기준은 반복문 밖에서 '딱 한 번만' 가져옴 설정
		// 이전 로직은 findMatchColorId 안에서 매번 DB를 호출해서 커넥션 오류가 났던 것임
		List<ArchiveColor> categories = archiveRepository.getArchiveColorCategories();

		System.out.println("분석 시작 - 총 대상: " + targets.size() + "건");

		for (Painting p : targets) {
			try {
				// 2. 구글 비전 API로 색상 확인
				List<ColorInfo> extracted = colorAnalysisService.extractColors(p.getImgPath());

				if (extracted != null && !extracted.isEmpty()) {
					ColorInfo top = extracted.get(0);
					int r = (int) top.getColor().getRed();
					int g = (int) top.getColor().getGreen();
					int b = (int) top.getColor().getBlue();

					// 3. 미리 가져온 categories 리스트를 전달하여 확인 (DB 호출 X)
					Integer categoryId = findMatchColorId(categories, r, g, b);

					// 4. 저장할 객체 생성 및 설정
					PaintingColorMap map = PaintingColorMap.builder().paintingId(p.getId()).archiveColorId(categoryId)
							.raw_r(r).raw_g(g).raw_b(b).score(top.getScore()).build();

					// 5. 결과 저장
					archiveRepository.insertColorMap(map);
					System.out.println("✅ [" + p.getPaintingNameKr() + "] 분석 완료 (ID: " + categoryId + ")");
				}
			} catch (Exception e) {
				// ⚠️ [중요 수정] 에러 발생 시 콘솔 도배 방지를 위해 즉시 멈춤 설정
				System.err.println("❌ " + p.getId() + "번 분석 중 치명적 오류: " + e.getMessage());
				e.printStackTrace();
				// break; // 에러 나면 더 이상 진행하지 않고 멈춤
			}
		}
	}

	// 매개변수로 카테고리 리스트를 직접 받아서 확인하도록 수정
	private Integer findMatchColorId(List<ArchiveColor> categories, int r, int g, int b) {
		for (ArchiveColor color : categories) {
			if (r >= color.getMin_r() && r <= color.getMax_r() && g >= color.getMin_g() && g <= color.getMax_g()
					&& b >= color.getMin_b() && b <= color.getMax_b()) {
				return color.getId();
			}
		}
		return null;
	}
}
