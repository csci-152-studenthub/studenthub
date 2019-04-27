import React, { Component } from 'react'
import { message, Input, Button, Form, Select, Typography, Modal } from 'antd';
import uuid from 'uuid';
import { API, Auth } from "aws-amplify";


const { Text } = Typography;
const { Option, OptGroup } = Select;
const { TextArea } = Input;
export class CreateResource extends Component {
  constructor(props){
    super(props);

    this.state ={
      visible: true,
      user: '',
      title:'',
      id: '',
      description:'',
      uri: '',
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
        let image_uri = values.uri;
				let created_by = user;
				let timestamp = new Date().toLocaleString();

        let apiName = 'posts';
        let path = '/resources/create-resource';
        let myInit = {
            body: { resource_title, resourceId, resource_description, created_by, image_uri, timestamp}
        }
        await API.post(apiName, path, myInit).then(response => {
          console.log("created resource:", response);
          this.props.handleCards(true);
        }).catch(error => {
          console.log("Coudln't create resource:", error)
        });
        this.props.handleComponent(false); //sends false to Resources component
        console.log('Received values of form: ', values);

      } else {
        console.log(err);
      }
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.handleComponent(false); //sends false to Resources component
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;


    return (
      <Modal
      title="Create a Flashcard"
      style={{top: 30, width: "50%"}}
      visible={this.state.visible}
      onOk={this.handleSubmit}
      onCancel={this.handleCancel}
      okText="Submit"
      >
        <Form onSubmit={this.handleSubmit}>
          <Text level={3} />Flashcard Term<Text/><br/>
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a term!' }],
            })(
              <Input placeholder="Term" style={{ width: 300}} />
            )}
          </Form.Item>
          <Text level={3} />Flashcard Definition<Text/><br/>
          <Form.Item>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input a definition!' }],
            })(
              <TextArea placeholder="Definitions" rows={4} style={{ width: 500}}/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const WrappedCreateResourceForm = Form.create({ name: 'CreateResourceForm' })(CreateResource);
export default WrappedCreateResourceForm
