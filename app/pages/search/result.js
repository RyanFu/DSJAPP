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
    Image
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
import { naviGoBack } from '../../utils/common';
import ScrollableTabView,{ DefaultTabBar }  from 'react-native-scrollable-tab-view';
import ConditionTab from './conditionTab';
import StoreActions from '../../constants/actions';
import Flow from '../../components/flow';

class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this.state = {
            searching: false
        };
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        if (navigator) {
            common.naviGoBack(navigator);
        }
    }

    componentDidMount() {
        const { dispatch, route } = this.props;
        let the = this;
        this.setState({searching: true});
        const params = {
            text: route.text,
            loadingMore: false,
            currentPage: 1,
            searchCondition: this.props.searchCondition
        };
        dispatch(fetchItemSearchList(params)).then(() => {
            the.setState({searching: false});
        });

        DeviceEventEmitter.addListener('filterChanged',()=>{
            the._onChangeTab();
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({type: StoreActions.SEARCH_CONDITION_RESET});
    }

    _goBack() {
        const { navigator } = this.props;
        naviGoBack(navigator);
    }

    _onChangeTab() {
        const { dispatch, route } = this.props;
        let the = this;
        this.setState({searching: true});
        const params = {
            text: route.text,
            loadingMore: false,
            currentPage: 1,
            searchCondition: this.props.searchCondition
        };
        dispatch(fetchItemSearchList(params)).then(() => {
            the.setState({searching: false});
        })
    }

    render() {
        const page = this.props.route.type ? parseInt(this.props.route.type) : 0;
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <View style={styles.searchHeader}>
                    <ImageButton
                        source={backImg}
                        style={styles.back}
                        onPress={this._onLeftIconClicked}
                        />
                    <TouchableWithoutFeedback onPress={()=> this._goBack()}>
                        <TextInput
                            style={styles.searchText}
                            placeholder={'搜索商品或笔记'}
                            placeholderTextColor='#bebebe'
                            multiline={false}
                            underlineColorAndroid='transparent'
                            returnKeyType='go'
                            value={this.props.route.text}
                            onFocus={()=> this._goBack()}
                            onSubmitEditing={(event) => this._search(event.nativeEvent.text)}
                            />
                    </TouchableWithoutFeedback>


                </View>
                <ScrollableTabView
                    scrollWithoutAnimation={true}
                    tabBarPosition="top"
                    tabBarBackgroundColor="rgba(255,255,255,0.9)"
                    tabBarActiveTextColor="#fc7d30"
                    tabBarInactiveTextColor="#9b9b9b"
                    tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 0}}
                    initialPage={page}
                    renderTabBar={() => <DefaultTabBar
                                    style={{height: 40,borderBottomColor: 'rgba(178,178,178,0.3)'}}
                                />}
                    >
                    <View
                        key='item'
                        tabLabel='商品'
                        style={{ flex: 1 }}
                        >
                        <ScrollableTabView
                            scrollWithoutAnimation={true}
                            tabBarPosition="top"
                            initialPage={0}
                            locked={false}
                            renderTabBar={() => <ConditionTab {...this.props}/>}
                            onChangeTab={this._onChangeTab.bind(this)}
                            >
                            <View
                                key='sv'
                                tabLabel='销量高'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='moods'
                                tabLabel='信用高'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='redPacket'
                                tabLabel='红包大'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='price'
                                tabLabel='价格'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                            <View
                                key='cut'
                                style={{ flex: 1 }}
                                >
                            </View>
                            <View
                                key='moreC'
                                tabLabel='筛选'
                                style={{ flex: 1 }}
                                >
                                {
                                    this.state.searching ?
                                        <View style={[styles.center,{marginTop: 40}]}>
                                            <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                                   source={require('../../assets/gif/loading.gif')}/>
                                        </View> :
                                        <SearchItem text={this.props.route.text} navigator={this.props.navigator}/>
                                }
                            </View>
                        </ScrollableTabView>

                    </View>
                    <View
                        key='note'
                        tabLabel='笔记'
                        style={{ flex: 1 }}
                        >
                        {
                            this.state.searching ?
                                <View style={[styles.center,{marginTop: 40}]}>
                                    <Image resizeMode={Image.resizeMode.contain} style={{width:200}}
                                           source={require('../../assets/gif/loading.gif')}/>
                                </View> :
                                <Flow tabForRefresh={this.state.tabForRefresh}
                                      tag='search'
                                      navigator={this.props.navigator}
                                      dispatch={this.props.dispatch}
                                      hasnoBottomTab={true}
                                      searchText={this.props.route.text}
                                    />
                        }
                    </View>
                </ScrollableTabView>

                <View style={styles.searchBody}>


                </View>
            </View>
        )

    }
}

function mapStateToProps(state) {
    const { search,searchCondition } = state;
    return {
        search,
        searchCondition
    };
}

export default connect(mapStateToProps)(SearchResult);