import React from 'react';
import styled from 'styled-components';

// 부모가 준 onSearch 함수를 받기
const Search = ({ onSearch }) => {

  const handleChange = (e) => {
    // 사용자가 입력한 글자를 바로 부모에게 전달
    onSearch(e.target.value);
  };

  return (
    <StyledWrapper>
      <input 
        placeholder="제목 검색..." 
        type="text" 
        className="input" 
        onChange={handleChange} // 글자가 바뀔 때마다 실행
      />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    width: 100%;
    max-width: 220px;
    height: 45px;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid lightgrey;
    outline: none;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0px 0px 20px -18px;
  }

  .input:hover {
    border: 2px solid lightgrey;
    box-shadow: 0px 0px 20px -17px;
  }

  .input:active {
    transform: scale(0.95);
  }

  .input:focus {
    border: 2px solid grey;
  }`;
export default Search;
