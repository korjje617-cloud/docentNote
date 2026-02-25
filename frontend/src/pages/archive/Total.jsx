import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from 'react-masonry-css'; 
import '../../components/common/Archive.css'; 
import ArchiveMenu from '../../components/common/ArchiveMenu.js';

export default function Total() {
	// 데이터를 담을 빈 목록 만들기
    const [paintings, setPaintings] = useState([]); 
	
    // useEffect = 화면이 처음 나타나면 딱 한번 이 행동을 해라
	// 지금은 데이터를 가져오라는 함수 실행 명령을 내리고있다
    useEffect(() => {
        fetchAllPaintings();
    }, []);
	
    // 함수 실행
    // async, await 는 데이터를 가지고 올 때 잠시 기다리라는 뜻
    // 데이터가 다 오지도 않았는데 다음 코드가 실행되는 걸 막는다
    const fetchAllPaintings = async () => {
        try {
            // 여기도 메인 페이지와 동일한 서버 주소 활용
            // axios.get('주소'): 지정된 주소에 있는 서버에게 "데이터 좀 보내달라고 요청
            const response = await axios.get('http://localhost:8081/api/main');
            console.log("서버 응답 데이터:", response.data);
            
            // 데이터 저장
            // 안전성 검사 : Array.isArray(response.data)
            // 서버가 보낸 결과가 진짜 배열인지 확인
            setPaintings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    // 디바이스 크기에 따라 레이아웃이 변경되는 지점
    // 기본 4줄, 너비가 줄어들 때 마다 한줄씩 줄어든다
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <div className="flex flex-col bg-white">
            <div className="flex flex-col self-stretch bg-[#F2F2F2] pb-[46px] gap-[38px]">
                <div className="flex flex-col items-start self-stretch mx-[95px] gap-[30px]">
                    <div className="flex items-center gap-[34px] mt-10">
                        <span className="text-black text-[40px] font-song-bold">{"아카이브"}</span>
                        <span className="text-black text-sm">{"더 많은 그림을 감상해보세요"}</span>
                    </div>

                    <ArchiveMenu/>

                    <div className="w-full">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {paintings.map((p) => (
                                <div key={p.id} className="flex flex-col items-start bg-[#F1F1F1] p-3 rounded-[18px] mb-6 shadow-sm">
                                    <img
                                        /* replace 없이 그대로 사용 */
                                        src={p.imgUrl} 
                                        className="w-full rounded-[18px] mb-4 object-cover"
                                        alt={p.paintingNameKr}
                                        /* 이미지 주소가 잘못되었을 경우를 대비한 보험 */
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                                        }}
                                    />
                                    <span className="text-black font-bold text-[15px] mb-2 ml-[13px]">
                                        {p.paintingNameKr || "제목 없음"}
                                    </span>
                                    <span className="text-gray-600 text-[13px] ml-[13px]">
                                        {p.painterNameKr || "작가 미상"}
                                    </span>
                                </div>
                            ))}
                        </Masonry>
                    </div>
                </div>
            </div>
        </div>
    );
}