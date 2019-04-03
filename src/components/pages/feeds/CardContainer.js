import React, { Component } from 'react';
import { Auth, API } from "aws-amplify";
import {
  Drawer,
  message,
  Input,
  List,
  Skeleton,
  Popconfirm,
  Icon,
  Typography,
  Button,
  Cascader,
  Tooltip,
  Modal,
  Divider
} from 'antd';
import uuid from "uuid";
import ProfilePic from "../profile/ProfilePic";
import './CardContainer.css';


const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
export class CardContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
      deleteSubfeedLoading: false,
      confirmModalLoading: false,
      buttonLoading: false,
      currentSubfeed: 'General',
      currentSubfeedId: '',
      currentSubfeedCreator: '',
      currentSubfeedTimestamp: '',
      currentSubfeedOwner: false,
      defaultSubfeed: ['General'],
      loading: true,
      user: '',
      posts: [],
      subfeeds: [],
      component: 1,
      title: '',
      content: '',
      drawerVisible: false,
      modalVisible: false
    }

    this.getPosts = this.getPosts.bind(this);
    this.getSubfeeds = this.getSubfeeds.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.deleteSubfeed = this.deleteSubfeed.bind(this);
    this.createSubfeed = this.createSubfeed.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.getSubfeedPosts = this.getSubfeedPosts.bind(this);
    this.switchSubfeed = this.switchSubfeed.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount(){
    this.getPosts();
    this.getSubfeeds();
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
    })
    .catch(err => console.log(err));
  }

  handleChange(type, e){
    // console.log(type, 'is now: ', e.target.value);
    this.setState({
      [type]: e.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({buttonLoading: true});

    try {
      var timestamp = new Date().toLocaleString();
      const response = await this.createPost({
        subfeed: this.state.currentSubfeed,
        likes: 0,
        dislikes: 0,
        timestamp: timestamp,
        id: uuid.v4().toString(),
        user: this.state.user,
        title: this.state.title,
        content: this.state.content
      });
      this.setState({buttonLoading: false});
      message.success('Post has been created!');
      if(this.state.currentSubfeed === 'General'){
        this.getPosts();
      } else {
        this.getSubfeedPosts(this.state.currentSubfeed)
      }
      console.log(response);
    } catch (e) {
      this.setState({buttonLoading: false});
      message.error('Could not create post.')
      console.log(e);
    }
  }

  createPost(post) {
    return API.post("posts", "/posts/create", {
      body: post
    });
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
      // console.log(posts.body);
      message.success('Successfully retrieved posts!');
      this.setState({loading: false});
    } catch (e) {
      console.log(e);
      this.setState({loading: false});
    }
  }

  async getSubfeedPosts(subfeed){
    this.setState({
      posts: [],
      loading: true
    })
    try{
      await API.post("posts", "/posts/get-posts", {body: {subfeed: subfeed}}).then(response => {
          console.log('Got subfeed posts: ',response);
          response.body.map((post) => (
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
      }).catch(error => {
          this.setState({loading: false});
          console.log(error)
      });
    } catch (e) {
      console.log(e);
    }
  }

  deletePost(id, timestamp){
    console.log(`Deleting post with id: ${id}`)
    let apiName = 'posts';
    let path = '/posts/delete-post';
    let myInit = {
        body: {
          id: id,
          timestamp: timestamp
        }
    }
    API.del(apiName, path, myInit).then(response => {
        // Add your code here
        message.success('Successfully deleted post!')
        if(this.state.currentSubfeed === 'General'){
          this.getPosts();
        } else {
          this.getSubfeedPosts(this.state.currentSubfeed);
        }
        console.log(response);
    }).catch(error => {
        message.error('Could not delete post.')
        console.log(error.response)
    });
  }

  handleActionClick(type){
    console.log('Like button pressed!');
  }

  handleLike(post){
    console.log('User liked post: ', post.title);

    let apiName = 'posts';
    let path = '/posts/'+post.id+'/like';
    console.log('api: '+path)
    let myInit = {
        body: {
          timestamp: post.timestamp
        }
    }
    API.put(apiName, path, myInit).then(response => {
        // Add your code here
        message.success('Successfully liked post!')
        console.log(response);
    }).catch(error => {
        message.error('Could not like post.')
        console.log(error.response)
    });
  }

  handleDislike(post){
    console.log('User disliked post: ', post.title);

    let apiName = 'posts';
    let path = '/posts/'+post.id+'/dislike';
    console.log('api: '+path)
    let myInit = {
        body: {
          timestamp: post.timestamp
        }
    }
    API.put(apiName, path, myInit).then(response => {
        // Add your code here
        message.success('Successfully disliked post!')
        console.log(response);
    }).catch(error => {
        message.error('Could not like post.')
        console.log(error.response)
    });
  }

  async getSubfeeds(){
    this.setState({
      subfeeds: []
    })

    try {
      const subfeeds = await API.get("posts", "/subfeeds/get-subfeeds");
      // console.log('Subfeeds: ', subfeeds);
      subfeeds.body.map((sub) => (
        this.setState({
          subfeeds: [
            ...this.state.subfeeds,
            {
              id: sub.id,
              timestamp: sub.timestamp,
              created_by: sub.created_by,
              value: sub.subfeed_name,
              label: sub.subfeed_name
            }
          ]
        })
      ));
      message.success('Successfully retrieved subfeeds!');
    } catch (e) {
      console.log('Error: ',e);
    }
  }

  async createSubfeed(){
    var subfeed_name = this.state.subfeed;
    var created_by = this.state.user;
    var timestamp = new Date().toLocaleString();
    var id = 'subfeed-'+uuid.v4().toString()

    console.log('User created subfeed: '+subfeed_name);
    this.setState({confirmModalLoading: true});

    let apiName = 'posts';
    let path = '/subfeeds/create-subfeed';
    let myInit = {
        body: {id, subfeed_name, created_by, timestamp}
    }
    await API.post(apiName, path, myInit).then(response => {
      this.setState({confirmModalLoading: false});
      console.log('Created subfeed with name: ', subfeed_name);
      if(response.body.success){
        message.success(response.body.success)
        // this.getSubfeeds();
        let subfeed_list = this.state.subfeeds;
        subfeed_list.push({id, value: subfeed_name, label: subfeed_name, created_by, timestamp});
        this.setState({
          subfeeds: subfeed_list,
          currentSubfeed: subfeed_name,
          modalVisible: false,
        });
        this.getSubfeedPosts(subfeed_name);
        this.setCurrentSubfeed(subfeed_name);
      } else{
        message.error(response.body.error)
      }
      console.log(response);
    }).catch(error => {
      this.setState({confirmModalLoading: false});
      message.error('Could not create subfeed.')
      console.log(error.response)
    });
  }

  // Removes deleted subfeed from subfeed array
  updateSubfeeds(){
    let subfeed_list = this.state.subfeeds.filter( s => s.value !== this.state.currentSubfeed );
    this.setState({
      subfeeds: subfeed_list,
      currentSubfeed: 'General'
    });
    this.setCurrentSubfeed('General');
  }

  async deleteSubfeed(id, timestamp){
    console.log('User deleting subfeed:', id, timestamp);
    this.setState(({deleteSubfeedLoading: true}));

    let apiName = 'posts';
    let path = '/subfeeds/delete-subfeed';
    let myInit = {
      body: {id, timestamp}
    };
    await API.post(apiName, path, myInit).then(response => {
      this.updateSubfeeds();
      this.setState(({
        deleteSubfeedLoading: false,
        drawerVisible: false,
      }));
      console.log('Success in deleting subfeed!:', response);
      message.success('Successfully deleted subfeed!');
      this.getPosts();
    }).catch(error => {
      this.setState(({deleteSubfeedLoading: false}));
      console.log('Encountered an error in deleting subfeed:',error.response);
      message.error('Encountered an error in deleting subfeed!');
    });
  }

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  }

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  handleModalCancel = (e) => {
    console.log(e);
    this.setState({
      modalVisible: false,
    });
  }

  setCurrentSubfeed(name){
    console.log('Setting current subfeed as:',name);
    let subfeed_obj = this.state.subfeeds.find(s => s.value === name);
    // console.log('Setting current subfeed object as: ', subfeed_obj);

    if(subfeed_obj !== undefined){
      this.setState({
        currentSubfeed: name,
        currentSubfeedId: subfeed_obj.id,
        currentSubfeedCreator: subfeed_obj.created_by,
        currentSubfeedTimestamp: subfeed_obj.timestamp,
      });

      if (subfeed_obj.created_by === this.state.user) {
        this.setState({currentSubfeedOwner: true})
      } else {
        this.setState({currentSubfeedOwner: false})
      }

    } else {
      console.log('subfeed_obj is undefined in setCurrentSubfeed!')
    }
  }

  onChange(value, selectedOptions) {
    console.log(value[0]);
    this.setCurrentSubfeed(value[0]);
    if(value[0] === 'General'){
      this.getPosts();
    } else{
      this.getSubfeedPosts(value[0])
    }
  }

  switchSubfeed(subfeed){
    console.log(`Setting subfeed to '${subfeed}' and loading posts.`)
    if(subfeed === 'General'){
      this.getPosts();
    } else {
      this.setCurrentSubfeed(subfeed);
      this.getSubfeedPosts(subfeed);
    }
  }

  render() {
    const IconText = ({ type, text, onClick }) => (
      <span>
        <Icon type={type} style={{ marginRight: 2, color: '#1890FF'}} onClick={onClick}/>
        {text}
      </span>
    );
    const DeleteIcon = ({ createdBy, id, timestamp }) => (
      <span>
        {this.state.user === createdBy ?
          <Popconfirm title="Are you sure delete this post?" onConfirm={() => this.deletePost(id, timestamp)} onCancel={() => console.log('Canceled post deletion.')} okText="Yes" cancelText="No">
            <Icon type="delete" style={{ right: 5}} />
          </Popconfirm>
          : null
        }
      </span>
    );
    const data = this.state.posts

    function filter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    return(
      <div className="card-container">
        <div className="item-post">
          <Title>
          {this.state.currentSubfeed}
            {this.state.currentSubfeedOwner ? <Tooltip title="Subfeed settings" placement="right"><Icon type="setting" style={{fontSize: 24, paddingLeft: 15}} onClick={this.showDrawer}/></Tooltip> : null }
        </Title>
          <div>
            <Title level={4}>Subfeed</Title>
            <Cascader
              changeOnSelect
              options={this.state.subfeeds}
              onChange={this.onChange}
              value={[this.state.currentSubfeed]}
              placeholder="Please select subfeed"
              showSearch={{ filter }}
            />
            <Button type="primary" onClick={this.showModal} style={{left: 15}}>Create New Subfeed</Button>
            <Divider orientation="left"><Text style={{fontSize: 22}}>Create Post</Text></Divider>
          </div>
          <div>
            <Input placeholder="Post title" style={{maxWidth: '300px', top: 0}} onChange={(e) => this.handleChange('title', e)}/><br/>
            <TextArea placeholder="Post content" rows={4} style={{top: 15, maxWidth: '600px'}} onChange={(e) => this.handleChange('content', e)}/><br/>
            <Button loading={this.state.buttonLoading} type="primary" onClick={this.handleSubmit} style={{top: 25}}>Submit Post</Button>
            <Divider orientation="left" style={{top: 30}}><Text style={{fontSize: 22}}>{this.state.currentSubfeed} Posts</Text></Divider>
          </div>
        </div>
        <div className="item-feed">
          {data === [] ? null :
          <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 10,
              }}
              dataSource={data}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={!this.state.loading && [
                    <IconText onClick={() => this.handleLike(item)} type="like-o" text="152" />,
                    <IconText onClick={() => this.handleDislike(item)} type="dislike-o" text="152" />,
                    <Tooltip title={`Switch to the ${item.subfeed} subfeed`}><Text onClick={() => this.switchSubfeed(item.subfeed)} style={{color: '#1890FF'}}>{item.subfeed}</Text></Tooltip>,
                    <DeleteIcon createdBy={item.user} id={item.id} timestamp={item.timestamp}/>]}
                >
                  <Skeleton loading={this.state.loading} active avatar>
                    <List.Item.Meta
                      avatar={<ProfilePic/>}
                      // avatar={<Avatar size={42} icon="user" style={{backgroundColor: '#1890FF', top: 10}}/>}
                      title={item.title}
                      description={`Submitted by user: ${item.user}`}
                    />
                    <Paragraph ellipsis={{ rows: 4, expandable: true }}>
                      {item.content}
                    </Paragraph>
                  </Skeleton>
                </List.Item>
              )}
            />
          }
        </div>

        <div className="item-rules">
          <h1>this is the area for the rules</h1>
        </div>

        <Drawer
          title="Subfeed Settings"
          placement="right"
          closable={true}
          onClose={this.onDrawerClose}
          visible={this.state.drawerVisible}
        >
          <Popconfirm placement="bottom" title="Are you sure delete this subfeed?" onConfirm={() => this.deleteSubfeed(this.state.currentSubfeedId, this.state.currentSubfeedTimestamp)} icon={<Icon type="exclamation-circle" style={{ color: 'red' }} />} onCancel={() => console.log('Canceled subfeed deletion.')} okText="Yes" cancelText="No">
            <Button type="danger" loading={this.state.deleteSubfeedLoading} onClick={() => 'Deleting subfeed!'}>Delete Subfeed?</Button>
          </Popconfirm>
        </Drawer>

        <Modal
          title="Create Subfeed"
          visible={this.state.modalVisible}
          onOk={this.createSubfeed}
          onCancel={this.handleModalCancel}
          confirmLoading={this.state.confirmModalLoading}
          footer={[
              <Button key="back" onClick={this.handleModalCancel}>Cancel</Button>,
              <Button key="submit" type="primary" loading={this.state.confirmModalLoading} onClick={this.createSubfeed}>
                Create Subfeed
              </Button>,
            ]}
        >
          <Text level={3} />Subfeed Name<Text/>
          <Input placeholder="New subfeed name" onChange={(e) => this.handleChange('subfeed', e)} style={{maxWidth: '300px', left: 15}}/>
        </Modal>
      </div>
    );
  }
}

export default CardContainer
