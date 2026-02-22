import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './Quill.css'; 

const Quill = ({ value, onChange }) => {
  
  // -- 설정: 예제의 풍성한 툴바 기능을 생성함 --
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // 제목 크기
      [{ font: [] }], // 글꼴 선택
      [{ align: [] }], // 정렬 (좌, 중, 우, 양쪽)
      ['bold', 'italic', 'underline', 'strike', 'blockquote'], // 글자 효과
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }], // 리스트, 들여쓰기
      [{ color: [] }, { background: [] }], // 글자색, 배경색
      ['link', 'image', 'video'], // 링크, 이미지, 비디오
      ['clean'], // 포맷 초기화
    ],
  };

  // -- 확인: 툴바에서 사용할 기능 형식을 지정함 --
  const formats = [
    'header', 'font', 'align',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
  ];

  return (
    <div className="quill-wrapper">
      {/* -- 생성: 예제 디자인을 적용한 에디터 본체 -- */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="내용을 입력해주세요..."
      />
    </div>
  );
};

export default Quill;