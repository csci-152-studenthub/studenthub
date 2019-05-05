import React, { Component } from 'react'
import { message, Input, Button, Form, Select, Typography, Modal, Icon } from 'antd';
import moment from 'moment';
import uuid from 'uuid';
import { API, Auth } from "aws-amplify";


const { Text } = Typography;
const { TextArea } = Input;
let id = 0;
export class CreateResource extends Component {
  constructor(props){
    super(props);
    this.state ={
      visible: true,
    };
  }

  async componentWillMount(){
    let { attributes } = await Auth.currentAuthenticatedUser();
    this.setState({user: attributes.preferred_username, userEmail: attributes.email});
  }

  handleChange(name, event){
    console.log(name, 'is now:', event.target.value);
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    let user = this.state.userEmail;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let noteCards = []
        for(let i in values.noteCard_term){
          let card = { term: values.noteCard_term[i], definition: values.noteCard_definition[i], flipped: false};
          noteCards.push(card)
        }

				let resource_title = values.title;
				let resourceId = 'resource-' + uuid.v4().toString(); 
        let resource_description = values.description;
        let resource_noteCards = noteCards;
        let image_uri = values.uri;
				let created_by = user;
        let timestamp = moment().format();
        
        let apiName = 'posts';
        let path = '/resources/create-resource';
        let myInit = {
            body: { resource_title, resourceId, resource_description, resource_noteCards, created_by, image_uri, timestamp}
        }
        await API.post(apiName, path, myInit).then(response => {
          console.log("created resource:", response);
          this.props.handleCards(true);
        }).catch(error => {
          console.log("Coudln't create resource:", error)
        });
        this.props.handleComponent(false); //sends false to Resources component
        // console.log('Received values of form: ', values);

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

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { myValidateHelp, myValidateStatus } = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        label={index === 0 ? 'Note Card' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`noteCard_term[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input something to define in this field",
          }],
        })(
          <div>
            <Input placeholder="Term" style={{ width: '60%', marginRight: 8 }} />
          </div>
        )}
        {getFieldDecorator(`noteCard_definition[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input something to define in this field",
          }],
        })(
          <div>
            <TextArea placeholder="Definition" rows={1} style={{ width: 500}}/>
          </div>
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));


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
          <Text level={3} />Title<Text/><br/>
          <Form.Item>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a title!' }],
            })(
              <Input placeholder="Title" style={{ width: 300, lineHeight: 0}} />
            )}
          </Form.Item>
          <Text level={3} />Description<Text/>
          <Form.Item>
            {getFieldDecorator('description', {
              rules: [{ required: true, message: 'Please input a description!' }],
            })(
              <TextArea placeholder="Description" rows={1} style={{ width: 500}}/>
            )}
          </Form.Item>
          {formItems}
          <Form.Item>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> Add Note Cards
            </Button>
          </Form.Item>
         
        </Form>
      </Modal>
    )
  }
}

const WrappedCreateResourceForm = Form.create({ name: 'CreateResourceForm' })(CreateResource);
export default WrappedCreateResourceForm
