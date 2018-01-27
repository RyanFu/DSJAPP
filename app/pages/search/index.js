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
    navigator,
    InteractionManager,
    AsyncStorage,
    ListView
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import * as common from '../../utils/common';
import { connect } from 'react-redux';
var backImg = require('../../assets/upload/rg_left.png');
import { fetchItemSearchList } from '../../actions/search';
import SearchItem from '../../components/searchItem';
import Spinner from 'react-native-spinkit';
import ResultPage from './result';
import StorageKeys from '../../constants/StorageKeys';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import _ from 'lodash';
import { request } from '../../utils/common';
import configs from '../../constants/configs';
import {isIphoneX} from "../../utils/common";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._jumpToResultPage = this._jumpToResultPage.bind(this);
        this._renderItemAutoRow = this._renderItemAutoRow.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.state = {
            keyWord: '',
            searchItemHistory: [],
            searchNoteHistory: [],
            itemAuto: false,
            itemAutoForList: this.ds.cloneWithRows([]),
            type: 0
        };
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        if (navigator) {
            common.naviGoBack(navigator);
        }
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
        navigator.push({
            component: ResultPage,
            name: 'ResultPage',
            text: text,
            type: this.state.type,
            from: this.props.route.from
        });
    }

    componentDidMount() {
        const the = this;
        AsyncStorage.getItem(StorageKeys.SEARCH_ITEM, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchItemHistory: result});
        });
        AsyncStorage.getItem(StorageKeys.SEARCH_NOTE, (error, result) => {
            result = _.reverse(JSON.parse(result));
            the.setState({searchNoteHistory: result});
        });

    }

    _deleteHistory() {
        AsyncStorage.removeItem(StorageKeys.SEARCH_ITEM);
        AsyncStorage.removeItem(StorageKeys.SEARCH_NOTE);

        this.setState({searchItemHistory: []});
        this.setState({searchNoteHistory: []});
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
                    <View style={styles.delete}>
                        <TouchableOpacity onPress={() => this._deleteHistory()}>
                            <Icon
                                name='ios-trash'
                                size={26}
                                color={'#aaa'}
                                />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={[styles.historyTitle,styles.baseText]}>搜索历史：</Text>
                    </View>
                    <View style={styles.history}>
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

    _onChangeTab(data) {
        this.setState({type: data.i})
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <View style={styles.searchHeader}>
                    <ImageButton
                        source={backImg}
                        style={styles.back}
                        onPress={this._onLeftIconClicked}
                        />
                    <TextInput
                        clearButtonMode='while-editing'
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
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    tabBarPosition="top"
                    tabBarBackgroundColor="rgba(255,255,255,0.9)"
                    tabBarActiveTextColor="#fc7d30"
                    tabBarInactiveTextColor="#9b9b9b"
                    tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 1.5}}
                    onChangeTab={this._onChangeTab.bind(this)}
                    renderTabBar={() => <DefaultTabBar
                                    tabStyle={{paddingBottom: 0}}
                                    style={{height: 40,borderBottomColor: 'rgba(178,178,178,0.3)'}}
                                />}
                    >

                    <View
                        key='item'
                        tabLabel='商品'
                        style={{ flex: 1 }}
                        >
                        {this._historyFrame()}
                    </View>
                    {
                        this.props.route.from !== 'editNote'?
                            <View
                                key='note'
                                tabLabel='笔记'
                                style={{ flex: 1 }}
                            >
                                {this._historyFrame()}
                            </View>:null
                    }

                </ScrollableTabView>
                <View style={styles.searchBody}>

                </View>
            </View>
        )

    }
}

function mapStateToProps(state) {
    const { search } = state;
    return {
        search
    };
}

export default connect(mapStateToProps)(Search);