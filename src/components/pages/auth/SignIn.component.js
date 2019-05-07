import React, { Component } from 'react';
import {message, Form, Icon, Input, Button, Checkbox} from 'antd';
import { Auth } from "aws-amplify";
import { Typography } from 'antd';
// import logo from '../../../assets/logo.jpg';
// import '../../../App.css';
import './SignIn.css';

const { Title } = Typography;


// const {
//   Header, Footer, Sider, Content,
// } = Layout;

class SignInComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      buttonLoading: false,
      formType: 0,
      email: "",
      password: ""
    }
  }

  handleChange = event => {
    // console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if(!err){
        this.setState({buttonLoading: true});
        this.props.changeEmail(values.email);
        // console.log(values);
        var email = values.email;
        var password = values.password;
        await Auth.signIn(email, password)
          .then(data => {
            this.setState({buttonLoading: false});
            // console.log(data);
            message.success("Signed In!", 2.5);
            this.props.history.push("/home");
          })
          .catch(err => {
            this.setState({buttonLoading: false});
            // console.log(err);
            message.error(err.message, 2.5);
          });
      } else {
        // console.log(err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    var changeForm  =   this.props.changeForm;
    var email = this.props.email;
    return (
      <div>
      <Title level={3} style={{paddingLeft: 0}}>Sign in</Title>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item style={{paddingTop: 10}}>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', message: 'The input is not valid E-mail!'},
                    { required: true, message: 'Please input your email!' }],
            initialValue: email
          })(
            <Input setFieldsValue={email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
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
          <a href="#" className="login-form-forgot" onClick={() => changeForm(1)}>Forgot password</a>
          <Button loading={this.state.buttonLoading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="#" onClick={() => changeForm(2)}>sign up now!</a>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'sign_in' })(SignInComponent);

export default WrappedNormalLoginForm;
