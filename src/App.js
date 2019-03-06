import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import {message, Layout, Col, Row, Divider} from 'antd';
import { Typography } from 'antd';
import logo from './assets/logo.jpg';
import './App.css';

import SignIn from './components/pages/auth/SignIn';
import Test from './Test';

const { Title } = Typography;


const {
  Header, Footer, Sider, Content,
} = Layout;

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      authenticated: false,
    }
  }

  componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({authenticated: true})
      console.log(user.attributes.email+' is signed in!');
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
      {this.state.authenticated ? <Test /> : <SignIn />}
      </div>
    );
  }
}

export default App;
