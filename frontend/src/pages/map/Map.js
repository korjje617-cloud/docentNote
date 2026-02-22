import React, { useEffect, useState } from 'react';

const Map = () => {
    const [museums, setMuseums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        // 가져옴: 서버에서 미술관 정보를 가져옴
        fetch("http://localhost:8081/api/map/museum")
            .then((response) => response.json())
            .then((data) => {
                if (data.response && data.response.body) {
                    setMuseums(data.response.body.items);
                }
            })
            .catch((error) => console.error("데이터 가져오기 실패:", error));
    }, []);

    // --- 페이지네이션 계산 로직 ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = museums.slice(indexOfFirstItem, indexOfLastItem);
    
    // 확인: 전체 페이지 개수를 먼저 구함
    const totalPages = Math.ceil(museums.length / itemsPerPage);

    // [수정 포인트 1]: 현재 페이지를 기준으로 10개씩 끊어서 보여줄 시작/끝 번호 계산
    const pageGroupLimit = 10; // 한 번에 보여줄 버튼 개수
    const startPage = Math.floor((currentPage - 1) / pageGroupLimit) * pageGroupLimit + 1;
    const endPage = Math.min(startPage + pageGroupLimit - 1, totalPages);

    // [수정 포인트 2]: 전체 번호 대신 화면에 보일 번호만 배열로 생성함
    const visiblePageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePageNumbers.push(i);
    }

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle} className='text-[40px] font-song-bold'>전국의 미술관 및 박물관</h1>
            
            <div style={listContainerStyle}>
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div key={index} style={listItemStyle}>
                            <h3 style={nameStyle}>{item.fcltyNm}</h3>
                            <p style={infoStyle}>📍 주소: {item.rdnmadr || item.lnmadr}</p>
                            <p style={infoStyle}>📞 전화: {item.phoneNumber}</p>
                            <p style={infoStyle}>⏰ 운영시간: {item.weekdayOperOpenHhmm} ~ {item.weekdayOperColseHhmm}</p>
                        </div>
                    ))
                ) : (
                    <p>데이터를 불러오는 중입니다...</p>
                )}
            </div>

            {/* [수정 포인트 3]: 페이지네이션 UI를 그룹화 로직에 맞게 출력함 */}
            <div style={paginationStyle}>
                {/* 설정: 첫 번째 그룹이 아니면 [이전] 버튼을 만듬 */}
                {startPage > 1 && (
                    <button onClick={() => setCurrentPage(startPage - 1)} style={buttonStyle}>이전</button>
                )}

                {/* 확인: 계산된 visiblePageNumbers(최대 10개)만 화면에 뿌려줌 */}
                {visiblePageNumbers.map(number => (
                    <button 
                        key={number} 
                        onClick={() => setCurrentPage(number)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: currentPage === number ? '#b3b3b3' : '#fff',
                            color: currentPage === number ? '#fff' : '#000'
                        }}
                    >
                        {number}
                    </button>
                ))}

                {/* 설정: 마지막 그룹이 아니면 [다음] 버튼을 만듬 */}
                {endPage < totalPages && (
                    <button onClick={() => setCurrentPage(endPage + 1)} style={buttonStyle}>다음</button>
                )}
            </div>
        </div>
    );
};

// --- 스타일링 (이전과 동일함) ---
const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' };
const titleStyle = { textAlign: 'center', marginBottom: '30px', color: '#333' };
const listContainerStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const listItemStyle = { padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', backgroundColor: '#fff' };
const nameStyle = { margin: '0 0 10px 0', color: '#007bff' };
const infoStyle = { margin: '5px 0', fontSize: '14px', color: '#666' };
const paginationStyle = { display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '5px' };
const buttonStyle = { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' };

export default Map;