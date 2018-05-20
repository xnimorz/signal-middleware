import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const El = styled.div`
  margin: 20px 0;
  padding: 10px;

  background: ${props => (props.grey ? "#e6e6e6" : "transparent")};
`;

class Comment extends PureComponent {
  render() {
    const { children, id } = this.props;
    return <El grey={id % 2 === 0}>{children}</El>;
  }
}

export default Comment;
