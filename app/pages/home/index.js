'use strict';

import React from 'react';

const ReactNative = require('react-native');
const {
    Platform,
    ScrollView,
    Text,
    View,
    InteractionManager,
    TouchableOpacity,
    AsyncStorage,
    StatusBar,
    DeviceEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Vibration
} = ReactNative;
import {connect} from 'react-redux';
import styles from './style';
import TabBar from './tab';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Toolbar from '../../components/toolbar';
import Flow from '../../components/flow';
import HomeFilter from '../../components/homeFilter';
import MyPage from '../my';
import MessagesPage from '../messages';
import CreateNotePage from '../note';
import Channel from '../channel';
import AddFriends from '../addFriends';
import {showorHideFilter} from '../../actions/home';
import {Token, request, toast} from '../../utils/common';
import HomeContainer from './homeContainer';
import baiChuanApi from 'react-native-taobao-baichuan-api';
import RedPacket from '../redPacket';
import {fetchMessageNum} from '../../actions/message';
import deprecatedComponents from 'react-native-deprecated-custom-components';

const Navigator = deprecatedComponents.Navigator;
import DetailPage from '../../pages/detail';
import SyncTipsPopup from '../../components/syncTipsPopup';
import StorageKeys from "../../constants/StorageKeys";
import {Clipboard} from "react-native";

