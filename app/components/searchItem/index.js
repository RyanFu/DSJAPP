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
    ListView,
    Image,
    ActivityIndicator
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import {Token,request,toast} from '../../utils/common';
import { connect } from 'react-redux';
var backImg = require('../../assets/upload/rg_left.png');
import Taobao from 'react-native-taobao-baichuan-api';
import { fetchItemSearchList } from '../../actions/search';
import { addRecentView } from '../../actions/recent';

class SearchItem extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._jumpToTaobaoPage = this._jumpToTaobaoPage.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.search.itemList),
            showTip: false
        };
    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}
                              onPress={() => this._tip(rowData.itemId.toString(),rowData)}>
                <View style={styles.itemRow}>
                    <Image style={styles.pic}
                           source={{uri: (rowData.itemPicUrl ? rowData.itemPicUrl : images.DEFAULT_PORTRAIT), width: 100, height: 100}}/>
                    <View style={styles.itemContent}>

                        <View>
                            <Text style={[styles.baseText,styles.title]}>
                                {rowData.itemTitle}
                            </Text>
                        </View>

                        <View style={styles.itemDigit}>
                            <View style={styles.itemDigitP}>
                                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                    <Text style={[styles.baseText,styles.price]}>
                                        ￥{rowData.itemPrice}
                                    </Text>
                                    <Image
                                        style={{width: 16,height: 16,marginLeft:8}}
                                        resizeMode={'contain'}
                                        source={require('../../assets/footer/red.png')}
                                        />
                                    <Text style={[styles.baseText,styles.dimText,{marginLeft:2,color: '#fc7d30',}]}>
                                        ￥{rowData.tkCommFee}
                                    </Text>
                                </View>
                                <View style={{flexDirection: 'row',alignItems: 'center'}}>

                                    <Image
                                        style={{width:12,height: 12,opacity:0.5,marginLeft:4}}
                                        resizeMode={'cover'}
                                        source={require('../../assets/search/shop.png')}
                                        />
                                    <Text style={[styles.baseText,styles.dimText,{marginLeft:4}]}>
                                        {rowData.shopTitle}
                                    </Text>
                                </View>

                            </View>
                            <View style={styles.itemDigitO}>
                                {
                                    rowData.userType == 1 ?
                                        <View style={styles.tmallIcon}>
                                            <Text style={[styles.baseText,{color:'#fff',fontSize:10,lineHeight:12,textAlign: 'center'}]}>天猫</Text>
                                        </View> : null
                                }
                                <Text style={[styles.baseText,styles.dimText]}>
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
                request('user/orderitems','POST',data,token)
                    .then((res) => {
                        if (res.resultCode === 0) {
                            toast('购买成功');
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

    _jumpToTaobaoPage(itemId,data) {

        //data.orderId = '33351509422362798';
        //this._insertOrder(data);
        //return;
        const { navigator,dispatch } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                Taobao.jump(itemId, (error, res) => {
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

    _tip(itemId, data) {
        this.props.tipShow();
        this.props.itemData(itemId, data, this._jumpToTaobaoPage);
    }

    _onScroll(event) {
        let the = this;
        const { dispatch, search } = this.props;
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
        const { dispatch, search } = this.props;
        let params = {};
        if (!search.loadingMore) {

            params.loadingMore = true;
            params.currentPage = search.currentPage + 1;
            params.text = this.props.text;
            dispatch(fetchItemSearchList(params)).then(()=> {
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
                    />

            </View>
        )

    }
}

function mapStateToProps(state) {
    const { search } = state;
    return {
        search
    };
}

export default connect(mapStateToProps)(SearchItem);