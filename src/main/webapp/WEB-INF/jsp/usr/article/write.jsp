<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="pageTitle" value="ARTICLE WRITE"></c:set>

<%@ include file="../common/head.jspf"%>

<hr />

<section class="mt-24  text-xl px-4">
	<div class="mx-auto flex justify-center">
		<form action="../article/doWrite" method="POST">
			<table class="table" border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse;">
				<tbody>
					
					<tr> <!-- 게시판 부분 중앙정렬 제거 -->
						<th>게시판</th>
						<td>
							<select name="boardId">
								<option value="" selected disabled>게시판을 선택해주세요</option>
								<option value="1">공지</option>
								<option value="2">자유</option>
								<option value="3">QnA</option>
							</select>
						</td>
					</tr>
					<tr>
						<th nowrap>제목</th>
						<td>
							<input size=50 maxlength=50 style="border: 1px solid black;" name="title" autocomplete="off" type="text"
								placeholder="제목" />
						</td>
					</tr>

					<tr>
						<th nowrap>본문</th>
						<td>
							<textarea rows="20" cols="50" style="border: 1px solid black;" name="body" autocomplete="off" placeholder="내용"></textarea>
						</td>
					</tr>

					<tr>

						<td>
							<div class="btns">
								<button class="btn btn-outline btn-ghost whitespace-nowrap" type="button" type="button"
									onClick="history.back();">뒤로가기</button>
							</div>
						</td>

						<td style="text-align: right;">
							<input class="btn btn-outline btn-ghost" type="submit" value="작성" />
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>
</section>

<%@ include file="../common/foot.jspf"%>