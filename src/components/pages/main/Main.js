import React, { Component } from 'react'
import { Menu, Icon, Layout, message } from 'antd';
import { Auth } from "aws-amplify";
// import CardContainer from '../feeds/CardContainer';
import Feeds from '../feeds/Feeds';
import './Main.css';

const SubMenu = Menu.SubMenu;

export class Main extends Component {
  constructor(props){
    super(props);

  }

  trySignOut(){
    console.log('Button was pressed')
    Auth.signOut()
    .then(data => {
      console.log(data);
      message.success('Signed out successfully!', 2.5);
      this.props.history.replace("/");
    })
    .catch(err => {
      console.log(err);
      message.error("Couldn't sign out, check console!", 2.5);
    });
  }

    render() {
      const {
        Content, Footer, Sider,
      } = Layout;
      return(
        <div className="container">
        
          <Sider className="item-sider" collapsible>
            <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1">
                  <Icon type="user" />
                  <span className="nav-text">Feeds</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="video-camera" />
                  <span className="nav-text">Resources</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="upload" />
                  <span className="nav-text">StudyGroup</span>
                </Menu.Item>
                <Menu.Item key="4">
                  <Icon type="user" />
                  <span className="nav-text">Profile</span>
                </Menu.Item>
                <Menu.Item key="5" onClick={() => {this.trySignOut()}}>
                  <Icon type="logout"/>
                  <span className="nav-text">Sign Out</span>
                </Menu.Item>
              </Menu>
          </Sider>
      
        <Content className="item-body">
          <Feeds/>
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
