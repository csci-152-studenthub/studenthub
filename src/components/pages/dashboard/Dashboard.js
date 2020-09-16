import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import {List, Typography, Skeleton, Divider, Statistic, Row, Col, Icon, Spin} from 'antd';
import GetApi from '../../../api/dashboard_api.js/get_api.js';
import './Dashboard.css';

const { Text ,Title } = Typography;

export class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state = {
      confirmLoading: false,
      buttonLoading: false,
      current_subfeed: 'General',
      statistics: undefined,
      loading: true,
      user: '',
      posts: [],
      component: 1,
      title: '',
      content: '',
      visible: false
    };
    this.getPosts = this.getPosts.bind(this);
  }
  
  async componentDidMount(){
    this.props.handler("Dashboard");
    await Auth.currentAuthenticatedUser({
      bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(response => {
      // console.log('Setting userAttributes to:', response.attributes);
      this.setState({userAttributes: response.attributes})
    }).catch(err => console.log(err));
    this.getPosts();
    this.getResources();
    this.getStudygroups();
    this.getStatistics();
  }

  async getPosts(){
    const posts = await GetApi.getposts();
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
  }

  async getResources(){
    let email = this.state.currentUser;
    let apiName = 'posts';
    let path = '/resources/get-resources';
    let myInit = {
      body: {user: email}
    };
    this.setState({
      resources: [],
    });
    await API.get(apiName, path, myInit)
      .then((response) => {
        response.body.map((item) => {
          this.setState({
            resources:[
              ...this.state.resources,
              {
               resource_title: item.resource_title,
               resource_id: item.resourceId,
               resource_description: item.resource_description,
               created_by: item.created_by,
               resource_url: item.resource_url,
               resource_comments: [],
               resource_noteCards: item.resource_noteCards,
               timestamp: item.timestamp
              }
            ]
          })
        });
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  async getStudygroups(){
    this.setState({
      study_groups: [],
      cardsLoading: true
    });

    let user = this.state.userAttributes.email;
    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: {user}
    };

    await API.post(apiName, path, myInit).then(response => {
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

  async getStatistics(){
    let user = this.state.userAttributes.preferred_username;
    let userEmail = this.state.userAttributes.email;
    let apiName = 'posts';
    let path = '/dashboard/get-statistics';
    let myInit = {
      body: {user, userEmail}
    };
    await API.post(apiName, path, myInit)
      .then((response) => {
        this.setState({statistics: response.body})
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  render() {
    const post_data =this.state.posts;
    const resource_data = this.state.resources;
    const studygroup_data = this.state.study_groups;

    let userAttributes = this.state.userAttributes;
    if(userAttributes === undefined)
      return (<Skeleton />);
    else
      return (
        <div className="dashboard-container">
          <div className="item-welcome-board">
            <div className="welcome-message-box">
              <div className="typewriter">
                <Title level={3}>Hello {userAttributes.name}</Title>
              </div>
            </div>
          
            <div className="item-statistics">
              <div className="item-feed-stats">
                <Statistic title="Total Posts" value={this.state.statistics ? this.state.statistics.postCount : "😪"} prefix={this.state.statistics ? <Icon type="project" rotate={-90}  /> : <Spin />} />
                <Statistic title="Total Likes" value={this.state.statistics ? this.state.statistics.postLikeCount : "😪"} prefix={this.state.statistics ? <Icon type="like" /> : <Spin />} />
              </div>
              <div className="item-resource-stats">
                <Statistic title="Total Resources" value={this.state.statistics ? this.state.statistics.resourceCount : "😪"} prefix={this.state.statistics ? <Icon type="read" /> : <Spin />} />
                <Statistic title="Resource Views" value={this.state.statistics ? this.state.statistics.resourceViewCount : "😪"} prefix={this.state.statistics ? <Icon type="eye" /> : <Spin />} />
              </div>
            </div>

          </div>
          <div className="item-activity-board">
            <Divider className="item-feed-title"><Text style={{fontSize: 32}}>Feeds</Text></Divider>
            <div className="item-feed-activity">
              <List
                itemLayout="horizontal"
                dataSource={post_data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      description={<Text><Text style={{fontWeight: "bold"}}>{item.user.split('@')[0]}</Text> posted '{item.title}'in the <Text style={{textDecorationLine:"underline"}}>{item.subfeed}</Text> subfeed</Text>}
                    />
                  </List.Item>
                )}
              />
            </div>
            <Divider className="item-resource-title"><Text style={{fontSize:32}}>Resources</Text></Divider>
            <div className="item-resources-activity">
              <List
                  itemLayout="horizontal"
                  dataSource={resource_data}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        description={
                        <Text>
                          <Text style={{fontWeight: "bold"}}>{item.created_by.split('@')[0]}</Text> created '{item.resource_title}' in
                          <span> <Text style={{textDecorationLine:"underline"}}>Resources</Text></span>
                        </Text>
                        }
                      />
                    </List.Item>
                  )}
              />
            </div>
            <Divider className="item-studygroup-title"><Text style={{fontSize: 32}}>Study Groups</Text></Divider>
            <div className="item-studygroups-activity">
               <List
                  itemLayout="horizontal"
                  dataSource={studygroup_data}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        description={
                        <Text>
                          <Text style={{fontWeight: "bold"}}>{item.created_by.split('@')[0]}</Text> created '{item.group_name}' in
                          <span> <Text style={{textDecorationLine:"underline"}}>Study Groups</Text></span>
                        </Text>
                        }
                      />
                    </List.Item>
                  )}
              />
            </div>
          </div>
        </div>
      )
  }
}

export default Dashboard