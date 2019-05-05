import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import { List, Typography, Skeleton, Divider } from 'antd';
import './Dashboard.css';
// import Feeds from '../feeds/Feeds';
// import Resources from '../resources/Resources';

const { Text, Title } = Typography;

// const highlight = {
//   fontSize: 32,
//   textShadow: '2px 2px 21px rgba(24, 144, 255, 1)'
// }
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
  }

  async getPosts() {
    this.setState({
      posts: [],
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
              content: post.content
            }
          ]
        })
      ));
     
    } catch (e) {
      console.log(e);

    }
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
        // console.log("Resources:", response);
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
    // console.log("Getting studygroups for user "+user);

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: {user}
    };

    await API.post(apiName, path, myInit).then(response => {
      // console.log('Successfylly got studygroups: ', response.body);
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



  
  // CountFeed()
  // {
  //   let e=0;
  //   this.state.posts.forEach(post => {
  //
  //     if(post.user===this.state.user)
  //     {
  //       e++;
  //     }
  //   });
  //
  //   return (<Text >Feeds: {e} , Resources: {e}, StudyGroup:{e}</Text>)
  // }
  

  countPosts(){
    let posts = this.state.posts;
    let user = this.state.userAttributes.preferred_username;
    let e = 0;

    posts.forEach(post => {
      if(post.user === user){
        e++;
      }
    });

    return e;
  }

  // highlight_handler = () =>{
  //   console.log('mouse enter text');
  //   this.setState({
  //     isHighlighted: true
  //   })
  // };

  // highlight_handler_leave = () =>{
  //   console.log('mouse left text');
  //   this.setState({
  //     isHighlighted: false
  //   })
  // };


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
            <Title level={3}>Hello {userAttributes.name}</Title>
            <Title level={4}>Your Posts: {this.countPosts()}</Title> 
            <Text level={0}><p>1. CSCI Midterm on 4/17</p></Text> 
            <Text level={0}><p>2. Appointment on 5/2</p></Text> 
            <Text level={0}><p>3. MileStone2 on 4/9</p></Text>
          </div>
          <div className="item-activity-board">
            <Divider className="item-feed-title"><Text style={{fontSize: 32}}>Feeds</Text></Divider>
            {/* <div className="item-feed-title"><Title style={{color:"white"}}>Feeds</Title></div> */}
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
            {/* <div className="item-resource-title"><Title style={{color:"white"}}>Resources</Title></div> */}
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
            {/* <div className="item-studygroup-title"><Title style={{color:"white"}}>StudyGroup</Title></div> */}
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
