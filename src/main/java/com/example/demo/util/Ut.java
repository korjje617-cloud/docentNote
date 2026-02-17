package com.example.demo.util;

import java.lang.reflect.Array;
import java.util.Map;

public class Ut {

	// 브라우저에서 메시지를 띄우고 지정된 주소로 강제 이동시키는 자바스크립트 코드를 만드는 도구
	public static String jsReplace(String resultCode, String msg, String replaceUri) {
		// 결과 코드가 비어있으면 빈 문자로 처리함
		if (resultCode == null) {
			resultCode = "";
		}

		// 보여줄 메시지가 비어있으면 빈 문자로 처리함
		if (msg == null) {
			msg = "";
		}

		// 이동할 주소가 없으면 기본적으로 메인 페이지("/")로 보냄
		if (replaceUri == null) {
			replaceUri = "/";
		}

		// "성공코드/메시지" 형태의 문자열을 만듦
		String resultMsg = resultCode + "/" + msg;

		// 아래의 스크립트 양식에 위에서 만든 데이터들을 채워 넣음
		return Ut.f("""
				<script>
					// 앞뒤 공백을 제거한 메시지를 변수에 담음
					let resultMsg = '%s'.trim();

					// 메시지가 존재한다면 브라우저 알림창(alert)을 띄움
					if(resultMsg.length > 0){
						alert(resultMsg);
					}

					// 지정된 주소('%s')로 페이지를 이동시킴 (기록이 안 남아 뒤로가기 방지)
					location.replace('%s');
				</script>
				""", resultMsg, replaceUri, replaceUri);
	}

	// 브라우저에서 메시지를 띄우고 이전 페이지로 돌려보내는 자바스크립트 코드를 만드는 도구
	public static String jsHistoryBack(String resultCode, String msg) {
		// 결과 코드가 없으면 빈 문자로 세팅
		if (resultCode == null) {
			resultCode = "";
		}

		// 메시지가 없으면 빈 문자로 세팅
		if (msg == null) {
			msg = "";
		}

		// 결과 코드와 메시지를 합침
		String resultMsg = resultCode + "/" + msg;

		// 스크립트 양식에 메시지를 채워 넣고 뒤로가기(history.back) 명령어를 작성함
		return Ut.f("""
				<script>
					let resultMsg = '%s'.trim();

					if(resultMsg.length > 0){
						alert(resultMsg);
					}

					history.back();
				</script>
				""", resultMsg);
	}

	// 문자열이 비어있거나(null) 공백만 있는지 확인하는 도구
	public static boolean isEmptyOrNull(String str) {
		
		// 글자가 아예 없거나, 공백을 제거했을 때 길이가 0이면 true(비어있음)를 반환함
		return str == null || str.trim().length() == 0;
	}

	// 여러 종류의 객체(글자, 지도, 배열 등)가 비어있는지 꼼꼼하게 검사하는 도구
	public static boolean isEmpty(Object obj) {
		
		// 객체 자체가 없으면 비어있는 것임
		if (obj == null) {
			return true;
		}

		// 만약 글자(String) 타입이라면?
		if (obj instanceof String) {
			
			// 앞뒤 공백 빼고 글자가 없으면 true
			return ((String) obj).trim().length() == 0;
		}

		// 만약 맵(Map) 형태의 데이터라면?
		if (obj instanceof Map) {
			
			// 맵 안에 데이터가 하나도 없으면 true
			return ((Map<?, ?>) obj).isEmpty();
		}

		// 만약 배열(Array) 형태의 데이터라면?
		if (obj.getClass().isArray()) {
			
			// 배열의 칸 수가 0개이면 true
			return Array.getLength(obj) == 0;
		}

		// 위의 모든 경우에 해당하지 않으면 데이터가 들어있는 것으로 판단
		return false;
	}

	// 문자열 안에 특정 데이터들을 편하게 끼워 넣는(포맷팅) 도구
	public static String f(String string, Object... args) {
		
		// String.format을 더 짧게 쓰기 위해 만든 메서드
		return String.format(string, args);
	}

}