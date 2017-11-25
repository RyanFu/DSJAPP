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
    Keyboard,
    ListView,
    Image
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import { request,toast } from '../../utils/common';
import { Token } from '../../utils/common';
import { connect } from 'react-redux';
//import Emoticons, * as emoticons from 'react-native-emoticons';
import AutoHideKeyboard from '../../components/autoHideBoard';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
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
            <TouchableOpacity  underlayColor="transparent" activeOpacity={0.5}>
                <View>
                    <View style={styles.orderRow}>
                        <Text>{rowData.itemTitle}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="订单"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <ListView
                    contentContainerStyle={styles.orderList}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                />


            </View>
        )

    }
}

function mapStateToProps(state) {
    const { recent } = state;
    return {
        recent
    };
}

export default connect(mapStateToProps)(Order);