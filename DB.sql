INSERT INTO `Movement` (`moveNameEn`, `moveNameKr`) VALUES 
('Art Nouveau', '아르누보'),
('Baroque', '바로크'),
('Illustration', '일러스트'),
('Impressionism', '인상주의'),
('Post-Impressionism', '탈인상주의'),
('Realism', '리얼리즘'),
('Renaissance', '르네상스'),
('Rococo', '로코코'),
('Romanticism', '낭만주의');

INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Jules Chéret', '쥘 셰레', 1, 'France', NOW(), NOW()),
('Gustav Klimt', '구스타프 클림트', 1, 'Austria', NOW(), NOW()),
('Berthon Livemont', '베르통 리브몽', 1, 'Belgium', NOW(), NOW()),
('Henri Meunier', '앙리 뫼니에', 1, 'Belgium', NOW(), NOW()),
('Alphonse Mucha', '알폰스 무하', 1, 'Czech', NOW(), NOW()),
('Kay Nielsen', '케이 닐슨', 1, 'Denmark', NOW(), NOW());

-- 널널하게 보정된 색상 데이터 입력 (저장)
INSERT INTO `archiveColor` (`colorName`, `min_r`, `max_r`, `min_g`, `max_g`, `min_b`, `max_b`, `regDate`) VALUES 
('Red', 120, 255, 0, 120, 0, 120, NOW()),      -- 빨강 (범위 하향)
('Orange', 180, 255, 80, 180, 0, 120, NOW()),   -- 주황
('Yellow', 180, 255, 160, 255, 0, 160, NOW()),  -- 노랑 (녹색기 도는 노랑 포함)
('Green', 0, 180, 80, 255, 0, 180, NOW()),     -- 초록
('Blue', 0, 180, 0, 200, 140, 255, NOW()),     -- 파랑
('Navy', 0, 100, 0, 100, 60, 200, NOW()),      -- 남색
('Purple', 80, 220, 0, 120, 130, 255, NOW()),   -- 보라
('Pink', 180, 255, 80, 220, 130, 255, NOW()),   -- 분홍
('Black', 0, 70, 0, 70, 0, 70, NOW()),         -- 검정 (기준 상향)
('White', 180, 255, 180, 255, 180, 255, NOW()), -- 하양 (회색빛 하양까지 포함)
('Brown', 50, 200, 20, 160, 0, 120, NOW());     -- 갈색 (매우 넓게 설정)


-- 1. 쥘 셰레 (Jules Chéret, painterId: 1)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Cheret Artwork ', n), CONCAT('쥘 셰레 작품 ', n), 1, 1, 1890, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Cheret\\cheret_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;

-- 2. 구스타프 클림트 (Gustav Klimt, painterId: 2)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Klimt Artwork ', n), CONCAT('구스타프 클림트 작품 ', n), 2, 1, 1905, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Klimt\\klimt_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;

-- 3. 베르통 리브몽 (Berthon Livemont, painterId: 3)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Livemont Artwork ', n), CONCAT('베르통 리브몽 작품 ', n), 3, 1, 1896, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Livemont\\livemont_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;

-- 4. 앙리 뫼니에 (Henri Meunier, painterId: 4)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Meunier Artwork ', n), CONCAT('앙리 뫼니에 작품 ', n), 4, 1, 1898, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Meunier\\meunier_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;

-- 5. 알폰스 무하 (Alphonse Mucha, painterId: 5)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Mucha Artwork ', n), CONCAT('알폰스 무하 작품 ', n), 5, 1, 1895, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Mucha\\mucha_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;

-- 6. 케이 닐슨 (Kay Nielsen, painterId: 6)
INSERT INTO `painting` (`paintingNameEn`, `paintingNameKr`, `painterId`, `movementId`, `createYear`, `imgPath`, `regDate`, `updateDate`)
SELECT CONCAT('Nielsen Artwork ', n), CONCAT('케이 닐슨 작품 ', n), 6, 1, 1914, 
CONCAT('C:\\jje_works\\sts5.0.1_workspace\\docentNote\\frontend\\public\\crawling_images\\Art_Nouveau\\Nielsen_K\\nielsen_k_', n, '.jpg'), NOW(), NOW()
FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19) AS numbers;