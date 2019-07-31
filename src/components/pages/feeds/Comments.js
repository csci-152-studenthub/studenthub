import React, { Component } from 'react';
import { API } from "aws-amplify";
import {
  Comment, Avatar, Form, Button, List, Input, Tooltip, Popconfirm, Divider, Typography,
} from 'antd';
import moment from 'moment';
import uuid from "uuid";
import Skeleton from "antd/lib/skeleton";

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
      id: '',
    }
  }

  componentDidMount() {
    if(this.props.id !== undefined) {
      // console.log("Comments modal received: ", this.props);
      this.getComments(this.props.id);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.id !== prevProps.id){
      this.setState({commentsLoading: true});
      // console.log("Getting comments for ref with id: ", this.props.id);
      this.getComments(this.props.id);
    }
  }

  async getComments(id){
    this.setState({ comments: [], commentsLoading: true, id});
    let ref = id;

    let apiName = 'posts';
    let path = '/comments/get-comments';

    let myInit = {
      body: { ref }
    };
    await API.post(apiName, path, myInit).then(response => {
      if (response.body.length === 0){
        // console.log("No comments found.");
        this.setState({comments: []});
      } else {
        let commentsTemp = response.body;
        // console.log("Comments: ", commentsTemp);

        commentsTemp.forEach(comment => {
          // console.log("ref:"+comment.content)
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
        });
        this.setState({commentsLoading: false})
      }
    }).catch(e => {
      console.log("Error in getting comments: ", e);
      this.setState({commentsLoading: false})
    })
  }

  setComments(){
    let comments = this.state.comments;

    // console.log("Setting comments in modal...");
    comments.forEach(comment => {
      // console.log(`Adding comment '${comment.content} to state.`);
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
    });
    this.setState({commentsLoading: false})
  }

  async postComment(){
    this.setState({commentsLoading: true, submitting: true});

    let user = this.props.user;
    let commentId = 'comment-'+uuid.v4().toString();
    let timestamp = moment().format();
    let content = this.state.commentContent;
    let ref = this.props.id;

    let apiName = 'posts';
    let path = '/comments/post-comment';

    let myInit = {
      body: {commentId, timestamp, user, content, ref}
    };
    await API.post(apiName, path, myInit).then(response => {
      // console.log("Successfully posted comment: ", response);
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
      this.setState({commentsLoading: false, submitting: false});
    }).catch(e => {
      console.log("Error in posting comment: ", e);
      this.setState({commentsLoading: false, submitting: false});
    })
  }

  handleSubmit = () => {
    if (!this.state.commentContent) {
      return;
    }
    this.postComment();
  };

  handleChange = (e) => {
    this.setState({
      commentContent: e.target.value,
    });
  };

  async handleDelete(item){
    // console.log(`Deleting post with id: ${item.id}`);
    this.setState({commentsLoading: true});

    let apiName = 'posts';
    let path = '/comments/delete-comment';
    let myInit = {
      body: {
        id: item.id,
        timestamp: item.datetime
      }
    };
    await API.del(apiName, path, myInit).then(response => {
      // console.log(response);
      this.removeComment(item.id);
    }).catch(error => {
      console.log(error.response)
    });
  }

  // Manually remove comment deleted from state - one less api to call
  removeComment(id){
    let { comments } = this.state;
    let index = comments.map(function(comment) {
      return comment.id
    }).indexOf(id);

    comments.splice(index, 1);
    this.setState({comments, commentsLoading: false});
  }

  render() {

    const blankData = [];
    for (let i = 0; i < this.state.comments.length; i++) {
      blankData.push({
        title: `Blank title`,
        description: 'Blank description',
        content: 'Blank content',
      });
    }

    let comments = this.state.comments === [] ? blankData : this.state.comments;

    let { submitting, commentContent, commentsLoading } = this.state;
    const user = this.props.user;

    const Timestamp = ({time}) => (
      <Tooltip title={moment(time).format('MMMM Do YYYY, h:mm:ss a')}>
        <span>{moment(time).fromNow()}</span>
      </Tooltip>
    );

    const DeleteIcon = ({ item }) => (
      <span>
          <Popconfirm title="Are you sure delete this comment?" onConfirm={() => this.handleDelete(item)} onCancel={() => {return null}} okText="Yes" cancelText="No">
            <span>Delete</span>
          </Popconfirm>
      </span>
    );

    return (
      <div>
        <Divider orientation="left"><Text style={{fontSize: 20}}>Add Comment</Text></Divider>
        <Editor
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          submitting={submitting}
          value={commentContent}
        />
        <List
          itemLayout="horizontal"
          dataSource={comments}
          pagination={{pageSize: 5}}
          renderItem={item => (
            <Skeleton loading={commentsLoading}>
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
            </Skeleton>
          )}
        />
      </div>
    );
  }
}