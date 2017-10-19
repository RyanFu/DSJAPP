import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ListView,
    InteractionManager,
    Navigator,
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
import { connect } from 'react-redux';
import { Token, timeFormat } from '../../utils/common';
import LoginPage from '../../pages/login';
import {fetchMessageList,markAsRead} from '../../actions/message';
import CommentListPage from '../../pages/commentList';
import FollowerPage from '../../pages/my/follower';
import StorageKeys from '../../constants/StorageKeys';

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
        const {dispatch,route,navigator} = this.props;
        const the = this;
        Token.getToken(navigator).then((token) => {
            const params = {
                type: route.type,
                token: token
            };
            dispatch(fetchMessageList(params)).then(() => {
                the.setState({'dataSource': the.ds.cloneWithRows(the.props.message.messageList)});
                the.state.messageList = the.props.message.messageList;
                the.setState({messageList: the.state.messageList});
            });
        });

    }

    _makeAsRead(rowID,rowData){
        const {navigator,route,dispatch} = this.props;
        const the = this;

        if(route.type === 'comment'){
            InteractionManager.runAfterInteractions(() => {
                navigator.push({
                    component: CommentListPage,
                    name: 'CommentListPage',
                    noteId: 1
                });
            });
        }

        if(route.type === 'follow'){
            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail)=> {
                if (meDetail !== null) {
                    const user = JSON.parse(meDetail);
                    InteractionManager.runAfterInteractions(() => {
                        navigator.push({
                            component: FollowerPage,
                            name: 'FollowerPage',
                            userId: user.userId
                        });
                    });
                }
            });
        }

        Token.getToken(navigator).then((token) => {
            const params = {
                id: rowData.id,
                token: token,
                type: route.type
            };

            dispatch(markAsRead(params)).then((res) => {
                if(res){
                    the.setState({'dataSource': the.ds.cloneWithRows(the.props.message.messageList)});
                    the.setState({messageList: the.props.message.messageList});
                }
            });
        });


    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        return (
            <TouchableHighlight  underlayColor="transparent" activeOpacity={0.5} onPress={()=>{this._makeAsRead(rowID,rowData)}}>
                <View>
                    <View style={styles.messageListRow}>
                        <View style={styles.messageListContent}>
                            <View style={styles.messageListTimeC}>
                                <Text style={[styles.dimText,styles.messageListTime]}>{rowData.createdDateTime ? timeFormat(rowData.createdDateTime, 'yyyy年MM月dd日 hh:mm:ss') : '2016-08-05'} </Text>
                            </View>

                            <View style={styles.messageListDetail}>
                                {
                                    this.state.messageList[rowID]&& !this.state.messageList[rowID].isRead?<View style={[styles.unReadDot]}>
                                    </View>:null
                                }

                                <Text style={[styles.baseText,styles.messageListText,this.state.messageList[rowID]&&!this.state.messageList[rowID].isRead?{height: 26}:null]} >
                                    {rowData.message}
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    render() {
        return(
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
    const { message } = state;
    return {
        message
    };
}

export default connect(mapStateToProps)(MessageList);