package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.repository.DocentRepository;
import com.example.demo.vo.Docent;
import com.example.demo.vo.Painting;

@Service // 서비스 선언
public class DocentService {

    @Autowired // 리포지토리 주입
    private DocentRepository docentRepository;

    @Autowired // GPT 서비스 주입
    private GptService gptService;

    public Docent getOrCreateDocent(Painting painting) {
        // DB에 이미 저장된 도슨트가 있는지 조회함
        Docent docent = docentRepository.findByPaintingId(painting.getId());
        
        // 만약 도슨트 데이터가 없다면?
        if (docent == null) {
            // 여기서 프롬프트를 정의
        	String prompt = String.format(
                    "너는 서양화 도슨트야. 화가 %s의 '%s' 작품에 대한 도슨트 글을 작성해줘. " +
                    "**인사말이나 부연 설명 없는 존댓말로 3문단 이내로 요약**해서 바로 출력해줘. " +
                    "**각 문단**은 공백 포함 **300자 미만**이야.",
                    painting.getPainterNameKr(), 
                    painting.getPaintingNameKr()
                );

            // 완성된 프롬프트를 GptService에 던짐
            String gptContent = gptService.askGpt(prompt);

            // 객체 생성 및 저장
            docent = Docent.builder()
                    .paintingId(painting.getId())
                    .body(gptContent)
                    .build();

            docentRepository.save(docent);
        }

        return docent;
    }
}