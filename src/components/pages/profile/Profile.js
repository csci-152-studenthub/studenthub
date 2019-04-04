import React, { Component } from 'react'
import {Avatar, message, Input, Icon, Spin, Typography, Button, Drawer, Tabs, Divider, Row, Col} from 'antd';
import ProfilePic from './ProfilePic';
import EditAccountInfo from './EditAccountInfo';
import { Auth, API } from "aws-amplify";
import './profile.css';

const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;

const { Title, Text } = Typography;

export class Profile extends Component {
  constructor(props){
    super();

    this.state ={
      drawerVisible: false,
      email: '',
      currentUser: '',
      preferredUsername: '',
      firstName:'',
      lastName: '',
      phoneNumber:'',
      post:[],
    }

  }

  async componentWillMount(){
    this.props.handler("Profile");
    let user = Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(response => {
      console.log('Setting userAttributes to:', response.attributes);
      this.setState({userAttributes: response.attributes})
    })
    .catch(err => console.log(err));
  }

  async getAttributes(){
    let user = await Auth.currentAuthenticatedUser({bypassCache: true});
    const { attributes } = user;
    console.log(attributes);

    // console.log("Getting attributes...");
    // let user = await Auth.currentAuthenticatedUser();
    // console.log(user);
    // // const { attributes } = user;
    // // console.log(attributes);

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
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div className="profile-container">
        <div className="item-profile" >
          <ProfilePic />
          <Text style={{fontSize: 24}}>{this.state.userAttributes ? this.state.userAttributes.preferred_username : <Spin indicator={antIcon} />}</Text>

          <div style={{textAlign: "left"}}>
            <Divider />
            <Button onClick={this.showDrawer} type="primary">Edit Account Information</Button>
          </div>
        </div>
        <span className="gray-col"></span>

        <div className="profile-body">
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><Icon rotate={-90} type="project" />Feeds</span>} key="1">
              <Title level={4}>Where the users' feed posts will go</Title>
            </TabPane>
            <TabPane tab={<span><Icon type="read" />Resources</span>} key="2">
              <Title level={4}>Where the users' resources posts will go</Title>
            </TabPane>
            <TabPane tab={<span><Icon type="team" />Study groups</span>} key="3">
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

export default Profile
