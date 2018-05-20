import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import TextArea from "./TextArea";
import Button from "./Button";

import { addComment } from "../actions/comments";

const El = styled.div`
  margin-bottom: 25px;
`;

class AddComment extends PureComponent {
  textArea = React.createRef();

  addComment = () => {
    // We wrap our signal action with promise,
    // so we can clear field after async request comes from server
    this.props
      .addComment(this.textArea.current.value)
      .promise.then(() => (this.textArea.current.value = ""));
  };

  submitByEnterKey = e => {
    if (e.which === 13 && (e.ctrlKey || e.metaKey)) {
      this.addComment();
    }
  };

  render() {
    return (
      <El>
        <TextArea
          onKeyDown={this.submitByEnterKey}
          placeholder="Your comment..."
          innerRef={this.textArea}
        />
        <Button onClick={this.addComment}>Add comment</Button>
      </El>
    );
  }
}

export default connect(null, { addComment })(AddComment);
