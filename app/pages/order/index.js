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
    AsyncStorage
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {decimals} from '../../utils/common';
import {timeFormat} from '../../utils/common';
import {connect} from 'react-redux';
//import Emoticons, * as emoticons from 'react-native-emoticons';
import AutoHideKeyboard from '../../components/autoHideBoard';
import _ from 'lodash';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
const dismissKeyboard = require('dismissKeyboard');
import deprecatedComponents from 'react-native-deprecated-custom-components';
import PrefetchImage from '../../components/prefetchImage';

const Navigator = deprecatedComponents.Navigator;

class Order extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            ratio: 0.7
        };
    }

    componentDidMount() {
        const the = this;
        AsyncStorage.getItem('ratio', (error, result) => {
            if(!error && result)
            the.setState({ratio: result});
        });

        this._buySource(this.props.recent.recentBuy);
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5} >
                <View>
                    <View style={styles.orderRow}>
                        <PrefetchImage
                            imageUri={rowData.pic}
                            imageStyle={styles.itemThumb}
                            resizeMode="stretch"
                            width={60}
                            height={90}
                            key={rowData.id+rowData.orderType+'.'}
                        />
                        <View style={styles.orderText}>
                            <Text style={styles.baseText} lineBreakMode={'tail'} numberOfLines={2}>{rowData.title}</Text>
                            <View style={styles.orderTextDetail}>
                                <Text style={[styles.dimText,styles.sText,rowData.orderType==1?styles.red:(rowData.orderType==2?styles.green:(rowData.orderType==3?styles.darkGreen:''))]}>预估红包：￥ {decimals(rowData.estimate*this.state.ratio, 2)}</Text>
                                <Text style={[styles.dimText,styles.sText,rowData.orderType==1?styles.red:(rowData.orderType==2?styles.green:(rowData.orderType==3?styles.darkGreen:''))]}>实际红包：￥ {decimals(rowData.real*this.state.ratio, 2)}</Text>
                                <Text style={[styles.dimText,styles.sText]}>下单时间： {timeFormat(rowData.time, 'yyyy年MM月dd日 hh:mm:ss')}</Text>

                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _orderList(orderType){
        let data = null;
        if(orderType === 2){
            data = _.filter(this.props.recent.recentBuy, function(o) { return o.orderItemState === 'SETTLED'; });
        }
        if(orderType === 1){
            data = _.filter(this.props.recent.recentBuy, function(o) { return o.orderItemState === 'PAID' ; });
        }
        if(orderType === 3){
            data = _.filter(this.props.recent.recentBuy, function(o) { return o.orderItemState === 'WITHDRAWN'; });
        }
        if(orderType === 0){
            data = this.props.recent.recentBuy;
        }
        return (
            <ListView
                contentContainerStyle={styles.orderList}
                dataSource={this.ds.cloneWithRows(this._buySource(data,orderType))}
                renderRow={this._renderRow}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
            />
        );
    }

    _buySource(data,orderType){
        // data = _.slice(data, 0, 6);
        let source = [];
        let the = this;
        _.each(data, (v, k) => {
            if(v.syncItems.length > 0){
                _.each(v.syncItems, (vv, kk) =>{
                    const item = {
                        id: vv.id,
                        estimate: vv.syncEstimateEffect,
                        real: vv.syncRealRefund,
                        price: vv.syncItemPrice,
                        title: vv.syncItemName,
                        orderId: vv.syncOrderId,
                        pic: vv.itemPicUrl,
                        status: vv.status,
                        orderType: orderType,
                        time: vv.syncCreationDate
                    };
                    source.push(item);
                });
            } else {
                const item = {
                    id: v.id,
                    orderId: v.orderId,
                    status: v.orderItemState,
                    orderType: orderType,
                    time: vv.creationDate|| (new Date()).getTime()
                };
                source.push(item);
            }
        });
        source = _.reverse(source);
        return source;
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
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
                        key='1'
                        tabLabel='有效订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(1)}
                    </View>
                    <View
                        key='2'
                        tabLabel='可提现订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(2)}
                    </View>
                    <View
                        key='3'
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