'use strict';
import React, {Component} from 'react';
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
    NavigatorIOS,
    RecyclerViewBackedScrollView,
    DeviceEventEmitter,
    Modal,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

import Button from '../../../app/components/button/Button';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import styles from './styles';
import StorageKeys from '../../constants/StorageKeys';
import {
    getToken,
    toast,
    timeFormat,
    Token,
    request
} from '../../utils/common';
import portraitPage from '../settings/portrait';
import {fetchUserNotes} from '../../actions/user';
import images from '../../constants/images';
import Spinner from 'react-native-spinkit';
import FollowingPage from './following';
import FollowerPage from './follower';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import DetailPage from '../../pages/detail';
import OrdersPage from '../../pages/order';
import WithdrawPage from '../../pages/order/withdraw';
import * as Emoticons from '../../components/emoticons';

const Navigator = deprecatedComponents.Navigator;

var womanIcon = <Icon style={{marginLeft: 3, alignItems: 'center', color: '#FF0087'}} size={16} name="venus"/>;
var manIcon = <Icon style={{marginLeft: 3, alignItems: 'center', color: '#FF0087'}} size={16} name="mars"/>;
var rmbIcon = <Icon style={[styles.text, {marginLeft: 3}]} size={12} name="rmb"/>;
var zanIcon = <Icon style={styles.noteAssetIcon} size={14} name="heart-o"/>;
var commentIcon = <Icon style={styles.noteAssetIcon} size={14} name="comment-o"/>;
var shoppingCartIcon = <Icon style={styles.noteAssetIcon} size={14} name="shopping-cart"/>;
var ellipsisIcon = <Icon style={styles.noteAssetIcon} size={14} name="ellipsis-h"/>;

var THUMB_URLS = [
    require('../../assets/test/test.png'),
    require('../../assets/test/test1.png')
];
var {height, width} = Dimensions.get('window');


const womanImg = require('../../assets/personal/female.png');
const manImg = require('../../assets/personal/male.png');
const zanImg = require('../../assets/personal/heart.png');
const commentImg = require('../../assets/personal/comment.png');
const shoppingCartImg = require('../../assets/personal/shopping_cart.png');

