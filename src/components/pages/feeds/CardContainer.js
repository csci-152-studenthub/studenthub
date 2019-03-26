import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import { Avatar, message, Input, List, Skeleton, Popconfirm, Icon, Typography, Button } from 'antd';
import uuid from "uuid";
import './CardContainer.css'

const { Title } = Typography;
const { TextArea } = Input;
export class CardContainer extends Component {
    
  constructor(props){
    super(props);

    this.state = {
      buttonLoading: false,
      loading: true,
      user: '',
      posts: [],
      component: 1,
      title: '',
      content: ''
    }

    this.getPosts = this.getPosts.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
  }

  async componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
    })
    .catch(err => console.log(err));
    this.getPosts();
  }

  handleChange(type, e){
    console.log(type, 'is now: ', e.target.value);
    this.setState({
      [type]: e.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({buttonLoading: true});

    try {
      var timestamp = new Date().toLocaleString();
      const response = await this.createPost({
        likes: 0,
        dislikes: 0,
        timestamp: timestamp,
        id: uuid.v4().toString(),
        user: this.state.user,
        title: this.state.title,
        content: this.state.content
      });
      this.setState({buttonLoading: false});
      message.success('Post has been created!');
      this.getPosts();
      console.log(response);
    } catch (e) {
      this.setState({buttonLoading: false});
      message.error('Could not create post.')
      console.log(e);
    }
  }

  createPost(post) {
    return API.post("posts", "/posts/create", {
      body: post
    });
  }

  async getPosts() {
    this.setState({
      posts: [],
      loading: true
    })

    try {
      const posts = await API.get("posts", "/posts/get-posts");
      // this.setState({posts});
      posts.body.map((post) => (
        this.setState({
          posts: [
            ...this.state.posts,
            {
              timestamp: post.timestamp,
              id: post.id,
              user: post.user,
              title: post.title,
              content: post.content
            }
          ]
        })
      ));
      // console.log(posts.body);
      message.success('Successfully retrieved posts!');
      this.setState({loading: false});
    } catch (e) {
      console.log(e);
      this.setState({loading: false});
    }
  }

  deletePost(id, timestamp){
    console.log(`Deleting post with id: ${id}`)
    let apiName = 'posts';
    let path = '/posts/delete-post';
    let myInit = {
        body: {
          id: id,
          timestamp: timestamp
        }
    }
    API.del(apiName, path, myInit).then(response => {
        // Add your code here
        message.success('Successfully deleted post!')
        this.getPosts();
        console.log(response);
    }).catch(error => {
        message.error('Could not delete post.')
        console.log(error.response)
    });
  }

  handleActionClick(type){
    console.log('Like button pressed!');
  }

  handleLike(post){
    console.log('User liked post: ', post.title);

    let apiName = 'posts';
    let path = '/posts/'+post.id+'/like';
    console.log('api: '+path)
    let myInit = {
        body: {
          timestamp: post.timestamp
        }
    }
    API.put(apiName, path, myInit).then(response => {
        // Add your code here
        message.success('Successfully liked post!')
        console.log(response);
    }).catch(error => {
        message.error('Could not like post.')
        console.log(error.response)
    });
  }

    handleDislike(post){
      console.log('User disliked post: ', post.title);

      let apiName = 'posts';
      let path = '/posts/'+post.id+'/dislike';
      console.log('api: '+path)
      let myInit = {
          body: {
            timestamp: post.timestamp
          }
      }
      API.put(apiName, path, myInit).then(response => {
          // Add your code here
          message.success('Successfully disliked post!')
          console.log(response);
      }).catch(error => {
          message.error('Could not like post.')
          console.log(error.response)
      });
    }

  render() {
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 2}} />
        {text}
      </span>
    );
    const DeleteIcon = ({ createdBy, id, timestamp }) => (
      <span>
        {this.state.user === createdBy ?
          <Popconfirm title="Are you sure delete this post?" onConfirm={() => this.deletePost(id, timestamp)} onCancel={() => console.log('Canceled post deletion.')} okText="Yes" cancelText="No">
            <Icon type="delete" style={{ right: 5}} />
          </Popconfirm>
          : null
        }
      </span>
    );
    const data = this.state.posts
    return(
      <div className="card-container">
        <div className="item-post">
          <Title>Feeds</Title>
          <Input placeholder="Post title" style={{maxWidth: '300px'}} onChange={(e) => this.handleChange('title', e)}/>
          <TextArea placeholder="Post content" rows={4} style={{top: 15}} onChange={(e) => this.handleChange('content', e)}/>
          <Button loading={this.state.buttonLoading} type="primary" onClick={this.handleSubmit} style={{top: 25}}>Submit Post</Button>
          <Button type="primary" onClick={() => console.log(this.state.posts)} style={{top: 25, left: 15}}>Console Log posts</Button>
        </div>
      <div className="item-feed">
        {data === [] ? null :
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
          
            dataSource={data}
            renderItem={item => (
              <List.Item
                key={item.id}
                actions={!this.state.loading && [<IconText type="like-o" text="156" />, <IconText type="dislike-o" text="156" />, <IconText type="message" text="2" />, <DeleteIcon createdBy={item.user} id={item.id} timestamp={item.timestamp}/>]}
              >
              <Skeleton loading={this.state.loading} active avatar>
              <List.Item.Meta
                avatar={<Avatar size={42} icon="user" style={{backgroundColor: '#1890FF', top: 10}}/>}
                title={item.title}
                description={'Submitted by: '+item.user}
              />
              {item.content}<br/>
              <a onClick={() => this.handleLike(item)}>Like</a><br />
              <a onClick={() => this.handleDislike(item)}>Dislike</a>
              </Skeleton>
              </List.Item>
            )}
        />
        }
      </div>
      
    </div>
    );
  }
}

export default CardContainer
