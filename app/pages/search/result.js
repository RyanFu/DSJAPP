'use strict';

import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    DeviceEventEmitter,
    Platform,
    TouchableWithoutFeedback,
    Image,
    AsyncStorage,
    NativeEventEmitter,
    Vibration,
    Clipboard,
    WebView
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import * as common from '../../utils/common';
import { connect } from 'react-redux';
var backImg = require('../../assets/upload/rg_left.png');
import { fetchItemSearchList } from '../../actions/search';
import SearchItem from '../../components/searchItem';
import Spinner from 'react-native-spinkit';
import { naviGoBack } from '../../utils/common';
import ScrollableTabView,{ DefaultTabBar }  from 'react-native-scrollable-tab-view';
import ConditionTab from './conditionTab';
import StoreActions from '../../constants/actions';
import Flow from '../../components/flow';
import TbPopup from '../../components/tbPopup';
import baiChuanApi from 'react-native-taobao-baichuan-api';
import SyncTipsPopup from '../../components/syncTipsPopup';
import {isIphoneX} from "../../utils/common";
import StorageKeys from '../../constants/StorageKeys';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._tipShow = this._tipShow.bind(this);
        this._getItemData = this._getItemData.bind(this);
        this._onPressTipButton = this._onPressTipButton.bind(this);
        this._onPressCross = this._onPressCross.bind(this);
        this.state = {
            searching: false,
            xiaohongshuSearching: true,
            toutiaoSearching: true,
            showTip: false,
            redPacket: 10,
            itemId: null,
            itemData: null,
            callback: null,
            ratio: 0.7,
            showbackTip: false,
        };
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        if (navigator) {
            common.naviGoBack(navigator);
        }
    }

    componentDidMount() {
        const { dispatch, route } = this.props;
        let the = this;
        this.setState({
            searching: true,
            xiaohongshuSearching: true,
            toutiaoSearching: true,
        });
        const params = {
            text: route.text,
            loadingMore: false,
            currentPage: 1,
            searchCondition: this.props.searchCondition
        };
        dispatch(fetchItemSearchList(params)).then(() => {
            the.setState({searching: false});
        });

        DeviceEventEmitter.addListener('filterChanged',()=>{
            the._onChangeTab();
        });

        AsyncStorage.getItem('ratio', (error, result) => {
            the.setState({ratio: result});
        });


        const emitter = new NativeEventEmitter(baiChuanApi);
        this.backFromTBEvent = emitter.addListener(
            'backFromTB',
            (res) => {
                Clipboard.getString().then((data) => {
                    if (!data || !/^[0-9]*$/.test(data)) {
                        AsyncStorage.getItem('neverShowSyncTip', (error, result) => {
                            if (!result || result === 'true') {
                                this.setState({showbackTip: true});
                                Vibration.vibrate();
                            }
                        });
                    }
                });

            }
        );
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({type: StoreActions.SEARCH_CONDITION_RESET});
        this.backFromTBEvent.remove();
    }

    _onPressCross(never) {
        this.setState({showTip: false});
        if (never) {
            AsyncStorage.setItem('neverShowSyncTip', 'true');
        }
    }

    _goBack() {
        const { navigator } = this.props;
        naviGoBack(navigator);
    }

    _onChangeTab(data) {
        const { dispatch, route } = this.props;
        let the = this;
        this.setState({searching: true});
        const params = {
            text: route.text,
            loadingMore: false,
            currentPage: 1,
            searchCondition: this.props.searchCondition
        };
        dispatch(fetchItemSearchList(params)).then(() => {
            the.setState({searching: false});
        })

        if (data.i === 2) {
            AsyncStorage.getItem(StorageKeys.FIST_USE_BIG_RED_PACKET).then((bFirstTime) => {
                if (bFirstTime !== 'false') {
                    Alert.alert('', '请知晓：红包大指的是返利的比率高，并不是数额高。',
                        [{text: '知道了', onPress: () => {
                            AsyncStorage.setItem(StorageKeys.FIST_USE_BIG_RED_PACKET, 'false');
                    }}]);
                }
            });
        }
    }

    _tipShow() {
        this.setState({showTip: true});
    }

    _getItemData(itemId, data, callback) {
        //callback(itemId, data)
        this.setState({redPacket: data.tkCommFee});
        this.setState({itemId: itemId});
        this.setState({itemDate: data});
        this.setState({coupon: data.couponAmount});
        this.setState({callback: callback})
    }

    _onPressTipButton() {
        this.state.callback(this.state.itemId, this.state.itemDate);
        this.setState({showTip: false});
    }

    _onPressCross() {
        this.setState({showTip: false});
    }

    render() {
        const page = this.props.route.type ? parseInt(this.props.route.type) : 0;
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                {
                    this.state.showTip?<TbPopup
                        onPressButton={this._onPressTipButton}
                        onPressCross={this._onPressCross}
                        redPacket={this.state.redPacket}
                        show={true}
                        hasCoupon={this.state.coupon}
                        /> : null
                }
                {
                    this.state.showbackTip ? <SyncTipsPopup
                        onPressCross={(never) => this._onPressCross(never)}
                        show={true}
                    /> : null
                }
                <View style={styles.searchHeader}>
                    <ImageButton
                        source={backImg}
                        style={styles.back}
                        onPress={this._onLeftIconClicked}
                        />
                    <TouchableWithoutFeedback onPress={()=> this._goBack()}>
                        <TextInput
                            style={styles.searchText}
                            placeholder={'搜索商品或笔记'}
                            placeholderTextColor='#bebebe'
                            multiline={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='go'
                            value={this.props.route.text}
                            onFocus={()=> this._goBack()}
                            onSubmitEditing={(event) => this._search(event.nativeEvent.text)}
                            />
                    </TouchableWithoutFeedback>


                </View>
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    tabBarPosition="top"
                    tabBarBackgroundColor="rgba(255,255,255,0.9)"
                    tabBarActiveTextColor="#fc7d30"
                    tabBarInactiveTextColor="#9b9b9b"
                    tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 0}}
                    initialPage={page}
                    renderTabBar={() => <DefaultTabBar
                                    tabStyle={{paddingBottom: 0}}
                                    style={{height: 40,borderBottomColor: 'rgba(178,178,178,0.3)'}}
                                />}
                    >
                    <View
                        key='item'
                        tabLabel='商品'
                        style={{ flex: 1 }}
                        >
                        <ScrollableTabView
                            scrollWithoutAnimation={true}
                            tabBarPosition="top"
                            initialPage={0}
                            locked={false}
                            renderTabBar={() => <ConditionTab {...this.props}/>}
                            onChangeTab={this._onChangeTab.bind(this)}
                            >
                            <View
                                key='sv'
                                tabLabel='销量高'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem from={this.props.route.from} ratio={this.state.ratio} itemData={this._getItemData} tipShow={this._tipShow} text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='moods'
                                tabLabel='信用高'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem from={this.props.route.from} itemData={this._getItemData} tipShow={this._tipShow} text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='redPacket'
                                tabLabel='红包大'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem from={this.props.route.from} itemData={this._getItemData} tipShow={this._tipShow} text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='price'
                                tabLabel='价格'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem from={this.props.route.from} itemData={this._getItemData} tipShow={this._tipShow} text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='cut'
                                style={{ flex: 1 }}
                                >
                            </View>
                            <View
                                key='moreC'
                                tabLabel='筛选'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem from={this.props.route.from} itemData={this._getItemData} tipShow={this._tipShow} text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                        </ScrollableTabView>

                    </View>
                    {
                        this.props.route.from !== 'editNote'?
                            <View
                                key='note'
                                tabLabel='笔记'
                                style={{ flex: 1 }}
                            >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <Flow tabForRefresh={this.state.tabForRefresh}
                                              tag='search'
                                              navigator={this.props.navigator}
                                              dispatch={this.props.dispatch}
                                              hasnoBottomTab={true}
                                              searchText={this.props.route.text}
                                        />
                                }
                            </View>:null
                    }
                    {
                        this.props.route.from !== 'editNote'?
                            <View
                                key='xiaohongshu'
                                tabLabel='小红书'
                                style={{ flex: 1 }}
                            >
                                {
                                    this.state.xiaohongshuSearching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                            <WebView
                                                style={{width: 0,height: 0, position: 'absolute'}}
                                                onLoadStart={()=>{this.setState({xiaohongshuSearching: true})}}
                                                onLoadEnd={()=>{this.setState({xiaohongshuSearching: false})}}
                                                ref="xiaohongshu"
                                                source={{uri: "http://www.xiaohongshu.com/search_result/"+this.props.route.text}}/>
                                        </View> :
                                        <WebView
                                            ref="xiaohongshu"
                                            source={{uri: "http://www.xiaohongshu.com/search_result/"+this.props.route.text}}/>
                                }
                            </View>:null
                    }
                    {
                        this.props.route.from !== 'editNote'?
                            <View
                                key='today'
                                tabLabel='今日头条'
                                style={{ flex: 1 }}
                            >
                                {
                                    this.state.toutiaoSearching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:150}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                            <WebView
                                                style={{width: 0,height: 0, position: 'absolute'}}
                                                onLoadStart={()=>{this.setState({toutiaoSearching: true})}}
                                                onLoadEnd={()=>{this.setState({toutiaoSearching: false})}}
                                                ref="today"
                                                source={{uri: "https://m.toutiao.com/search/?keyword="+this.props.route.text}}/>
                                        </View> :
                                        <WebView
                                            ref="today"
                                            source={{uri: "https://m.toutiao.com/search/?keyword="+this.props.route.text}}/>
                                }
                            </View>:null
                    }

                </ScrollableTabView>

                <View style={styles.searchBody}>


                </View>
            </View>
        )

    }
}

function mapStateToProps(state) {
    const { search,searchCondition } = state;
    return {
        search,
        searchCondition
    };
}

export default connect(mapStateToProps)(SearchResult);