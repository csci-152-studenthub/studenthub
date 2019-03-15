import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider} from 'antd';
import { Typography } from 'antd';
import SignIn from './SignIn';
import logo from './assets/logo.jpg';
import SiderContainer  from './components/pages/feeds/SiderContainer'
// import './App.css';
import './NewApp.css';

const { Title } = Typography;


const {
  Header, Footer, Sider, Content,
} = Layout;

const success = () => {
  message.loading('Action in progress..', 2.5)
    .then(() => message.success('Loading finished', 2.5));
  };

class App extends Component {

  render() {
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
    );
  }
}

export default App;
