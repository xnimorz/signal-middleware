import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import Button from "./Button";

import { fetchAreas, clearAreas } from "../actions/areas";
import { DIRTY } from "../constants/status";

const El = styled.div`
  width: 300px;
`;

const List = styled.ul``;

const Item = styled.li``;

class Areas extends PureComponent {
  loadAreas = () => {
    this.props.fetchAreas();
  };
  clearAreas = () => {
    this.props.clearAreas();
  };
  renderList(areas) {
    if (areas.status === DIRTY) {
      return null;
    }

    return (
      <List>
        {areas.data.map(area => <Item key={area.id}>{area.name}</Item>)}
      </List>
    );
  }
  render() {
    const { areas } = this.props;
    return (
      <El>
        <Button onClick={this.loadAreas}>Load areas</Button>
        <Button onClick={this.clearAreas}>Clear areas</Button>
        {this.renderList(areas)}
      </El>
    );
  }
}

export default connect(
  state => ({
    areas: state.areas
  }),
  { fetchAreas, clearAreas }
)(Areas);
