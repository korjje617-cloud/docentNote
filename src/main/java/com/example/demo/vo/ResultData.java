package com.example.demo.vo;

import lombok.Getter;
import lombok.ToString;

// 객체 내부의 데이터를 문자열로 쉽게 출력할 수 있게 함
@ToString

// <DT>: 데이터 타입을 나중에 정할 수 있게 비워둔 주머니 (제네릭)
public class ResultData<DT> {

	// 외부에서 결과 코드를 읽을 수 있게 함
	@Getter
	private String ResultCode;
	
	// 외부에서 결과 메시지를 읽을 수 있게 함
	@Getter
	private String msg;
	
	// 외부에서 실제 데이터1 을 읽을 수 있게 함 (주머니 속 내용물)
	@Getter
	private DT data1;
	
	// 외부에서 데이터1 의 이름을 읽을 수 있게 함
	@Getter
	private String data1Name;
	
	// 외부에서 실제 데이터2 를 읽을 수 있게 함 (주머니 속 내용물)
	@Getter
	private Object data2;
	
	// 외부에서 데이터2 의 이름을 읽을 수 있게 함
	@Getter
	private String data2Name;


	
	// 결과 코드와 메시지만 담아서 보고서를 만드는 도구A
	public static <DT> ResultData<DT> from(String ResultCode, String msg) {
		
		// 아래의 데이터를 호출하여 도구B 에게 전달
		return from(ResultCode, msg, null, null);
	}

	
	
	// 코드, 메시지, 이름, 실제 데이터까지 모두 담는 도구B
	public static <DT> ResultData<DT> from(String ResultCode, String msg, String data1Name, DT data1) {
		
		// 새로운 보고서 객체 생성
		ResultData<DT> rd = new ResultData<DT>();
		
		// 결과 코드 저장 (S-1, F-1 등)
		rd.ResultCode = ResultCode;
		
		// 메시지 저장
		rd.msg = msg;
		
		// 실제 데이터1 저장
		rd.data1 = data1;
		
		// 데이터1 이름 저장
		rd.data1Name = data1Name;

		// 완성된 보고서 반환
		return rd;
	}
	
	// 코드, 메시지, 이름, 실제 데이터1 + 데이터 2까지 모두 담는 도구C
	public static <DT> ResultData<DT> from(String resultCode, String msg, String data1Name, DT data1, String data2Name, DT data2) {
		
		// 도구B 와 같은 구조에 데이터 2만 추가됐다
		ResultData<DT> rd = new ResultData<DT>();
		rd.ResultCode = resultCode;
		rd.msg = msg;
		rd.data1Name = data1Name;
		rd.data1 = data1;
		rd.data2Name = data2Name;
		rd.data2 = data2;

		return rd;
	}
	
		
	// 결과 코드가 "S-"로 시작하면 성공으로 판단하는 기능
	public boolean isSuccess() {
		return ResultCode.startsWith("S-");
	}

	
	// "S-"가 아니면 실패로 판단하는 기능
	public boolean isFail() {
		return !isSuccess();
	}

	
	// 기존 보고서의 결과는 유지하면서 데이터 내용만 새로 바꾸는 기능
	public static <DT> ResultData<DT> newData(ResultData rd, String dataName, DT newData) {
		
		// 기존의 코드와 메시지를 가져와서 새 보고서 작성
		return from(rd.getResultCode(), rd.getMsg(), dataName, newData);
	}
}