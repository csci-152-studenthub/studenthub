import React, { Component } from 'react';
import { Card, List, Skeleton, Modal, Divider, Typography } from 'antd';
import { API, Auth } from "aws-amplify";
// import uuid from "uuid";
import "./Resources.css";
import Comments from "../feeds/Comments";


const { Title, Text } = Typography;
const { Meta } = Card;

export class Cards extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      loading: true,
      isMobile: false,
      currentCard: undefined,
      testCard: undefined,
      resources: [],
      userEmail: '',
      user:''
    }
  }
  
  async componentDidMount(){
    if(window.innerWidth < 900){
      this.handleWindowResize();
    }
    Auth.currentAuthenticatedUser({
      bypassCache:true
    }).then(user =>{
      this.setState({user: user.attributes.preferred_username, userEmail: user.attributes.email});
    })
    .catch(error => console.log(error));
    this.getResources();
  }

  componentDidUpdate(prevProps){
    if(this.props.updateResources !== prevProps.updateResources){
      this.getResources();
    }
    window.addEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    return setTimeout(() => {
      // console.log('screenresized, mobile is:', this.state.isMobile);
      this.setState({ isMobile: window.innerWidth < 900 })
    });
  };

  async getResources(){
    let apiName = 'posts';
    let path = '/resources/get-resources';
    this.setState({
      resources: [],
      loading: true
    });
    await API.get(apiName, path)
      .then((response) => {
        // console.log("Resources:", response.body[0]);
        response.body.map((item) => {
          this.setState({
            resources:[
              ...this.state.resources,
              {
               resource_title: item.resource_title,
               resourceId: item.resourceId,
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
        this.setState({ loading: false, currentCard: response.body[0] });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("Something went wrong: ", error);
      });
  }

  openCard = (item) => {
    
    this.setState({
      currentCard: item,
      visible: true
    });
    this.increaseResourceViews(item);
    // console.log(`Opening card with title '${item.resource_title}'`);
    // console.log("Card contents:", item);
  };

  handleCardModalCancel = () => {
    this.setState({
      visible: false,
    });
  };

  flipCard(card){
    let currentCard = this.state.currentCard;

    currentCard.resource_noteCards.forEach(flashcard => {
      if(flashcard.term === card.term){
        flashcard.flipped = !flashcard.flipped
      }
    });

    this.setState({currentCard})
  }

  increaseResourceViews(card){
    let email = this.state.userEmail;
    let id = card.resource_id;

    if(card.created_by === email){
      // console.log("User viewed their own resource. Not incrementing views.")
    } else {
      // console.log("Increasing resource views for resource: ", card.resource_id);
      let apiName = 'posts';
      let path = '/resources/increase-resource-views';
      let myInit = {
        body: {user: email, id}
      };
      API.post(apiName, path, myInit)
        .then((response) => {
          // console.log(response);
        })
        .catch((error) => {
          console.log("Something went wrong: ", error);
        });
    }
  }

  render() {
    const blankData = [];
    for (let i = 0; i < 8; i++) {
      blankData.push({
        resource_title: `Blank asdf`,
        resource_description: 'Blank asdf',
        resource_noteCards: [{
          flipped: false,
          term: "test1",
          definition: "def1"
        }],
      });
    }

    let load = this.state.loading;
    // let testCards = this.state.testCards ? this.state.testCards : [];
    let currentCard = !load ? this.state.currentCard :
      {
        resource_title: "loading",
        resource_id: "0",
        resource_description: "loading",
        created_by: "loading",
        resource_url: "loading",
        resource_comments: [],
        resource_noteCards: [{
          flipped: false,
          term: "test1",
          definition: "def1"
        }],
        timestamp: "loading"
      };

    return (
      <div className="item-resources">
        <div className="item-resource-cards">
          <List 
            dataSource={load ? blankData : this.state.resources}
            renderItem={item => (
              <List.Item > 
                  <Skeleton loading={load} active >
                    <Card
                      className="resource-card"
                      onClick={ () => this.openCard(item)}
                      hoverable
                    > 
                    <Meta
                      title={item.resource_title}
                      description={item.resource_description}
                    /> 
                    </Card>
                  </Skeleton>
        
              </List.Item>
            )}
          />
        </div>

        {/* Window View */}
          <div className="item-resource-info">
            <div className="item-resource-createdby">
              <Title level={3}>{currentCard.resource_title}</Title>
              <Text><Text strong>Created by:</Text> {currentCard.created_by}</Text><br/>
              <Text><Text strong>Description: </Text><br/>{currentCard.resource_description}</Text>
            </div>
           
            <div className="item-resource-cards">
              <Divider orientation="left"><Text style={{fontSize: 20}}>Flashcards</Text></Divider>
              <List
                style={this.state.visible ?  {display:"block"} : null}
                grid={{ column: 2 }}
                dataSource={currentCard.resource_noteCards}
                renderItem={noteItem => (
                  <List.Item style={{paddingRight: 20}}>
                    <Skeleton loading={load} active >
                      <Card
                        className="notecard"
                        onClick={() => this.flipCard(noteItem)}
                        hoverable
                      > 
                        {noteItem.flipped ? <Text>{noteItem.definition}</Text> : <Text style={{fontWeight: "bold"}}>{noteItem.term}</Text>}
                      </Card>
                    </Skeleton>
                  </List.Item>
                )}
              />
              <Comments id={currentCard.resourceId} user={this.state.user}/>
            </div>
          </div>

        {/* Mobile View */}
        {/* MODAL FILLED WITH NOTECARDS */}
        <div className="res-mobile-view">
          <Modal
            className="res-mobile-view"
            title={this.state.currentCard === undefined ? "Loading..." : currentCard.title}
            style={{top: 30}}
            width={1000}
            visible={this.state.isMobile && this.state.visible}
            onCancel={this.handleCardModalCancel}
            footer={null}
          >
          <div className="item-resource-info-mobile">
            <div className="item-resource-createdby">
              <Title level={3}>{currentCard.resource_title}</Title>
              <Text><Text strong>Created by: </Text>{currentCard.created_by}</Text><br/>
              <Text><Text strong>Description: </Text><br/>{currentCard.resource_description}</Text>
            </div>
            <List
              style={this.state.visible ?  {display:"block"} : {display:"none"}}
              grid={{ column: 1 }}
              dataSource={this.state.currentCard ? currentCard.resource_noteCards : blankData}
              renderItem={noteItem => (
                <List.Item style={{paddingRight: 20}}>
                  <Skeleton loading={load} active >
                    <Card
                      className="notecard"
                      onClick={() => this.flipCard(noteItem)}
                      hoverable
                    > 
                    {/* <div className="notecard"> */}
                      {noteItem.flipped ? <Text>{noteItem.definition}</Text> : <Text style={{fontWeight: "bold"}}>{noteItem.term}</Text>}
                    {/* </div> */}
                    </Card>
                  </Skeleton>
                </List.Item>  
              )}
            />
            <Comments id={currentCard.resourceId} user={this.state.user}/>
          </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Cards