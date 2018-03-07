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
    ListView,
    Image,
    AsyncStorage,
    RefreshControl,
    Button
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {decimals, isIphoneX, request, toast, Token} from '../../utils/common';
import {timeFormat} from '../../utils/common';
import {connect} from 'react-redux';
//import Emoticons, * as emoticons from 'react-native-emoticons';
import AutoHideKeyboard from '../../components/autoHideBoard';
import _ from 'lodash';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import baiChuanApi from 'react-native-taobao-baichuan-api';

const dismissKeyboard = require('dismissKeyboard');
import deprecatedComponents from 'react-native-deprecated-custom-components';
import PrefetchImage from '../../components/prefetchImage';
import images from '../../constants/images';
import StorageKeys from "../../constants/StorageKeys";
import {fetchRecentBuy} from "../../actions/recent";

const Navigator = deprecatedComponents.Navigator;

class Order extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            ratio: 0.7,
            refreshing: false,
            token: null
        };
    }

    componentDidMount() {
        const the = this;
        AsyncStorage.getItem('ratio', (error, result) => {
            if (!error && result)
                the.setState({ratio: result});
        });

        this._buySource(this.props.recent.recentBuy);

        Token.getToken(navigator).then((token) => {
            if (token) {
                the.setState({token: token});
            }
        });
    }

    _statusText(status) {
        switch (status) {
            case 'NEW':
                return '订单同步';
            case 'PAID':
                return '订单付款';
            case 'SETTLED':
                return '订单收货';
            case 'FAILED':
                return '订单失效';
            case 'WITHDRAWN':
                return '提现成功';
            case 'CANCELSYNC':
                return '取消跟单';
            default:
                return '无效订单';
        }
    }

    _textColor(status) {
        switch (status) {
            case 'NEW':
                return 'grey';
            case 'PAID':
                return 'green';
            case 'SETTLED':
                return 'red';
            case 'FAILED':
                return 'grey';
            case 'WITHDRAWN':
                return 'darkGreen';
            case 'CANCELSYNC':
                return '';
            default:
                return 'grey';
        }
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}>
                <View>
                    <View style={styles.orderRow}>
                        <View style={styles.header}>
                            <Text
                                style={[styles.dimText, styles.sText, styles[this._textColor(rowData.status)]]}>
                                {this._statusText(rowData.status)}
                            </Text>
                            <Text
                                style={[styles.dimText, styles.sText]}>下单时间： {timeFormat(rowData.time, 'yyyy年MM月dd日 hh:mm:ss')}</Text>
                        </View>
                        <View style={[styles.orderRowInner,{alignItems: rowData.pic? 'stretch': 'center'}]}>
                            {rowData.pic ? <PrefetchImage
                                    imageUri={rowData.pic ? rowData.pic : images.DEFAULT_IMAGE}
                                    imageStyle={[styles.itemThumb, {marginTop: rowData.pic ? null : null}]}
                                    resizeMode="contain"
                                    width={rowData.pic ? 108 : 60}
                                    height={rowData.pic ? 108 : 60}
                                    key={rowData.id + rowData.orderType + '.'}
                                />
                                :< Image resizeMode = {Image.resizeMode.contain} style={{width:80,height: 80}}
                                source={require('../../assets/gif/loading.gif')}/>
                            }
                            <View style={styles.orderText}>
                                <Text style={styles.baseText} lineBreakMode={'tail'}
                                      numberOfLines={4}>{rowData.title}</Text>
                                {rowData.status && rowData.status !== 'CANCELSYNC' && rowData.status !== 'NEW' ?
                                    <View style={styles.orderTextDetail}>
                                        <Text
                                            style={[styles.dimText, styles.sText, styles.pText, styles[this._textColor(rowData.status)]]}>价格：￥ {rowData.price} × {rowData.mount ? rowData.mount : 1}</Text>
                                        {
                                            rowData.status === 'PAID' ?
                                                <Text
                                                    style={[styles.dimText, styles.sText, styles.pText, styles[this._textColor(rowData.status)]]}>预估红包：￥ {rowData.estimate}</Text> : null
                                        }
                                        {
                                            rowData.status === 'SETTLED' ? <Text
                                                style={[styles.dimText, styles.sText, styles.pText, styles[this._textColor(rowData.status)]]}>可提现红包：￥ {rowData.real}</Text> : null
                                        }
                                        {
                                            rowData.status === 'WITHDRAWN' ? <Text
                                                style={[styles.dimText, styles.sText, styles.pText, styles[this._textColor(rowData.status)]]}>已提现红包：￥ {rowData.real }</Text> : null
                                        }

                                        <View style={styles.shop}>
                                            <Image
                                                style={{width: 12, height: 12, opacity: 0.5, marginRight: 4,marginTop:3}}
                                                resizeMode={'cover'}
                                                source={require('../../assets/search/shop.png')}
                                            />
                                            <Text style={[styles.dimText, styles.sText, styles.pText]}>{rowData.shop || ''}</Text>
                                        </View>

                                    </View> : null
                                }
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Text style={[styles.dimText, styles.sText]}>
                                订单号：{rowData.orderId}
                            </Text>
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    style={[styles.button, styles.buttonGrey]}
                                    onPress={() => this._jumpToOrderPage(rowData.orderId.toString())}>
                                    <Text style={[styles.buttonFont, styles.buttonGreyFont]}>更多详情</Text>
                                </TouchableOpacity>
                                {
                                    !rowData.status || (rowData.status && rowData.status === 'NEW') ?
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonGrey]}
                                            onPress={() => {
                                                this._cancelSync(rowData.orderId)
                                            }}>
                                            <Text style={[styles.buttonFont, styles.buttonGreyFont]}>取消跟单</Text>
                                        </TouchableOpacity> : null
                                }
                            </View>

                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _orderList(orderType) {
        let data = null;
        if (orderType === 2) {
            data = _.filter(this.props.recent.recentBuy, function (o) {
                return o.orderItemState === 'SETTLED';
            });
        }
        if (orderType === 1) {
            data = _.filter(this.props.recent.recentBuy, function (o) {
                return o.orderItemState === 'PAID' ;
            });
        }
        if (orderType === 3) {
            data = _.filter(this.props.recent.recentBuy, function (o) {
                return o.orderItemState === 'WITHDRAWN';
            });
        }
        if (orderType === 0) {
            data = _.filter(this.props.recent.recentBuy, function (o) {
                return o.orderItemState !== 'CANCELSYNC';
            });
        }
        return (
            <ListView
                contentContainerStyle={styles.orderList}
                dataSource={this.ds.cloneWithRows(this._buySource(data, orderType))}
                renderRow={this._renderRow}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._onRefresh()}
                        colors={['#fc7d30']}
                        tintColor={['#fc7d30']}
                    />
                }
            />
        );
    }

    _buySource(data, orderType) {
        // data = _.slice(data, 0, 6);
        let source = [];
        let the = this;
        _.each(data, (v, k) => {
            if (v.syncItems.length > 0) {
                _.each(v.syncItems, (vv, kk) => {
                    const item = {
                        id: vv.id,
                        estimate: vv.estimatedRebate,
                        real: vv.availableRebate,
                        price: vv.syncPaidAmount,
                        title: vv.syncItemName,
                        orderId: vv.syncOrderId,
                        pic: vv.itemPicUrl,
                        status: vv.status,
                        orderType: orderType,
                        time: vv.syncCreationDate,
                        shop: vv.syncStoreName,
                        mount: vv.syncItemCount
                    };
                    source.push(item);
                });
            } else {
                const item = {
                    title: v.orderItemState === 'CANCELSYNC' || !v.orderItemState ? '订单无效' + v.orderId : '订单同步中' + v.orderId,
                    id: v.id,
                    orderId: v.orderId,
                    status: v.orderItemState,
                    orderType: orderType,
                    estimate: 0,
                    real: 0,
                    price: 0,
                    time: v.createdDateTime || v.creationDate || (new Date()).getTime()
                };
                if(v.orderItemState === 'NEW'){
                    if ((Date.now() - (v.createdDateTime || v.creationDate)) > 86400000) {
                        item.title = '您的订单超过同步期限（24小时），可能是因为您的订单没有按照剁手记的正确操作流程，也可能是系统原因，您可以关注微信公众号"剁手记服务号"，联系客服';
                    } else {
                        item.title = '订单正在同步中，5分钟内完成...';
                    }
                }
                source.push(item);
            }
        });
        source = _.reverse(source);
        return source;
    }

    _jumpToOrderPage(orderId) {
        const {navigator} = this.props;
        const type = 'taobao';

        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump('', orderId, type, (error, res) => {
                    if (error) {
                        console.error(error);
                    }
                })
            }
        });
        this.setState({openOrderPage: true});
    }

    _cancelSync(orderId) {
        let userId = 17321057664;
        let the = this;

        const cancel = (orderId) => {
            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY, (err, result) => {
                if (result) {
                    result = JSON.parse(result);
                    userId = result.userId || userId;
                    request('/mapuserorder/unmap?userId=' + userId + '&orderId=' + orderId, 'GET', '', the.state.token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast(res.resultValues.message);
                                the._getBuyList();
                            }
                        }, function (error) {
                            console.log(error);
                        })
                        .catch(() => {
                            console.log('network error');
                        });
                }
            });
        };

        Alert.alert(
            '',
            '您需要取消此订单跟单吗？',
            [
                {text: '取消', onPress: () => console.log('')},
                {
                    text: '确定', onPress: () => {
                        cancel(orderId);
                    }

                },
            ]
        )
    }

    _getBuyList() {
        const the = this;
        const {dispatch} = this.props;
        return new Promise((resolve, reject) => {
            Token.getToken().then((token) => {
                if (!token) {
                    dispatch(fetchRecentBuy());
                    the.setState({buySource: the.ds.cloneWithRows([])});
                    resolve(false);
                    return;
                }
                const params = {
                    token: token
                };
                dispatch(fetchRecentBuy(params)).then(() => {
                    let copy = _.cloneDeep(this.props.recent.recentBuy);
                    the._buySource(copy);
                    resolve(true);
                });
            });
        })
    }

    _onRefresh() {
        const the = this;
        this.setState({refreshing: true});
        this._getBuyList()
            .then((res) => {
                if (res)
                    the.setState({refreshing: false});
            });
        setTimeout(() => {
            the.setState({refreshing: false});
        }, 3000);
    }


    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null :(isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <Toolbar
                    title="交易"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    tabBarPosition="top"
                    tabBarBackgroundColor="rgba(255,255,255,0.9)"
                    tabBarActiveTextColor="#fc7d30"
                    tabBarInactiveTextColor="#9b9b9b"
                    tabBarUnderlineStyle={{backgroundColor: '#fc7d30', height: 1.5}}
                    initialPage={0}
                    renderTabBar={() => <DefaultTabBar
                        style={{height: 40, borderBottomColor: 'rgba(178,178,178,0.3)'}}
                    />}
                >
                    <View
                        key='1'
                        tabLabel='全部'
                        style={{flex: 1}}
                    >
                        {this._orderList(0)}
                    </View>
                    <View
                        key='2'
                        tabLabel='有效订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(1)}
                    </View>
                    <View
                        key='3'
                        tabLabel='可提现订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(2)}
                    </View>
                    <View
                        key='4'
                        tabLabel='已提现订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(3)}
                    </View>
                </ScrollableTabView>

            </View>
        )

    }
}

function mapStateToProps(state) {
    const {recent} = state;
    return {
        recent
    };
}

export default connect(mapStateToProps)(Order);