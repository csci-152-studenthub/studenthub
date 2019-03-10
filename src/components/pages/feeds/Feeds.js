import React, { Component } from 'react';
import CardContainer from './CardContainer';
import { Layout } from 'antd';
import Sider from './SiderContainer'
import './feeds.css'

export class Feeds extends Component {
  render() {
    const {
     Footer
    } = Layout;
    return (
      <div className="container">
        <div className="grid-item itemBody">
          <Sider/>
        </div>
         

      </div>
     
    )
  }
}

export default Feeds
