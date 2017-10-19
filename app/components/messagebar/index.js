/**
 * Created by lyan2 on 16/7/31.
 */
import React, { Component } from 'react';
import {
    AsyncStorage,
    Flex,
    InteractionManager,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    RecyclerViewBackedScrollView
} from 'react-native';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import MessageDetailPage from '../../pages/messages/MessageDetailPage';

export default class MessageBar extends Component {
    constructor(props) {
        super(props);
    }

    _getMessageIcon(type) {
        switch(type) {
            case 'note' :
                return fileIcon;
            case 'comment':
                return commentIcon;
            case 'trans' :
                return shoppingCartIcon;
            case 'fan':
                return userIcon;
            default:
                return infoIcon;
        }
    }

    _onPressMessageBar() {
        this.props.highlightRow(this.props.data.sectionID, this.props.data.rowID);

        const { navigator } = this.props;

        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        if(navigator) {
            navigator.push({
                name: 'MessageDetailPage',
                component: MessageDetailPage
            })
        }
    }

    render() {
        let rowData = this.props.data.rowData;

        return (
            <View style={styles.messageRow} onPress={this._onPressMessageBar}>
                {this._getMessageIcon(rowData.type)}
                <Text style={styles.messageTitle}>{rowData.title}</Text>
                <View style={styles.messageNewMark}>
                    <Text style={styles.messageNewNum}>{rowData.newCnt}</Text>
                </View>
                {chevronRightIcon}
            </View>
        );
    }
}
