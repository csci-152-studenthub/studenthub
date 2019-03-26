import React, { Component } from 'react';
// import { Layout } from 'antd';
// import { Button } from 'antd';
// import { List, Icon, Tag } from 'antd';

import './Dashboard.css';
import Feeds from '../feeds/Feeds';
export class Dashboard extends Component {

  render() {
    return (
      <div>
        <div class="grid-head">
          <div>Hello!</div>
        </div>
        <div class="grid-container">
          <div><Feeds/>
          

          </div>
          <div>Resources</div>
          <div>StudyGroup</div>
        </div>
        <div class="grid-bottom">
          <div>User posts title in Feeds</div>
        </div>









      </div>

    )
    
  }
}

export default Dashboard
