import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider, Form, Icon, Input, Button, Checkbox} from 'antd';
import { Auth } from "aws-amplify";
import { Typography } from 'antd';
// import { Link, withRouter } from "react-router-dom";
import logo from './assets/logo.jpg';
import './App.css';
import './signIn.css';

import SignInComponent from './SignIn.component';
import ForgotPasswordComponent from './ForgotPassword.component';
import SignUpComponent from './SignUp.component';
import ChangePasswordComponent from './ChangePassword.component';

const { Title } = Typography;


const {
  Header, Footer, Sider, Content,
} = Layout;

const success = () => {
  message.loading('Action in progress..', 2.5)
    .then(() => message.success('Loading finished', 2.5));
  };

class SignIn extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      formType: 2,
      email: "",
      password: "",
    }

  }

  componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => console.log(user.attributes.email+' is signed in!'))
    .catch(err => console.log(err));
  }

  changeForm = (type) => {
    this.setState({formType: type})
  }

  handleChange = event => {
    console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    console.log(this.state);

    try {
      const response = await Auth.signIn(this.state.normal_login_email, this.state.normal_login_password);
      // console.log(response);
      message.success("Logged in", 2.5);
    } catch (e) {
      message.error(e.message, 2.5)
    }
  }

  renderForm(){
    var formType = this.state.formType;
    if(formType === 0){
      return (<SignInComponent changeForm = {this.changeForm} />)
    } else if (formType === 1) {
      return (<ForgotPasswordComponent changeForm = {this.changeForm} />)
    } else if (formType === 2) {
      return (<SignUpComponent changeForm = {this.changeForm} />)
    } else if (formType === 3) {
      return (<ChangePasswordComponent changeForm = {this.changeForm} />)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="register-container">
        <img src={logo} alt="Logo" className="item-image"/>
        <Divider type="vertical" className="item-col-line" />
        <div className="item-sign-in">
          <Title>StudentHub</Title>
          {this.renderForm()}
        </div>
      </div>
      // <div>
      //   <Row type="flex" align="middle"  justify="space-around" style={{ paddingTop: 100}}>
      //     <Col span={6} >
      //       <img src={logo} alt="Logo" style={{ height: 400, paddingLeft: 200, paddingRight: 10}}/>
      //       </Col>
      //     <Col span={1}><Divider type="vertical" style={{height: 300, left: 125}} /></Col>
      //     <Col span={10}>
      //       <Title style={{paddingLeft: 0}}>StudentHub</Title>
      //       {this.renderForm()}
      //     </Col>
      //   </Row>
      // </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(SignIn);

export default WrappedNormalLoginForm;
