'use strict';

import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ListView,
    InteractionManager,
    Platform,
    DeviceEventEmitter,
    AsyncStorage,
    CameraRoll
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import PrefetchImage from '../../components/prefetchImage';
import Flow from '../../components/flow';
import Share from '../../components/share';
import SaveImage from '../../components/saveImage';
import CommentPage from '../../pages/comment';
import CommentListPage from '../../pages/commentList';
import UserPage from '../../pages/user';
import ImageSlider from '../../components/imageSlider';
import {fetchDetail} from '../../actions/detail';
import {fetchCommentsList} from '../../actions/comments';
import {fetchRecommendList} from '../../actions/recommend';
import {connect} from 'react-redux';
import baiChuanApi from 'react-native-taobao-baichuan-api';
import {Token, follow, timeFormat, like, request, toast} from '../../utils/common';
import _ from 'lodash';
import imagesConstants from '../../constants/images';
// import * as Emoticons from 'react-native-emoticons';
import * as Emoticons from '../../components/emoticons';
import Icon from 'react-native-vector-icons/Ionicons';
import Webview from '../../components/webview';
import StorageKeys from '../../constants/StorageKeys';
import deprecatedComponents from 'react-native-deprecated-custom-components';

const Navigator = deprecatedComponents.Navigator;

const shareImg = require('../../assets/note/transfer.png');
const uri = ['https://hbimg.b0.upaiyun.com/fd0af542aae5ceb16f67c54c080a6537111d065b94beb-brWmWp_fw658',
    'https://hbimg.b0.upaiyun.com/b13d086f8c1a3040ae05637c6cb283d60c1286661f43b-OKqo08_fw658',
    'https://hbimg.b0.upaiyun.com/81329d6d0911921db04ee65f3df9d62aa6763b5f266fa-4kXDrj_fw658'
];
const {height, width} = Dimensions.get('window');

