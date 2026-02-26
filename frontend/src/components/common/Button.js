import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button onClick={() => window.location.href='/'} className='select-none'>
        <span>메인으로</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* 1. 이 컴포넌트 자체를 공중에 띄워서 다른 레이어(조명)와 격리시킵니다. */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50; /* 조명보다 위에 보이게 설정 */
  
  /* 2. 내부 버튼 배치를 위해 flex 사용 */
  display: flex;

  button {
    background: #fff;
    border: none;
    padding: 10px 20px;
    display: inline-block;
    font-size: 15px;
    font-weight: 600;
    width: 120px;
    text-transform: uppercase;
    cursor: pointer;
    transform: skew(-21deg);
    position: relative; /* ::before 위치 기준 */
    overflow: hidden;

    /* 3. 디자인용 마진 유지 (이제 absolute 덕분에 조명을 밀지 않습니다) */
    margin-top: 80px;
    margin-left: 25px;
  }

  span {
    display: inline-block;
    transform: skew(21deg);
  }

  button::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background: rgb(20, 20, 20);
    opacity: 0;
    z-index: -1;
    transition: all 0.5s;
  }

  button:hover {
    color: #fff;
  }

  button:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
  }
`;

export default Button;
