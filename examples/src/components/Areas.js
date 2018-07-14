import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import Button from "./Button";

import { fetchAreas, clearAreas } from "../actions/areas";
import { DIRTY } from "../constants/status";

const El = styled.div`
  width: 300px;
`;

class Areas extends PureComponent {
  state = { loading: false };
  loadAreas = () => {
    this.setState({ loading: true });
    this.props.fetchAreas().then(
      () => {
        this.setState({ loading: false });
      },
      () => {
        // we also can show error to user in view, change loading state and etc.
        this.setState({ loading: false });
      }
    );
  };
  clearAreas = () => {
    this.props.clearAreas();
  };
  renderList(areas) {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    if (areas.status === DIRTY) {
      return null;
    }

    return (
      <ul>{areas.data.map(area => <li key={area.id}>{area.name}</li>)}</ul>
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
