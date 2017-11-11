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
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ListView,
    InteractionManager,
    AsyncStorage,
    Dimensions,
    Animated
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import { request,toast } from '../../utils/common';
import { Token } from '../../utils/common';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import StorageKeys from '../../constants/StorageKeys';
import configs from '../../constants/configs';
import ResultPage from '../search/result';
import PrefetchImage from '../../components/prefetchImage';
import { fetchRecentView,fetchRecentBuy } from '../../actions/recent';
const {height, width} = Dimensions.get('window');
const addImg = require('../../assets/header/add.png');
const searchImg = require('../../assets/header/search.png');
import AddFriends from '../addFriends';
import SearchPage from '../search';
import baiChuanApi from 'react-native-taobao-baichuan-api';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

class RedPacket extends React.Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this._jumpToResultPage = this._jumpToResultPage.bind(this);
        this._renderItemAutoRow = this._renderItemAutoRow.bind(this);
        this._recentList = this._recentList.bind(this);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this._onRightIconClicked.bind(this);
        this.state = {
            keyWord: '',
            searchItemHistory: [],
            searchNoteHistory: [],
            itemAuto: false,
            itemAutoForList: this.ds.cloneWithRows([]),
            buySource: this.ds.cloneWithRows([]),
            viewSource: this.ds.cloneWithRows([]),
            bounce: new Animated.Value(0)
        };
    }

    _search(text) {
        let the = this;
        text = text || this.state.keyWord;
        this.setState({keyWord: text});
        if (!text)
            return;
        AsyncStorage.getItem(StorageKeys.SEARCH_ITEM, (error, result) => {
            if (error) {
                console.error("Error happened when to get token: " + error);
            }

            the._updateHistory(result, text);
            the._jumpToResultPage(text);
        });

    }

    _updateHistory(searchItemHistory, text) {
        searchItemHistory = searchItemHistory && searchItemHistory !== '' ? searchItemHistory : '[]';

        searchItemHistory = JSON.parse(searchItemHistory);
        _.remove(searchItemHistory, function (n) {
            return n === text;
        });
        searchItemHistory.push(text);

        let tempValue = _.clone(searchItemHistory);
        _.reverse(tempValue);
        this.setState({searchItemHistory: tempValue});
        this.setState({searchNoteHistory: tempValue});
        searchItemHistory = JSON.stringify(searchItemHistory);
        AsyncStorage.setItem(StorageKeys.SEARCH_ITEM, searchItemHistory);
        AsyncStorage.setItem(StorageKeys.SEARCH_NOTE, searchItemHistory);
    }

    _jumpToResultPage(text) {

        const { navigator } = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: ResultPage,
                name: 'ResultPage',
                text: text
            });
        });
    }

    componentWillReceiveProps() {
        const copy = _.cloneDeep(this.props.recent.recentView);
        const view = _.reverse(copy);
        this.setState({viewSource: this.ds.cloneWithRows(view)});
    }

    componentDidMount() {
        const the = this;
        const { dispatch } = this.props;

        AsyncStorage.getItem(StorageKeys.SEARCH_ITEM, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchItemHistory: result});
        });
        AsyncStorage.getItem(StorageKeys.SEARCH_NOTE, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchNoteHistory: result});
        });

        dispatch(fetchRecentView()).then(()=> {
            const copy = _.cloneDeep(this.props.recent.recentView);
            the.setState({viewSource: this.ds.cloneWithRows(_.reverse(copy))});
        });
        DeviceEventEmitter.addListener('newView', ()=> {
            dispatch(fetchRecentView()).then(()=> {
                const copy = _.cloneDeep(this.props.recent.recentView);
                the.setState({viewSource: this.ds.cloneWithRows(_.reverse(copy))});
            });
        });

        Token.getToken().then((token) => {
            if(!token){
                return;
            }
            const params = {
                token: token
            };
            dispatch(fetchRecentBuy(params)).then(()=> {
                const copy = _.cloneDeep(this.props.recent.recentBuy);
                the.setState({buySource: this.ds.cloneWithRows(_.reverse(copy))});
            });
        });


        var tick = 0;
        setInterval((v)=> {
            Animated.spring(
                this.state.bounce,
                {
                    toValue: -22 * (tick % 2),
                    friction: 5,
                }
            ).start();
            tick++;
        }, 2000);
    }

    _deleteSearchHistory() {
        AsyncStorage.removeItem(StorageKeys.SEARCH_ITEM);
        AsyncStorage.removeItem(StorageKeys.SEARCH_NOTE);

        this.setState({searchItemHistory: []});
        this.setState({searchNoteHistory: []});
    }

    _deleteViewHistory() {
        AsyncStorage.removeItem('recent_view');

        this.setState({viewSource: this.ds.cloneWithRows([])});
    }

    _historyFrame() {
        var rows = [];
        _.each(this.state.searchItemHistory, (v, k) => {
            if (typeof v === 'string')
                rows.push(
                    <TouchableOpacity style={styles.historyItem} key={k} onPress={() => this._search(v)}>
                        <View >
                            <Text style={[styles.historyItemFont,styles.baseText]}>{v}</Text>
                        </View>
                    </TouchableOpacity>
                );
        });
        if (!this.state.itemAuto)
            return (
                <View style={styles.historyC}>
                    <View style={styles.blockTitle}>
                        <View style={styles.delete}>
                            <TouchableOpacity onPress={() => this._deleteSearchHistory()}>
                                <Icon
                                    name='ios-trash'
                                    size={26}
                                    color={'#aaa'}
                                    />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.historyTitle,styles.baseText]}>搜索历史：</Text>
                    </View>
                    <View style={[{marginTop: 10,flexDirection: 'row',flexWrap: 'wrap',alignSelf: 'flex-start'}]}>
                        {
                            rows
                        }
                    </View>
                </View>

            );
        else
            return (
                <View style={styles.auto}>
                    <ListView
                        contentContainerStyle={styles.itemAutoList}
                        dataSource={this.state.itemAutoForList}
                        renderRow={this._renderItemAutoRow}
                        horizontal={false}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                        />
                </View>
            )
    }

    _renderItemAutoRow(rowData:string, sectionID:number, rowID:number) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}
                              onPress={() => this._search(rowData[0])}>
                <View style={styles.itemAutoRow}>
                    <Text style={styles.baseText}>{rowData[0]}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _autoComplete(text) {
        this.setState({keyWord: text});
        let url = {
            host: configs.taobaoAutoCompleteUrl,
            route: 'sug?code=utf-8&q=' + text,
            headers: {}
        };
        if (!text) {
            this.setState({itemAuto: false});
            return;
        }
        this.setState({itemAuto: true});
        return request(url, 'GET')
            .then((list) => {
                if (list.result.length > 0) {
                    this.setState({itemAutoForList: this.ds.cloneWithRows(list.result)});
                } else {
                    this.setState({itemAuto: false});
                }

            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _recentList(type) {
        let dataSource = this.state.buySource;
        if (type === 'view'){
            dataSource = this.state.viewSource;

        }
        return (
            <ListView
                contentContainerStyle={styles.itemList}
                dataSource={dataSource}
                renderRow={this._renderItemRow.bind(this)}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                enableEmptySections={true}
                />
        )

    }

    _renderItemRow(rowData:string) {
        if(!rowData)
            return null
        return (
            <TouchableOpacity onPress={() => this._jumpToTaobaoPage(rowData.itemId.toString())}
                              underlayColor="transparent" activeOpacity={0.5}>
                <View>
                    <View style={styles.sysRow}>
                        <PrefetchImage
                            imageUri={rowData.itemPicUrl}
                            imageStyle={styles.sysThumb}
                            resizeMode="cover"
                            width={width/3-5}
                            height={width/3-5}
                            key={rowData.itemPicUrl}
                            />
                        <View style={styles.recFlowPrice}>
                            <Animated.Text
                                style={[styles.baseText,styles.recFlowText,{marginTop: this.state.bounce}]}>￥{rowData.itemPrice}</Animated.Text>
                            <Text style={[styles.baseText,styles.recFlowText]}>红包：￥{rowData.tkCommFee}</Text>
                        </View>
                        <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
                            <Text style={[styles.baseText,{paddingBottom:0,minHeight: 38}]} lineBreakMode={'tail'} numberOfLines={2}>
                                {rowData.itemTitle}
                            </Text>
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _jumpToTaobaoPage(itemId) {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump(itemId, (error, res) => {
                    if (error) {
                        console.error(error);
                    } else {
                        let orders;
                        if (res) { //交易成功
                            orders = res.oders;
                        }
                    }
                })
            }
        });
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: AddFriends,
                        name: 'AddFriends',
                        sceneConfigs: Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
                    });
                });
            }
        });
    }

    _onRightIconClicked() {
        const { navigator } = this.props;

        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: SearchPage,
                name: 'SearchPage',
                sceneConfigs: Navigator.SceneConfigs.FadeAndroid
            });
        });
    }

    render() {
        var rows = [];
        _.each(this.state.searchItemHistory, (v, k) => {
            if (typeof v === 'string')
                rows.push(
                    <TouchableOpacity style={styles.historyItem} key={k} onPress={() => this._search(v)}>
                        <View >
                            <Text style={[styles.historyItemFont,styles.baseText]}>{v}</Text>
                        </View>
                    </TouchableOpacity>
                );
        });
        return (
            <View style={styles.container}>
                <Toolbar
                    title={'剁手记'}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    leftImg={addImg}
                    rightImg={searchImg}
                    onLeftIconClicked={this._onLeftIconClicked}
                    onRightIconClicked={this._onRightIconClicked}
                    />
                <View style={[styles.block,styles.search]}>
                    <Text style={[styles.baseText, {fontSize: 14,color: '#fc7d30'}]}>淘宝购物全场都有红包拿，还不快搜！</Text>
                    <View style={styles.searchHeader}>
                        <TextInput
                            style={styles.searchText}
                            placeholder={'搜索商品或笔记'}
                            placeholderTextColor='#bebebe'
                            multiline={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='go'
                            onChangeText={(text) => {this._autoComplete(text)}}
                            value={this.state.keyWord}
                            onSubmitEditing={(event) => this._search(event.nativeEvent.text)}
                            />
                        <TouchableOpacity style={styles.sButton} onPress={() => this._search()}>
                            <Text style={styles.sButtonFont}>搜索</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                {
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.block,styles.history]}>
                            {this._historyFrame()}
                        </View>{
                        this.props.recent.recentBuy.length > 0 || this.props.recent.recentView.length > 0 ?


                            <View
                                style={[styles.block,styles.recent,{height: this.props.recent.recentView.length > 0 && this.props.recent.recentBuy.length > 0 ? 460: 230}]}>
                                {
                                    this.props.recent.recentBuy.length > 0 ?
                                        <View style={{marginBottom: 10}}>
                                            <View style={styles.blockTitle}>
                                                <Text style={[styles.historyTitle,styles.baseText]}>最近购买：</Text>
                                            </View>
                                            <View style={styles.recentBuy}>
                                                {this._recentList('buy')}
                                            </View>
                                        </View> :
                                        null
                                }
                                {
                                    this.props.recent.recentView.length > 0 ?
                                        <View>
                                            <View style={styles.blockTitle}>
                                                <View style={styles.delete}>
                                                    <TouchableOpacity onPress={() => this._deleteViewHistory()}>
                                                        <Icon
                                                            name='ios-trash'
                                                            size={26}
                                                            color={'#aaa'}
                                                            />
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={[styles.historyTitle,styles.baseText]}>最近浏览：</Text>
                                            </View>
                                            <View style={styles.recentView}>
                                                {this._recentList('view')}
                                            </View>
                                        </View> :
                                        null
                                }

                            </View>
                            :
                            null}
                    </ScrollView>
                }

            </View>
        )

    }
}

function mapStateToProps(state) {
    const { comments,recent } = state;
    return {
        comments,
        recent
    };
}

export default connect(mapStateToProps)(RedPacket);