import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Typography, Select } from 'antd';
import { Auth } from "aws-amplify";
import '../../../App.css';
import './SignIn.css';

const { Title } = Typography;
const { Option, OptGroup } = Select;

class SignUpComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      buttonLoading: false,
      myValidateHelp: '',
      myValidateStatus: '',
    }

  }

  handleChange = event => {
    // console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(async (err, values) => {

      if (!err) {
        this.setState({
          myValidateHelp: '',
          myValidateStatus: '',
          buttonLoading: true
        });
        // console.log(values);
        let username = values.email;
        let password = values.password;
        let name = values.firstName;
        let family_name = values.lastName;
        let preferred_username = values.username;

        await Auth.signUp({
          username,
          password,
          attributes: {
            name,
            family_name,
            preferred_username,
            'custom:major': 'Computer Science',
          }
          })
          .then(data => {
            this.setState({buttonLoading: false});
            // console.log(data);
            this.props.changeEmail(username);
            message.success("Successfully signed up!", 2.5);
            setTimeout(() => message.success("Check your email to confirm your account!", 5), 500);
            setTimeout(() => this.props.changeForm(0), 500);
          })
          .catch(err => {
            this.setState({buttonLoading: false});
            // console.log(err);
            message.error(err.message, 2.5);
          });
      } else {
        // console.log(err);
        if (err.firstName || err.lastName) {
          this.setState({
            myValidateHelp: 'Please enter first name and last name',
            myValidateStatus: 'error'
          });
        }
      }
    });
  };

  render() {
    const { myValidateHelp, myValidateStatus } = this.state;
    const { getFieldDecorator } = this.props.form;
    var changeForm  =   this.props.changeForm;

    return (
      <div>
      <Title level={3} style={{paddingLeft: 0}}>Sign up</Title>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Input.Group compact>
            {getFieldDecorator('firstName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your first name!'
                }
              ],
            })(<Input style={{width: '50%'}} placeholder="First Name" />)}
            {getFieldDecorator('lastName', {
              rules: [
                {
                  required: true,
                  message: 'Please input your last name!'
                }
              ],
            })(<Input style={{width: '50%'}}  placeholder="Last Name" />)}
          </Input.Group>
        </Form.Item>
        <Form.Item
          hasFeedback
        >
          {getFieldDecorator('major', {
            rules: [
              { required: true, message: 'Please select your major!' },
            ],
          })(
            <Select placeholder="Please select a major">
              <OptGroup label="College of Science and Mathematics">
                <Option value="Biology">Biology</Option>
                <Option value="Chemistry">Chemistry</Option>
                <Option value="Computer Science">Computer Science</Option>
                <Option value="Mathematics">Mathematics</Option>
              </OptGroup>
              <OptGroup label="Lyles College of Engineering">
                <Option value="Civil Engineering">Civil Engineering</Option>
                <Option value="Computer Engineering">Computer Engineering</Option>
                <Option value="Electrical Engineering">Electrical Engineering</Option>
                <Option value="Mechanical Engineering">Mechanical Engineering</Option>
              </OptGroup>
              <OptGroup label="College of Social Sciences">
                <Option value="Geography">Geography</Option>
                <Option value="History">History</Option>
              </OptGroup>
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: 'Please input a username!'}
            ],
          })(
            <Input placeholder="Username" onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>
        <Form.Item>

          {getFieldDecorator('email', {
            rules: [
              { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$', message: 'Only edu emails can be accepted!'},
              { type: 'email', message: 'This is not a valid E-mail!'},
              { required: true, message: 'Please input your E-mail!'}
            ],
            })(
              <Input type="email" placeholder="Email" onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input a password!',
            }],
          })(
            <Input.Password setFieldsValue={this.state.password} onChange={this.handleChange} type="password" placeholder="Password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>

        <Form.Item>
          <Button loading={this.state.buttonLoading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">Sign Up</Button>
          Or <a onClick={() => changeForm(0)}>sign in!</a>
        </Form.Item>
      </Form>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'sign_up' })(SignUpComponent);

export default WrappedNormalLoginForm;