class Detail extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._onSharePress = this._onSharePress.bind(this);
        this._jumpToWebview = this._jumpToWebview.bind(this);
        this._onSavePress = this._onSavePress.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            commendTaobaoSource: this.ds.cloneWithRows([]),
            showShare: false,
            position: 0,
            noteUpdated: false,
            showSave: false,
            currentImage: null
        };
    }

    _renderRow(rowData: string, sectionID: number, rowID: number) {
        return (
            <TouchableOpacity onPress={() => this._jumpToRecommendPage(rowData.providerItemId.toString())}
                              underlayColor="transparent" activeOpacity={0.5}>
                <View>
                    <View style={styles.sysRow}>
                        <PrefetchImage
                            imageUri={rowData.image.url}
                            imageStyle={styles.sysThumb}
                            resizeMode="cover"
                            width={width / 3 - 5}
                            height={width / 3 - 5}
                        />
                        <View style={styles.recFlowPrice}>
                            <Text style={[styles.baseText, styles.recFlowText]}>￥{rowData.price}</Text>
                        </View>
                        <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                            <Text style={[styles.baseText, {paddingBottom: 0}]} lineBreakMode={'tail'}
                                  numberOfLines={1}>
                                {rowData.title}
                            </Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onSharePress() {
        const {navigator} = this.props;
        this.setState({showShare: !this.state.showShare});
    }

    _onSavePress() {
        const {navigator} = this.props;
        this.setState({showSave: !this.state.showSave});
    }

    _jumpToCommentPage() {
        const {navigator} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                navigator.push({
                    component: CommentPage,
                    name: 'CommentPage',
                    sceneConfigs: Navigator.SceneConfigs.FloatFromBottom,
                    noteId: this.props.route.note.noteId
                });
            }
        });
    }

    _jumpToCommentListPage() {
        const {navigator} = this.props;
        navigator.push({
            component: CommentListPage,
            name: 'CommentListPage',
            noteId: this.props.route.note.noteId
        });
    }

    componentDidMount() {
        const {dispatch, route, detail} = this.props;
        let the = this;
        if (!detail.note[route.note.noteId])
            dispatch(fetchDetail(route.note.noteId));
        dispatch(fetchCommentsList(route.note.noteId));
        dispatch(fetchRecommendList(route.note.noteId)).then(() => {
            let taobaoList = the.props.recommend.recommendList.taobao ? the.props.recommend.recommendList.taobao : [];
            the.setState({'commendTaobaoSource': the.ds.cloneWithRows(taobaoList)})
        });
    }


    _jumpToRecommendPage(data) {
        const {navigator} = this.props;
        // const type = data.userType === 1? 'tmall' : 'taobao';
        this._tracking(data);
        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump(data.itemId, '', 'tmall', (error, res) => {
                    if (error) {
                        console.error(error);
                    } else {
                        let orders;
                        if (res) { //交易成功
                            orders = res.orders;
                            data.orderId = orders[0];
                            this._insertOrder(data);
                        }
                    }
                })
            }
        });

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

    _tracking(data) {
        const {detail, route} = this.props;
        const noteId = route.note.noteId;
        data = {
            trackingName: "itemReferal",
            trackingValue: {
                noteUser: detail.note[noteId].authorId,
                itemId: data.itemId
            }
        };
        data = JSON.stringify(data);
        Token.getToken(navigator).then((token) => {
            if (token) {
                request('uTracking/Tracking', 'POST', data, token)
                    .then((res) => {
                        if (res.resultCode === 0) {
                            console.log('add tracking');
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

    _jumpToUserPage(userId) {
        const {navigator} = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY, (err, result) => {
                        if (result) {
                            result = JSON.parse(result);
                            if (result.userId !== userId) {

                                navigator.push({
                                    component: UserPage,
                                    name: 'UserPage',
                                    sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
                                    userId: userId
                                });
                            } else {
                                navigator.pop();
                                DeviceEventEmitter.emit('newNote', true);
                            }
                        } else {
                            navigator.push({
                                component: UserPage,
                                name: 'UserPage',
                                sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
                                userId: userId
                            });
                        }
                    });
                }
            }
        );
    }

    _follow(userId) {
        let {navigator, detail} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                follow(userId, token).then((res) => {
                    //let notes = _.filter(detail.note, {userId: userId});
                    _.each(detail.note, function (note) {
                        if (note.authorId == userId)
                            note.isFollowedBySessionUser = true;
                    });
                    this.setState({noteUpdated: true});

                    toast('关注成功');
                });
            }
        });
    }

    _like(noteId) {
        const {navigator, detail} = this.props;
        let the = this;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    like(noteId, token).then((res) => {
                        //let note = detail.note[noteId];
                        detail.note[noteId].isLikedBySessionUser = !detail.note[noteId].isLikedBySessionUser;
                        if (detail.note[noteId].isLikedBySessionUser)
                            detail.note[noteId].likeCount++;
                        else
                            detail.note[noteId].likeCount--;
                        this.setState({noteUpdated: true});
                    });
                }
            }
        );
    }

    _jumpToWebview(val) {
        const {navigator} = this.props;
        if (val.itemId) {
            this._jumpToRecommendPage(val);
            return;
        }
        navigator.push({
            component: Webview,
            name: 'Webview',
            sceneConfigs: Navigator.SceneConfigs.FloatFromBottom,
            url: val.url,
            title: val.url ? '商品详情' : null
        });
    }

    _setCurrentImage(image) {
        this.setState({
            currentImage: image,
            showSave: true
        });
    }

    render() {
        const {detail, route, comments, navigator} = this.props;
        const noteId = route.note.noteId;
        let images = [];
        let marks = [];
        if (!detail.note[noteId]) {
            return (
                <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                    <Toolbar
                        title="笔记详情"
                        navigator={this.props.navigator}
                        hideDrop={true}
                        rightImg={shareImg}
                        onRightIconClicked={this._onSharePress}
                    />
                    <View style={{alignItems: 'center', marginTop: 50}}>
                        <Text style={[styles.baseText, {fontSize: 16}]}>很忧伤，笔记消失了！</Text>
                    </View>
                </View>
            );
        }
        if (detail.note[noteId] && detail.note[noteId].images[0].image.url) {
            detail.note[noteId].images.map((val, key) => {
                let image = {
                    width: val.image.width,
                    height: val.image.height,
                    uri: val.image.url
                };
                images.push(image);

                _.each(val.marks, (v, k) => {
                    if (v.imageUrl && v.title)
                        marks.push(v);
                });
            }, this);
        } else {
            let image = {
                width: 376,
                height: 288,
                uri: 'https://asianeye.com/templates/admin_coco/images/default.png'
            };
            images.push(image);
        }

        if (marks.length === 0) {
            const mark = {
                title: '现货送豪礼 Meitu/美图 M6S 美图M6全网通4G拍照美颜手机分期免息 - 天猫Tmall.com',
                price: '2599',
                url: encodeURI('https://detail.m.tmall.com/item.htm?spm=0.0.0.0.v2fTq4&id=542771352237&abtest=23&rn=e7bc7b12e5cf73be030c02caf3d2cb06&sid=0d8dc4118ed52bea07203a6e52f33538&sku_properties=5919063:6536025'),
                imageUrl: 'https://img.alicdn.com/bao/uploaded/i1/TB1dhCaRpXXXXaAaXXXXXXXXXXX_!!0-item_pic.jpg_640x640q50.jpg',
                urlCategory: '',
                itemId: ''
            };
            // marks.push(mark);
        }

        //rating
        const rating = detail.note[noteId] && detail.note[noteId].rating && 0;
        let star = [];
        let i;
        for (i = 0; i < Math.floor(rating / 2); i++) {
            star.push(<Icon key={'full_star' + i} name={'md-star'} size={24} color={'#fc7d30'}/>);
        }
        if (Math.ceil(rating / 2) !== Math.floor(rating / 2)) {
            star.push(<Icon key={'half_star'} name={'md-star-half'} size={24} color={'#fc7d30'}/>);
        }
        for (i = 0; i < 5 - Math.ceil(rating / 2); i++) {
            star.push(<Icon key={'md-star-outline' + i} name={'md-star-outline'} size={24} color={'#bdbdbd'}/>);
        }
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="笔记详情"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    rightImg={shareImg}
                    onRightIconClicked={this._onSharePress}
                />
                <ScrollView style={styles.main}>

                    <View style={[styles.note, styles.block]}>
                        <View style={styles.user}>
                            <TouchableOpacity style={{flexDirection: 'row'}}
                                              onPress={() => this._jumpToUserPage(detail.note[noteId].authorId)}>
                                <Image style={styles.portrait}
                                       source={{
                                           uri: (detail.note[noteId] && detail.note[noteId].portrait ? detail.note[noteId].portrait : imagesConstants.DEFAULT_PORTRAIT),
                                           width: 34,
                                           height: 34
                                       }}/>
                                <View style={styles.info}>
                                    <Text
                                        style={styles.nick}>{detail.note[noteId] ? detail.note[noteId].nickname : ''}</Text>
                                    <Text
                                        style={styles.date}>{detail.note[noteId] ? timeFormat(detail.note[noteId].publishedTime, 'yyyy年MM月dd日 hh:mm:ss') : ''}</Text>
                                </View>
                            </TouchableOpacity>

                            {
                                !detail.note[noteId] || detail.note[noteId] && !detail.note[noteId].isFollowedBySessionUser ?
                                    <TouchableOpacity style={styles.follow}
                                                      onPress={() => this._follow(detail.note[noteId].authorId)}>
                                        <Image source={require('../../assets/note/follow.png')}/>
                                    </TouchableOpacity>
                                    :
                                    <View></View>
                            }

                        </View>
                        <View style={styles.thumbWarp}>

                            <ImageSlider
                                images={images}
                                position={this.state.position}
                                onPositionChanged={position => this.setState({position})}
                                onLongPress={this._setCurrentImage.bind(this)}
                            />

                        </View>

                        <View style={styles.description}>
                            <Text
                                style={[styles.dTitle, styles.baseText]}>{detail.note[noteId] ? Emoticons.parse(detail.note[noteId].title) : ''}</Text>
                            <Text
                                style={[styles.dContent, styles.baseText]}>{detail.note[noteId] ? Emoticons.parse(detail.note[noteId].content) : ''}</Text>
                        </View>
                        {
                            detail.note[noteId]
                            && detail.note[noteId].address
                            && detail.note[noteId].address.indexOf('定位') < 0
                            && detail.note[noteId].address.indexOf('正在尝试') < 0    ? <View style={styles.location}>
                                <Icon
                                    name={'ios-pin'}
                                    size={16}
                                    color={'#fc7d30'}
                                    style={{marginTop: 2, marginRight:2}}
                                />
                                <Text style={[styles.baseText,styles.locationText]}>
                                    {detail.note[noteId] ? detail.note[noteId].address : ''}
                                </Text>
                            </View> : null
                        }

                        <View style={styles.tags}>
                            {
                                detail.note[noteId] && detail.note[noteId].tags ? detail.note[noteId].tags.map((val, key) => {
                                    return (
                                        <TouchableOpacity key={key} style={styles.tag}><Text
                                            style={styles.tagText}>{val.name}</Text></TouchableOpacity>
                                    )
                                }, this) : null


                            }

                        </View>
                    </View>

                    {
                        //<View style={[styles.block, styles.GC]}>
                        //    <View style={styles.grade}>
                        //        <View style={styles.blockTitle}><Text style={styles.blockTitleText}>评分</Text></View>
                        //        <View style={styles.star}>
                        //            {star}
                        //        </View>
                        //
                        //    </View>
                        //</View>
                    }


                    <View style={[styles.block, styles.GC]}>

                        <View style={styles.comment}>
                            <View style={styles.blockTitle}>
                                <Text style={styles.blockTitleText}>评论({comments.commentsList.length})</Text>
                                <TouchableOpacity style={styles.rightArrow}
                                                  onPress={() => this._jumpToCommentListPage()}>
                                    <Image source={require('../../assets/note/rg_right.png')}/>
                                </TouchableOpacity>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={() => this._jumpToCommentListPage()}
                            >
                                <View>
                                    {
                                        comments.commentsList.map((val, key) => {
                                            if (key > 3)
                                                return;
                                            return (
                                                <View key={key} style={styles.commentList}>
                                                    <Text style={styles.NickName} lineBreakMode={"tail"}
                                                    >{val.authorNickname}：</Text>
                                                    <Text style={styles.commentContent} lineBreakMode={'tail'}
                                                          numberOfLines={1}>{Emoticons.parse(val.comment)}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                    </View>

                    {
                        marks.length > 0 ? (

                            <View style={[styles.block, styles.recommendByUser]}>
                                <View style={styles.blockTitle}>
                                    <Text style={styles.blockTitleText}>作者推荐商品</Text>
                                </View>
                                {
                                    marks.map((val, key) => {
                                        return (
                                            <TouchableOpacity
                                                key={'recommend' + key}
                                                onPress={() => {
                                                    this._jumpToWebview(val)
                                                }}
                                                style={styles.recFrame}>
                                                <PrefetchImage
                                                    imageUri={val.imageUrl ? val.imageUrl : imagesConstants.DEFAULT_IMAGE}
                                                    imageStyle={styles.recThumb}
                                                    resizeMode="cover"
                                                    width={width / 4}
                                                    height={width / 4}
                                                />
                                                <View style={styles.recContent}>
                                                    <Text style={styles.baseText} lineBreakMode={'tail'}
                                                          numberOfLines={2}>
                                                        {val.title}
                                                    </Text>
                                                    <View style={styles.recPriceFrame}>
                                                        <Text
                                                            style={[styles.baseText, styles.recPrice]}>{val.price ? '价格：￥' + val.price : ''}</Text>
                                                    </View>
                                                    <View style={styles.recRedFrame}>
                                                        <Image style={styles.redIcon}
                                                               source={require('../../assets/footer/red_.png')}/>
                                                        <Text
                                                            style={[styles.baseText, styles.recRedText]}>{val.estimatedEffective ? '￥' + val.estimatedEffective : '￥0'}</Text>
                                                    </View>

                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }

                            </View>


                        ) : null
                    }


                    {
                        this.props.recommend.recommendList.taobao && this.props.recommend.recommendList.taobao.length > 0 ?
                            <View style={[styles.block, styles.recommendBySystem]}>
                                <View style={styles.blockTitle}>
                                    <Text style={styles.blockTitleText}>系统为你推荐</Text>
                                </View>
                                <View style={styles.sysFromFrame}>
                                    <View style={styles.sysFrom}>
                                        <Text style={[styles.baseText, styles.sysFromText]}>来自淘宝</Text>
                                        {
                                            //<TouchableOpacity style={styles.sysFromMore}>
                                            //    <Text style={[styles.baseText, styles.dimText]}>更多</Text>
                                            //    <Image source={require('../../assets/note/rg_right.png')}/>
                                            //</TouchableOpacity>
                                        }
                                    </View>
                                    <ListView
                                        contentContainerStyle={styles.sysList}
                                        dataSource={this.state.commendTaobaoSource}
                                        renderRow={this._renderRow}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        enableEmptySections={true}
                                    />
                                </View>

                            </View> : null
                    }

                    {
                        //<View style={[styles.block, styles.relatedNote]}>
                        //    <View style={[styles.blockTitle,styles.relatedNoteTitle]}>
                        //        <Text style={styles.blockTitleText}>相关笔记</Text>
                        //    </View>
                        //    <Flow navigator={this.props.navigator}></Flow>
                        //</View>
                    }

                </ScrollView>
                <View style={styles.float}>
                    <TouchableOpacity style={styles.floatOp} onPress={() => this._like(noteId)}>
                        <View style={styles.floatOpView}>
                            {
                                detail.note[noteId] && detail.note[noteId].isLikedBySessionUser ? (
                                    <Icon
                                        name={'ios-heart'}
                                        size={18}
                                        color={'#fc7d30'}
                                        style={{justifyContent: 'flex-start'}}
                                    />
                                ) : (
                                    <Image style={styles.floatOpImage}
                                           source={require('../../assets/note/heart.png')}/>
                                )
                            }
                            <Text
                                style={styles.floatOpText}>{detail.note[noteId] ? detail.note[noteId].likeCount : 0}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.floatOpLine}></View>
                    <TouchableOpacity style={styles.floatOp} onPress={() => this._jumpToCommentPage()}>
                        <View style={styles.floatOpView}>
                            <Image style={styles.floatOpImage}
                                   source={require('../../assets/personal/comment.png')}/>
                            <Text
                                style={styles.floatOpText}>{detail.note[noteId] ? detail.note[noteId].commentCount : 0}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.floatOpLine}></View>

                </View>
                {[this.state.showShare].map((show) => {
                    if (show) {
                        return (
                            <Share key='' note={detail.note[noteId]} noteId={noteId} press={this._onSharePress}
                                   thumbUrl={images[0].uri}/>
                        );
                    }
                })}
                {[this.state.showSave].map((show) => {
                    if (show) {
                        return (
                            <SaveImage key='' image={this.state.currentImage} press={this._onSavePress}/>
                        );
                    }
                })}
            </View>
        )

    }
}

function mapStateToProps(state) {
    const {detail, comments, recommend} = state;
    return {
        detail,
        comments,
        recommend
    };
}

export default connect(mapStateToProps)(Detail);