import React, { Component } from 'react';
import {
    AppRegistry,
    FlatList,
    Text,
    View
} from 'react-native';
import axios from 'axios';
import { Switch } from 'react-native-switch';

axios.defaults.baseURL = "http://192.168.0.8:3000";

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
        <View style={{
            height: 100,
            backgroundColor: "#dfd",
            justifyContent: "center"
        }}>
            <Text style={{left:20}}>{item.title}</Text>
            <Text style={{left:20}}>{item.ip}</Text>
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
        </View>
    )

    render() {
        const { state } = this;
        return (
            <View style={{flex:1}}>
                <FlatList
                    data={state.switches}
                    renderItem={this._renderItem}
                    style={{
                        flex:1,
                        backgroundColor: '#fff',
                        marginVertical: 20,
                    }}
                />
            </View>
        );
    }
}

