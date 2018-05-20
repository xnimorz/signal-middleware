import styled from "styled-components";

export default styled.button`
  -webkit-appearance: none;
  display: inline-block;
  box-sizing: border-box;
  margin: 0;
  border-radius: 0;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  cursor: pointer;
  height: 38px;
  position: relative;
  padding: 0 15px;
  border: 1px solid;
  font-size: 14px;
  font-family: inherit;
  line-height: 36px;
  background-color: ${props => (props.pressed ? "#0f609c" : "#0f8fee")};
  border-color: #0f8fee;
  color: #fff;
  border-radius: 3px;

  &:hover {
    background-color: #0e81d6;
  }
`;
