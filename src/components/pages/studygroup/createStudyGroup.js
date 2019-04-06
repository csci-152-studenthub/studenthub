
import React from 'react';
import 'antd/dist/antd.css';
import {
  Form, Input, Icon, Button, 
} from 'antd';
import { Auth, API } from "aws-amplify";
import uuid from "uuid";



let id = 0;


class CreateStudyGroup extends React.Component {
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log(values);
        let group_name=values.studygroupName;
        let course=values.course;
        let professor=values.professor;
        let members=values.names;
        let groupId = 'studygroup-'+uuid.v4().toString()
        
        let apiName = 'posts';
        let path = '/studygroups/create-studygroup';
        let myInit = {
            body: {groupId,group_name,course,professor,members}
        }
        await API.post(apiName, path, myInit).then(response => {
          console.log(response);
        }).catch(error => {
          console.log(error.response)
        });
       
      }
    });
  }



  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 8 },
      },
    };
    
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 8,
        },
      },
    };
    

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Members E-mail' : ''}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [{
            required: true,
            whitespace: true,
            message: "Please input members email or delete this field.",
          },
          { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$', message: 'Only edu emails can be accepted!'},
          { type: 'email', message: 'This is not a valid E-mail!'},
          { required: true, message: 'Please input your E-mail!'}],
        })(
          <Input placeholder="Members E-mail" style={{ width: '60%', marginRight: 8 }} />
        )}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            disabled={keys.length === 1}
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        
        <Form.Item
          label="Study Group Name"
        >
          {getFieldDecorator('studygroupName', {
            rules: [
              {required: true, message: 'Please input a study group name!',
            }],
          })(
            <Input placeholder="Gold Team Study Group CSCI 152" />
          )}
        </Form.Item>
        <Form.Item
          label="Course"
        >
          {getFieldDecorator('course', {
            rules: [{
              required: true, message: 'Please input a course for this study group',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input placeholder="Math 101" />
          )}
        </Form.Item>
        <Form.Item
          label="Professor"
        >
          {getFieldDecorator('professor', {
            rules: [{
              required: true, message: 'Please input a professor for the course!',
            }],
          })(
            <Input placeholder="Dr Liu" />
          )}
        </Form.Item>
        {formItems}
        
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add study group members
          </Button>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Create the group</Button>
        </Form.Item>
      </Form>
    );
  }
}

const CreateStudyGroupForm = Form.create({ name: 'CreateStudygroup' })(CreateStudyGroup);

export default CreateStudyGroupForm;
          