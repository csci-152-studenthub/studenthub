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
      // console.log('Setting userAttributes to:', response.attributes);
      this.setState({userAttributes: response.attributes});
    })
    .catch(err => console.log(err));
    this.getStudygroups();
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

  async getStudygroups(){
    this.setState({
      study_groups: [],
      cardsLoading: true
    });

    let user = this.state.userAttributes.email;
    // console.log("Getting studygroups for user "+user);

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: {user}
    };
    await API.post(apiName, path, myInit).then(response => {
      // console.log('Successfully got studygroups: ', response.body);
      this.setState({currentStudygroup: response.body[0]});
      response.body.map((item) => (
        this.setState({
          study_groups:[
            ...this.state.study_groups,
            {
              groupId: item.groupId,
              course: item.course,
              group_name: item.group_name,
              description: item.description,
              members: item.members,
              professor: item.professor,
              timestamp: item.timestamp,
              created_by: item.created_by
            }
          ]
        })
      ));
      this.setState({cardsLoading: false});
    }).catch(e => {
      console.log("Encountered an error in getting studygroups: ", e);
    });
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

  dummySwitch(group){
    // console.log("Profile: switching to group:", group.group_name);
  }

  render() {
    let cardsLoading = this.state.cardsLoading;
    let userAttributes = this.state.userAttributes ? this.state.userAttributes : "Undefined";

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        group_name: "",
        description: "",
      });
    }

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
                <ProfileResources  currentUser={userAttributes.email}/>
              </TabPane>
              <TabPane tab={<span><Icon type="team"/>Study groups</span>} key="3">
                <ProfileStudyGroups user={this.state.userAttributes.email} switch={this.dummySwitch} study_groups={cardsLoading ? blankData : this.state.study_groups}/>
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
