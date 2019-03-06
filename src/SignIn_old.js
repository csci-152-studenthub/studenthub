import React from 'react';
import { Auth } from "aws-amplify";

import './App.css';

import {
  Form, Icon, Input, Button, Checkbox, message
} from 'antd';

class SignIn extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      email: "",
      password: ""
    }

    this.switchLoading = this.switchLoading.bind(this);
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


  // handleSubmit = async (e) => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       event.preventDefault();
  //       try {
  //         await Auth.signIn(this.state.email, this.state.password);
  //         alert("Logged in");
  //       } catch (e) {
  //         alert(e.message);
  //       }
  //     }
  //   });
  // }

  switchLoading() {
    this.setState(state => ({
      loading: true
    }));
    message.loading('Signing in...', 2.5)
      .then(() => message.success('Signed in!', .5));
    this.setState(state => ({
      loading: false
    }));
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item style={{paddingTop: 20}}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input setFieldsValue={this.state.email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input setFieldsValue={this.state.password} onChange={this.handleChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" >Forgot password</a>
          <Button loading={this.state.loading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a >register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Sign);

export default WrappedNormalLoginForm;
