import React, { Component } from 'react'
import { message, Input, Button, Form, Select, Typography } from 'antd';
import uuid from 'uuid';
import { API, Auth } from "aws-amplify";


const { Text } = Typography;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
export class CreateResources extends Component {
  constructor(props){
    super();

    this.state ={
      user: '',
      title:'',
      id: '',
      description:'',
      timestamp: '',
    };

  }

  async componentWillMount(){
    let user = await Auth.currentAuthenticatedUser();
    this.setState({userCognito: user});
  }

  handleChange(name, event){
    console.log(name, 'is now:', event.target.value);
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let user = this.state.userCognito;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
				let resource_title = values.title;
				let resourceId = 'resource-' + uuid.v4().toString(); 
				let resource_description = values.description;
				let created_by = user;
				let timestamp = new Date().toLocaleString();

        let apiName = 'posts';
        let path = '/resources/create-resource';
        let myInit = {
            body: { resource_title, resourceId, resource_description, created_by, timestamp}
        }
        await API.post(apiName, path, myInit).then(response => {
          console.log("created resource:", response);
        }).catch(error => {
          console.log("Coudln't create resource:", error)
        });
       
        console.log('Received values of form: ', values);

      } else {
        console.log(err);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;


    return (
      <Form onSubmit={this.handleSubmit} style={{ width: "50%"}}>
				<Text level={3} />Resource Title<Text/><br/>
        <Form.Item>
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input a title!' }],
          })(
            <Input placeholder="Title" />
          )}
        </Form.Item>
				<Text level={3} />Resource Description<Text/><br/>
        <Form.Item>
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input a description!' }],
          })(
            <TextArea placeholder="Description" />
          )}
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{width: '40%'}}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const WrappedCreateResourceForm = Form.create({ name: 'CreateResourceForm' })(CreateResources);
export default WrappedCreateResourceForm
