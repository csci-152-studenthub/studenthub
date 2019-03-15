import React, { Component } from 'react';
import {message, Layout, Col, Row, Divider, Form, Icon, Input, Button, Checkbox, Typography} from 'antd';
import { Auth } from "aws-amplify";
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

class ForgotPasswordComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      formType: 0,
      email: "",
      password: ""
    }
  }

  handleChange = event => {
    console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    // console.log(this.state);

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if(!err){
        console.log(values);

        var username = values.email;
        const response = await Auth.forgotPassword(username)
          .then(data => {console.log(data); message.success("Email sent!", 2.5); setTimeout(() => this.props.changeForm(3), 1)})
          .catch(err => {console.log(err); message.error(err.message, 2.5)});

      } else {
        console.log(err);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    var changeForm  =   this.props.changeForm;
    return (
      <div>
        <Title level={4} style={{paddingLeft: 0}}>Forgot Password?</Title>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item style={{paddingTop: 20}}>
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: 'The input is not valid E-mail!'},
                      { required: true, message: 'Please input your email!' }]
            })(
              <Input setFieldsValue={this.state.email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
            )}
          </Form.Item>

          <Form.Item>
            <Button loading={this.state.loading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
            Or <a onClick={() => changeForm(0)}>back to sign in.</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'forgot_password' })(ForgotPasswordComponent);

export default WrappedNormalLoginForm;