export default class MyContent extends Component {
    constructor(props) {
        super(props);

        this._updatePortrait = this._updatePortrait.bind(this);
        this._jumpToDetailPage = this._jumpToDetailPage.bind(this);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 != s2
        });

        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            loading: true,
            modalVisible: false,
            selectedNote: null
        };
    }

    componentWillMount() {
        if (this.props.userInfo) {
            this.setState({dataSource: this.ds.cloneWithRows([])});
            this.setState({loading: true});
        }
        // load old data to display
        if (!this.props.userInfo)
            this._loadInitialState();
    }

    componentDidMount() {
        setTimeout(() => {
            const {dispatch} = this.props;
            Token.getToken(navigator).then((token) => {
                let params = {
                    token: token
                };
                if (this.props.userId) {
                    params.userId = this.props.userId;
                }
                dispatch(fetchUserNotes(params)).then(() => {
                    if (this.props.userInfo)
                        this.setState({dataSource: this.ds.cloneWithRows(this.props.user.userNotes)});
                    else
                        this.setState({dataSource: this.ds.cloneWithRows(this.props.user.myNotes)});
                    this.setState({loading: false});
                })
            });
        }, 300);

    }

    componentWillReceiveProps() {
        this._loadRefreshData();
    }

    _loadRefreshData() {
        try {

            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail) => {
                if (meDetail !== null) {
                    this.setState({user: JSON.parse(meDetail)});
                }
            });

            if (this.props.userInfo)
                this.setState({dataSource: this.ds.cloneWithRows(this.props.user.userNotes)});
            else
                this.setState({dataSource: this.ds.cloneWithRows(this.props.user.myNotes)});
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    _loadInitialState() {
        try {

            AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail) => {
                if (meDetail !== null) {
                    this.setState({user: JSON.parse(meDetail)});
                }
            });


            //if(this.props.userInfo)
            //    this.setState({dataSource: this.ds.cloneWithRows(this.props.user.userNotes)});
            //else
            //    this.setState({dataSource: this.ds.cloneWithRows(this.props.user.myNotes)});

            //let myNotes = await AsyncStorage.getItem(StorageKeys.MY_NOTES_STORAGE_KEY);
            //if (myNotes !== null){
            //    this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(JSON.parse(myNotes))});
            //}
            //this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(this.props.user.userNotes)});
        } catch (error) {
            console.log('AsyncStorage error: ' + error.message);
        }
    }

    async updateFromServer() {
        //await this._getAboutMe();
        await this._getMyNotes();
    }


    async _updateNoteSource(source) {
        await AsyncStorage.setItem(StorageKeys.MY_NOTES_STORAGE_KEY, JSON.stringify(source));
        this.state.notes = source.s1;
        this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(source)});
    }

    async _getMyNotes() {
        // fetch('https://duoshouji.com/endpoint/aboutme', {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         token: this.state.token
        //     })
        // }).then((response) => response.json())
        // .then((responseJson) => {
        //     this._updateUserSource(responseJson);
        // })
        // .catch((error) => {
        //     console.error(error);
        // });

        this._updateNoteSource({
            s1: {
                'noteId1': {
                    user: {
                        name: '天才小熊猫',
                        thumbUri: 'https://facebook.github.io/react/img/logo_small_2x.png'
                    },
                    detail: {
                        title: '最新入手的羊毛线',
                        createTime: '05-28 08:29'
                    },
                    summary: {
                        zanNum: 28,
                        commentNum: 8,
                        income: 32
                    }
                }, 'noteId2': {
                    user: {
                        name: '天才小子',
                        thumbUri: 'https://facebook.github.io/react/img/logo_small_2x.png'
                    },
                    detail: {
                        title: '滚出',
                        createTime: '05-28 08:29'
                    },
                    summary: {
                        zanNum: 8,
                        commentNum: 8,
                        income: 3
                    }
                }
            }
        });
    }


    _renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.myNotesTitle}>
                <Text style={{fontSize: 16}}>笔记</Text>
            </View>
        );
    }

    _updatePortrait(info) {
        const {navigator} = this.props;
        if (navigator && !this.props.userInfo) {
            navigator.push({
                name: 'portraitPage',
                component: portraitPage,
                sceneConfigs: Navigator.SceneConfigs.FadeAndroid,
                info: info
            })
        }
    }

    _renderNote(rowData, sectionID, rowID, highlightRow) {
        const data = {
            user: {
                name: this.props.userInfo ? this.props.user.userInfo.nickname : this.state.user.name,
                thumbUri: rowData.portrait
            },
            detail: {
                title: rowData.title,
                createTime: timeFormat(rowData.publishedTime, 'yyyy年MM月dd日 hh:mm:ss'),
                image: (rowData.image ? rowData.image : images.DEFAULT_PORTRAIT),
                noteId: rowData.noteId,
                imageHeight: rowData.imageHeight,
                imageWidth: rowData.imageWidth
            },
            summary: {
                zanNum: rowData.likeCount,
                commentNum: rowData.commentCount,
                income: rowData.transactionCount
            }
        };
        return (
            <TouchableWithoutFeedback >
                <View style={styles.myNote}>
                    {
                        !this.props.userInfo ? <TouchableWithoutFeedback onPress={() => {
                            this._setModalVisible(true, data.detail.noteId)
                        }}>
                            <View style={styles.delete}>
                                <Icon color={'#ccc'} size={14} name="close"/>
                            </View>
                        </TouchableWithoutFeedback> : null
                    }


                    <View style={styles.noteUserBox}>
                        <View style={[styles.portrait, {borderRadius: 31}]}>
                            <Image source={{uri: data.user.thumbUri, width: 31, height: 31}}
                                   style={{borderRadius: 15.5}}/>
                        </View>
                        <View style={styles.noteUserMsgBox}>
                            <Text style={styles.noteUserTitle}>{data.user.name}</Text>
                            <Text style={styles.noteCreateTime}>{data.detail.createTime}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => this._jumpToDetailPage({noteId: data.detail.noteId})}
                        onLongPress={() => {
                            this._setModalVisible(true, data.detail.noteId)
                        }}
                    >
                        <View style={styles.noteThumbBox}>
                            <Image style={styles.noteThumb} source={{
                                uri: data.detail.image,
                                width: width / 5 * 3,
                                height: data.detail.imageHeight / data.detail.imageWidth * (width / 5 * 3)
                            }}
                                   resizeMode={Image.resizeMode.contain}/>
                        </View>
                    </TouchableOpacity>


                    <Text style={styles.noteTitle}>{Emoticons.parse(data.detail.title)}</Text>
                    <View style={styles.noteAssets}>
                        <View style={styles.noteAsset}>
                            <Image source={zanImg}/>
                            <Text style={[styles.text, {marginLeft: 5}]}>{data.summary.zanNum}</Text>
                        </View>
                        <View style={styles.separatorVertical}></View>
                        <View style={styles.noteAsset}>
                            <Image source={commentImg}/>
                            <Text style={[styles.text, {marginLeft: 5}]}>{data.summary.commentNum}</Text>
                        </View>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={sectionID + '_' + rowID}
                  style={styles.separatorHorizontal}/>
        );
    }

    _setModalVisible(visible, noteId) {
        if (!this.props.userInfo) {
            this.setState({modalVisible: visible});
            if (noteId) {
                this.setState({selectedNote: noteId});
            }
        }
    }

    _deleteNote(noteId) {
        const the = this;
        const {navigator, dispatch} = this.props;
        noteId = noteId ? noteId : this.state.selectedNote;
        if (noteId)
            Token.getToken(navigator).then((token) => {
                    if (token) {
                        request('/notes/' + noteId + '/delete', 'post', ' ', token)
                            .then((res) => {
                                if (res.resultCode === 0) {
                                    the.setState({modalVisible: false});
                                    dispatch(fetchUserNotes({token: token})).then(() => {
                                        the.setState({dataSource: the.ds.cloneWithRows(this.props.user.myNotes)});
                                        toast('删除笔记成功');
                                    });
                                } else {
                                    toast('删除笔记');
                                }
                            }, function (error) {
                                console.log(error);
                            })
                            .catch(() => {
                                console.log('network error');
                            });
                    }
                }
            );
    }

    _jumpToFollowingPage(userId) {
        const {navigator} = this.props;
        navigator.push({
            component: FollowingPage,
            name: 'FollowingPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
            userId: userId
        });
    }

    _jumpToFollowerPage(userId) {
        const {navigator} = this.props;
        navigator.push({
            component: FollowerPage,
            name: 'FollowerPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
            userId: userId
        });
    }

    _jumpToDetailPage(note) {
        const {navigator} = this.props;
        navigator.push({
            component: DetailPage,
            name: 'DetailPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
            note
        });
    }

    _jumpOrdersPage() {
        const {navigator} = this.props;
        navigator.push({
            component: OrdersPage,
            name: 'OrdersPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight
        });
    }

    _jumpWithdrawPage() {
        const {navigator} = this.props;
        navigator.push({
            component: WithdrawPage,
            name: 'WithdrawPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight
        });
    }

    _withdraw() {
        if(this.state.user.availableRebate && this.state.user.availableRebate > 0.1){
            this._jumpWithdrawPage();
        } else if(this.state.user.availableRebate > 0) {
            toast('亲，提现金额最低不得少于0.1元');
        } else {
            toast('亲，暂时没有可提金额哦');

        }
    }

    render() {

        this.user = this.state.user;

        if (this.props.userInfo) {
            let userInfo = this.props.userInfo;
            this.user = {
                userId: userInfo.userId,
                name: userInfo.nickname,
                gender: userInfo.gender == 'FEMALE' ? 'women' : 'man',
                income: userInfo.totalRevenue,
                thumbUri: userInfo.portraitUrl,
                summary: {
                    noteNum: userInfo.publishedNoteCount,
                    transNum: userInfo.transactionCount,
                    watcherNum: userInfo.watchCount,
                    fansNum: userInfo.fanCount
                }
            }
        } else if (this.state.user == null) {
            return null;
        }

        return (
            <View style={styles.container}>

                <View style={styles.userContainer}>
                    {
                        !this.props.userInfo ?
                            (<View style={styles.my}>
                                    <View style={styles.user}>
                                        <TouchableHighlight onPress={() => this._updatePortrait(this.user)} style={styles.portrait}>
                                            <Image style={[styles.portraitImg,{borderRadius: 25}]} source={{uri: this.user.thumbUri, width: 50, height: 50}}/>
                                        </TouchableHighlight>
                                        <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                                            <Text style={styles.myNameText} lineBreakMode={'tail'} numberOfLines={1}>{this.user.name}</Text>
                                            {
                                                this.user.gender == 'women' ? (
                                                    <Image style={styles.gender} key={1} source={womanImg}/>
                                                ) : (
                                                    <Image style={styles.gender} key={2} source={manImg}/>
                                                )
                                            }
                                        </View>

                                    </View>
                                    <View style={styles.income}>
                                        <View style={styles.incomeLine}>
                                            <Text style={{fontSize: 14,color: '#9b9b9b'}}>总收益:￥</Text>
                                            <Text style={{fontSize: 14, color: '#026734'}}>{this.user.income}</Text>
                                        </View>

                                        <View style={styles.incomeLine}>
                                            <Text style={{fontSize: 12,color: '#9b9b9b'}}>预估:￥</Text>
                                            <Text style={{marginLeft: 3, fontSize: 12, color: '#00d05d'}}>{this.user.estimatedRebate? this.user.estimatedRebate : 0}</Text>

                                            <Text style={{fontSize: 12,color: '#9b9b9b',marginLeft:10}}>可提:￥</Text>
                                            <Text style={{marginLeft: 3, fontSize: 12, color: '#ff0000'}}>{this.user.availableRebate? this.user.availableRebate : 0}</Text>
                                            <TouchableOpacity style={[styles.button,{marginLeft: 10}]} onPress={this._withdraw.bind(this)}>
                                                <Text style={styles.buttonFont}>提现</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                            </View>
                                ) :
                            <View style={styles.user}>
                                <TouchableHighlight onPress={() => this._updatePortrait(this.user)} style={styles.portrait}>
                                    <Image style={styles.portraitImg} source={{uri: this.user.thumbUri, width: 45, height: 45}} />
                                </TouchableHighlight>
                                <View style={{flexDirection:'row',alignItems:'flex-end'}}>
                                    <Text style={styles.myNameText} lineBreakMode={'tail'} numberOfLines={1}>{this.user.name}</Text>
                                    {
                                        this.user.gender == 'women' ? (
                                            <Image style={styles.gender} key={1} source={womanImg}/>
                                        ) : (
                                            <Image style={styles.gender} key={2} source={manImg}/>
                                        )
                                    }
                                </View>

                            </View>
                    }

                </View>

                <View style={styles.summaryContainer}>
                    <View style={styles.asset}>
                        <Text style={styles.count}>{this.user.summary.noteNum}</Text>
                        <Text style={[styles.text, styles.assetText]}>笔记</Text>
                    </View>
                    <View style={styles.separatorVertical}/>
                    {
                        !this.props.userInfo ?
                            <TouchableWithoutFeedback onPress={() => this._jumpOrdersPage()}>
                                <View style={styles.asset}>
                                    <Text style={styles.count}>{this.user.summary.transNum}</Text>
                                    <Text style={[styles.text, styles.assetText]}>交易</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        : null
                    }
                    {
                        !this.props.userInfo ?
                            <View style={styles.separatorVertical}/>
                        : null
                    }

                    <TouchableWithoutFeedback onPress={() => this._jumpToFollowingPage(this.user.userId)}>
                        <View style={styles.asset}>
                            <Text style={styles.count}>{this.user.summary.watcherNum}</Text>
                            <Text style={[styles.text, styles.assetText]}>关注</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.separatorVertical}/>
                    <TouchableWithoutFeedback onPress={() => this._jumpToFollowerPage(this.user.userId)}>
                        <View style={styles.asset}>
                            <Text style={styles.count}>{this.user.summary.fansNum}</Text>
                            <Text style={[styles.text, styles.assetText]}>粉丝</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>

                {
                    !this.state.loading ? (
                        <ListView dataSource={this.state.dataSource}
                                  contentContainerStyle={styles.list}
                                  renderSectionHeader={this._renderSectionHeader}
                                  renderRow={this._renderNote.bind(this)}
                            //renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                                  renderSeparator={this._renderSeparator}
                                  style={styles.myNoteContainer}
                                  enableEmptySections={true}
                        />
                    ) : (
                        <View style={styles.loading}>
                            <Spinner isVisible size={45} type="FadingCircleAlt" color={'#fc7d30'}/>
                        </View>
                    )
                }


                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        console.log("Modal has been closed.")
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => {
                        this._setModalVisible(false)
                    }}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modal}>
                                <TouchableOpacity style={styles.op} onPress={() => {
                                    this._deleteNote()
                                }}>
                                    <View>
                                        <Text style={[styles.text, styles.redText]}>删除</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.line}></View>
                                <TouchableOpacity style={styles.op} onPress={() => {
                                    this._setModalVisible(false)
                                }}>
                                    <View>
                                        <Text style={styles.text}>取消</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>


                </Modal>
            </View>
        );
    }
}