import React, { Component } from 'react'
import { Menu, Icon, Layout, message, Row, Col, Button } from 'antd';
import { Typography } from 'antd';
import { Auth, API } from "aws-amplify";
import { Card, Avatar, Tag, Divider, Spin, Input, List, Skeleton, Switch } from 'antd';
// const { Title } = Typography;
// import CardContainer from '../feeds/CardContainer';
import Feeds from '../feeds/Feeds';
import uuid from "uuid";
import './Main.css';

const SubMenu = Menu.SubMenu;

const { Title } = Typography;
const {
  Content, Footer, Sider,
} = Layout;

const { TextArea } = Input;


class Dashboard extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
      user: '',
      posts: [],
      component: 1,
      title: '',
      content: ''
    }

    this.getPosts = this.getPosts.bind(this);
  }

  async componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
    })
    .catch(err => console.log(err));
    this.getPosts();
    this.setState({loading: false});
  }

  onChange = (checked) => {
    this.setState({ loading: !checked });
  }

  handleChange(type, e){
    console.log(type, 'is now: ', e.target.value);
    this.setState({
      [type]: e.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    // console.log(this.state);

    try {
      const response = await this.createPost({
        id: uuid.v4().toString(),
        user: this.state.user,
        title: this.state.title,
        content: this.state.content
      });
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  }

  createPost(post) {
    return API.post("posts", "/posts/create", {
      body: post
    });
  }

  async getPosts() {
    this.setState({posts: []})
    setTimeout((console.log('waiting...')), 5000);
    try {
      const posts = await API.get("posts", "/posts/get-posts");
      // this.setState({posts});
      posts.body.map((post) => (
        this.setState({
          posts: [
            ...this.state.posts,
            {
              id: post.id,
              user: post.user,
              title: post.title,
              content: post.content
            }
          ]
        })
      ));
      console.log(posts.body);
      message.success('Successfully retrieved posts!');
    } catch (e) {
      console.log(e);
    }
  }



  render() {
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 2}} />
        {text}
      </span>
    );
    const data = this.state.posts
    return(
      <div>
      <Title>Dashboard</Title>
      <Switch checked={!this.state.loading} onChange={this.onChange} />
      <Input placeholder="Post title" style={{maxWidth: '300px'}} onChange={(e) => this.handleChange('title', e)}/>
      <TextArea placeholder="Post content" rows={4} style={{top: 15}} onChange={(e) => this.handleChange('content', e)}/>
      <Button type="primary" onClick={this.handleSubmit} style={{top: 25}}>Submit Post</Button>
      <Button type="primary" onClick={() => console.log(this.state.posts)} style={{top: 25, left: 15}}>Console Log posts</Button>
      {this.state.posts === undefined ? null :
      <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          style={{top: 50}}
          dataSource={data}
          renderItem={item => (
            <List.Item
              key={item.id}
              actions={!this.state.loading && [<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
            >
            <Skeleton loading={this.state.loading} active avatar>
            <List.Item.Meta
              avatar={<Avatar size={36} icon="user" style={{backgroundColor: '#1890FF'}}/>}
              title={item.title}
              description={'Submitted by: '+item.user}
            />
            {item.content}
            </Skeleton>
            </List.Item>
          )}
        />
      }
      </div>
    );
  }
}

class Resources extends React.Component {
  render() {
    return <div><Title>Resources Page</Title></div>;
  }
}

class StudyGroups extends React.Component {
  render() {
    return <div><Title>Study Groups Page</Title></div>;
  }
}

class Profile extends React.Component {
  render() {
    return <div><Title>Profile Page</Title></div>;
  }
}

export class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      component: 1,
    }
  }

  componentDidMount(){
    // console.log(this.props.name);
  }

  switchComponent(page){
    console.log('Switching to page', page);
    this.setState({component: page});
  }

  renderComponent(){
    const current_component = this.state.component;
    switch (current_component) {
      case 1:
        return (<Dashboard />);
        break;
      case 2:
        return (<Feeds />);
        break;
      case 3:
        return (<Resources />);
        break;
      case 4:
        return (<StudyGroups />);
        break;
      case 5:
        return (<Profile />);
        break;
      default:
        return (<Dashboard />)
    }
  }

  trySignOut(){
    console.log('Button was pressed')
    Auth.signOut()
    .then(data => {
      console.log(data);
      message.success('Signed out!', 2.5);
      this.props.history.replace("/");
    })
    .catch(err => {
      console.log(err);
      message.error("Couldn't sign out, check console!", 2.5);
    });
  }

    render() {
      return(
        <div className="container">

          <Sider className="item-sider" collapsible>
            <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.component.toString()]}>
                <Menu.Item key="1" onClick={() => this.switchComponent(1)}>
                  <Icon type="home" style={{fontSize: 20}} />
                  <span className="nav-text">Dashboard</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this.switchComponent(2)}>
                  <Icon type="project" rotate={-90} style={{fontSize: 20}} />
                  <span className="nav-text">Feeds</span>
                </Menu.Item>
                <Menu.Item key="3" onClick={() => this.switchComponent(3)}>
                  <Icon type="read" style={{fontSize: 20}} />
                  <span className="nav-text">Resources</span>
                </Menu.Item>
                <Menu.Item key="4" onClick={() => this.switchComponent(4)}>
                  <Icon type="team" style={{fontSize: 20}} />
                  <span className="nav-text">Study Groups</span>
                </Menu.Item>
                <Menu.Item key="5" onClick={() => this.switchComponent(5)}>
                  <Icon type="user" style={{fontSize: 20}} />
                  <span className="nav-text">My Profile</span>
                </Menu.Item>
                <Menu.Item key="6" onClick={() => {this.trySignOut()}}>
                  <Icon type="logout" style={{fontSize: 20}} />
                  <span className="nav-text">Sign Out</span>
                </Menu.Item>
              </Menu>
          </Sider>

        <Content className="item-body">
          {this.renderComponent()}
        </Content>

        <Footer className="item-footer">
          Studenthub.io ©2019 Created with
          <a href="https://ant.design/"> Ant Design</a>
        </Footer>
      </div>
      );
    }
  }


export default Main
