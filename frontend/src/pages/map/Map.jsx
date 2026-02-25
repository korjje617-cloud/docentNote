import React, { useEffect, useState, useCallback, useMemo } from 'react';
// 가져옴: 최적화를 위해 useJsApiLoader와 MarkerF를 사용함
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const Map = () => {
    // 설정: 스크립트 로드 최적화 (LoadScript 대신 사용)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "인증키 삭제",
        language: "ko"
    });

    const [museums, setMuseums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const itemsPerPage = 10;

    useEffect(() => {
        fetch("http://localhost:8081/api/map/museum")
            .then((response) => response.json())
            .then((data) => {
                if (data.response && data.response.body && data.response.body.items) {
                    setMuseums(data.response.body.items);
                }
            })
            .catch((error) => console.error("데이터 가져오기 실패:", error));
    }, []);

    // --- 페이지네이션 로직 (기존 유지) ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = useMemo(() => museums.slice(indexOfFirstItem, indexOfLastItem), [museums, indexOfFirstItem, indexOfLastItem]);
    const totalPages = Math.ceil(museums.length / itemsPerPage);

    const pageGroupLimit = 10;
    const startPage = Math.floor((currentPage - 1) / pageGroupLimit) * pageGroupLimit + 1;
    const endPage = Math.min(startPage + pageGroupLimit - 1, totalPages);
    const visiblePageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    // 확인: 지도가 깨지는 현상을 방지하기 위해 스타일을 메모리에 고정함
    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '100%'
    }), []);

    // 설정: 불필요한 마커 재렌더링 방지
    const renderMarkers = useMemo(() => {
        return currentItems.map((item, idx) => (
            <MarkerF
                key={`${item.fcltyNm}-${idx}`}
                position={{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }}
                label={{ text: item.fcltyNm, fontSize: '12px', fontWeight: 'bold' }}
            />
        ));
    }, [currentItems]);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }} className='text-[40px] font-song-bold'>
                전국의 미술관 및 박물관
            </h1>

            <div style={{ display: 'flex', gap: '20px', height: '700px' }}>
                {/* 왼쪽: 리스트 영역 */}
                <div style={{ flex: '1.5', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '10px', padding: '15px', backgroundColor: '#f9f9f9' }}>
                    {currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                            <div
                                key={index}
                                style={listItemStyle}
                                onClick={() => setMapCenter({ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) })}
                            >
                                <h3 style={nameStyle}>{item.fcltyNm}</h3>
                                <p style={infoStyle}>📍 주소: {item.rdnmadr || item.lnmadr}</p>
                                <p style={infoStyle}>📞 전화: {item.phoneNumber}</p>
                                <p style={infoStyle}>⏰ 운영시간: {item.weekdayOperOpenHhmm} ~ {item.weekdayOperColseHhmm}</p>
                            </div>
                        ))
                    ) : (
                        <p>데이터를 불러오는 중입니다...</p>
                    )}

                    <div style={paginationStyle}>
                        {startPage > 1 && <button onClick={() => setCurrentPage(startPage - 1)} style={buttonStyle}>이전</button>}
                        {visiblePageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                style={{ ...buttonStyle, backgroundColor: currentPage === number ? '#333' : '#fff', color: currentPage === number ? '#fff' : '#000' }}
                            >
                                {number}
                            </button>
                        ))}
                        {endPage < totalPages && <button onClick={() => setCurrentPage(endPage + 1)} style={buttonStyle}>다음</button>}
                    </div>
                </div>

                {/* 오른쪽: 지도 영역 (최적화 적용) */}
                <div style={{ flex: '2.5', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ddd' }}>
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={14}
                            // 확인: 지도 로딩 시 불필요한 컨트롤을 제거하여 가볍게 만듬
                            options={{ disableDefaultUI: false, zoomControl: true }}
                        >
                            {renderMarkers}
                        </GoogleMap>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            지도를 빠르게 불러오는 중...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 스타일 설정 (기존 유지) ---
const listItemStyle = { padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', backgroundColor: '#fff', marginBottom: '8px', borderRadius: '5px' };
const nameStyle = { margin: '0 0 5px 0', color: '#007bff', fontSize: '16px' };
const infoStyle = { margin: '0', fontSize: '13px', color: '#666' };
const paginationStyle = { display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '5px', flexWrap: 'wrap' };
const buttonStyle = { padding: '5px 10px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', borderRadius: '3px' };

export default Map;