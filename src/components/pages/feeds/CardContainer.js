
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
  Divider,
  Tag, Avatar
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
      currentSubfeedCreator: 'Admin',
      currentSubfeedTimestamp: '',
      currentSubfeedDescription: 'Default subfeed for all students. All posts are allowed here.',
      currentSubfeedOwner: false,
      defaultSubfeed: ['General'],
      componentLoading: true,
      user: '',
      userEmail: '',
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
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.props.setHeader('General');
      this.setState({user: user.attributes.preferred_username, userEmail: user.attributes.email})
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
        likes: [this.state.userEmail],
        dislikes: [],
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
      componentLoading: true
    });

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
    console.log('Posts: ', posts);
    this.setState({componentLoading: false});
  }

  async getSubfeedPosts(subfeed){
    this.setState({
      posts: [],
      componentLoading: true
    });

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
                content: post.content,
                likes: post.likes,
                dislikes: post.dislikes
              }
            ]
          })
        ));
        this.setState({componentLoading: false});
    }).catch(error => {
        this.setState({componentLoading: false});
        console.log(error)
    });
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
    let tempPosts = this.state.posts;
    let user = this.state.userEmail;

    for (let item of tempPosts) {
      if(item.id === post.id){
        if(item.likes.includes(user)){                     // If user has already disliked post, removes like
          let index = item.likes.indexOf(user);
          if (index !== -1) {
            item.likes.splice(index, 1);
          }
        } else {
          if(item.dislikes.includes(user)){                      // If user has previously liked post, removes like
            let index = item.dislikes.indexOf(user);
            if (index !== -1) {
              item.dislikes.splice(index, 1);
            }
          }
          item.likes.push(user);
        }
      }
    }

    this.setState({posts: tempPosts});
    this.likePost(post);
  }

  likePost(post){
    let id = post.id;
    let timestamp = post.timestamp;
    let userEmail = this.state.userEmail;

    let apiName = 'posts';
    let path = '/posts/'+post.id+'/like';
    let myInit = {
      body: {
        id, timestamp, userEmail
      }
    };
    API.post(apiName, path, myInit).then(response => {
      console.log('like-post lambda response: ', response);
    }).catch(error => {
      console.log(error.response)
    });
  }

  handleDislike(post){
    console.log('User disliked post: ', post.title);
    let tempPosts = this.state.posts;
    let user = this.state.userEmail;

    for (let item of tempPosts) {
      if(item.id === post.id){
        if(item.dislikes.includes(user)){                     // If user has already disliked post, remove dislike
          let index = item.dislikes.indexOf(user);
          if (index !== -1) {
            item.dislikes.splice(index, 1);
          }
        } else {
          if(item.likes.includes(user)){                      // If user has previously liked post, removes like
            let index = item.likes.indexOf(user);
            if (index !== -1) {
              item.likes.splice(index, 1);
            }
          }
          item.dislikes.push(user);
        }
      }
    }

    this.setState({posts: tempPosts});
    this.dislikePost(post);
  }

  dislikePost(post){
    let id = post.id;
    let timestamp = post.timestamp;
    let userEmail = this.state.userEmail;

    let apiName = 'posts';
    let path = '/posts/'+post.id+'/dislike';
    let myInit = {
      body: {
        id, timestamp, userEmail
      }
    };
    API.post(apiName, path, myInit).then(response => {
      console.log('dislike-post lambda response: ', response);
    }).catch(error => {
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
              description: sub.subfeed_description,
              id: sub.id,
              timestamp: sub.timestamp,
              created_by: sub.created_by,
              value: sub.subfeed_name,
              label: sub.subfeed_name
            }
          ]
        })
      ));
    } catch (e) {
      console.log('Error: ',e);
    }
  }

  async createSubfeed(){
    var subfeed_name = this.state.subfeed;
    var subfeed_description = this.state.subfeed_description;
    var created_by = this.state.user;
    var timestamp = new Date().toLocaleString();
    var id = 'subfeed-'+uuid.v4().toString()

    console.log('User created subfeed: '+subfeed_name);
    this.setState({confirmModalLoading: true});

    let apiName = 'posts';
    let path = '/subfeeds/create-subfeed';
    let myInit = {
        body: {id, subfeed_name, subfeed_description, created_by, timestamp}
    }
    await API.post(apiName, path, myInit).then(response => {
      this.setState({confirmModalLoading: false});
      console.log('Created subfeed with name: ', subfeed_name);
      if(response.body.success){
        message.success(response.body.success)
        // this.getSubfeeds();
        let subfeed_list = this.state.subfeeds;
        subfeed_list.push({id, value: subfeed_name, label: subfeed_name, created_by, timestamp, description: subfeed_description});
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
    // console.log('Setting current subfeed as:',name);
    this.props.setHeader(name);
    let subfeed_obj = this.state.subfeeds.find(s => s.value === name);
    console.log('Setting current subfeed object as: ', subfeed_obj);

    if(subfeed_obj !== undefined){
      this.setState({
        currentSubfeed: name,
        currentSubfeedId: subfeed_obj.id,
        currentSubfeedCreator: subfeed_obj.created_by,
        currentSubfeedTimestamp: subfeed_obj.timestamp,
        currentSubfeedDescription: subfeed_obj.description
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
    const IconText = ({ type, style, text, onClick }) => (
      <span>
        <Icon type={type} style={{ marginRight: 5, color: '#1890FF'}} theme={style} onClick={onClick}/>
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
    const data = this.state.posts;
    let loading = this.state.componentLoading;


    function filter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        title: `Blank title`,
        description: 'Blank description',
        content: 'Blank content',
      });
    }

    return(
      <div className="card-container">
        <div className="item-feed">
          <Divider orientation="left"><Text style={{fontSize: 22}}>Create Post</Text></Divider>
          <Input placeholder="Post title" style={{maxWidth: '300px', top: 0}} onChange={(e) => this.handleChange('title', e)}/><br/>
          <TextArea placeholder="Post content" rows={4} style={{top: 15, maxWidth: '600px'}} onChange={(e) => this.handleChange('content', e)}/><br/>
          <Button loading={this.state.buttonLoading} type="primary" onClick={this.handleSubmit} style={{top: 25}}>Submit Post</Button>
          <Divider orientation="left" style={{top: 30}}><Text style={{fontSize: 22}}>{this.state.currentSubfeed} Posts</Text></Divider>

          <List
              itemLayout="vertical"
              size="large"
              pagination={{pageSize: 10}}
              dataSource={loading ? blankData : data}
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={!loading && [
                    <IconText onClick={() => this.handleLike(item)} type="like" style={item.likes.includes(this.state.userEmail) ? "filled" : null} text={loading ? null : item.likes.length} />,
                    <IconText onClick={() => this.handleDislike(item)} type="dislike" style={item.dislikes.includes(this.state.userEmail) ? "filled" : null} text={loading ? null : item.dislikes.length} />,
                    <Tooltip title={`Switch to the ${item.subfeed} subfeed`}><Tag onClick={() => this.switchSubfeed(item.subfeed)} color="#1890FF">{item.subfeed}</Tag></Tooltip>,
                    <DeleteIcon createdBy={item.user} id={item.id} timestamp={item.timestamp}/>]}
                >
                  <Skeleton loading={loading} active avatar>
                    <List.Item.Meta
                      avatar={<Avatar size={38}  style={{ backgroundColor: '#1890FF', top: 10 }} icon="user" />}
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
        </div>

        <div className="item-subfeed">
          <div className="item-subpost">
            <Title level={4}>Select subfeed</Title>
            <Cascader
              changeOnSelect
              options={this.state.subfeeds}
              onChange={this.onChange}
              value={[this.state.currentSubfeed]}
              placeholder="Please select subfeed"
              showSearch={{ filter }}
            />
            {this.state.currentSubfeedOwner ? <Tooltip title="Subfeed settings" placement="right"><Icon type="setting" style={{fontSize: 24, paddingLeft: 15}} onClick={this.showDrawer}/></Tooltip> : null }
            <Button type="primary" onClick={this.showModal} style={{top: 15}}>Create New Subfeed</Button>
            <Divider style={{top: 15}} />
          </div>

          <div className="item-subfeed-info">
              <Title level={4}>Subfeed Information</Title>
              <Text><Text style={{fontWeight: "bold"}}>Created by</Text>: {this.state.currentSubfeedCreator}</Text><br/>
              <Text style={{fontWeight: "bold"}}>Description:</Text>
              <Paragraph style={{top: 5}}>{this.state.currentSubfeedDescription}</Paragraph>
          </div>
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
          <Text level={3} />Subfeed Name<Text/><br/>
          <Input placeholder="Name of your subfeed!" onChange={(e) => this.handleChange('subfeed', e)} style={{maxWidth: '300px', top: 5}}/>
          <div style={{paddingTop: 15}}>
            <Text level={3} />Subfeed Description<Text/>
            <TextArea placeholder="Give a description about what your subfeed is about!" rows={4} style={{ maxWidth: '500px', top: 5}} onChange={(e) => this.handleChange('subfeed_description', e)}/><br/>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CardContainer