const Event = NativeModules.Event;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._showFilter = this._showFilter.bind(this);
        this._onFilterClicked = this._onFilterClicked.bind(this);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this._onRightIconClicked.bind(this);
        this._jumpToDetailPage = this._jumpToDetailPage.bind(this);
        this.state = {
            showToolbar: this.props.home.showToolbar,
            filterMounted: false,
            currentTab: 0,
            tabForRefresh: false,
            newNote: false,
            fetchMessage: 1,
            showTip: false,
        }
    }

    static defaultProps = {
        tabTile: {
            0: '红包',
            1: '笔记',
            2: '',
            3: '消息',
            4: '我的'
        },
        cameraPress: (navigator) => {
            navigator.push({
                component: CreateNotePage,
                name: 'CreateNotePage',
                sceneConfigs: Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
            });
        }

    };

    componentDidMount() {
        const { navigator } = this.props;

        const emitter = new NativeEventEmitter(baiChuanApi);
        const eventEmitter = new NativeEventEmitter(Event);

        this.subscriptionTb = emitter.addListener(
            'EventReminder',
            (reminder) => {
                //binding taobao user
                const user = reminder.user;
                const nick = user.nick;
                const openSid = user.openSid;
                const openId = user.openId;
                this._bindTaobao(openId);
            }
        );

        this.subscriptionEvent = eventEmitter.addListener(
            'mLink',
            (res) => {
                const noteId = res.result['noteId'];
                this._jumpToDetailPage({noteId: noteId});
            }
        );


        this.backFromTBEvent = emitter.addListener(
            'backFromTB',
            (res) => {
                const routesLength = navigator.getCurrentRoutes().length;
                if(routesLength > 1)
                    return;
                Clipboard.getString().then((data) => {
                    if (!data || !/^[0-9]*$/.test(data)) {
                        AsyncStorage.getItem('neverShowSyncTip', (error, result) => {
                            if (!result || result !== 'true') {
                                this.setState({showTip: true});
                                Vibration.vibrate();
                            }
                        });
                    }
                });

            }
        );

        this.backFromTBEventD = DeviceEventEmitter.addListener('showTip', (val) => {
            const routesLength = navigator.getCurrentRoutes().length;
            if(routesLength > 1)
                return;
            this.setState({showTip: true});
        });
    }

    _jumpToDetailPage(note) {
        const {navigator} = this.props;
        navigator.push({
            component: DetailPage,
            name: 'DetailPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
            note
        });
    }


    _bindTaobao(openId) {
        const {navigator} = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    request('user/bindings/taobao/' + openId, 'POST', '', token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                console.log('绑定淘宝成功');
                            }
                        }, function (error) {
                            console.log(error);
                        })
                        .catch(() => {
                            console.log('network error');
                        });
                }
            }
        );
    }

    componentWillUnmount() {
        this.subscriptionTb.remove();
        this.subscriptionNote.remove();
        this.subscriptionEvent.remove();
        this.backFromTBEvent.remove();
        this.backFromTBEventD.remove();
    }

    componentWillMount() {
        let the = this;
        this.subscriptionNote = DeviceEventEmitter.addListener('newNote', () => {
            the.setState({'newNote': true});
            setTimeout(() => {
                the.setState({'newNote': false})
            }, 10)
        });

    }

    _showFilter() {
        const {dispatch} = this.props;
        if (this.props.home.showFilter) {
            dispatch(showorHideFilter(false));
        } else {
            dispatch(showorHideFilter(true));
        }

    }

    _onFilterClicked() {
        if (this.props.home.filterMounted) {
            //this.props.home.showFilter = !this.props.home.showFilter;
            this._showFilter();
        }
    }

    /**
     * Parameter data is a object {i:currentPage, ref:Component, from: prevPage}.
     * Properties 'i' and 'from' both are number.
     * @param data
     * @private
     */
    _onChangeTab(data) {
        if (data.i !== this.state.currentTab) {
            this.setState({currentTab: data.i});
        } else {
            this.setState({tabForRefresh: true});
            setTimeout(() => {
                this.setState({tabForRefresh: false});
            }, 10)
        }
        if (data.i == 3 || data.i == 4) {
            setTimeout(() => {
                this.setState({showToolbar: false});
            }, 2000)

        } else {
            this.setState({showToolbar: true});
        }


        const {dispatch} = this.props;
        const the = this;
        //fetch message
        if (data.i == 3) {
            DeviceEventEmitter.emit('getMessage', true);
            // Token.getToken(navigator).then((token) => {
            //     if (token) {
            //         const params = {
            //             token: token
            //         };
            //         dispatch(fetchMessageNum(params))
            //     }
            // });
        }

    }

    _onLeftIconClicked() {
        const {navigator} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                navigator.push({
                    component: AddFriends,
                    name: 'AddFriends',
                    sceneConfigs: deprecatedComponents.Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
                });
            }
        });
    }

    _onRightIconClicked() {
        const {navigator} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                //todo
            }
        });
    }

    _onPressCross(never) {
        this.setState({showTip: false});
        if (never) {
            AsyncStorage.setItem('neverShowSyncTip', 'true');
        }
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]} visible='hidden'>
                {

                    //this.state.showToolbar ? (
                    //    <Toolbar
                    //        title={this.props.home.isFollowed ? '关注的' : '剁手记'}
                    //        navigator={navigator}
                    //        showFilter={this._showFilter}
                    //        leftImg={addImg}
                    //        rightImg={searchImg}
                    //        onLeftIconClicked={this._onLeftIconClicked}
                    //        onRightIconClicked={this._onRightIconClicked}
                    //        hideDrop={this.state.showToolbar}
                    //        />
                    //) :null
                }
                {
                    this.state.showTip ? <SyncTipsPopup
                        onPressCross={(never) => this._onPressCross(never)}
                        show={true}
                    /> : null
                }

                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    style={{marginTop: 0,}}
                    tabBarPosition='overlayBottom'
                    initialPage={0}
                    renderTabBar={() => <TabBar {...this.props} newNote={this.state.newNote}/>}
                    onChangeTab={this._onChangeTab.bind(this)}
                    locked={true}
                >
                    <RedPacket tabLabel="ios-cash-outline" style={styles.tabView} dispatch={this.props.dispatch}
                               navigator={this.props.navigator}/>


                    <HomeContainer tabLabel="ios-paper-outline" style={styles.tabView}
                                   navigator={this.props.navigator} dispatch={this.props.dispatch}>
                        {
                            //<Channel navigator={this.props.navigator}></Channel>
                        }
                        <Flow tabForRefresh={this.state.tabForRefresh}
                              tag='all'
                              navigator={this.props.navigator}
                              dispatch={this.props.dispatch}
                        />
                    </HomeContainer>

                    <ScrollView tabLabel="md-camera" style={styles.tabView}>
                    </ScrollView>

                    <MessagesPage navigator={this.props.navigator} tabLabel="ios-mail-outline"
                                  style={styles.tabView}/>

                    <MyPage navigator={this.props.navigator} tabLabel="ios-person-outline" style={styles.tabView}/>

                </ScrollableTabView>
                {
                    this.props.home.showFilter ?
                        <HomeFilter navigator={this.props.navigator} click={this._onFilterClicked} key=''/> :
                        <View></View>

                }


            </View>

        );
    }
}

function mapStateToProps(state) {
    const {home, flow} = state;
    return {
        home,
        flow
    };
}

export default connect(mapStateToProps)(Home);