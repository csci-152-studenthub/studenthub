import React, { Component } from 'react'
import { Icon, Typography, Button, Drawer, Tabs, Divider, Skeleton} from 'antd';
import ProfilePic from './ProfilePic';
import EditAccountInfo from './EditAccountInfo';
import ProfileFeed from './ProfileFeed';
import { Auth, API } from "aws-amplify";
import './profile.css';

const TabPane = Tabs.TabPane;

const { Title, Text } = Typography;

export class Profile extends Component {
  constructor(props){
    super();

    this.state ={
      componentLoading: true,
      drawerVisible: false,
      email: '',
      currentUser: '',
      preferredUsername: '',
      firstName:'',
      lastName: '',
      phoneNumber:'',
    }

  }

  async componentWillMount(){
    this.props.handler("Profile");
    this.getPosts();
    await Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(response => {
      console.log('Setting userAttributes to:', response.attributes);
      this.setState({userAttributes: response.attributes});

    })
    .catch(err => console.log(err));
    this.setState({componentLoading: false});
  }

  async getPosts() {
    this.setState({
      posts: [],
      loading: true
    })

    try {
      const posts = await API.get("posts", "/posts/get-posts");
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
      this.setState({loading: false});
    } catch (e) {
      console.log(e);
      this.setState({loading: false});
    }
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  render() {
    let userAttributes = this.state.userAttributes ? this.state.userAttributes : "Undefined";

    if (this.state.componentLoading) {
      return (
        <div className="profile-container">
          <div className="item-profile">
            <Skeleton/>
          </div>
          <div className="profile-body">
            <Skeleton/>
          </div>
        </div>
      )
    } else {
      return (
        <div className="profile-container">
          <div className="item-profile">
            <ProfilePic/>
            <Text style={{fontSize: 24}}>{userAttributes.name + ' ' + userAttributes.family_name}</Text>
            <Text style={{fontSize: 20}}>{userAttributes.preferred_username}</Text>
            <div style={{textAlign: "left"}}>
              <Text style={{fontSize: 16}}><Text
                style={{fontWeight: "300"}}>Major: </Text>{userAttributes["custom:major"]}</Text>
              <Divider/>
              <Button onClick={this.showDrawer} type="primary">Edit Account Information</Button>
            </div>
          </div>
          <span className="gray-col"></span>

          <div className="profile-body">
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon rotate={-90} type="project"/>Feeds</span>} key="1">
                <ProfileFeed currentUser={userAttributes.email}/>
              </TabPane>
              <TabPane tab={<span><Icon type="read"/>Resources</span>} key="2">
                <Title level={4}>Where the users' resources posts will go</Title>
              </TabPane>
              <TabPane tab={<span><Icon type="team"/>Study groups</span>} key="3">
                <Title level={4}>Where the users' study groups will go</Title>
              </TabPane>
            </Tabs>
          </div>


          <Drawer
            title="Edit Account Information"
            placement="right"
            closable={true}
            onClose={this.onDrawerClose}
            visible={this.state.drawerVisible}
            width={"384"}
          >
            <EditAccountInfo userAttributes={userAttributes} closeDrawer={this.onDrawerClose}/>
          </Drawer>

        </div>
      )
    }
  }
}

export default Profile
