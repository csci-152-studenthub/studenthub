import React, { Component } from 'react'
import './MotherPage.css';
import SiderContainer  from './components/pages/feeds/SiderContainer'
import {message, Layout, Col, Row, Divider} from 'antd';

export class MotherPage extends Component {
  render() {
    const {
        Header, Footer, Sider, Content,
    } = Layout;
    return (
        <div className="container">
            <div className="grid-item itemSider">
                <SiderContainer/>
            </div>
            <div className="itemFooter">
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2018 Created by Ant UED
            </Footer>
            </div>
      </div>
    )
  }
}

export default MotherPage
