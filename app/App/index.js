import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Button, Card, CardItem, Footer, FooterTab } from 'native-base';
import {
    AppRegistry,
    FlatList,
    Text,
    View
} from 'react-native';
import axios from 'axios';
import { Switch } from 'react-native-switch';

axios.defaults.baseURL = "http://127.0.0.1:3000";

export default class app extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switches: null,
        };
    }

    async getData() {
        return axios.get("/sw-lists");
    }

    async componentDidMount() {
        let data = await this.getData();
        this.setState({
            switches: data.data.switches
        });
    }

    _renderItem = ({item}) => (
		    <Card>
			    <CardItem>
				    <Left>
					    <Text>{item.title}</Text>
				    </Left>
				    <Body>
					    <Text>{item.ip}</Text>
				    </Body>
				    <Right>
					    <Switch
						    value={false}
						    onValueChange={(val) => {
							    console.log(val);
							    axios.post("/action", {
								    ip:item.ip,
								    status:val
							    }).then(function(res){
								    console.log(res.data);
							    }).catch(function(err){
								    console.log(err);
							    });
						    }}
						    style={{left:20}}
					    />
				    </Right>
			    </CardItem>
		    </Card>
    )

    render() {
        const { state } = this;
        return (
            <Container>
                <Header>
                    <Body>
	                    <Title>Home Controller</Title>
                    </Body>
                </Header>
                <Content>
                    <FlatList
                        data={state.switches}
                        renderItem={this._renderItem}
                        style={{
                            flex:1,
                            backgroundColor: '#fff',
                        }}
                    />
                </Content>
	            <Footer>
		            <Text>Billy's Home Controller</Text>
	            </Footer>
            </Container>

        );
    }
}

