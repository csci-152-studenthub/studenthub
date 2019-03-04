import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider} from 'antd';
import Form from './SignIn';
import SignUp from './SignUp';
import logo from './assets/logo.jpg';
import './App.css';

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
      <div>
        <Row type="flex" align="middle"  justify="space-around" style={{ paddingTop: 100}}>
          <Col span={6} ><img src={logo} alt="Logo" style={{ height: 400, paddingLeft: 200, paddingRight: 10}}/></Col>
          <Col span={1}><Divider type="vertical" style={{height: 300, left: 125}} /></Col>
          <Col span={10}><Form /></Col>
        </Row>
      </div>
    );
  }
}

export default App;
