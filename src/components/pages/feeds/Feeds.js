import React, { Component } from 'react';
import CardContainer from './CardContainer';
import { Layout } from 'antd';
import './feeds.css'

export class Feeds extends Component {
  render() {

    return (
        <div className="feed-container">
          <CardContainer/>
        </div>
    )
  }
}

export default Feeds
