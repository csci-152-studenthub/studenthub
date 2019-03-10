import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider} from 'antd';
import { Typography } from 'antd';
import SignIn from './SignIn';
import Feeds from './components/pages/feeds/Feeds'
import logo from './assets/logo.jpg';
import './App.css';

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
      <div>

      {/* <Feeds /> */}
      <SignIn />
      </div>
    );
  }
}

export default App;
