import React, { Component } from 'react'
import { Icon, Typography, Button, Drawer, Tabs, Divider, Skeleton } from 'antd';
import ProfilePic from './ProfilePic';
import EditAccountInfo from './EditAccountInfo';
import ProfileStudyGroups from './ProfileStudyGroups';
import ProfileFeed from './ProfileFeed';
import { Auth, API } from "aws-amplify";
import './profile.css';
import ProfileResources from "./ProfileResources";

const TabPane = Tabs.TabPane;

const { Text } = Typography;

export class Profile extends Component {
  constructor(props){
    super(props);

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
    });

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
              content: post.content,
              likes: post.likes,
              dislikes: post.dislikes
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
            <div className="item-profile-user">
              <ProfilePic/>
              <Text style={{fontSize: 24, paddingTop: 15}}>{userAttributes.name + ' ' + userAttributes.family_name}</Text>
              <Text style={{fontSize: 18}}>{userAttributes.preferred_username}</Text>
            </div>
            <div className="item-profile-settings">
              <Text style={{fontSize: 16}}><Text style={{fontWeight: "500"}}>Major: </Text>{userAttributes["custom:major"]}</Text><br/>
              <Text style={{fontSize: 16}}><Text style={{fontWeight: "500"}}>Email: </Text>{userAttributes["email"]}</Text>
              <Divider/>
              <Button onClick={this.showDrawer} type="primary">Edit Account Information</Button>
            </div>
          </div>

          <div className="profile-body">
            <Tabs defaultActiveKey="1">
              <TabPane tab={<span><Icon rotate={-90} type="project"/>Feeds</span>} key="1">
                <ProfileFeed currentUser={userAttributes.preferred_username}/>
              </TabPane>
              <TabPane tab={<span><Icon type="read"/>Resources</span>} key="2">
                <ProfileResources />
              </TabPane>
              <TabPane tab={<span><Icon type="team"/>Study groups</span>} key="3">
                <ProfileStudyGroups user={this.state.userAttributes.email}/>
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
