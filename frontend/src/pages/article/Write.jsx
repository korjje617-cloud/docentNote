import React, { useState } from 'react';
import Quill from '../../components/common/Quill';

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
      <h2 className='font-song-bold text-3xl m-4'>게시글 작성하기</h2>
      
      {/* -- 설정: 제목 입력란 생성 -- */}
      <input 
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '20px', fontSize: '18px', borderRadius: '5px', border: '1px solid #ccc' }}
      />

      {/* -- 가져옴: 디자인이 적용된 Quill 에디터 -- */}
      <Quill value={content} onChange={setContent} />
      
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <button style={{ padding: '10px 25px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default Write;