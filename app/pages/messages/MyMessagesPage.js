/**
 * Created by lyan2 on 16/7/27.
 */
'use strict';
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
import Toolbar from '../../components/toolbar';
import Button from '../../components/button/Button';
import StorageKeys from '../../constants/StorageKeys';
import styles from './styles';
import MessageDetailPage from './MessageDetailPage';
import MessageList from './meeageList';
import {
    getToken,
    Token
} from '../../utils/common';
import {fetchMessageNum} from '../../actions/message';
import { connect } from 'react-redux';

var fileIcon = <Icon style={[styles.messageIndicatortIcon]} size={16} name="file-text-o"/>;
var userIcon = <Icon style={[styles.messageIndicatortIcon]} size={16} name="user"/>;
var commentIcon = <Icon style={[styles.messageIndicatortIcon]} size={16} name="comment-o"/>;
var shoppingCartIcon = <Icon style={[styles.messageIndicatortIcon]} size={16} name="shopping-cart"/>;
var infoIcon = <Icon style={[styles.messageIndicatortIcon]} size={16} name="info"/>;
var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class MyMessagesPage extends Component {
    constructor(props) {
        super(props);

        this._getMessagesFromServer = this._getMessagesFromServer.bind(this);
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.newCnt !== r2.newCnt,
            sectionHeaderHasChanged: (s1, s2) => s1 != s2
        });

        this.state = {
            dataSource: ds,
            shouldUpdate: this.props.shouldUpdate
        }
    }

    componentWillReceiveProps() {
        this._getMessagesFromServer();
    }

    componentWillMount() {
        // load old data to display
        //await this._loadInitialState();
    }

    componentDidMount() {
        // refresh data from server
        InteractionManager.runAfterInteractions(() => {
            this._getMessagesFromServer();
        });
        //const {dispatch} = this.props;
        //Token.getToken(navigator).then((token) => {
        //    if (token) {
        //        const params = {
        //            token: token
        //        };
        //        dispatch(fetchMessageNum(params))
        //    }
        //});
    }

    async _loadInitialState() {
        try {
            await getToken();

            let value = await AsyncStorage.getItem(StorageKeys.MY_MESSAGES_STORAGE_KEY);
            if (value !== null) {
                this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(JSON.parse(value))});
            }
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    _getMessagesFromServer() {
        this._updateMessagesSource({
            messages: {
                "message2": {
                    title: '新的交易',
                    newCnt: this.props.message.messageNum['unreadRebateNotificationCount'] >=0 ? this.props.message.messageNum['unreadRebateNotificationCount'] : 0,
                    type: 'trans'
                }, "message3": {
                    title: '新的粉丝',
                    newCnt: this.props.message.messageNum['unreadFollowNotificationCount'] >=0 ? this.props.message.messageNum['unreadFollowNotificationCount'] : 0,
                    type: 'fan'
                }, "message4": {
                    title: '新的评论',
                    newCnt: this.props.message.messageNum['unreadCommentNotificationCount'] >=0 ? this.props.message.messageNum['unreadCommentNotificationCount'] : 0,
                    type: 'comment'
                }
            }
        });
    }

    async _updateMessagesSource(source) {
        this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(source)});
        AsyncStorage.setItem(StorageKeys.MY_MESSAGES_STORAGE_KEY, JSON.stringify(source));
    }

    _onDataArrived(newData) {
        this._notes = this._notes.concat(newData);
        this.setState({
            datasource: this.state.ds.cloneWithRows(this._notes)
        });
    }

    _renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.messageHeader}>
                <Text style={styles.messageHeaderTitle}>消息</Text>
            </View>
        );
    }

    _onPressMessage(messageData) {
        const { navigator } = this.props;
        let type = 'rebate';
        switch (messageData.type) {
            case 'comment':
                type = 'comment';
                break;
            case 'trans' :
                type = 'rebate';
                break;
            case 'fan':
                type = 'follow';
                break;
            default:
                type = 'rebate';
        }
        if (navigator) {
            navigator.push({
                name: 'MessageList',
                component: MessageList,
                type: type
            })
        }
    }

    _getMessageIcon(type) {
        switch (type) {
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

    _renderMessage(rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableHighlight onPress={() => {highlightRow(sectionID, rowID); this._onPressMessage(rowData);}}>
                <View style={styles.messageRow}>
                    {this._getMessageIcon(rowData.type)}
                    <Text style={styles.messageTitle}>{rowData.title}</Text>
                    {rowData.newCnt>0?
                        <View style={styles.messageNewMark}>
                            <Text style={styles.messageNewNum}>{rowData.newCnt}</Text>
                        </View>: null
                    }

                    {chevronRightIcon}
                </View>
            </TouchableHighlight>
        );
    }

    _renderSeparator(sectionID:number, rowID:number, adjacentRowHighlighted:bool) {
        return (
            <View key={sectionID + '_' + rowID}
                  style={styles.separatorHorizontal}/>
        );
    }

    render() {
        return (
            <View style={{marginTop: 21}}>

                <ListView dataSource={this.state.dataSource}
                          renderSectionHeader={this._renderSectionHeader}
                          renderRow={this._renderMessage.bind(this)}
                          renderSeparator={this._renderSeparator}/>

            </View>
        );
    }
}

function mapStateToProps(state) {
    const { message } = state;
    return {
        message
    };
}

export default connect(mapStateToProps)(MyMessagesPage);
