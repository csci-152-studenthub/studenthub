import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import './App.css';
import {
  Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, message
} from 'antd';

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class RegistrationForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
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
      console.log('handleSubmit e: ', e);

      try{
        this.props.form.validateFieldsAndScroll(async (err, values) => {
          const username = values.email;
          const password = values.password;
          const phone_number = values.prefix+values.phone
          if (!err) {
            // console.log(values.prefix+values.phone);
            console.log('Received values of form: ', values);
              const response = await Auth.signUp({
                username,
                password,
                attributes: {
                    phone_number,   // optional - E.164 number convention
                    // other custom attributes
                },
                })
                .then(data => {console.log(data); message.success("Successfully signed up!", 2.5)})
                .catch(err => {console.log(err); message.error(err)});
          }
        });
      } catch (e) {
        console.log(e);
      }
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+1',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (
      <Form onSubmit={this.handleSubmit} className="sign-up">
        <Form.Item
          {...formItemLayout}
          label="E-mail"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not valid E-mail!',
            }, {
              required: true, message: 'Please input your E-mail!',
            }],
          })(
            <Input setFieldsValue={this.state.email} onChange={this.handleChange} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input setFieldsValue={this.state.password} onChange={this.handleChange} type="password" />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input setFieldsValue={this.state.confirm_password} onChange={this.handleChange} type="password" onBlur={this.handleConfirmBlur} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input setFieldsValue={this.state.phone_number} onChange={this.handleChange} addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button onClick={this.handleSubmit} type="primary" htmlType="submit">Register</Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

export default WrappedRegistrationForm;
