import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Button, Card, CardItem, Footer, FooterTab, Grid, Col } from 'native-base';
import {
    AppRegistry,
    FlatList,
    Text,
    View,
    RefreshControl
} from 'react-native';
import axios from 'axios';
import { Switch } from 'react-native-switch';

axios.defaults.baseURL = "http://192.168.0.10:3000";

export default class app extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switches: null,
            refreshing: false,
        };
    }

    componentDidMount() {
        this._getData();
    }

    async _getData() {
        this.setState({refreshing:true});
        let data = await axios.get("/sw-lists");
        this.setState({
            switches: data.data.switches,
            refreshing:false
        });
    }

    _renderItem = ({item}) => (
        <Card>
            <CardItem>
                <Content>
                    <Grid>
                        <Col>
                            <Text>{item.title}</Text>
                            <Text>{item.ip}</Text>
                        </Col>
                        <Col>
                            <Switch
                                value={item.status}
                                onValueChange={(val) => {
                                    axios.post("/action", {
                                        ip:item.ip,
                                        status:val
                                    }).then(function(res){
                                        console.log(res.data);
                                    }).catch(function(err){
                                        console.log(err);
                                    });
                                }}
                            />
                        </Col>
                    </Grid>
                </Content>
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
                <Content refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.getData}
                    />
                }>
                    <FlatList
                        ref={(r) => {this.self = r;}}
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

