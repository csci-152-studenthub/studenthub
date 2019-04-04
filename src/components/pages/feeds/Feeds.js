import React, { Component } from 'react';
import CardContainer from './CardContainer';

export class Feeds extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
        <div>
          <CardContainer setHeader={this.props.handler}/>
        </div>
    )
  }
}

export default Feeds
