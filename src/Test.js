import React, { Component } from 'react';
import {message, Col, Row, Divider, Button} from 'antd';
import { Auth } from "aws-amplify";
import { Typography } from 'antd';
import logo from './assets/logo.jpg';
import './App.css';

const { Title } = Typography;

class Test extends Component {

  trySignOut(){
    Auth.signOut()
    .then(data => {
      console.log(data);
      message.success('Signed out successfully!', 2.5);
      this.props.history.replace("/");
    })
    .catch(err => {
      console.log(err);
      message.error("Couldn't sign out, check console!", 2.5);
    });
  }

  render() {
    return (
      <div>
        <Row type="flex" align="middle"  justify="space-around" style={{ paddingTop: 100}}>
          <Col span={6} >
            <img src={logo} alt="Logo" style={{ height: 400, paddingLeft: 200, paddingRight: 10}}/>
            </Col>
          <Col span={1}><Divider type="vertical" style={{height: 300, left: 125}} /></Col>
          <Col span={10}>
            <Title style={{paddingLeft: 0}}>StudentHub</Title>
            <Title level={3}>Already signed in!</Title>
            <Button type="primary" onClick={() => {this.trySignOut()}}>Sign Out</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Test;
