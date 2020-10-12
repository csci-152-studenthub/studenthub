import React, { Component , useState, useEffect} from 'react';
import { Auth, API } from "aws-amplify";
import {List, Typography, Skeleton, Divider, Statistic, Row, Col, Icon, Spin} from 'antd';
import GetApi from '../../../api/dashboard_api.js/get_api.js';
import PostApi from '../../../api/dashboard_api.js/post_api.js';
import './Dashboard.css';
import Init from './DashboardInit';

const { Text ,Title } = Typography;

const Dashboard = () => {
  const[{
    confirmLoading,
    buttonLoading,
    current_subfeed,
    loading, 
    user, 
    component, 
    title,
    content,
    visible
  }] = useState(Init);
    const [userattributes, setAttributes] = useState(undefined);
    const [study_groups, setStudyGroups] = useState(undefined);
    const [posts, setPosts] = useState(undefined);
    const [resources, setResources] = useState(undefined);
    const [statistics, setStatistics] = useState(undefined);

  useEffect(()=>{
    const auth = async () => {
      await Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      }).then(response => {
        // console.log('Setting userAttributes to:', response.attributes);
        setAttributes(response.attributes);
        getPosts();
        getResources(response.attributes);
        getStudygroups(response.attributes);
        getStatistics(response.attributes);
      }).catch(err => console.log(err));
    }
    // this.props.handler("Dashboard");
    auth();
  },[]);

  async function getPosts(){
    try{
        const posts = await GetApi.getposts();
        console.log(posts);
        setPosts(posts.body);
    }catch(e){
      console.log('error',e);
    }
  }

  async function getResources(userattributes){
    let email = userattributes.email;
    let myInit = {
      body: {user: email}
    };
    const resources = await GetApi.getresources(myInit);
    setResources(resources.body);
  }

  async function getStudygroups(userAttributes){
    try{
        let user = userAttributes.email;
        let myInit = {
          body: {user}
        };
        const studygroups = await PostApi.getstudygroups(myInit);
        setStudyGroups(studygroups.body);
    }catch(e){
      console.log("error",e);
    }
    
  }
  
  async function getStatistics(userAttributes){
    try{
        let user = userAttributes.preferred_username;
        let userEmail = userAttributes.email;
        let myInit = {
        body: {user, userEmail}
        };
        const statistic = await PostApi.getstatistics(myInit);
        setStatistics(statistic.body);
      }catch(e){
        console.log("error",e);
      }
  }

  

  
  const post_data = posts; 
  const resource_data = resources;
  const studygroup_data = study_groups;
  
  let userAttributes = userattributes;
  if(userAttributes === undefined)
    return (<Skeleton />);
  else
    return (
      <div className="dashboard-container">
        <div className="item-welcome-board">
          <div className="welcome-message-box">
            <div className="typewriter">

              <Title level={3}>Hello {userAttributes?userAttributes.name:null}</Title>
            </div>
          </div>
        
          <div className="item-statistics">
            <div className="item-feed-stats">
              <Statistic title="Total Posts" value={statistics ? statistics.postCount : "😪"} prefix={statistics ? <Icon type="project" rotate={-90}  /> : <Spin />} />
              <Statistic title="Total Likes" value={statistics ? statistics.postLikeCount : "😪"} prefix={statistics ? <Icon type="like" /> : <Spin />} />
            </div>
            <div className="item-resource-stats">
              <Statistic title="Total Resources" value={statistics ? statistics.resourceCount : "😪"} prefix={statistics ? <Icon type="read" /> : <Spin />} />
              <Statistic title="Resource Views" value={statistics ? statistics.resourceViewCount : "😪"} prefix={statistics ? <Icon type="eye" /> : <Spin />} />
            </div>
          </div>

        </div>
        <div className="item-activity-board">
          <Divider className="item-feed-title"><Text style={{fontSize: 32}}>Feeds</Text></Divider>
          <div className="item-feed-activity">
            <List
              itemLayout="horizontal"
              dataSource={post_data? post_data:[]}
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
                dataSource={resource_data? resource_data:[]}
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
                dataSource={studygroup_data? study_groups:[]}
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

export default Dashboard
