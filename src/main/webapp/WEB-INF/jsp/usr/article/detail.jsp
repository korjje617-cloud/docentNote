<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="pageTitle" value="ARTICLE DETAIL"></c:set>

<%@ include file="../common/head.jspf"%>

<hr />

<!-- 변수 -->
<script>
	const params = {};
	params.id = parseInt('${param.id}');

	var isAlreadyAddGoodRp = ${isAlreadyAddGoodRp};
	var isAlreadyAddBadRp = ${isAlreadyAddBadRp};
</script>

<!-- 좋아요 싫어요  -->
<script>
<!-- 좋아요 싫어요 버튼	-->
	function checkRP() {
		if (isAlreadyAddGoodRp == true) {
			$('#likeButton').toggleClass('btn-outline');
		} else if (isAlreadyAddBadRp == true) {
			$('#DislikeButton').toggleClass('btn-outline');
		} else {
			return;
		}
	}

	function doGoodReaction(articleId) {

		$.ajax({
			url : '/usr/reactionPoint/doGoodReaction',
			type : 'POST',
			data : {
				relTypeCode : 'article',
				relId : articleId
			},
			dataType : 'json',
			success : function(data) {
				console.log(data);
				console.log('data.data1Name : ' + data.data1Name);
				console.log('data.data1 : ' + data.data1);
				console.log('data.data2Name : ' + data.data2Name);
				console.log('data.data2 : ' + data.data2);
				if (data.resultCode.startsWith('S-')) {
					var likeButton = $('#likeButton');
					var likeCount = $('#likeCount');
					var likeCountC = $('.likeCount');
					var DislikeButton = $('#DislikeButton');
					var DislikeCount = $('#DislikeCount');
					var DislikeCountC = $('.DislikeCount');

					if (data.resultCode == 'S-1') {
						likeButton.toggleClass('btn-outline');
						likeCount.text(data.data1);
						likeCountC.text(data.data1);
					} else if (data.resultCode == 'S-2') {
						DislikeButton.toggleClass('btn-outline');
						DislikeCount.text(data.data2);
						DislikeCountC.text(data.data2);
						likeButton.toggleClass('btn-outline');
						likeCount.text(data.data1);
						likeCountC.text(data.data1);
					} else {
						likeButton.toggleClass('btn-outline');
						likeCount.text(data.data1);
						likeCountC.text(data.data1);
					}

				} else {
					alert(data.msg);
				}

			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('좋아요 오류 발생 : ' + textStatus);

			}

		});
	}

	function doBadReaction(articleId) {

		$.ajax({
			url : '/usr/reactionPoint/doBadReaction',
			type : 'POST',
			data : {
				relTypeCode : 'article',
				relId : articleId
			},
			dataType : 'json',
			success : function(data) {
				console.log(data);
				console.log('data.data1Name : ' + data.data1Name);
				console.log('data.data1 : ' + data.data1);
				console.log('data.data2Name : ' + data.data2Name);
				console.log('data.data2 : ' + data.data2);
				if (data.resultCode.startsWith('S-')) {
					var likeButton = $('#likeButton');
					var likeCount = $('#likeCount');
					var likeCountC = $('.likeCount');
					var DislikeButton = $('#DislikeButton');
					var DislikeCount = $('#DislikeCount');
					var DislikeCountC = $('.DislikeCount');

					if (data.resultCode == 'S-1') {
						DislikeButton.toggleClass('btn-outline');
						DislikeCount.text(data.data2);
						DislikeCountC.text(data.data2);
					} else if (data.resultCode == 'S-2') {
						likeButton.toggleClass('btn-outline');
						likeCount.text(data.data1);
						likeCountC.text(data.data1);
						DislikeButton.toggleClass('btn-outline');
						DislikeCount.text(data.data2);
						DislikeCountC.text(data.data2);

					} else {
						DislikeButton.toggleClass('btn-outline');
						DislikeCount.text(data.data2);
						DislikeCountC.text(data.data2);
					}

				} else {
					alert(data.msg);
				}
			},
			error : function(jqXHR, textStatus, errorThrown) {
				alert('싫어요 오류 발생 : ' + textStatus);
			}

		});
	}

	$(function() {
		checkRP();
	});

</script>

<script>
	function ArticleDetail__doIncreaseHitCount() {
		$.get('../article/doIncreaseHitCountRd', {
			id : params.id,
			ajaxMode : 'Y'
		}, function(data) {
			$('.article-dtail__hit-count').html(data.data1);
			console.log(data);
			console.log('data.msg : ' + data.msg);
			console.log('data.data1 : ' + data.data1);
		}, 'json')
	}

	$(function() {
		ArticleDetail__doIncreaseHitCount();
		// 		setTimeout(ArticleDetail__doIncreaseHitCount, 2000);
	})
</script>

<section class="mt-24 text-xl px-4">
	<div class="mx-auto">
		<div class="article-detail" style="width: 800px; margin: 0 auto;">

			<!-- 제목 -->
			<h2 style="margin-bottom: 10px;">${article.title}</h2>

			<!-- 메타 정보 -->
			<div style="color: #666; font-size: 14px; margin-bottom: 20px;">

				<span>작성자: ${article.extra__writer }</span>

				&nbsp;|&nbsp;

				<span>작성일: ${article.regDate }</span>

				&nbsp;|&nbsp;

				<span>조회수: ${article.hitCount }</span>

				<div style="text-align: right; font-size: 12px; color: #999;">게시글 번호: ${article.id}</div>

			</div>

			<hr>

			<!-- 본문 -->
			<div style="min-height: 200px; padding: 20px 0; font-size: 16px; line-height: 1.6; white-space: pre-line;">${article.body}</div>

			<hr>

			<!-- 좋아요 싫어요 -->
			<tbody>
				<tr>
					<th style="text-align: center;">LIKE / DISLIKE / ${usersReaction }</th>
					<td style="text-align: center;">
					
						<button id="likeButton" class="btn btn-outline btn-success" onclick="doGoodReaction(${param.id})">
							👍 LIKE
							<span class="likeCount">${article.goodReactionPoint}</span>
						</button>
						
						<button id="DislikeButton" class="btn btn-outline btn-error" onclick="doBadReaction(${param.id})">
							👎 DISLIKE
							<span class="DislikeCount">${article.badReactionPoint}</span>
						</button>
						
					</td>
				<tr>
			</tbody>


			<!-- 하단 정보 -->

			<div class="btns mt-10">
				<button class="btn btn-outline btn-ghost" type="button" onClick="history.back();">뒤로가기</button>
				<c:if test="${article.userCanModify }">
					<a class="btn btn-outline btn-warning" type="button" href="../article/modify?id=${article.id }">수정</a>
				</c:if>
				<c:if test="${article.userCanDelete }">
					<a class="btn btn-outline btn-error" type="button" href="../article/doDelete?id=${article.id }">삭제</a>
				</c:if>

			</div>
		</div>
	</div>
</section>

<%@ include file="../common/foot.jspf"%>