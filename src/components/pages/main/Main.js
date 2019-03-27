import React, { Component } from 'react'
import { Menu, Icon, Layout, message, Row, Col } from 'antd';
import { Auth } from "aws-amplify";
// import { Card, Avatar, Tag, Divider, Spin, Input } from 'antd';
// const { Title } = Typography;
// import CardContainer from '../feeds/CardContainer';
import Feeds from '../feeds/Feeds';
import Dashboard from '../dashboard/Dashboard';
import Resources from '../resources/Resources';
import StudyGroups from '../studygroup/Studygroup';
import Profile from '../profile/Profile';
import './Main.css';

// const SubMenu = Menu.SubMenu;

// const { Title } = Typography;
const {
  Content, Footer, Sider,
} = Layout;

export class Main extends Component {
  constructor(props){
    super(props);

    this.state = {
      component: 1,
    }
  }

  componentDidMount(){
    // console.log(this.props.name);
  }

  switchComponent(page){
    console.log('Switching to page', page);
    this.setState({component: page});
  }

  renderComponent(){
    const current_component = this.state.component;
    switch (current_component) {
      case 1:
        return (<Dashboard />);
        // break;
      case 2:
        return (<Feeds />);
        // break;
      case 3:
        return (<Resources />);
        // break;
      case 4:
        return (<StudyGroups />);
        // break;
      case 5:
        return (<Profile />);
        // break;
      default:
        return (<Dashboard />)
    }
  }

  trySignOut(){
    console.log('Button was pressed')
    Auth.signOut()
    .then(data => {
      console.log(data);
      message.success('Signed out!', 2.5);
      this.props.history.replace("/");
    })
    .catch(err => {
      console.log(err);
      message.error("Couldn't sign out, check console!", 2.5);
    });
  }

    render() {
      return(
        <div className="container">
          <div className="item-header">
            <h2>This is the header</h2>
          </div>

          <Sider className="item-sider" collapsible>
            <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.component.toString()]} className="stickyNav">
                <Menu.Item key="1" onClick={() => this.switchComponent(1)}>
                  <Icon type="home" style={{fontSize: 20}} />
                  <span className="nav-text">Dashboard</span>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this.switchComponent(2)}>
                  <Icon type="project" rotate={-90} style={{fontSize: 20}} />
                  <span className="nav-text">Feeds</span>
                </Menu.Item>
                <Menu.Item key="3" onClick={() => this.switchComponent(3)}>
                  <Icon type="read" style={{fontSize: 20}} />
                  <span className="nav-text">Resources</span>
                </Menu.Item>
                <Menu.Item key="4" onClick={() => this.switchComponent(4)}>
                  <Icon type="team" style={{fontSize: 20}} />
                  <span className="nav-text">Study Groups</span>
                </Menu.Item>
                <Menu.Item key="5" onClick={() => this.switchComponent(5)}>
                  <Icon type="user" style={{fontSize: 20}} />
                  <span className="nav-text">My Profile</span>
                </Menu.Item>
                <Menu.Item key="6" onClick={() => {this.trySignOut()}}>
                  <Icon type="logout" style={{fontSize: 20}} />
                  <span className="nav-text">Sign Out</span>
                </Menu.Item>
              </Menu>
          </Sider>

        <Content className="item-body">
          {this.renderComponent()}
        </Content>

        <Footer className="item-footer">
          Studenthub.io ©2019 Created with
          <a href="https://ant.design/"> Ant Design</a>
        </Footer>
      </div>
      );
    }
  }


export default Main
