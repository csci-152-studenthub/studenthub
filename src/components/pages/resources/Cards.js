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
      resources: [],
      userEmail: '',
      user:''
    }
  }
  
  async componentDidMount(){
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
  }

  async getResources(){
    console.log("Getting studygroups...");

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
    this.increaseResourceViews(item);
    console.log(`Opening card with title '${item.resource_title}'`);
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
      console.log("User viewed their own resource. Not incrementing views.")
    } else {
      console.log("Increasing resource views for resource: ", card.resource_id);
      let apiName = 'posts';
      let path = '/resources/increase-resource-views';
      let myInit = {
        body: {user: email, id}
      };
      API.post(apiName, path, myInit)
        .then((response) => {
          console.log(response);
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
        {/* MODAL FILLED WITH NOTECARDS */}
        {/* <Modal
          title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.title}
          style={{top: 30}}
          width={1000}
          visible={this.state.visible}
          onCancel={this.handleCardModalCancel}
          footer={null}
        > */}
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
                    <Text>{noteItem.flipped ? noteItem.definition : noteItem.term}</Text>
                  {/* </div> */}
                  </Card>
                </Skeleton>
              </List.Item>
              
            )}
          />
        </div>
        {/* </Modal> */}

      </div>
    )
  }
}

export default Cards