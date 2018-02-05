'use strict';

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    DeviceEventEmitter,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ListView,
    InteractionManager,
    AsyncStorage,
    Dimensions,
    Animated,
    ActivityIndicator,
    Image,
    NativeEventEmitter,
    Clipboard,
    RefreshControl
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {request, toast} from '../../utils/common';
import {Token, decimals} from '../../utils/common';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import StorageKeys from '../../constants/StorageKeys';
import configs from '../../constants/configs';
import ResultPage from '../search/result';
import PrefetchImage from '../../components/prefetchImage';
import {fetchRecentView, fetchRecentBuy} from '../../actions/recent';
import SyncPopup from '../../components/syncPopup';

const {height, width} = Dimensions.get('window');
const addImg = require('../../assets/header/add.png');
const searchImg = require('../../assets/header/search.png');
import AddFriends from '../addFriends';
import SearchPage from '../search';
import baiChuanApi from 'react-native-taobao-baichuan-api';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import OrdersPage from '../../pages/order';

const Navigator = deprecatedComponents.Navigator;
const moreIcon = <Icon style={[styles.moreIcon]} size={20} name="ios-arrow-dropright"/>;

class RedPacket extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this._jumpToResultPage = this._jumpToResultPage.bind(this);
        this._renderItemAutoRow = this._renderItemAutoRow.bind(this);
        this._recentList = this._recentList.bind(this);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this._onRightIconClicked.bind(this);
        this._topSearch = this._topSearch.bind(this);
        this._onPressCross = this._onPressCross.bind(this);
        this._getRecentBuy = this._getRecentBuy.bind(this);
        this._buySource = this._buySource.bind(this);
        this._syncOrder = this._syncOrder.bind(this);

        this.state = {
            keyWord: '',
            searchItemHistory: [],
            searchNoteHistory: [],
            itemAuto: false,
            itemAutoForList: this.ds.cloneWithRows([]),
            buySource: this.ds.cloneWithRows([]),
            viewSource: this.ds.cloneWithRows([]),
            bounce: new Animated.Value(0),
            ratio: 0.7,
            isLoadMore: false,
            topSearch: [],
            showTop: true,
            showTip: false,
            order: 0,
            openOrderPage: false,
            token: null,
            refreshing: false,
            syncMsg: ''
        };
    }

    _search(text) {
        let the = this;
        text = text || this.state.keyWord;
        this.setState({keyWord: text});
        if (!text)
            return;
        AsyncStorage.getItem(StorageKeys.SEARCH_ITEM, (error, result) => {
            if (error) {
                console.error("Error happened when to get token: " + error);
            }

            the._updateHistory(result, text);
            the._jumpToResultPage(text);
        });

    }

    _updateHistory(searchItemHistory, text) {
        searchItemHistory = searchItemHistory && searchItemHistory !== '' ? searchItemHistory : '[]';

        searchItemHistory = JSON.parse(searchItemHistory);
        _.remove(searchItemHistory, function (n) {
            return n === text;
        });
        searchItemHistory.push(text);

        let tempValue = _.clone(searchItemHistory);
        _.reverse(tempValue);
        this.setState({searchItemHistory: tempValue});
        this.setState({searchNoteHistory: tempValue});
        searchItemHistory = JSON.stringify(searchItemHistory);
        AsyncStorage.setItem(StorageKeys.SEARCH_ITEM, searchItemHistory);
        AsyncStorage.setItem(StorageKeys.SEARCH_NOTE, searchItemHistory);
    }

    _jumpToResultPage(text) {

        const {navigator} = this.props;
        navigator.push({
            component: ResultPage,
            name: 'ResultPage',
            text: text
        });
    }

    componentWillReceiveProps() {
        const copy = _.cloneDeep(this.props.recent.recentView);
        const view = _.reverse(copy);
        this.setState({viewSource: this.ds.cloneWithRows(view)});
    }

    componentDidMount() {
        const the = this;
        const {dispatch, navigator} = this.props;

        AsyncStorage.getItem(StorageKeys.SEARCH_ITEM, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchItemHistory: result});
        });
        AsyncStorage.getItem(StorageKeys.SEARCH_NOTE, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchNoteHistory: result});
        });

        dispatch(fetchRecentView()).then(() => {
            const copy = _.cloneDeep(this.props.recent.recentView);
            the.setState({viewSource: this.ds.cloneWithRows(_.reverse(copy))});
        });
        DeviceEventEmitter.addListener('newView', () => {
            dispatch(fetchRecentView()).then(() => {
                const copy = _.cloneDeep(this.props.recent.recentView);
                the.setState({viewSource: this.ds.cloneWithRows(_.reverse(copy))});
            });
        });

        DeviceEventEmitter.addListener('newBuy', () => {
            the._getRecentBuy();
        });

        Token.getToken().then((token) => {
            if (!token) {
                return;
            }
            const params = {
                token: token
            };
            dispatch(fetchRecentBuy(params)).then((res) => {
                let copy = _.cloneDeep(this.props.recent.recentBuy);
                the._buySource(copy);
            });

            this.setState({token: token})
        });


        var tick = 0;
        // setInterval((v) => {
        //     Animated.spring(
        //         this.state.bounce,
        //         {
        //             toValue: -22 * (tick % 2),
        //             friction: 5,
        //         }
        //     ).start();
        //     tick++;
        // }, 2000);

        const req = {
            route: '/rebate/ratio',
            navigator: navigator
        };
        request(req, 'GET')
            .then((res) => {
                if (res && res.resultValues)
                    AsyncStorage.setItem('ratio', res.resultValues);
                the.setState({ratio: res.resultValues});
            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });

        this._topSearch();

        const emitter = new NativeEventEmitter(baiChuanApi);
        emitter.addListener(
            'backFromTB',
            (res) => {
                Clipboard.getString().then((data) => {
                    if (data
                        && /^[0-9]*$/.test(data)
                        && the.state.openOrderPage) {
                        the._syncOrder(data);

                    }
                });
            }
        );
    }

    _buySource(data) {
        // data = _.slice(data, 0, 6);
        let source = [];
        let the = this;
        _.each(data, (v, k) => {

            if (v.orderItemState !== 'CANCELSYNC' && v.orderItemState !== 'FAILED' && v.orderItemState) {

                if (v.syncItems.length > 0) {
                    _.each(v.syncItems, (vv, kk) => {
                        const item = {
                            estimate: vv.syncEstimateEffect,
                            real: vv.syncRealRefund,
                            price: vv.syncItemPrice,
                            title: vv.syncItemName,
                            orderId: vv.syncOrderId,
                            pic: vv.itemPicUrl,
                            status: v.orderItemState
                        };
                        source.push(item);
                    });
                } else {
                    const item = {
                        orderId: v.orderId,
                        status: v.orderItemState
                    };
                    source.push(item);
                }
            }
        });
        source = _.reverse(source);
        source = _.slice(source, 0, 6);

        the.setState({buySource: this.ds.cloneWithRows(source)});
    }

    _getRecentBuy() {
        const the = this;
        const {dispatch} = this.props;
        return new Promise((resolve, reject) => {
            Token.getToken().then((token) => {
                if (!token) {
                    dispatch(fetchRecentBuy());
                    the.setState({buySource: the.ds.cloneWithRows([])});
                    return resolve(false);
                }
                const params = {
                    token: token
                };
                dispatch(fetchRecentBuy(params)).then(() => {
                    let copy = _.cloneDeep(this.props.recent.recentBuy);
                    // copy = _.slice(copy, 0, 6);
                    // _.each(copy, (v, k) => {
                    //     copy[k].tkCommFee = v.tkCommFee / 100
                    // });
                    // the.setState({buySource: the.ds.cloneWithRows(_.reverse(copy))});
                    the._buySource(copy);
                    resolve(true);
                });
            });
        })

    }

    _deleteSearchHistory() {
        AsyncStorage.removeItem(StorageKeys.SEARCH_ITEM);
        AsyncStorage.removeItem(StorageKeys.SEARCH_NOTE);

        this.setState({searchItemHistory: []});
        this.setState({searchNoteHistory: []});
    }

    _deleteViewHistory() {
        AsyncStorage.removeItem('recent_view');

        this.setState({viewSource: this.ds.cloneWithRows([])});
    }

    _historyFrame() {
        let rows = [];
        let topRows = [];
        _.each(this.state.searchItemHistory, (v, k) => {
            if (typeof v === 'string')
                rows.push(
                    <TouchableOpacity style={styles.historyItem} key={k} onPress={() => this._search(v)}>
                        <View>
                            <Text style={[styles.historyItemFont, styles.baseText]}>{v}</Text>
                        </View>
                    </TouchableOpacity>
                );
        });
        _.each(this.state.topSearch, (v, k) => {
            if (typeof v === 'string')
                topRows.push(
                    <TouchableOpacity style={styles.historyItem} key={k} onPress={() => this._search(v)}>
                        <View>
                            <Text style={[styles.historyItemFont, styles.baseText]}>{v}</Text>
                        </View>
                    </TouchableOpacity>
                );
        });
        if (!this.state.itemAuto)
            return (
                <View>
                    {rows.length > 0 ? <View style={styles.historyC}>
                        <View style={styles.blockTitle}>
                            <View style={styles.delete}>
                                <TouchableOpacity onPress={() => this._deleteSearchHistory()}>
                                    <Icon
                                        name='ios-trash'
                                        size={26}
                                        color={'#aaa'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.historyTitle, styles.baseText]}>搜索历史：</Text>
                        </View>
                        <View style={styles.historyContent}>
                            {
                                rows
                            }
                        </View>
                    </View> : null
                    }

                    {topRows.length > 0 ? <View style={styles.historyC}>
                        <View style={styles.blockTitle}>
                            <View style={styles.delete}>
                                <TouchableOpacity onPress={() => this._showTop()}>
                                    <Icon
                                        name={this.state.showTop ? 'ios-eye' : 'ios-eye-off'}
                                        size={26}
                                        color={'#aaa'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.historyTitle, styles.baseText]}>热门搜索：</Text>
                        </View>
                        <View style={styles.historyContent}>
                            {
                                this.state.showTop ? topRows : <View style={{flex: 1, alignItems: 'center'}}><Text
                                    style={styles.dimText}>热门搜索关闭</Text></View>
                            }
                        </View>
                    </View> : null
                    }
                </View>
            );
        else
            return (
                <View style={styles.auto}>
                    <ListView
                        contentContainerStyle={styles.itemAutoList}
                        dataSource={this.state.itemAutoForList}
                        renderRow={this._renderItemAutoRow}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                    />
                </View>
            )
    }

    _renderItemAutoRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}
                              onPress={() => this._search(rowData[0])}>
                <View style={styles.itemAutoRow}>
                    <Text style={styles.baseText}>{rowData[0]}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _autoComplete(text) {
        this.setState({keyWord: text});
        let url = {
            host: configs.taobaoAutoCompleteUrl,
            route: 'sug?code=utf-8&q=' + text,
            headers: {}
        };
        if (!text) {
            this.setState({itemAuto: false});
            return;
        }
        this.setState({itemAuto: true});
        return request(url, 'GET')
            .then((list) => {
                if (list.result.length > 0) {
                    this.setState({itemAutoForList: this.ds.cloneWithRows(list.result)});
                } else {
                    this.setState({itemAuto: false});
                }

            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _recentList(type) {
        let dataSource = this.state.buySource;
        if (type === 'view') {
            dataSource = this.state.viewSource;
            return (
                <ListView
                    contentContainerStyle={styles.itemList}
                    dataSource={dataSource}
                    renderRow={this._renderItemRow.bind(this)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    enableEmptySections={true}
                    pageSize={10}
                    initialListSize={10}
                    removeClippedSubviews={false}
                />
            )
        }
        return (
            <ListView
                contentContainerStyle={styles.itemList}
                dataSource={dataSource}
                renderRow={this._renderItemRow.bind(this)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                enableEmptySections={true}
                renderFooter={this._renderFooter.bind(this)}
                pageSize={6}
                initialListSize={6}
                onEndReached={this._onEndReached.bind(this)}
                removeClippedSubviews={false}
            />
        )

    }

    _onEndReached() {
        if (this.state.buySource.rowIdentities.length > 6)
            this.setState({isLoadMore: true});
    }

    _renderFooter() {
        if (this.state.isLoadMore) {
            return (
                <TouchableOpacity onPress={this._jumpOrdersPage.bind(this)} style={styles.loadMore}>
                    <View>
                        <Text style={styles.loadMoreText}>
                            加载更多
                        </Text>
                        {moreIcon}

                    </View>
                </TouchableOpacity>

            );
            return null;
        }
        return null;
    }

    _jumpOrdersPage() {
        const {navigator} = this.props;
        navigator.push({
            component: OrdersPage,
            name: 'OrdersPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight
        });
    }

    _renderItemRow(rowData: string) {
        const jump = () => {
            if (rowData.orderId)
                this._jumpOrdersPage();
            else
                this._jumpToTaobaoPage(rowData.itemId.toString(), rowData)
        }
        if (!rowData)
            return null;
        return (
            <TouchableOpacity onPress={() => jump()}
                              underlayColor="transparent" activeOpacity={0.5}>
                <View style={styles.sysRowC}>
                    <View style={styles.sysRow}>
                        <PrefetchImage
                            imageUri={rowData.itemPicUrl || rowData.pic}
                            imageStyle={styles.sysThumb}
                            resizeMode="cover"
                            width={width / 3 - 5}
                            height={width / 3 - 5}
                            key={rowData.itemPicUrl || rowData.pic}
                        />

                        <View style={styles.recFlowPrice}>
                            <Text
                                style={[styles.baseText, styles.recFlowText]}>￥{rowData.itemPrice || rowData.price}</Text>

                        </View>
                        <View style={styles.redPacketPrice}>
                            <Image style={styles.redIcon} source={require('../../assets/footer/red_.png')}/>
                            <Text
                                style={[styles.baseText, styles.recFlowText, styles.redPacketText]}>￥{decimals((typeof rowData.tkCommFee != 'undefined' ? rowData.tkCommFee : rowData.estimate) * this.state.ratio, 2)}</Text>
                        </View>
                        <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                            <Text style={[styles.baseText, {paddingBottom: 0, minHeight: 38}]} lineBreakMode={'tail'}
                                  numberOfLines={2}>
                                {rowData.itemTitle || rowData.title}
                            </Text>
                        </View>

                    </View>
                    {
                        (rowData.status == 'UNKNOWN' ||
                            !rowData.status ||
                            !rowData.price) && rowData.orderId ? <View style={styles.syncShadow}>
                            <View style={styles.syncShadowBG}>
                                <View style={styles.syncShadowCircle}>
                                    <Text style={styles.syncShadowText}>订单同步中,大约需5分钟</Text>
                                </View>
                            </View>
                        </View> : null
                    }

                </View>
            </TouchableOpacity>
        )
    }

    _insertOrder(data) {
        const {dispatch} = this.props;
        const the = this;
        data = JSON.stringify(data);
        Token.getToken(navigator).then((token) => {
            if (token) {
                request('user/order', 'POST', data, token)
                    .then((res) => {
                        if (res.resultCode === 0) {
                            toast('购买成功');
                            const params = {
                                token: token
                            };
                            dispatch(fetchRecentBuy(params)).then(() => {
                                const copy = _.cloneDeep(the.props.recent.recentBuy);
                                // the.setState({buySource: the.ds.cloneWithRows(_.reverse(copy))});
                                the._buySource(copy);
                            });
                        }
                    }, function (error) {
                        console.log(error);
                    })
                    .catch(() => {
                        console.log('network error');
                    });
            }
        });
    }

    _jumpToTaobaoPage(itemId, data) {
        const {navigator} = this.props;
        const type = data.userType === 1 ? 'tmall' : 'taobao';

        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump(itemId, '', type, (error, res) => {
                    if (error) {
                        console.error(error);
                    } else {
                        let orders;
                        if (res) { //交易成功
                            orders = res.oders;
                            data.orderId = orders[0];
                            this._insertOrder(data);
                        }
                    }
                })
            }
        });
        this.setState({openOrderPage: false});
    }

    _onLeftIconClicked() {
        const {navigator} = this.props;
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

    _onRightIconClicked() {
        const {navigator} = this.props;

        navigator.push({
            component: SearchPage,
            name: 'SearchPage',
            sceneConfigs: Navigator.SceneConfigs.FadeAndroid
        });
    }

    _topSearch() {
        return request('system/topsearch', 'GET')
            .then((res) => {
                if (res.resultCode === 0
                    && res.resultValues
                    && res.resultValues.configValue.length > 0) {
                    let string = res.resultValues.configValue.substr(1, res.resultValues.configValue.length - 2);
                    this.setState({topSearch: string.split(',')});
                }
            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _showTop() {
        this.setState({showTop: !this.state.showTop});
    }

    _jumpToOrderPage() {
        const {navigator} = this.props;
        const type = 'tmall';

        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump('', '0', type, (error, res) => {
                    if (error) {
                        console.error(error);
                    }
                })
            }
        });
        this.setState({openOrderPage: true});
    }

    _onPressCross() {
        this.setState({showTip: false});
    }

    _syncOrder(orderId) {
        let userId = 17321057664;
        let the = this;

        // let data = {};
        // data.orderId = orderId;
        // this._insertOrder(data);
        // return;

        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY, (err, result) => {
            if (result) {
                result = JSON.parse(result);
                userId = result.userId || userId;
                request('/mapuserorder/map?userId=' + userId + '&orderId=' + orderId, 'GET', '', this.state.token)
                    .then((res) => {
                        if (res.resultCode === 0) {
                            // the._onRefresh();
                            this._getRecentBuy();
                            the.setState({
                                order: orderId,
                                showTip: true,
                                syncMsg: res.resultValues.message
                            });
                        } else {
                            toast(res.resultValues.message);
                        }
                        the.setState({openOrderPage: false});

                        Clipboard.setString('');

                    }, function (error) {
                        console.log(error);
                    })
                    .catch(() => {
                        console.log('network error');
                    });
            }
        });
    }

    _onRefresh() {
        let the = this;
        this.setState({refreshing: true});
        this._getRecentBuy()
            .then((res) => {
                this.setState({refreshing: false});
            });
        this._topSearch();
        setTimeout(() => {
            this.setState({refreshing: false});
        }, 3000)
    }

    _showTip() {
        DeviceEventEmitter.emit('showTip', true);
    }

    render() {
        var rows = [];
        _.each(this.state.searchItemHistory, (v, k) => {
            if (typeof v === 'string')
                rows.push(
                    <TouchableOpacity style={styles.historyItem} key={k} onPress={() => this._search(v)}>
                        <View>
                            <Text style={[styles.historyItemFont, styles.baseText]}>{v}</Text>
                        </View>
                    </TouchableOpacity>
                );
        });
        return (
            <View style={styles.container}>
                <Toolbar
                    title={'剁手记'}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    leftImg={addImg}
                    rightImg={searchImg}
                    onLeftIconClicked={this._onLeftIconClicked}
                    onRightIconClicked={this._onRightIconClicked}
                />
                {
                    this.state.showTip ? <SyncPopup
                        onPressCross={this._onPressCross}
                        order={this.state.order}
                        show={true}
                        text={this.state.syncMsg}
                    /> : null
                }
                <View style={[styles.block, styles.search]}>
                    <Text style={[styles.baseText, {fontSize: 14, color: '#fc7d30'}]}>淘宝购物全场都有红包拿，还不快搜！</Text>
                    <View style={styles.searchHeader}>
                        <TextInput
                            clearButtonMode='while-editing'
                            style={styles.searchText}
                            placeholder={'搜索商品或笔记'}
                            placeholderTextColor='#bebebe'
                            multiline={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='go'
                            onChangeText={(text) => {
                                this._autoComplete(text)
                            }}
                            value={this.state.keyWord}
                            onSubmitEditing={(event) => this._search(event.nativeEvent.text)}
                        />
                        <TouchableOpacity style={styles.sButton} onPress={() => this._search()}>
                            <Text style={styles.sButtonFont}>搜索</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                {
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => this._onRefresh()}
                                colors={['#fc7d30']}
                                tintColor={['#fc7d30']}
                            />
                        }
                        showsVerticalScrollIndicator={false}>
                        <View style={[styles.block, styles.history]}>
                            {this._historyFrame()}
                        </View>
                        {
                            this.props.recent.recentBuy.length === 0 && this.state.token ?
                                <View style={[styles.syncBlock]}>
                                    <TouchableOpacity style={[styles.sync, styles.syncS]}
                                                      onPress={() => this._jumpToOrderPage()}>
                                        <Icon
                                            name='md-sync'
                                            size={16}
                                            color={'#fff'}
                                        />
                                        <Text
                                            style={[styles.historyTitle, styles.baseText, styles.syncTitle]}>手工同步订单</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.what,{marginTop: 6}]}
                                                      onPress={() => this._showTip()}>
                                        <Icon
                                            name='md-help-circle'
                                            size={22}
                                            color={'#666'}
                                        />
                                    </TouchableOpacity>
                                </View> : null
                        }

                        {
                            this.props.recent.recentBuy.length > 0 || this.props.recent.recentView.length > 0 ?

                                <View
                                    style={[styles.block, styles.recent, {height: this.props.recent.recentView.length > 0 && this.props.recent.recentBuy.length > 0 ? 490 : 245}]}>
                                    {
                                        this.props.recent.recentBuy.length > 0 ?
                                            <View style={{marginBottom: 10}}>
                                                <View style={styles.blockTitle}>
                                                    <View style={styles.delete}>
                                                        <TouchableOpacity style={styles.sync}
                                                                          onPress={() => this._jumpToOrderPage()}>
                                                            <Icon
                                                                name='md-sync'
                                                                size={16}
                                                                color={'#fff'}
                                                            />
                                                            <Text
                                                                style={[styles.historyTitle, styles.baseText, styles.syncTitle]}>手工同步</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={styles.what}
                                                                          onPress={() => this._showTip()}>
                                                            <Icon
                                                                name='md-help-circle'
                                                                size={22}
                                                                color={'#666'}
                                                            />
                                                        </TouchableOpacity>

                                                    </View>
                                                    <Text style={[styles.historyTitle, styles.baseText]}>最近购买：</Text>
                                                </View>
                                                <View style={styles.recentBuy}>
                                                    {this._recentList('buy')}
                                                </View>
                                            </View> :
                                            null
                                    }
                                    {
                                        this.props.recent.recentView.length > 0 ?
                                            <View>
                                                <View style={styles.blockTitle}>
                                                    <View style={styles.delete}>
                                                        <TouchableOpacity onPress={() => this._deleteViewHistory()}>
                                                            <Icon
                                                                name='ios-trash'
                                                                size={26}
                                                                color={'#aaa'}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text style={[styles.historyTitle, styles.baseText]}>最近浏览：</Text>
                                                </View>
                                                <View style={styles.recentView}>
                                                    {this._recentList('view')}
                                                </View>
                                            </View> :
                                            null
                                    }

                                </View>
                                :
                                null}
                    </ScrollView>
                }

            </View>
        )

    }
}

function mapStateToProps(state) {
    const {comments, recent} = state;
    return {
        comments,
        recent
    };
}

export default connect(mapStateToProps)(RedPacket);