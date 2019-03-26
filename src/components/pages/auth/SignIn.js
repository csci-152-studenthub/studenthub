import React, { Component } from 'react';
import { Divider, Form} from 'antd';
import { Typography } from 'antd';
import logo from '../../../assets/logo.jpg';
import '../../../App.css';
import './SignIn.css';


import SignInComponent from './SignIn.component';
import ForgotPasswordComponent from './ForgotPassword.component';
import SignUpComponent from './SignUp.component';
import ChangePasswordComponent from './ChangePassword.component';

const { Title } = Typography;

class SignIn extends Component {
  constructor(props){
    super(props);

    this.state = {
      formType: 0,
      email: ''
    }

  }

  changeForm = (type) => {
    this.setState({formType: type});
  }

  changeEmail = (email) => {
    console.log("Setting email to: ", email);
    this.setState({email: email});
  }

  renderForm(){
    var formType = this.state.formType;
    if(formType === 0){
      return (<SignInComponent changeForm = {this.changeForm} changeEmail={this.changeEmail} email={this.state.email} history={this.props.history}/>)
    } else if (formType === 1) {
      return (<ForgotPasswordComponent changeForm = {this.changeForm} changeEmail={this.changeEmail} email={this.state.email}/>)
    } else if (formType === 2) {
      return (<SignUpComponent changeForm = {this.changeForm} changeEmail={this.changeEmail} email={this.state.email}/>)
    } else if (formType === 3) {
      return (<ChangePasswordComponent changeForm = {this.changeForm} changeEmail={this.changeEmail} email={this.state.email}/>)
    }
  }

  render() {
    return (
      <div className="register-container">
        <img src={logo} alt="Logo" className="item-image"/>
        <Divider type="vertical" className="item-col-line" />
        <div className="item-sign-in">
          <Title>StudentHub</Title>
          {this.renderForm()}
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(SignIn);

export default WrappedNormalLoginForm;
