import React, { PureComponent } from "react";
import { connect } from "react-redux";

import Row from "./Row";
import Button from "./Button";
import Gap from "./Gap";
import Comments from "./Comments";
import CommentsCode from "./CommentsCode";
import Areas from "./Areas";
import AreasCode from "./AreasCode";

import { switchView } from "../actions/switcher";

import { COMMENTS, AREAS } from "../constants/viewKinds";

class Switcher extends PureComponent {
  selectComments = () => {
    this.props.switchView(COMMENTS);
  };
  selectAreas = () => {
    this.props.switchView(AREAS);
  };
  renderComments(switcher) {
    if (switcher !== COMMENTS) {
      return null;
    }
    return (
      <Row>
        <Comments />
        <CommentsCode />
      </Row>
    );
  }
  renderAreas(switcher) {
    if (switcher !== AREAS) {
      return null;
    }
    return (
      <Row>
        <Areas />
        <AreasCode />
      </Row>
    );
  }
  render() {
    const { switcher } = this.props;
    return (
      <React.Fragment>
        <Row>
          <Button onClick={this.selectComments} pressed={switcher === COMMENTS}>
            Comments
          </Button>
          <Button onClick={this.selectAreas} pressed={switcher === AREAS}>
            Areas
          </Button>
        </Row>
        <Gap />
        {this.renderComments(switcher)}
        {this.renderAreas(switcher)}
      </React.Fragment>
    );
  }
}

export default connect(state => ({ switcher: state.switcher }), { switchView })(
  Switcher
);
