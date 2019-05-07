import React, { Component } from 'react';
import {message, Form, Icon, Input, Button, Typography} from 'antd';
import { Auth } from "aws-amplify";
// import logo from '../../../assets/logo.jpg';
import '../../../App.css';

const { Title } = Typography;


// const {
//   Header, Footer, Sider, Content,
// } = Layout;

class ForgotPasswordComponent extends Component {
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

  componentDidMount(){
    this.setState({email: this.props.email});
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
        this.setState({buttonLoading: true});
        console.log(values);
        this.props.changeEmail(values.email);

        var username = values.email;
        await Auth.forgotPassword(username)
          .then(data => {
            this.setState({buttonLoading: false});
            console.log(data);
            message.success("Please check your email for your verification code!", 3);
            setTimeout(() => this.props.changeForm(3), 1);
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
        <Title level={4} style={{paddingLeft: 0}}>Forgot Password</Title>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item style={{paddingTop: 10}}>
            {getFieldDecorator('email', {
              rules: [{ type: 'email', message: 'The input is not valid E-mail!'},
                      { required: true, message: 'Please input your email!' }],
              initialValue: email
            })(
              <Input setFieldsValue={this.state.email} onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} type="email" placeholder="Email" />
            )}
          </Form.Item>

          <Form.Item>
            <Button loading={this.state.buttonLoading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button">
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
