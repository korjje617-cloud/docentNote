import React, { useState, useEffect } from "react";

import Button from '../../components/common/Button';

export default function Explorer() {
	const [allPaintings, setAllPaintings] = useState([]); // 전체 그림 목록
	const [history, setHistory] = useState([]); // 본 그림들의 인덱스 순서 기록
	const [historyIndex, setHistoryIndex] = useState(-1); // 현재 기록의 위치

	// 1. 처음 로딩 시 데이터 가져오기
	useEffect(() => {
		fetch('http://localhost:8081/api/main')
			.then((res) => res.json())
			.then((data) => {
				if (data && data.length > 0) {
					setAllPaintings(data);
					// 첫 랜덤 그림 설정
					const firstRandom = Math.floor(Math.random() * data.length);
					setHistory([firstRandom]);
					setHistoryIndex(0);
				}
			});
	}, []);

	// 2. 다음 버튼 함수
	const handleNext = () => {
		if (historyIndex < history.length - 1) {
			// 이미 봤던 '다음' 기록이 있다면 그 기록으로 이동
			setHistoryIndex(historyIndex + 1);
		} else {
			// 새로운 랜덤 그림 추가
			const nextRandom = Math.floor(Math.random() * allPaintings.length);
			setHistory([...history, nextRandom]);
			setHistoryIndex(historyIndex + 1);
		}
	};

	// 3. 이전 버튼 함수
	const handlePrev = () => {
		if (historyIndex > 0) {
			// 기록상 이전 그림으로 이동
			setHistoryIndex(historyIndex - 1);
		} else {
			alert("이전 기록이 없습니다!");
		}
	};

	// 현재 보여줄 그림 선택
	const currentPainting = allPaintings[history[historyIndex]];

	if (!currentPainting) return <div className="bg-[#333333] min-h-screen text-white p-10">로딩 중...</div>;

	return (
		<div className="flex flex-col min-h-screen bg-[#333333]">
			<Button />
			<div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">

				{/* 2. 조명 이미지 */}
				<div
					className="absolute inset-0 z-10 pointer-events-none"
					style={{
						backgroundImage: "url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Xkz4x9yRgw/3l405byc_expires_30_days.png')",
						backgroundSize: '60% 100%', // 화면 가로세로에 꽉 맞춤
						backgroundPosition: 'top center',
						backgroundRepeat: 'no-repeat',
						mixBlendMode: 'screen', // 검은 배경을 날리고 빛만 남김
						opacity: 0.9
					}}
				></div>

				<div className="relative z-20 flex items-center gap-10 xl:gap-20">

					{/* --- 왼쪽 액자 (이전) --- */}
					<div onClick={handlePrev} className="flex flex-col items-center opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer group">
						<div className="w-[250px] p-3 card shadow-2xl bg-gradient-to-br from-gray-300 via-white to-gray-200 border border-gray-100 rounded-sm transform group-hover:-translate-x-2 transition-transform">
							<div className="aspect-[3/4] overflow-hidden shadow-inner border border-gray-300 bg-[#222222] flex items-center justify-center">
								<span className="text-white text-6xl font-thin select-none">←</span>
							</div>
						</div>
					</div>

					{/* --- 중앙 액자 --- */}
					<div className="flex flex-col items-center shrink-0">
						<div className="w-[450px] xl:w-[550px] card p-4 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] bg-gradient-to-br from-gray-200 via-white to-gray-50 border border-gray-100 rounded-sm">
							<div className="overflow-hidden shadow-inner border border-gray-200 bg-white">
								<img
									src={currentPainting.imgUrl}
									className="w-full h-auto block transform hover:scale-105 transition-transform duration-500 select-none"
									alt="Artwork"
								/>
							</div>
						</div>
						<h1 className="text-white text-4xl font-song-bold mt-8 tracking-tight drop-shadow-lg select-none">
							{"이 작품은 어떠신가요?"}
						</h1>
					</div>

					{/* --- 오른쪽 액자 (다음) --- */}
					<div onClick={handleNext} className="flex flex-col items-center opacity-50 hover:opacity-100 transition-all duration-300 cursor-pointer group">
						<div className="w-[250px] card p-3 shadow-2xl bg-gradient-to-br from-gray-300 via-white to-gray-200 border border-gray-100 rounded-sm transform group-hover:translate-x-2 transition-transform">
							<div className="aspect-[3/4] overflow-hidden shadow-inner border border-gray-300 bg-[#222222] flex items-center justify-center">
								<span className="text-white text-6xl font-thin select-none">→</span>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
}