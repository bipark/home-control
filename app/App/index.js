import React, { Component } from 'react';
import { Container, Content, Header, Left, Right, Body, Title, Button, Card, CardItem, Footer, FooterTab, Grid, Col } from 'native-base';
import { Text, FlatList, View, RefreshControl } from 'react-native';
import axios from 'axios';
import { Switch } from 'react-native-switch';
import css from './css';

axios.defaults.baseURL = "http://192.168.0.10:3000";

export default class app extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switches: [],
            refreshing: false,
        };
    };

    componentDidMount() {
        this._getData();
    };

    async _getData() {
        this.setState({refreshing:true});
        let data = await axios.get("/sw-lists");
        this.setState({
            switches: data.data.switches,
            refreshing:false
        });
    };

    async _setSwitch(item, val) {
        let data = await axios.post("/action",{
            ip:item.ip,
            status:val
        });
    };

    _renderItem = ({item}) => (
        <Card>
            <CardItem>
                <Content>
                    <Grid>
                        <Col>
                            <Text>{item.title}</Text>
                            <Text>{item.ip}</Text>
                        </Col>
                        <Col style={css.switch}>
                            <Switch
                                value={(item.status === 1)}
                                onValueChange={(val) => {this._setSwitch(item, val)}}
                            />
                        </Col>
                    </Grid>
                </Content>
            </CardItem>
        </Card>
    );

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
                        keyExtractor={(item, index) => item.id}
                        data={state.switches}
                        renderItem={this._renderItem}
                        style={{
                            flex:css.viewport,
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

