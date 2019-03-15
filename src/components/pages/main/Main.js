import React, { Component } from 'react'
import { Menu, Icon, Switch, Layout, message, Button } from 'antd';
import { Auth } from "aws-amplify";
import CardContainer from '../feeds/CardContainer';
import './Main.css'

const SubMenu = Menu.SubMenu;

export class SiderContainer extends Component {
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
        Header, Content, Footer, Sider,
      } = Layout;
      return(
        <Layout>
          <Sider className="siderStyle" collapsible>
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
              <Menu.Item key="1">
                <Icon type="user" />
                <span className="nav-text">nav 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="video-camera" />
                <span className="nav-text">nav 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="upload" />
                <span className="nav-text">nav 3</span>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="user" />
                <span className="nav-text">nav 4</span>
              </Menu.Item>
              <Menu.Item key="5" onClick={() => {this.trySignOut()}}>
                <Icon type="logout"/>
                <span className="nav-text">Sign Out</span>
              </Menu.Item>
            </Menu>
          </Sider>


          <Footer style={{ textAlign: 'center' }}>
            Studenthub.io ©2019 Created with
            <a href="https://ant.design/"> Ant Design</a>
          </Footer>
        </Layout>

      );
    }
  }


export default SiderContainer
