import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    InteractionManager,
    DeviceEventEmitter,
    Platform,
    TouchableWithoutFeedback,
    TouchableHighlight,
    AsyncStorage
} from 'react-native';
import styles from './styles';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import MessageDetailPage from './MessageDetailPage';
import {connect} from 'react-redux';
import {Token, timeFormat} from '../../utils/common';
import LoginPage from '../../pages/login';
import {fetchMessageList, markAsRead} from '../../actions/message';
import CommentListPage from '../../pages/commentList';
import FollowerPage from '../../pages/my/follower';
import OrderPage from '../../pages/order';
import StorageKeys from '../../constants/StorageKeys';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import Emoticons, * as emoticons from '../../components/emoticons';
import _ from 'lodash';

const Navigator = deprecatedComponents.Navigator;

class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._makeAsRead = this._makeAsRead.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.message.messageList),
            messageList: this.props.message.messageList
        };
    }

    componentDidMount() {
        const {dispatch, route, navigator} = this.props;
        const the = this;
        Token.getToken(navigator).then((token) => {
            const params = {
                type: route.type,
                token: token
            };
            dispatch(fetchMessageList(params)).then(() => {
                _.reverse(the.props.message.messageList);
                the.setState({'dataSource': the.ds.cloneWithRows(the.props.message.messageList)});
                the.state.messageList = the.props.message.messageList;
                the.setState({messageList: the.state.messageList});
            });
        });

    }

    _makeAsRead(rowID, rowData) {
        const {navigator, route, dispatch} = this.props;
        const the = this;

        if (route.type === 'comment') {
            navigator.push({
                component: CommentListPage,
                name: 'CommentListPage',
                noteId: rowData.noteId
            });
        }

        if (route.type === 'follow') {
            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail) => {
                if (meDetail !== null) {
                    const user = JSON.parse(meDetail);
                    navigator.push({
                        component: FollowerPage,
                        name: 'FollowerPage',
                        userId: user.userId
                    });
                }
            });
        }

        if (route.type === 'account') {
            navigator.push({
                component: OrderPage,
                name: 'OrderPage',
                to: 2
            });
        }

        if (!rowData.isRead)
            Token.getToken(navigator).then((token) => {
                const params = {
                    id: rowData.id,
                    token: token,
                    type: route.type
                };

                dispatch(markAsRead(params)).then((res) => {
                    if (res) {
                        the.setState({'dataSource': the.ds.cloneWithRows(the.props.message.messageList)});
                        the.setState({messageList: the.props.message.messageList});
                    }
                });
            });


    }

    _renderCommentRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableHighlight underlayColor="transparent" activeOpacity={0.5} onPress={() => {
                this._makeAsRead(rowID, rowData)
            }}>
                <View>
                    <View style={styles.messageListRow}>
                        <View style={styles.messageListContent}>
                            <View style={styles.messageListTimeC}>
                                <Text
                                    style={[styles.dimText, styles.messageListTime]}>{rowData.createdDateTime ? timeFormat(rowData.createdDateTime, 'yyyy年MM月dd日 hh:mm:ss') : '2016-08-05'} </Text>
                            </View>

                            <View style={styles.messageListDetail}>
                                {
                                    this.state.messageList[rowID] && !this.state.messageList[rowID].isRead ?
                                        <View style={[styles.unReadDot]}>
                                        </View> : null
                                }
                                <Text
                                    style={[styles.baseText, styles.messageListText, this.state.messageList[rowID] && !this.state.messageList[rowID].isRead ? {} : null]}>
                                    您有一条来自{rowData.commentAuthorNickname}关于《{emoticons.parse(rowData.noteTitle)}》的评论：
                                </Text>
                            </View>
                            <View style={[styles.messageListDetail, styles.messageListDetailPreView]}>
                                <Text style={styles.dimText} numberOfLines={1}
                                      lineBreakMode={"tail"}>{emoticons.parse(rowData.commentContent)}</Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _renderFollowRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableHighlight underlayColor="transparent" activeOpacity={0.5} onPress={() => {
                this._makeAsRead(rowID, rowData)
            }}>
                <View>
                    <View style={styles.messageListRow}>
                        <View style={styles.messageListContent}>
                            <View style={styles.messageListTimeC}>
                                <Text
                                    style={[styles.dimText, styles.messageListTime]}>{rowData.createdDateTime ? timeFormat(rowData.createdDateTime, 'yyyy年MM月dd日 hh:mm:ss') : '2016-08-05'} </Text>
                            </View>

                            <View style={styles.messageListDetail}>
                                {
                                    this.state.messageList[rowID] && !this.state.messageList[rowID].isRead ?
                                        <View style={[styles.unReadDot]}>
                                        </View> : null
                                }

                                <Text
                                    style={[styles.baseText, styles.messageListText, this.state.messageList[rowID] && !this.state.messageList[rowID].isRead ? {height: 26} : null]}>
                                    {rowData.message}
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _renderRebateRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableHighlight underlayColor="transparent" activeOpacity={0.5} onPress={() => {
                this._makeAsRead(rowID, rowData)
            }}>
                <View>
                    <View style={styles.messageListRow}>
                        <View style={styles.messageListContent}>
                            <View style={styles.messageListTimeC}>
                                <Text
                                    style={[styles.dimText, styles.messageListTime]}>{rowData.createdDateTime ? timeFormat(rowData.createdDateTime, 'yyyy年MM月dd日 hh:mm:ss') : '2016-08-05'} </Text>
                            </View>

                            <View style={styles.messageListDetail}>
                                {
                                    this.state.messageList[rowID] && !this.state.messageList[rowID].isRead ?
                                        <View style={[styles.unReadDot]}>
                                        </View> : null
                                }

                                <Text style={[styles.baseText, styles.messageListText]}>
                                    {rowData.message}
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    _renderRow(rowData: string, sectionID: number, rowID: number) {
        if (this.props.route.type === 'comment') {
            return this._renderCommentRow(rowData
        :
            string, sectionID
        :
            number, rowID
        :
            number
        )
            ;
        }
        if (this.props.route.type === 'follow') {
            return this._renderFollowRow(rowData
        :
            string, sectionID
        :
            number, rowID
        :
            number
        )
            ;
        }
        if (this.props.route.type === 'account') {
            return this._renderRebateRow(rowData
        :
            string, sectionID
        :
            number, rowID
        :
            number
        )
            ;
        }
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="消息"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <ListView
                    contentContainerStyle={styles.messageList}
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
    const {message} = state;
    return {
        message
    };
}

export default connect(mapStateToProps)(MessageList);