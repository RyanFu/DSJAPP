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
    ListView,
    Image,
    ActivityIndicator,
    AsyncStorage, Linking, Clipboard
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import {Token, request, toast, decimals} from '../../utils/common';
import {connect} from 'react-redux';

import Taobao from 'react-native-taobao-baichuan-api';
import {fetchItemSearchList} from '../../actions/search';
import {addRecentView} from '../../actions/recent';
import _ from 'lodash';
import configs from "../../constants/configs";
import H5Page from "../../pages/h5";
import StorageKeys from "../../constants/StorageKeys";

class SearchItem extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._jumpToTaobaoPage = this._jumpToTaobaoPage.bind(this);
        this._getForTag = this._getForTag.bind(this);
        this._gotoH5Page = this._gotoH5Page.bind(this);
        this._jumpToCouponPage = this._jumpToCouponPage.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.search.itemList),
            showTip: false,
            ratio: this.props.ratio ? this.props.ratio : 0.8
        };
    }

    componentDidMount() {

    }

    _renderRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}
                              onPress={() => this._tip(rowData.itemId.toString(), rowData)}>
                <View style={styles.itemRow}>
                    <Image style={styles.pic}
                           resizeMode={Image.resizeMode.contain}
                           source={{
                               uri: (rowData.itemPicUrl ? rowData.itemPicUrl : images.DEFAULT_PORTRAIT),
                               width: 100,
                               height: 100
                           }}/>
                    <View style={styles.itemContent}>

                        <View>
                            <Text style={[styles.baseText, styles.title]}>
                                {rowData.itemTitle}
                            </Text>
                        </View>

                        <View style={styles.itemDigit}>
                            <View style={styles.itemDigitP}>
                                {
                                    rowData.couponAmount?
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={styles.coupon}>
                                                <Text style={[styles.baseText, styles.dimText, styles.couponText]}>{rowData.couponAmount}元券</Text>
                                            </View>
                                        </View>:
                                        null
                                }
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Text style={[styles.baseText, styles.price]}>
                                        ￥{rowData.itemPrice}
                                    </Text>
                                    <Image
                                        style={{width: 16, height: 16, marginLeft: 8}}
                                        resizeMode={'contain'}
                                        source={require('../../assets/footer/red.png')}
                                    />
                                    <Text style={[styles.baseText, styles.dimText, {marginLeft: 2, color: '#fc7d30',}]}>
                                        ￥{decimals(rowData.tkCommFee * this.state.ratio, 2)}
                                    </Text>
                                </View>

                                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                                    <Image
                                        style={{width: 12, height: 12, opacity: 0.5, marginLeft: 4}}
                                        resizeMode={'cover'}
                                        source={require('../../assets/search/shop.png')}
                                    />
                                    <Text style={[styles.baseText, styles.dimText, styles.shopTitle, {marginLeft: 4}]}
                                          lineBreakMode={'tail'} numberOfLines={1}>
                                        {rowData.shopTitle}
                                    </Text>
                                </View>

                            </View>
                            <View style={styles.itemDigitO}>
                                {
                                    rowData.userType == 1 ?
                                        <Image
                                            style={{width: 20, height: 20, marginLeft: 8}}
                                            resizeMode={'contain'}
                                            source={require('../../assets/logo/tmall_40.png')}
                                                />
                                         :
                                        <Image
                                            style={{width: 20, height: 20, marginLeft: 8}}
                                            resizeMode={'contain'}
                                            source={require('../../assets/logo/taoicon.jpeg')}
                                                />
                                }
                                <Text style={[styles.baseText, styles.dimText]}>
                                    月销：{rowData.biz30day}
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _insertOrder(data) {
        data = JSON.stringify(data);
        Token.getToken(navigator).then((token) => {
            if (token) {
                request('user/order', 'POST', data, token)
                    .then((res) => {
                        if (res.resultCode === 0) {
                            toast('购买成功');
                            DeviceEventEmitter.emit('portraitUpdated', true);
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

        //data.orderId = '33351509422362798';
        //this._insertOrder(data);
        //return;
        // const type = data.userType === 1 ? 'tmall' : 'taobao';
        const type = 'tmall';//统一跳到手淘

        const {navigator, dispatch} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                Taobao.jump(itemId, '', type, (error, res) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(res);
                        let orders;
                        if (res) { //交易成功
                            orders = res.orders;//["33351509422362798"] "33363950028362798"
                            console.log(orders[0]);
                            data.orderId = orders[0];
                            this._insertOrder(data);
                        }
                    }
                });
                dispatch(addRecentView(data));

                //DeviceEventEmitter.emit('newView', true);

            }
        });
    }

    _jumpToCouponPage(itemId, searchData) {
        const {navigator, dispatch} = this.props;
        const the = this;
        let userId = 17321057664;

        Token.getToken(navigator).then((token) => {
            if (token) {
                AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY, (err, result) => {
                    if (result) {
                        result = JSON.parse(result);
                        userId = result.userId || userId;
                        request('highrebate/decode?userId=' + userId + '&itemId=' + itemId, 'GET', '', token)
                            .then((res) => {
                                if (res.resultCode === 0 && res.resultValues.status === 0) {
                                    const data = JSON.parse(res.resultValues.data);

                                    const couponLink = data.data.couponShortLinkUrl.replace('https://','');
                                    const url = configs.taobaoLink + couponLink;
                                    Linking.canOpenURL(url).then(supported => {
                                        if (supported) {
                                            Linking.openURL(url);
                                        } else {
                                            the._gotoH5Page('',data.data.couponShortLinkUrl);
                                        }
                                    })
                                    dispatch(addRecentView(searchData));
                                } else {
                                    this._jumpToTaobaoPage(itemId, searchData);
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
        });



    }

    _gotoH5Page(title, uri) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'H5Page',
                component: H5Page,
                uri: uri,
                title: title||'优惠券详情'
            })
        }
    }

    _tip(itemId, data) {
        const cloneData = _.cloneDeep(data);
        if (this.props.from === 'editNote') {
            this._getForTag(cloneData);
        } else {
            this.props.tipShow();
            cloneData.tkCommFee = decimals(cloneData.tkCommFee * this.state.ratio, 2);
            this.props.itemData(itemId, cloneData, data.couponAmount?this._jumpToCouponPage:this._jumpToTaobaoPage);

        }
    }

    _getForTag(data) {
        const addTag = (data) => {
            let tag = {};
            tag.title = data.itemTitle;
            tag.imageUrl = data.itemPicUrl;
            tag.url = '';
            tag.itemId = data.itemId;
            tag.redPacket = decimals(data.tkCommFee * this.state.ratio, 2);
            tag.urlCategory = 'taobao';
            tag.price = data.itemPrice;
            DeviceEventEmitter.emit('newTag', tag);
            this.props.navigator.popN(2);
        };
        Alert.alert(
            '标签',
            '这是您要找的商品吗？',
            [
                {text: '不是', onPress: () => console.log('')},
                {
                    text: '是', onPress: () => {
                        addTag(data);
                    }
                }
            ]
        );
    }

    _onScroll(event) {
        let the = this;
        const {dispatch, search} = this.props;
        let maxOffset = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
        let offset = event.nativeEvent.contentOffset.y;
        let params = {};
        if (offset > 0
            && Math.floor(maxOffset - offset) <= 0
            && !search.loadingMore) {

            params.loadingMore = true;
            params.currentPage = parseInt(search.currentPage) + 1;
            params.text = this.props.text;
            dispatch(fetchItemSearchList(params));
        }
    }

    _onEndReached() {
        let the = this;
        const {dispatch, search} = this.props;
        let params = {};
        if (!search.loadingMore) {

            params.loadingMore = true;
            params.currentPage = search.currentPage + 1;
            params.text = this.props.text;
            dispatch(fetchItemSearchList(params)).then(() => {
                the.setState({
                    dataSource: this.ds.cloneWithRows(this.props.search.itemList)
                });
            });
        }
    }

    _renderFooter() {
        if (this.props.search.loadingMore) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="small" color="#fc7d30"/>
                    <Text style={styles.loadingText}>
                        数据加载中……
                    </Text>
                </View>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.props.search.itemList.length > 0 ?
                        <ListView
                            contentContainerStyle={styles.itemList}
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            enableEmptySections={true}
                            onEndReached={() => this._onEndReached()}
                            onEndReachedThreshold={10}
                            scrollEventThrottle={200}
                            renderFooter={this._renderFooter}
                        />:
                        <View style={styles.noItems}>
                            <Icon
                                color={'#F37D30'}
                                size={70}
                                name={'logo-freebsd-devil'}
                            />
                            <Text style={styles.dimText}>缩短搜索关键词再试试吧</Text>
                        </View>
                }


            </View>
        )

    }
}

function mapStateToProps(state) {
    const {search} = state;
    return {
        search
    };
}

export default connect(mapStateToProps)(SearchItem);