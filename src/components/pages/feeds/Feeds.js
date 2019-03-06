import React, { Component } from 'react';
import CardContainer from './CardContainer';
import './feeds.css'

export class Feeds extends Component {
  render() {
    return (
    <div className="container">
      <div className="grid-item itemHeader">StudentHub</div>
        <div className="grid-item itemBody">
          <CardContainer />
        </div>
      
    </div>
    )
  }
}

export default Feeds
