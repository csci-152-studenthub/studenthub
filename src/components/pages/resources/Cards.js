import React, { Component } from 'react';
import { Card, List, Button, Skeleton, Modal, Carousel, Divider, Typography, Empty, ConfigProvider} from 'antd';
import { API, Auth } from "aws-amplify";
import uuid from "uuid";
import "./Resources.css";


const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const highlight = {

}

export class Cards extends Component {
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      loading: true,
      isMobile: false,
      resources: [],
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
      this.setState({user: user.attributes.preferred_username});
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
      console.log('screenresized, mobile is:', this.state.isMobile);
      this.setState({ isMobile: window.innerWidth < 900 })
    });
}

  async getResources(){
    let apiName = 'posts';
    let path = '/resources/get-resources';
    this.setState({
      resources: [],
      loading: true
    });
    await API.get(apiName, path)
      .then((response) => {
        console.log("Resources:", response);
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
        this.setState({ loading: false });
        // console.log('Success: ', this.state.study_groups);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  openCard = (item) => {
    
    this.setState({
      currentCard: item,
      visible: true
    });
    console.log(`Opening card with title '${item.resource_title}'`);
    console.log("Card contents:", item);
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

  render() {
    const blankData = [];
    for (let i = 0; i < 8; i++) {
      blankData.push({
        resource_title: `Blank asdf`,
        resource_description: 'Blank asdf',
      });
    }

    let load = this.state.loading;

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
            <List
              style={this.state.visible ?  {display:"block"} : {display:"none"}}
              grid={{ column: 2 }}
              dataSource={this.state.currentCard ? this.state.currentCard.resource_noteCards : blankData}
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
          </div>

        {/* Mobile View */}
        {/* MODAL FILLED WITH NOTECARDWS */}
        <div className="res-mobile-view">
          <Modal
            className="res-mobile-view"
            title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.title}
            style={{top: 30}}
            width={1000}
            visible={this.state.isMobile ? this.state.visible : console.log('mobileis:',this.state.isMobile) }
            onCancel={this.handleCardModalCancel}
            footer={null}
          >
          <div className="item-resource-info-mobile">
            <List
              style={this.state.visible ?  {display:"block"} : {display:"none"}}
              grid={{ column: 1 }}
              dataSource={this.state.currentCard ? this.state.currentCard.resource_noteCards : blankData}
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
          </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Cards