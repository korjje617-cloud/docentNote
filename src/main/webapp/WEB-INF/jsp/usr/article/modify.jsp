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
					<input type="hidden" name="id" value="${article.id}">

					<tr>
						<th nowrap>제목</th>
						<td>
							<input size=50 maxlength=50 style="border: 1px solid black;" name="title" autocomplete="off" type="text"
								value="${article.title}" />
						</td>
					</tr>

					<tr>
						<th nowrap>본문</th>
						<td>
							<textarea rows="20" cols="50" style="border: 1px solid black;" name="body" autocomplete="off">${article.body}</textarea>
						</td>
					</tr>


					<tr>

						<td style="text-align: left;">
							<c:if test="${article.userCanDelete }">
								<a class="btn btn-outline btn-error whitespace-nowrap" href="../article/doDelete?id=${article.id }">삭제</a>
							</c:if>
						</td>

						<td nowrap>
							<div class="btns">
								<button class="btn btn-outline btn-ghost" type="button" onClick="history.back();">뒤로가기</button>
							</div>
						</td>

						<td style="text-align: right;">
							<input class="btn btn-outline btn-ghost" type="submit" value="수정" />
						</td>

					</tr>
				</tbody>
			</table>
		</form>
	</div>
</section>

<%@ include file="../common/foot.jspf"%>