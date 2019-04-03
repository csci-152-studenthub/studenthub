import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import { Avatar, message, Input, List, Skeleton, Popconfirm, Icon, Typography, Button } from 'antd';
import './Dashboard.css';
import Feeds from '../feeds/Feeds';
import Resources from '../resources/Resources';
import game from "./game.jpg";
import music from "./music.jpg";
import book from "./book.jpg";



const { Title } = Typography;
export class Dashboard extends Component {
  constructor(props){
    super(props);

    this.state = {
      confirmLoading: false,
      buttonLoading: false,
      current_subfeed: 'General',
      loading: true,
      user: '',
      posts: [],
      component: 1,
      title: '',
      content: '',
      visible: false
    }

    this.getPosts = this.getPosts.bind(this);
    
  }
  
  async componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
    })
    .catch(err => console.log(err));
    this.getPosts();
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
              subfeed: post.subfeed,
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
     
      this.setState({loading: false});
    } catch (e) {
      console.log(e);
      this.setState({loading: false});
    }
  }
  
  render() {
    return (
      <div>
      <div class="grid-head">
        <div>Hello <strong>{this.state.user.split('@')[0]}</strong>, hope you have an amazing day!</div>
      </div>
      <div class="grid-container">
        <div><Feeds/></div>
        <div>Resources
          <p></p>
          <p>{<img alt="example" src={music} height="20" />}Stanely upload a new item in media</p> 
          <p>{<img alt="example" src={music} height="20" />}Bill upload a new item in media</p> 
          <p>{<img alt="example" src={game}  height="20" />}Erick upload a new item in game</p> 
          <p>{<img alt="example" src={book}  height="20" />}Steve upload a new item in book</p> 
        </div>
        <div>StudyGroup</div>
      </div>
      
    </div>

    )
  }
}

export default Dashboard
