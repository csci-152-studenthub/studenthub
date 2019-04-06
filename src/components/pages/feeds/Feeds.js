import React, { Component } from 'react';
import CardContainer from './CardContainer';
import { PropTypes } from 'react';

export class Feeds extends Component {

  render() {
    return (
        <div>
          <CardContainer setHeader={this.props.handler}/>
        </div>
    )
  }
}

export default Feeds
