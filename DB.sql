DROP DATABASE IF EXISTS `docentNote`;
CREATE DATABASE `docentNote`;
USE `docentNote`;

# 게시글 테이블 생성
CREATE TABLE article (
	 id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	 regDate DATETIME NOT NULL,
	 updateDate DATETIME NOT NULL,
	 memberId INT(10) UNSIGNED NOT NULL,
	 hitCount INT(10) UNSIGNED NOT NULL DEFAULT 0,
	 likeCount INT(10) UNSIGNED NOT NULL DEFAULT 0,
	 dislikeCount INT(10) UNSIGNED NOT NULL DEFAULT 0,
	 boardId INT(10) NOT NULL,
	 title CHAR(100) NOT NULL,
	 `body` TEXT NOT NULL
);

# 회원 테이블 생성
CREATE TABLE `member` (
	 id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	 regDate DATETIME NOT NULL,
	 updateDate DATETIME NOT NULL,
	 loginId CHAR(30) NOT NULL,
	 loginPw CHAR(100) NOT NULL,
	 `authLevel` SMALLINT(2) UNSIGNED DEFAULT 3 COMMENT '권한 레벨 (3=일반,7=관리자)',
	 `name` CHAR(20) NOT NULL,
	 nickname CHAR(20) NOT NULL,
	 cellphoneNum CHAR(20) NOT NULL,
	 email CHAR(20) NOT NULL,
	 delStatus TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '탈퇴 여부 (0=탈퇴 전, 1=탈퇴 후)',
	 delDate DATETIME COMMENT '탈퇴 날짜'
);


# 게시판(board) 테이블 생성
CREATE TABLE board (
	 id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	 regDate DATETIME NOT NULL,
	 updateDate DATETIME NOT NULL,`docentNote`
	 `code` CHAR(50) NOT NULL UNIQUE COMMENT 'notice(공지사항) free(자유) QnA(질의응답)...',
	 `name` CHAR(20) NOT NULL UNIQUE COMMENT '게시판 이름',
	 delStatus TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '삭제 여부 (0=삭제 전, 1=삭제 후)',
	 delDate DATETIME COMMENT '삭제 날짜'
);

# 좋아요 싫어요 테이블 생성
CREATE TABLE reactionPoint (
	 id INT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	 regDate DATETIME NOT NULL,
	 updateDate DATETIME NOT NULL,
	 memberId INT(10), UNSIGNED NOT NULL,
	 relTypeCode CHAR(50) NOT NULL COMMENT '관련 데이터 타입 코드',
	 relId INT(10) NOT NULL COMMENT '관련 데이터 번호',
	 `point` INT(10) NOT NULL
);

# 게시판 TD
INSERT INTO board
SET regDate = NOW(),
updateDate = NOW(),
`code` = 'notice',
`name` = '공지사항';

INSERT INTO board
SET regDate = NOW(),
updateDate = NOW(),
`code` = 'free',
`name` = '자유';

INSERT INTO board
SET regDate = NOW(),
updateDate = NOW(),
`code` = 'QnA',
`name` = '질의응답';


# 게시글 TD
INSERT INTO article
SET regDate = NOW(),
updateDate = NOW(),
memberId = 1,
boardId = 1,
title = '공지사항',
`body` = '공지사항';

INSERT INTO article
SET regDate = NOW(),
updateDate = NOW(),
memberId = 2,
boardId = 2,
title = '자유',
`body` = '자유';

INSERT INTO article
SET regDate = NOW(),
updateDate = NOW(),
memberId = 3,
boardId = 3,
title = '질의응답',
`body` = '질의응답';


# 회원 TD
INSERT INTO `member`
SET regDate = NOW(),
updateDate = NOW(),
loginId = 'admin',
loginPw = 'admin',
`authLevel` = 7,
`name` = '관리자',
nickname = '관리자_별명',
cellphoneNum = '01012341234',
email = 'abc@gmail.com';

INSERT INTO `member`
SET regDate = NOW(),
updateDate = NOW(),
loginId = 'test1',
loginPw = 'test1',
`name` = '회원1',
nickname = '회원1_별명',
cellphoneNum = '01043214321',
email = 'abcd@gmail.com';

INSERT INTO `member`
SET regDate = NOW(),
updateDate = NOW(),
loginId = 'test2',
loginPw = 'test2',
`name` = '회원2',
nickname = '회원2_별명',
cellphoneNum = '01056785678',
email = 'abced@gmail.com';


# reactionPoint 테스트 데이터 생성

# 1번 회원이 1번 글에 싫어요
INSERT INTO reactionPoint
SET regDate = NOW(),
updateDate = NOW(),
memberId = 1,
relTypeCode = 'article',
relId = 1,
`point` = -1;

# 1번 회원이 2번 글에 좋아요
INSERT INTO reactionPoint
SET regDate = NOW(),
updateDate = NOW(),
memberId = 1,
relTypeCode = 'article',
relId = 2,
`point` = 1;

# 2번 회원이 1번 글에 싫어요
INSERT INTO reactionPoint
SET regDate = NOW(),
updateDate = NOW(),
memberId = 2,
relTypeCode = 'article',
relId = 1,
`point` = -1;

# 2번 회원이 2번 글에 싫어요
INSERT INTO reactionPoint
SET regDate = NOW(),
updateDate = NOW(),
memberId = 2,
relTypeCode = 'article',
relId = 2,
`point` = -1;

# 3번 회원이 1번 글에 좋아요
INSERT INTO reactionPoint
SET regDate = NOW(),
updateDate = NOW(),
memberId = 3,
relTypeCode = 'article',
relId = 1,
`point` = 1;



# -------------------SELECT 확인용

SELECT *
FROM article ORDER BY id DESC;

SELECT *
FROM `member`;

SELECT *
FROM board;


##===============================###################### 테스트


# 자유게시판 생성
INSERT INTO article
SET regDate = NOW(),
updateDate = NOW(),
memberId = CEILING(RAND() * 2) + 1,
boardId = 2,
title = CONCAT('제목', SUBSTRING(RAND() * 1000 FROM 1 FOR 2)),
`body` = CONCAT('내용', SUBSTRING(RAND() * 1000 FROM 1 FOR 2));


# article 생성 1
INSERT INTO article
SET regDate = NOW(),
updateDate = NOW(),
memberId = CEILING(RAND() * 2) + 1,
boardId = CEILING(RAND() * 3) + 1,
title = CONCAT('제목', SUBSTRING(RAND() * 1000 FROM 1 FOR 2)),
`body` = CONCAT('내용', SUBSTRING(RAND() * 1000 FROM 1 FOR 2));


# article 대량생성 2
INSERT INTO article
	(
		regDate, updateDate, memberId, boardId, title, `body`
	)
SELECT NOW(), NOW(), FLOOR(RAND() * 2) + 1, FLOOR(RAND() * 3) + 1, CONCAT('제목', SUBSTRING(RAND() * 1000 FROM 1 FOR 2)), CONCAT('내용', SUBSTRING(RAND() * 1000 FROM 1 FOR 2))
FROM article;


# member 대량생성 (아직 필요 없음)
INSERT INTO `member`
SET regDate = NOW(),
updateDate = NOW(),
loginId = CONCAT('loginId', SUBSTRING(RAND() * 1000 FROM 1 FOR 2)),
loginPw = CONCAT('loginPw', SUBSTRING(RAND() * 1000 FROM 1 FOR 2)),
`name` = CONCAT('name', SUBSTRING(RAND() * 1000 FROM 1 FOR 2));
