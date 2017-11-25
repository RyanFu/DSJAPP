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
    Image
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {request, toast} from '../../utils/common';
import {Token} from '../../utils/common';
import {connect} from 'react-redux';
//import Emoticons, * as emoticons from 'react-native-emoticons';
import AutoHideKeyboard from '../../components/autoHideBoard';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

const dismissKeyboard = require('dismissKeyboard');
import deprecatedComponents from 'react-native-deprecated-custom-components';

const Navigator = deprecatedComponents.Navigator;

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.recent.recentView)
        };
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}>
                <View>
                    <View style={styles.orderRow}>
                        <Text>{rowData.itemTitle}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _orderList(orderType){
        let data = null;
        if(orderType === 1){
            data = _.filter(this.props.recent.recentView, function(o) { return o.state === 'SETTLED'; });
        }
        if(orderType === 2){
            data = _.filter(this.props.recent.recentView, function(o) { return (o.state !== 'INVALID' || o.state !== 'UNKNOWN'); });
        }
        if(orderType === 3){
            data = _.filter(this.props.recent.recentView, function(o) { return o.state === 'UNKNOWN'; });
        }
        return (
            <ListView
                contentContainerStyle={styles.orderList}
                dataSource={this.ds.cloneWithRows(data)}
                renderRow={this._renderRow}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                enableEmptySections={true}
            />
        );
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="订单"
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
                        tabLabel='可提现订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(1)}
                    </View>
                    <View
                        key='2'
                        tabLabel='有效订单'
                        style={{flex: 1}}
                    >
                        {this._orderList(2)}
                    </View>
                    <View
                        key='3'
                        tabLabel='同步中订单'
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