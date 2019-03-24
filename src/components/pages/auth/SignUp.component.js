import React, { Component } from 'react';
import {message, Form, Icon, Input, Button, AutoComplete, Select, Typography} from 'antd';
import { Auth } from "aws-amplify";
// import logo from '../../../assets/logo.jpg';
import '../../../App.css';
import './SignIn.css';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

const { Title } = Typography;

// const {
//   Header, Footer, Sider, Content,
// } = Layout;

class SignUpComponent extends Component {
  constructor(props){
    super(props);

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      buttonLoading: false
    }

  }

  handleChange = event => {
    // console.log(`${event.target.id} is now: `, event.target.value);
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll(async (err, values) => {

      if (!err) {
        this.setState({buttonLoading: true});
        console.log(values);
        const username = values.email;
        const password = values.password;
        const phone_number = values.prefix+values.phone

        const response = await Auth.signUp({
          username,
          password,
          attributes: {
              phone_number,   // optional - E.164 number convention
              // other custom attributes
          },
          })
          .then(data => {
            this.setState({buttonLoading: false});
            console.log(data);
            this.props.changeEmail(username);
            message.success("Successfully signed up!", 2.5);
            setTimeout(() => this.props.changeForm(0), 500);
          })
          .catch(err => {
            this.setState({buttonLoading: false});
            console.log(err);
            message.error(err.message, 2.5);
          });
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    var changeForm  =   this.props.changeForm;
    var email = this.props.email;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+1',
    })(
      <Select style={{ width: 70 }}>
        <Option value="1">+1</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <div>
      <Title level={3} style={{paddingLeft: 0}}>Sign up</Title>
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$', message: 'Only edu emails can be accepted!'},
              { type: 'email', message: 'This is not a valid E-mail!'},
              { required: true, message: 'Please input your E-mail!'}
            ],
            })(
              <Input type="email" placeholder="Email" setFieldsValue={email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input setFieldsValue={this.state.password} onChange={this.handleChange} type="password" placeholder="Password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input setFieldsValue={this.state.confirm_password} onChange={this.handleChange} type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}/>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input setFieldsValue={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" addonBefore={prefixSelector} style={{ width: '100%' }} />
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
