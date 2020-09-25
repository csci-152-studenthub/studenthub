import React, { Component , useState, useEffect} from 'react';
import { Auth, API } from "aws-amplify";
import {List, Typography, Skeleton, Divider, Statistic, Row, Col, Icon, Spin} from 'antd';
import GetApi from '../../../api/dashboard_api.js/get_api.js';
import PostApi from '../../../api/dashboard_api.js/post_api.js';
import './Dashboard.css';

const { Text ,Title } = Typography;

const Dashboard = () => {
  const[count,setCount] = useState(0);
  const[{userAttributes,content,study_groups},setState]=useState({userAttributes:"",content:"MEMe",study_groups:[]}) ;
  useEffect(async ()=>{
     await Auth.currentAuthenticatedUser({bypassCache: true}).then(response => {
      // console.log('Setting userAttributes to:', response.attributes);
      setState({userAttributes: response.attributes})
    }).catch(err => console.log(err));
      // console.log(data.attributes);
    
    getStudygroups();
    
  },[]);

  async function getStudygroups(){
    try{
        const useremail = {userAttributes}['userAttributes']['email'];
        let myInit = {
          body: {user:useremail}
        };
        const studygroups = await PostApi.getstudygroups(myInit);
        console.log(studygroups);
        studygroups.body.map((item) => setState(state=>({
          study_groups:[
            {
              ...state,
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
        })))
        setState({cardsLoading: false});
    }catch(e){
      console.log("error",e);
      
    }
    
  }
  
  

  

  
  // const post_data =this.state.posts;
  // const resource_data = this.state.resources;
  // const studygroup_data = this.state.study_groups;

  // let userAttributes = this.state.userAttributes;
  if(userAttributes === undefined)
    return (<Skeleton />);
  else
    return (
      <div className="dashboard-container">
        <div className="item-welcome-board">
          <div className="welcome-message-box">
            <div className="typewriter">
              {/* <button onClick = {Toggle}>Click me!</button> */}
              <Title level={3}>Hello {userAttributes['email']}</Title>
              {/* <Title level={3}>Hello {userAttributes.name}</Title> */}
            </div>
          </div>
        
          <div className="item-statistics">
            <div className="item-feed-stats">
              {/* <Statistic title="Total Posts" value={this.state.statistics ? this.state.statistics.postCount : "😪"} prefix={this.state.statistics ? <Icon type="project" rotate={-90}  /> : <Spin />} />
              <Statistic title="Total Likes" value={this.state.statistics ? this.state.statistics.postLikeCount : "😪"} prefix={this.state.statistics ? <Icon type="like" /> : <Spin />} /> */}
            </div>
            <div className="item-resource-stats">
              {/* <Statistic title="Total Resources" value={this.state.statistics ? this.state.statistics.resourceCount : "😪"} prefix={this.state.statistics ? <Icon type="read" /> : <Spin />} />
              <Statistic title="Resource Views" value={this.state.statistics ? this.state.statistics.resourceViewCount : "😪"} prefix={this.state.statistics ? <Icon type="eye" /> : <Spin />} /> */}
            </div>
          </div>

        </div>
        <div className="item-activity-board">
          {/* <Divider className="item-feed-title"><Text style={{fontSize: 32}}>Feeds</Text></Divider> */}
          <div className="item-feed-activity">
            {/* <List
              itemLayout="horizontal"
              dataSource={post_data}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    description={<Text><Text style={{fontWeight: "bold"}}>{item.user.split('@')[0]}</Text> posted '{item.title}'in the <Text style={{textDecorationLine:"underline"}}>{item.subfeed}</Text> subfeed</Text>}
                  />
                </List.Item>
              )}
            /> */}
          </div>
          {/* <Divider className="item-resource-title"><Text style={{fontSize:32}}>Resources</Text></Divider> */}
          <div className="item-resources-activity">
            {/* <List
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
            /> */}
          </div>
          <Divider className="item-studygroup-title"><Text style={{fontSize: 32}}>Study Groups</Text></Divider>
          <div className="item-studygroups-activity">
              {/* <List
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
            /> */}
          </div>
        </div>
      </div>
    )
  
}

export default Dashboard

