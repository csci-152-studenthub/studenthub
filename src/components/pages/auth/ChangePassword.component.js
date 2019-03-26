import React, { Component } from 'react';
import {message, Form, Icon, Input, Button, Typography} from 'antd';
import { Auth } from "aws-amplify";
import '../../../App.css';

const { Title } = Typography;

class ChangePasswordComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      buttonLoading: false,
      formType: 0,
      email: "",
      code: "",
      new_password: ""
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
    // console.log(this.state);
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if(!err){
        this.setState({buttonLoading: true});
        console.log(values);

        var username = values.email;
        this.props.changeEmail(username);
        var code = values.code;
        var new_password = values.new_password;

        await Auth.forgotPasswordSubmit(username, code, new_password)
          .then(data => {
            this.setState({buttonLoading: false});
            console.log(data);

            message.success("Password changed!", 2.5);
            setTimeout(() => this.props.changeForm(0), 500);
          })
          .catch(err => {
            this.setState({buttonLoading: false});
            console.log(err);
            message.error(err.message, 2.5)
          });
      } else {
        console.log(err);
      }
    });

  }

  render() {
    const { getFieldDecorator } = this.props.form;
    var changeForm  =   this.props.changeForm;
    var email = this.props.email;
    return (
      <div>
        <Title level={4} style={{paddingLeft: 0}}>Change password</Title>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item style={{paddingTop: 10}}>
            {getFieldDecorator('email', {
              rules: [
                { type: 'email', message: 'The input is not valid E-mail!'},
                { required: true, message: 'Please input your email!' }],
              initialValue: email
            })(
              <Input setFieldsValue={email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
            )}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('code', {
              rules: [
                { max: 6, message: 'Code can only be 6 characters long!'},
                { required: true, message: 'Please input your code!' }
              ],
            })(
              <Input setFieldsValue={this.state.code} onChange={this.handleChange} prefix={<Icon type="ant-design" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Code" />
            )}
          </Form.Item>
          <Form.Item >
            {getFieldDecorator('new_password', {
              rules: [{ required: true, message: 'Please input your new password!' }],
            })(
              <Input setFieldsValue={this.state.new_password} onChange={this.handleChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="New password" />
            )}
          </Form.Item>

          <Form.Item>
            <Button loading={this.state.buttonLoading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
            Or <a href="#" onClick={() => changeForm(0)}>back to sign in.</a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'change_password' })(ChangePasswordComponent);

export default WrappedNormalLoginForm;
