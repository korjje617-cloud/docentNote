DROP DATABASE IF EXISTS `docentNote`;
CREATE DATABASE `docentNote`;
USE `docentNote`;

CREATE TABLE `member` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `loginId` VARCHAR(20) NOT NULL,
  `loginPw` VARCHAR(100) NOT NULL,
  `authLevel` TINYINT NOT NULL DEFAULT 3,
  `name` VARCHAR(20) NOT NULL,
  `nickName` VARCHAR(20) NOT NULL,
  `birthDay` DATE NOT NULL,
  `cellPhone` VARCHAR(254) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `delStatus` TINYINT(1) NOT NULL DEFAULT 0,
  `delDate` DATETIME,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `board` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(20) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `delStatus` TINYINT NOT NULL DEFAULT 0,
  `delDate` DATE,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `article` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `memberId` INT NOT NULL,
  `boardId` INT NOT NULL,
  `hits` INT NOT NULL DEFAULT 0,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `comment` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `memberId` INT NOT NULL,
  `relTypeCode` VARCHAR(20) NOT NULL,
  `relId` INT NOT NULL,
  `body` TEXT NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `reaction` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `relTypeCode` VARCHAR(20) NOT NULL,
  `relId` INT NOT NULL,
  `memberId` INT NOT NULL,
  `point` TINYINT NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `painting` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `paintingNameEn` VARCHAR(100) NOT NULL,
  `paintingNameKr` VARCHAR(100) NOT NULL,
  `painterId` INT NOT NULL,
  `movementId` INT NOT NULL,
  `createYear` INT NOT NULL,
  `imgPath` VARCHAR(500) NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `painter` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `painterNameEn` VARCHAR(100) NOT NULL,
  `painterNameKr` VARCHAR(100) NOT NULL,
  `movementId` INT NOT NULL,
  `nationality` VARCHAR(100) NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `Movement` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `moveNameEn` VARCHAR(100) NOT NULL,
  `moveNameKr` VARCHAR(100) NOT NULL
);

CREATE TABLE `archiveMove` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `movementId` INT NOT NULL,
  `description` TEXT NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `archivePainter` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `painterId` INT NOT NULL,
  `painterNameEn` VARCHAR(100) NOT NULL,
  `painterNameKr` VARCHAR(100) NOT NULL,
  `movementId` INT NOT NULL,
  `regDate` DATETIME NOT NULL,
  `updateDate` DATETIME NOT NULL
);

CREATE TABLE `painting_like` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `memberId` INT NOT NULL,
  `paintingId` INT NOT NULL,
  `regDate` DATETIME NOT NULL
);

CREATE TABLE `archiveColor` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `colorName` VARCHAR(50) UNIQUE NOT NULL COMMENT '예: Red, Deep Blue',
  `min_r` INT NOT NULL,
  `max_r` INT NOT NULL,
  `min_g` INT NOT NULL,
  `max_g` INT NOT NULL,
  `min_b` INT NOT NULL,
  `max_b` INT NOT NULL,
  `regDate` DATETIME NOT NULL
);

CREATE TABLE `painting_color_map` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `regDate` DATETIME DEFAULT NOW(),
  `paintingId` INT NOT NULL,
  `archiveColorId` INT COMMENT '매칭된 사전 색상 ID',
  `raw_r` INT NOT NULL COMMENT 'API가 추출한 실제 R값',
  `raw_g` INT NOT NULL COMMENT 'API가 추출한 실제 G값',
  `raw_b` INT NOT NULL COMMENT 'API가 추출한 실제 B값',
  `score` FLOAT COMMENT '색상 비중 (0~1)'
);

ALTER TABLE `article` ADD FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

ALTER TABLE `article` ADD FOREIGN KEY (`boardId`) REFERENCES `board` (`id`);

ALTER TABLE `comment` ADD FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

ALTER TABLE `reaction` ADD FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

ALTER TABLE `comment` ADD FOREIGN KEY (`relId`) REFERENCES `article` (`id`);

ALTER TABLE `reaction` ADD FOREIGN KEY (`relId`) REFERENCES `article` (`id`);

ALTER TABLE `painting` ADD FOREIGN KEY (`painterId`) REFERENCES `painter` (`id`);

ALTER TABLE `painting` ADD FOREIGN KEY (`movementId`) REFERENCES `Movement` (`id`);

ALTER TABLE `painter` ADD FOREIGN KEY (`movementId`) REFERENCES `Movement` (`id`);

ALTER TABLE `archiveMove` ADD FOREIGN KEY (`movementId`) REFERENCES `Movement` (`id`);

ALTER TABLE `archivePainter` ADD FOREIGN KEY (`painterId`) REFERENCES `painter` (`id`);

ALTER TABLE `archivePainter` ADD FOREIGN KEY (`movementId`) REFERENCES `Movement` (`id`);

ALTER TABLE `painting_like` ADD FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

ALTER TABLE `painting_like` ADD FOREIGN KEY (`paintingId`) REFERENCES `painting` (`id`);

ALTER TABLE `painting_color_map` ADD FOREIGN KEY (`paintingId`) REFERENCES `painting` (`id`);

ALTER TABLE `painting_color_map` ADD FOREIGN KEY (`archiveColorId`) REFERENCES `archiveColor` (`id`);

---

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