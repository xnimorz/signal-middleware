import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";
import AddComment from "./AddComment";

const El = styled.div`
  margin-top: 10px;
  width: 300px;
  border-right: 1px solid #eee;
`;

class Comments extends PureComponent {
  render() {
    const { comments } = this.props;
    return (
      <El>
        Comments:
        <AddComment />
        {comments.data.map(comment => (
          <Comment id={comment.id} key={comment.id}>
            {comment.text}
          </Comment>
        ))}
      </El>
    );
  }
}

export default connect(state => ({
  comments: state.comments
}))(Comments);
