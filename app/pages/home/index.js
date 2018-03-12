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
    Vibration,
    AppState
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
import {isIphoneX} from '../../utils/common';
import LoginPage from '../login/LoginPage';

const Navigator = deprecatedComponents.Navigator;
import DetailPage from '../../pages/detail';
import SyncTipsPopup from '../../components/syncTipsPopup';
import StorageKeys from "../../constants/StorageKeys";
import {Clipboard, Linking} from "react-native";
import RootSiblings from 'react-native-root-siblings';
import TklPopup from "../../components/tklPopup";
import configs from "../../constants/configs";

const Event = NativeModules.Event;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._showFilter = this._showFilter.bind(this);
        this._onFilterClicked = this._onFilterClicked.bind(this);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this._onRightIconClicked.bind(this);
        this._jumpToDetailPage = this._jumpToDetailPage.bind(this);
        this._readClipboard = this._readClipboard.bind(this);
        this._onPressCross = this._onPressCross.bind(this);
        this._tklParse = this._tklParse.bind(this);
        this.state = {
            showToolbar: this.props.home.showToolbar,
            filterMounted: false,
            currentTab: 0,
            tabForRefresh: false,
            newNote: false,
            fetchMessage: 1,
            showTip: false,
            currentAppState: AppState.currentState,
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

        this.sessionEvent = DeviceEventEmitter.addListener('sessionExpired', (val) => {
            if(val && navigator.getCurrentRoutes()[navigator.getCurrentRoutes().length-1].name !== 'LoginPage')
                navigator.push({
                    component: LoginPage,
                    name: 'LoginPage',
                    sceneConfigs: Navigator.SceneConfigs.FloatFromBottom
                });
        });

        //taokouling
        AppState.addEventListener('change', this._handleAppStateChange.bind(this));
        this._readClipboard();
    }

    _handleAppStateChange(nextAppState){
        if (this.state.currentAppState.match(/inactive|background/) && nextAppState === 'active') {
            this._readClipboard();
        }
        this.setState({currentAppState: nextAppState});
    }

    _readClipboard() {
        const the = this;
        Clipboard.getString().then((data) => {
            if (data
                && !/^[0-9]*$/.test(data)) {
                this._tklParse(data);
            }
        });
        // this._showItemDetailPopup();
    }

    _tklParse(text) {
        const the = this;
        let userId = '';
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY, (err, result) => {
            if (result) {
                result = JSON.parse(result);
                userId = result.userId || userId;
            }
            let body = {
                token: text
            };
            body = JSON.stringify(body);
            request('/taokouling/decode?userId=' + userId , 'POST', body)
                .then((res) => {
                    if (res.resultCode === 0 && res.resultValues.status === 0) {
                        let data = JSON.parse(res.resultValues.data);
                        data =  data.data;
                        this._showItemDetailPopup(data);
                        Clipboard.setString('');
                    } else {
                    }

                    // const data= JSON.parse("{\"tkSpecialCampaignIdRateMap\":{\"34098653\":\"15.50\",\"21145035\":\"7.50\"},\"eventCreatorId\":0,\"rootCatId\":16,\"leafCatId\":50008898,\"debugInfo\":null,\"rootCatScore\":0,\"nick\":\"初语旗舰店\",\"userType\":1,\"title\":\"初语2018春装新款 假两件卫衣女中长款宽松连帽ulzzang长袖上衣\",\"sellerId\":761679524,\"shopTitle\":\"初语旗舰店\",\"pictUrl\":\"//img.alicdn.com/bao/uploaded/i2/761679524/TB1AxvganZRMeJjSsppXXXrEpXa_!!0-item_pic.jpg\",\"couponLink\":\"\",\"couponLinkTaoToken\":\"\",\"couponActivityId\":null,\"couponAmount\":0,\"couponStartFee\":0,\"couponTotalCount\":0,\"couponEffectiveStartTime\":\"\",\"couponEffectiveEndTime\":\"\",\"tkRate\":5.50,\"dayLeft\":-17600,\"tk3rdRate\":null,\"auctionUrl\":\"http://item.taobao.com/item.htm?id=542978443607\",\"biz30day\":2335,\"auctionId\":542978443607,\"tkMktStatus\":null,\"includeDxjh\":1,\"reservePrice\":249.00,\"tkCommFee\":10.95,\"totalFee\":2391.98,\"totalNum\":227,\"zkPrice\":199.00,\"auctionTag\":\"4 385 587 907 1163 1478 1483 2049 2059 3851 3915 3974 4166 4491 4550 4555 4801 5895 6603 7105 7495 8326 11083 11339 11531 12491 13707 13771 13953 15297 15563 16321 16395 16577 17739 17803 20609 21442 21697 23105 25282 28353 28802 30337 30401 30593 30657 30849 30977 31489 34433 35713 36033 36161 36929 37569 37633 39233 40897 46849 49218 49282 51585 51841 51969 60418 62082 63105 64129 65281 67521 70465 72386 73089 73601 74369 74561 74689 74753 79489 81793 82306 82498 82625 84801 84865 85697 86081 91201 101762 107842 112386 116546 119234 119298 119426 120962 143746 151362 166402 175490 189250 194626 202370 202434 208770 212546 213378 218434 218562 218626 232898 233026 237698 243906 244994 245058 246978 248898 248962 249090 249858 249922 251138 253570\",\"couponLeftCount\":0,\"tkCommonRate\":5.50,\"tkCommonFee\":10.95,\"rlRate\":20.08,\"sameItemPid\":\"-352184043\",\"hasRecommended\":null,\"hasSame\":null,\"hasUmpBonus\":null,\"umpBonus\":null,\"isBizActivity\":null,\"couponShortLink\":null,\"couponInfo\":\"无\",\"eventRate\":null,\"rootCategoryName\":null,\"couponOriLink\":null,\"userTypeName\":null,\"tkFinalRate\":null,\"tkFinalFee\":null}");
                    // this._showItemDetailPopup(data);

                }, function (error) {
                    console.log(error);
                })
                .catch(() => {
                    console.log('network error');
                });
        });
    }

    _showItemDetailPopup(data) {
        return new RootSiblings(<TklPopup
        onPressCross={this._onPressCross}
        data={data}
        show={true}
        />);
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
        this.sessionEvent.remove();
        AppState.removeEventListener('change', this._handleAppStateChange);
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
        if (data.i == 4) {
            DeviceEventEmitter.emit('getMessage', true);
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
            <View style={[styles.container, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]} visible='hidden'>
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