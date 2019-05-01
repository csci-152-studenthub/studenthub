import React, { Component } from 'react';
import { API } from "aws-amplify";
import {
  Comment, Avatar, Form, Button, List, Input, Tooltip, Popconfirm, Divider, Typography, message
} from 'antd';
import moment from 'moment';
import uuid from "uuid";

const TextArea = Input.TextArea;
const { Text, Paragraph } = Typography;

const Editor = ({
                  onChange, onSubmit, submitting, value,
                }) => (
  <div>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Submit
      </Button>
    </Form.Item>
  </div>
);

export default class Comments extends Component {
  constructor(props){
    super(props);

    this.state ={
      commentContent: '',
      comments: [],
      submitting: false,
    }
  }

  componentDidMount() {
    console.log("Comments modal received: ", this.props.comments);
    if(this.props.comments !== undefined) {
      this.setComments(this.props.comments);
    }
  }

  setComments(comments){
    console.log("Setting comments in modal...");
    comments.forEach(comment => {
      console.log(`Adding comment '${comment.content} to state.`);
      this.setState(prevState => ({
        comments: [
          ...prevState.comments,
          {
            id: comment.commentId,
            datetime: comment.timestamp,
            author: comment.user,
            content: comment.content,
            avatar: (<Avatar size={38}  style={{ backgroundColor: '#1890FF', top: 10 }} icon="user" />)
          }
        ]
      }))
    })
  }

  // async getComments(){
  //   let ref = this.props.post.id;
  //
  //   let apiName = 'posts';
  //   let path = '/comments/get-comments';
  //
  //   let myInit = {
  //     body: { ref }
  //   };
  //   await API.post(apiName, path, myInit).then(response => {
  //     console.log("Successfully got comments: ", response);
  //   }).catch(e => {
  //     console.log("Error in getting comments: ", e);
  //   })
  // }

  async postComment(){
    let user = this.props.user;
    let commentId = 'comment-'+uuid.v4().toString();
    let timestamp = moment().format();
    let content = this.state.commentContent;
    let ref = this.props.post.id;
    console.log(`Adding comment '${content}' to post '${this.props.post.title}`);

    let apiName = 'posts';
    let path = '/comments/post-comment';

    let myInit = {
      body: {commentId, timestamp, user, content, ref}
    };
    await API.post(apiName, path, myInit).then(response => {
      console.log("Successfully posted comment: ", response);
      this.setState(prevState => ({
        submitting: false,
        commentContent: '',
        comments: [
          {
            id: commentId,
            datetime: timestamp,
            author: user,
            content: content,
            avatar: (<Avatar size={38}  style={{ backgroundColor: '#1890FF', top: 10 }} icon="user" />)
          },
          ...prevState.comments,
        ]
      }));
    }).catch(e => {
      console.log("Error in posting comment: ", e);
    })
  }

  handleSubmit = () => {
    if (!this.state.commentContent) {
      return;
    }

    this.setState({
      submitting: true,
    });

    this.postComment();

  };

  handleChange = (e) => {
    this.setState({
      commentContent: e.target.value,
    });
  };

  async handleDelete(item){
    console.log(`Deleting post with id: ${item.id}`);

    let apiName = 'posts';
    let path = '/comments/delete-comment';
    let myInit = {
      body: {
        id: item.id,
        timestamp: item.datetime
      }
    };
    await API.del(apiName, path, myInit).then(response => {
      console.log(response);
      this.removeComment(item.id);
    }).catch(error => {
      console.log(error.response)
    });
  }

  removeComment(id){
    let { comments } = this.state;
    let index = comments.map(function(comment) {
      return comment.id
    }).indexOf(id);

    comments.splice(index, 1);
    this.setState({comments});
  }

  render() {
    const { comments, submitting, commentContent } = this.state;
    const user = this.props.user;

    const Timestamp = ({time}) => (
      <Tooltip title={moment(time).format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(time).fromNow()}</span>
      </Tooltip>
    );

    const DeleteIcon = ({ item }) => (
      <span>
          <Popconfirm title="Are you sure delete this comment?" onConfirm={() => this.handleDelete(item)} onCancel={() => console.log('Canceled comment deletion.')} okText="Yes" cancelText="No">
            <span>Delete</span>
          </Popconfirm>
      </span>
    );

    return (
      <div>
        <List
          itemLayout="horizontal"
          dataSource={comments}
          renderItem={item => (
            <Comment
              actions={user === item.author ? [<DeleteIcon item={item}/> ] : null}
              author={<Text style={{fontSize: 14}}>{item.author}</Text>}
              avatar={item.avatar}
              content={
                <Paragraph ellipsis={{ rows: 4, expandable: true }}>
                  {item.content}
                </Paragraph>
                }
              datetime={(<Timestamp time={item.datetime} />)}
            />
          )}
        />
        <Divider orientation="left"><Text style={{fontSize: 22}}>Add Comment</Text></Divider>
        <Editor
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          submitting={submitting}
          value={commentContent}
        />
      </div>
    );
  }
}