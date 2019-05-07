import React, { Component } from 'react'
import { message, Input, Button, Form, Select} from 'antd';
import { Auth } from "aws-amplify";

const { Option, OptGroup } = Select;

export class EditAccountInfo extends Component {
  constructor(props){
    super();

    this.state ={
      email: '',
      currentUser: '',
      preferredUsername: '',
      firstName:'',
      lastName: '',
      phoneNumber:'',
      myValidateHelp: '',
      myValidateStatus: '',
    };

  }

  async componentWillMount(){
    // console.log(this.props.userAttributes);
    let user = await Auth.currentAuthenticatedUser();
    this.setState({userCognito: user});
  }

  handleChange(name, event){
    // console.log(name, 'is now:', event.target.value);
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let user = this.state.userCognito;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          myValidateHelp: '',
          myValidateStatus: ''
        });
        // console.log('Received values of form: ', values);

        await Auth.updateUserAttributes(user, {
          'preferred_username': values.username,
          'name': values.firstName,
          'family_name': values.lastName,
          'custom:major': values.major
        }).then((response) => {
          // console.log('Success:', response);
          message.success("Information Updated!");
          this.props.closeDrawer();
        }).catch((error) => {
          console.log('Encountered error in updating information:', error);
          message.error("Encountered error in updating information");
        });

      } else {
        console.log(err);
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
    const { getFieldDecorator } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;

    let userAttributes = this.props.userAttributes;

    return (
      <Form onSubmit={this.handleSubmit} style={{maxWidth: '300'}}>
        <Form.Item>
          {getFieldDecorator('username', {
            initialValue: userAttributes.preferred_username,
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item
          help={myValidateHelp}
          validateStatus={myValidateStatus}
        >
          <Input.Group compact>
            {getFieldDecorator('firstName', {
              initialValue: userAttributes.name,
              rules: [
                {
                  required: true,
                  message: 'Please input your first name!'
                }
              ],
            })(<Input style={{width: '50%'}} placeholder="First Name" />)}
            {getFieldDecorator('lastName', {
              initialValue: userAttributes.family_name,
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
            initialValue: userAttributes["custom:major"],
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
          <Button type="primary" htmlType="submit" style={{width: '100%'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedEditAccountInfo = Form.create({ name: 'edit_account_info' })(EditAccountInfo);
export default WrappedEditAccountInfo
