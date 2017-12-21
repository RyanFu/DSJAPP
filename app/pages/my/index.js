'use strict';
import React, { Component } from 'react';
import {
    View,
    ScrollView,
    InteractionManager,
    Text,
    AsyncStorage,
    DeviceEventEmitter,
    RefreshControl
} from 'react-native';
import Content from './content';
import Toolbar from '../../components/toolbar';
import SettingPage from '../settings';
import {Token} from '../../utils/common';
import AddFriends from '../addFriends';
import {fetchUserInfo, fetchUserNotes} from '../../actions/user';
import { connect } from 'react-redux';
import StorageKeys from '../../constants/StorageKeys';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

const addImg = require('../../assets/header/add.png');
const settingImg = require('../../assets/personal/setting.png');

class MyHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: false,
            refreshing: false,
        }
    }

    componentWillMount() {
        const { dispatch,navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            let params = {
                token: token
            };
            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY,(err,result)=>{
                if(!result){
                    fetchUserInfo(params).then(()=>{
                        this.setState({init: true});
                    });
                } else {
                    this.setState({init: true});
                }
            });

            //dispatch(fetchUserNotes(params)).then(() => {
            //    DeviceEventEmitter.emit('receiveNotes', this.props.user);
            //});
        });

    }

    componentDidMount(){
        DeviceEventEmitter.addListener('portraitUpdated',()=>{
            this._onRefresh();
        });
    }

    _onClickSettingIcon() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SettingPage',
                component: SettingPage
            })
        }
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                navigator.push({
                    component: AddFriends,
                    name: 'AddFriends',
                    sceneConfigs: Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
                });
            }
        });
    }

    _onRefresh(){
        const { dispatch } = this.props;
        this.setState({refreshing: true});
        Token.getToken(navigator).then((token) => {
            let params = {
                token: token
            };
            fetchUserInfo(params).then(()=>{
                dispatch(fetchUserNotes(params)).then(() => {
                    this.setState({refreshing: false});
                });
            });

        });

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Toolbar
                    title="我的主页"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    leftImg={addImg}
                    onLeftIconClicked={this._onLeftIconClicked.bind(this)}
                    rightImg={settingImg}
                    onRightIconClicked={this._onClickSettingIcon.bind(this)}
                    />
                <ScrollView
                    refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this._onRefresh()}
                            colors={['#fc7d30']}
                            tintColor={['#fc7d30']}
                          />
                      }
                    >
                    {this.state.init? (
                        <Content {...this.props} key="1" />
                    ):(
                        <View/>
                    )}

                </ScrollView>


            </View>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    };
}

export default connect(mapStateToProps)(MyHomePage);