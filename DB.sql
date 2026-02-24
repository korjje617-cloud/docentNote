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
  `paintingNameEn` VARCHAR(255) NOT NULL,
  `paintingNameKr` VARCHAR(100) NOT NULL,
  `painterId` INT NOT NULL,
  `movementId` INT NOT NULL,
  `imgUrl` VARCHAR(500) NOT NULL,
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

CREATE TABLE `docent` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `paintingId` INT UNIQUE NOT NULL COMMENT '작품 하나당 도슨트 하나 (1:1)',
  `body` LONGTEXT NOT NULL COMMENT 'GPT가 생성한 긴 도슨트 내용',
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
  `colorName` VARCHAR(50) UNIQUE NOT NULL,
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
  `paintingId` INT NOT NULL,
  `archiveColorId` INT,
  `raw_r` INT NOT NULL,
  `raw_g` INT NOT NULL,
  `raw_b` INT NOT NULL,
  `score` FLOAT
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

ALTER TABLE `painting` ADD FOREIGN KEY (`id`) REFERENCES `docent` (`paintingId`);

ALTER TABLE `painting_like` ADD FOREIGN KEY (`memberId`) REFERENCES `member` (`id`);

ALTER TABLE `painting_like` ADD FOREIGN KEY (`paintingId`) REFERENCES `painting` (`id`);

ALTER TABLE `painting_color_map` ADD FOREIGN KEY (`paintingId`) REFERENCES `painting` (`id`);

ALTER TABLE `painting_color_map` ADD FOREIGN KEY (`archiveColorId`) REFERENCES `archiveColor` (`id`);






-- 미술사조 목록
INSERT INTO `Movement` (`moveNameEn`, `moveNameKr`) VALUES 
('Art Nouveau', '아르누보'),
('Baroque', '바로크'),
('Illustration', '일러스트'),
('Impressionism', '인상주의'),
('Post Impressionism', '탈인상주의'),
('Realism', '리얼리즘'),
('Renaissance', '르네상스'),
('Rococo', '로코코'),
('Romanticism', '낭만주의');

-- 색상 데이터 
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

-- 아르누보 화가 데이터
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Jules Cheret', '쥘 셰레', 1, 'France', NOW(), NOW()),
('Gustav Klimt', '구스타프 클림트', 1, 'Austria', NOW(), NOW()),
('Berthon Livemont', '베르통 리브몽', 1, 'Belgium', NOW(), NOW()),
('Henri Meunier', '앙리 뫼니에', 1, 'Belgium', NOW(), NOW()),
('Alphonse Mucha', '알폰스 무하', 1, 'Czech', NOW(), NOW()),
('Kay Nielsen', '케이 닐슨', 1, 'Denmark', NOW(), NOW());

-- 바로크 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Jan Brueghel the Elder', '얀 브뤼헐', 2, 'Belgium', NOW(), NOW()),
('Castello Caldei', '카스텔로 칼데이', 2, 'Italy', NOW(), NOW()),
('Gerard van Honthorst', '게라르드 반 혼토르스트', 2, 'Netherlands', NOW(), NOW()),
('Rembrandt Harmenszoon van Rijn', '렘브란트 하르먼손 판레인', 2, 'Netherlands', NOW(), NOW()),
('Diego Velazquez', '디에고 벨라스케스', 2, 'Spain', NOW(), NOW()),
('Johannes Vermeer', '요하네스 베르메르', 2, 'Netherlands', NOW(), NOW());

-- 일러스트 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('J. C. Leyendecker', '조셉 크리스천 레이엔데커', 3, 'USA', NOW(), NOW());

-- 인상주의 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Edgar Degas', '에드가 드가', 4, 'France', NOW(), NOW()),
('Edouard Manet', '에두아르 마네', 4, 'France', NOW(), NOW()),
('Claude Monet', '클로드 모네', 4, 'France', NOW(), NOW()),
('Berthe Morisot', '베르트 모리조', 4, 'France', NOW(), NOW()),
('Camille Pissarro', '카미유 피사로', 4, 'France', NOW(), NOW()),
('Pierre Auguste Renoir', '오귀스트 르누아르', 4, 'France', NOW(), NOW()),
('Joaquin Sorolla', '호아킨 소로야', 4, 'Spain', NOW(), NOW());

-- 탈인상주의 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Paul Cezanne', '폴 세잔', 5, 'France', NOW(), NOW()),
('Vincent van Gogh', '빈센트 반 고흐', 5, 'Netherlands', NOW(), NOW()),
('Gustave Loiseau', '귀스타브 루아조', 5, 'France', NOW(), NOW()),
('Theo van Rysselberghe', '테오 반 뤼셀베르그', 5, 'Belgium', NOW(), NOW()),
('Georges Seurat', '조르주 쇠라', 5, 'France', NOW(), NOW()),
('Henri Le Sidaner', '앙리 르 시다네르', 5, 'France', NOW(), NOW());

-- 리얼리즘 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Gustave Courbet', '귀스타브 쿠르베', 6, 'France', NOW(), NOW()),
('Honore Daumier', '오노레 도미에', 6, 'France', NOW(), NOW()),
('Jean Francois Millet', '장 프랑수아 밀레', 6, 'France', NOW(), NOW()),
('Ilya Repin', '일리아 레핀', 6, 'Russia', NOW(), NOW()),
('Jean Baptiste Robie', '장 바티스트 로비', 6, 'Belgium', NOW(), NOW()),
('Anders Zorn', '안데르스 소른', 6, 'Sweden', NOW(), NOW());

-- 르네상스 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Leonardo da Vinci', '레오나르도 다 빈치', 7, 'Italy', NOW(), NOW()),
('Michelangelo', '미켈란젤로', 7, 'Italy', NOW(), NOW());

-- 로코코 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('Francois Boucher', '프랑수아 부셰', 8, 'France', NOW(), NOW()),
('Canaletto', '지오반니 안토니오 카날', 8, 'Italy', NOW(), NOW()),
('Jean Honore Fragonard', '장 오노레 프라고나르', 8, 'France', NOW(), NOW()),
('Thomas Gainsborough', '토머스 게인즈버러', 8, 'UK', NOW(), NOW()),
('Elisabeth Vigee Le Brun', '엘리자베스 비제 르 브룅', 8, 'France', NOW(), NOW()),
('Giovanni Battista Tiepolo', '조반니 바티스타 티에폴로', 8, 'Italy', NOW(), NOW()),
('Jean Antoine Watteau', '장 앙투안 와토', 8, 'France', NOW(), NOW());

-- 낭만주의 화가
INSERT INTO `painter` (`painterNameEn`, `painterNameKr`, `movementId`, `nationality`, `regDate`, `updateDate`) VALUES 
('John Constable', '존 컨스터블', 9, 'UK', NOW(), NOW()),
('Eugene Delacroix', '외젠 들라쿠르아', 9, 'France', NOW(), NOW()),
('Caspar David Friedrich', '카스파르 다비드 프리드리히', 9, 'Germany', NOW(), NOW()),
('Francisco Goya', '프란시스코 고야', 9, 'Spain', NOW(), NOW()),
('J. M. W. Turner', '조셉 말로드 윌리엄 터너', 9, 'UK', NOW(), NOW());