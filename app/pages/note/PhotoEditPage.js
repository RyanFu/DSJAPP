/**
 * Created by lyan2 on 16/8/2.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ImageEditor,
    ImageStore,
    ListView,
    Modal,
    Platform,
    ScrollView,
    Slider,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    InteractionManager,
    DeviceEventEmitter,
    WebView
} from 'react-native';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
//import WebViewBridge from 'react-native-webview-bridge';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Button from '../../components/button/Button';
import Loading from '../../components/loading';
import FramedTextInput from '../../components/textInput/FramedTextInput';
import Toolbar from '../../components/toolbar';
import ConfirmBar from '../../components/bar/ConfirmBar';
import StoreActions from '../../constants/actions';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import ImageButton from '../../components/toolbar/ImageButton';
import BrandOptionList from './BrandOptionList';
import CurrencyOptionList from './CurrencyOptionList';
import NationOptionList from './NationOptionList';
import CategoryOptionList from './CategoryOptionList';
import PostNotePage from './PostNotePage';
import {fabrics} from '../../constants/fabrics';
import {fabricContrast} from '../../constants/imageFilters';
const arrowImg = require('../../assets/header/arrow.png');
import styles from './style';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

const originImg = require('../../assets/photo/origin.png');
const sepia2Img = require('../../assets/photo/sepia2.jpg');
const sepiaImg = require('../../assets/photo/sepia.jpg');
const sharpenImg = require('../../assets/photo/sharpen.jpg');
const photoHtmlAndroid = require('../../assets/html/photo.html');
import photoHtmlIos from '../../assets/html/photo';

import stickers from '../../assets/stickers/index.js';
import ChannelTabBar from '../../components/channelTabBar';
import Webview from '../../components/webview';

import _ from 'lodash';
import {toast} from "../../utils/common";
let WebViewBridge = WebView;
let clone = require('lodash/clone');

let contrastIcon = <Icon name="adjust" size={30} color="#333"/>;
let brightnessIcon = <Icon name="sun-o" size={30} color="#333"/>;
let cropIcon = <Icon name="crop" size={30} color="#333"/>;
let rotateIcon = <Icon name="rotate-right" size={30} color="#333"/>;
let linkIcon = <Icon name="link" size={15} color="#fff"/>;

let maxSize = 1024;

class PhotoEditPage extends Component {
    constructor(props) {
        super(props);
        this._stickerUpdateState = this._stickerUpdateState.bind(this);
        this.state = {
            bShowTabsBar: true,
            bHandlingFilter: false,
            oTabsBar: null,
            oDefaultTabsBar: <DefaultTabBar {...this.props}/>,
            dBrightness: 0.5,
            sBase64Data: null,
            oImageTag: null,
            sImageBase64Data: null,
            avatarSource: this.props.photo,
            optionsModalVisible: false,
            categoryOptionsVisible: false,
            currencyOptionsVisible: false,
            brandOptionsVisible: false,
            nationOptionsVisible: false,
            transparent: true,
            tagOverlayVisible: false,
            tags: [],
            currentTag: {},
            beautifyTab: 'default',
            beautify: {
                brightness: {oldValue: 0.5, newValue: 0.5},
                contrast: {oldValue: 1, newValue: 1}
            },
            currentFilter: null,
            updatedSticks: {},
            next: false,
            ready: false,
            showWebview: false,
            showRemoveTagButton: false,
        };

        this.stickersDataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return (r1 !== r2 || this.state.updatedSticks[r1.name]);
            },
            sectionHeaderHasChanged: (s1, s2) => s1 != s2
        });

        this.state.stickers = clone(stickers);
        // here, datasource's argument must be original "stickers" object.

        this.state.stickersBbs = {};
        this.state.stickersChz = {};
        this.state.stickersJbk = {};
        this.state.stickersJs = {};
        this.state.stickersMrz = {};
        this.state.stickersNrz = {};
        this.state.stickersPyyhh = {};
        this.state.stickersQqg = {};
        this.state.stickersSdp = {};
        _.each(this.state.stickers.myStickers, (v, k)=> {
            if (v.type === 'bbs')
                this.state.stickersBbs[k] = v;
            if (v.type === 'chz')
                this.state.stickersChz[k] = v;
            if (v.type === 'jbk')
                this.state.stickersJbk[k] = v;
            if (v.type === 'js')
                this.state.stickersJs[k] = v;
            if (v.type === 'mrz')
                this.state.stickersMrz[k] = v;
            if (v.type === 'nrz')
                this.state.stickersNrz[k] = v;
            if (v.type === 'pyyhh')
                this.state.stickersPyyhh[k] = v;
            if (v.type === 'qqg')
                this.state.stickersQqg[k] = v;
            if (v.type === 'sdp')
                this.state.stickersSdp[k] = v;
        });

        this.state.stickersDataSourceBbs = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersBbs});
        this.state.stickersDataSourceChz = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersChz});
        this.state.stickersDataSourceJbk = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersJbk});
        this.state.stickersDataSourceJs = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersJs});
        this.state.stickersDataSourceMrz = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersMrz});
        this.state.stickersDataSourceNrz = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersNrz});
        this.state.stickersDataSourcePyyhh = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersPyyhh});
        this.state.stickersDataSourceQqg = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersQqg});
        this.state.stickersDataSourceSdp = this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersSdp});
        this.state.stickersDataSource = this.stickersDataSource.cloneWithRowsAndSections(this.state.stickers);
    }

    _onWebViewLoadEnd() {
        if (this.props.draftNote) {
            let {currentPhotoIndex, notePhotos} = this.props.draftNote;
            if (notePhotos && notePhotos.length > currentPhotoIndex) {
                this.state.avatarSource = notePhotos[currentPhotoIndex].photo;
                let imageSize = {width,height} = this.state.avatarSource;
                let displaySize = {};

                if (imageSize.width > imageSize.height && imageSize.width > maxSize) {
                    displaySize = {width: maxSize, height: (maxSize / imageSize.width * imageSize.height)};
                } else if (imageSize.height > imageSize.width && imageSize.height > maxSize) {
                    displaySize = {height: maxSize, width: (maxSize / imageSize.height * imageSize.width)};
                } else {
                    displaySize = {height: imageSize.height, width: imageSize.width}
                }

                console.log(this.state.avatarSource);

                // get base64data of image
                ImageEditor.cropImage(this.state.avatarSource.uri, {
                    offset: {x: 0, y: 0},
                    size: imageSize,
                    displaySize: displaySize,
                    resizeMode: 'contain'
                }, (url) => {
                    ImageStore.getBase64ForTag(url, (base64Data) => {
                        const { webviewbridge } = this.refs;
                        let {height, width} = Dimensions.get('window');
                        let sImageBase64Data = "data:" + this.state.avatarSource.type + ";base64," + base64Data.replace(/\n|\r/g, "");
                        //console.log('data:' + sImageBase64Data);

                        webviewbridge.postMessage(JSON.stringify({
                            type: "imageReady",
                            window: {width: width, height: height},
                            image: displaySize,
                            data: sImageBase64Data
                        }));
                    }, (error) => {
                        console.log(error);
                    });
                }, (error) => {
                    console.log(error);
                });
            }
        }
    }

    _onCancel() {
        const { navigator, dispatch } = this.props;
        let {currentPhotoIndex} = this.props.draftNote;

        dispatch({type: StoreActions.REMOVE_NOTE_PHOTO, index: currentPhotoIndex});

        if (navigator) {
            navigator.pop();
        }
    }

    _onContinue() {
        const { navigator, dispatch } = this.props;
        const { webviewbridge } = this.refs;
        this.setState({next: true});

        dispatch({type: StoreActions.ADD_TAGS, tags: this.state.tags.slice()});

        webviewbridge.postMessage(JSON.stringify({type: 'continue'}));

    }

    /**
     * @param args: {i:currentPage, from: prevPage, ref: currentPage component}
     * @private
     */
    _onChangeTab(args) {
        const { webviewbridge } = this.refs;
        webviewbridge.postMessage(JSON.stringify({type: 'changeTab', imageClickable: (args.i == 1)}));
    }

    _onCurrencyInputFocus() {
        this.showCurrencyModal(true);
    }

    _onNationInputFocus() {
        this.showNationModal(true);
    }

    _onCategorySelect(rowData) {
        this.state.currentTag.category = {title: rowData.title, id: rowData.id};
        this.showBrandModal(false);
    }

    _onBrandSelect(rowData) {
        this.state.currentTag.brand = rowData.title;
        this.showBrandModal(false);
    }

    /*
     * @deprecated
     */
    _onCurrencySelect(rowData) {
        this.state.currentTag.currency = rowData.title;
        this.showCurrencyModal(false);
    }

    _onNationSelect(rowData) {
        this.state.currentTag.city = {title: rowData.title, id: rowData.id};
        this.showCurrencyModal(false);
    }

    setOptionsModalVisible(flag) {
        this.setState({optionsModalVisible: flag});
    }

    showCategoryModal(flag) {
        this.state.categoryOptionsVisible = flag;
        this.state.brandOptionsVisible = false;
        this.state.nationOptionsVisible = false;
        this.state.currencyOptionsVisible = false;
        this.setOptionsModalVisible(flag);
    }

    showBrandModal(flag) {
        this.state.brandOptionsVisible = flag;
        this.state.categoryOptionsVisible = false;
        this.state.nationOptionsVisible = false;
        this.state.currencyOptionsVisible = false;
        this.setOptionsModalVisible(flag);
    }

    showCurrencyModal(flag) {
        this.state.currencyOptionsVisible = flag;
        this.state.categoryOptionsVisible = false;
        this.state.brandOptionsVisible = false;
        this.state.nationOptionsVisible = false;
        this.setOptionsModalVisible(flag);
    }

    showNationModal(flag) {
        this.state.nationOptionsVisible = flag;
        this.state.currencyOptionsVisible = false;
        this.state.brandOptionsVisible = false;
        this.setOptionsModalVisible(flag);
    }

    _onModalCancel() {
        this.state.nation = this.state.currency = this.state.brand = "";
        this.setState({tagOverlayVisible: false});
    }

    _onAddTag() {
        const { webviewbridge } = this.refs;
        let {tags} = this.state;
        const the = this;
        //remove prev tag
        if(this.state.currentTag.index || this.state.currentTag.index == 0){
            webviewbridge.postMessage(JSON.stringify({type: 'removeTag', data: this.state.currentTag}));
            _.remove(this.state.tags, function(n,k) {
                return k.index  == the.state.currentTag.index;
            });
        }

        let tagData = {name, currency, brand, price, address, x, y,title,url,urlCategory,itemId,imageUrl} = this.state.currentTag;
        tagData.name = tagData.title;
        this.state.currentTag.category && (tagData.category = this.state.currentTag.category.id);
        this.state.currentTag.city && (tagData.city = this.state.currentTag.city.id);
        tagData.index = tags.length;
        let data = clone(tagData);

        this.state.currentTag.category && (data.category = this.state.currentTag.category.title);
        this.state.currentTag.city && (data.city = this.state.currentTag.city.title);

        if(!tagData.title || tagData.title == ''){
            toast('请输入商品名称');
            return;
        }

        tags.push(tagData);
        webviewbridge.postMessage(JSON.stringify({type: 'addTag', data: data}));

        this.state.tags = tags;
        this.setState({tagOverlayVisible: false});
        this.setState({currentTag: {}});
    }

    _onPressBrightness() {
        this.state.bShowTabsBar = false;
        this._resetTabBars();
        this.setState({beautifyTab: 'brightness'});
    }

    _onPressContrast() {
        this.state.bShowTabsBar = false;
        this._resetTabBars();
        this.setState({beautifyTab: 'contrast'});
    }

    _onPressRotate() {
        const { webviewbridge } = this.refs;
        this.setState({bHandlingFilter: true});
        webviewbridge.postMessage(JSON.stringify({type: 'beautify', beautify: 'rotate'}));
    }

    _resetTabBars() {
        this.state.oTabsBar = this.state.bShowTabsBar ? this.state.oDefaultTabsBar : false;
    }

    _adjustImageBrightness(value) {
        const { webviewbridge } = this.refs;
        this.setState({bHandlingFilter: true});
        webviewbridge.postMessage(JSON.stringify({type: 'beautify', beautify: 'brightness', value: value}));
        this.state.beautify.brightness.newValue = value;
    }

    _adjustImageContrast(value) {
        const { webviewbridge } = this.refs;
        this.setState({bHandlingFilter: true});
        webviewbridge.postMessage(JSON.stringify({type: 'beautify', beautify: 'contrast', value: value}));
        this.state.beautify.contrast.newValue = value;
    }

    _applyImageFilter(filter) {
        if (this.state.currentFilter === filter)
            return;
        const { webviewbridge } = this.refs;
        this.setState({bHandlingFilter: true});
        webviewbridge.postMessage(JSON.stringify({type: 'filter', value: filter}));
        this.setState({currentFilter: filter});
    }

    _onBridgeMessage(message) {
        const { navigator, dispatch } = this.props;
        const { webviewbridge } = this.refs;

        //console.log(message);
        message = message.nativeEvent.data;
        if (message.startsWith("{")) {
            message = JSON.parse(message);
            switch (message.type) {
                case "bridgeReady":
                    this._onWebViewLoadEnd();
                    this.setState({ready: true});
                    break;
                case "clickImage":
                    this.setState({showRemoveTagButton: false, tagOverlayVisible: true, currentTag: {x: message.x, y: message.y}});
                    break;
                case "imageUpdated":
                    this.setState({bHandlingFilter: false});
                    console.log(message.type);
                    //this.setState({sImageBase64Data: message.data});
                    break;
                case "continue":
                    dispatch({
                        type: StoreActions.ADD_NOTE_PHOTO_DATA,
                        imageData: message.imageData,
                        ImgSize: message.ImgSize
                    });
                    this.setState({next: false});
                    if (navigator) {
                        navigator.push({
                            name: 'PostNotePage',
                            component: PostNotePage
                        })
                    }
                    break;
                case "showAddedTag":
                    this.setState({showRemoveTagButton: true, tagOverlayVisible: true, currentTag: this.state.tags[message.id]});
                    break;
                case 'toSvg':
                    console.log(message.imageData)
            }
        }
    }

    _toggleSticker(stickerInfo, sectionID, rowID) {
        let { webviewbridge } = this.refs;

        if (!stickerInfo.added) {
            stickerInfo.added = true;
            this.state.updatedSticks[rowID] = true;
            webviewbridge.postMessage(JSON.stringify({type: "addSticker", name: rowID}));
            //this.setState({stickersDataSource: this.stickersDataSource.cloneWithRowsAndSections(this.state.stickers)});
        } else {
            stickerInfo.added = false;
            this.state.updatedSticks[rowID] = true;
            webviewbridge.postMessage(JSON.stringify({type: "removeSticker", name: rowID}));
            //this.setState({stickersDataSource: this.stickersDataSource.cloneWithRowsAndSections(this.state.stickers)});
        }

        this._stickerUpdateState(stickerInfo);
    }

    _stickerUpdateState(stickerInfo) {
        if (stickerInfo.type === 'bbs')
            this.setState({stickersDataSourceBbs: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersBbs})});
        if (stickerInfo.type === 'chz')
            this.setState({stickersDataSourceChz: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersChz})});
        if (stickerInfo.type === 'jbk')
            this.setState({stickersDataSourceJbk: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersJbk})});
        if (stickerInfo.type === 'js')
            this.setState({stickersDataSourceJs: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersJs})});
        if (stickerInfo.type === 'mrz')
            this.setState({stickersDataSourceMrz: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersMrz})});
        if (stickerInfo.type === 'nrz')
            this.setState({stickersDataSourceNrz: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersNrz})});
        if (stickerInfo.type === 'pyyhh')
            this.setState({stickersDataSourcePyyhh: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersPyyhh})});
        if (stickerInfo.type === 'qqg')
            this.setState({stickersDataSourceQqg: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersQqg})});
        if (stickerInfo.type === 'sdp')
            this.setState({stickersDataSourceSdp: this.stickersDataSource.cloneWithRowsAndSections({m: this.state.stickersSdp})});
    }

    _renderSticker(rowData, sectionID, rowID, highlightRow) {
        let selectedStyle = rowData.added ? {borderColor: '#fc7d30'} : {borderColor: '#777'};
        this.state.updatedSticks[rowID] = false; // reset
        return <TouchableOpacity style={[{marginHorizontal:10,borderWidth: 2,backgroundColor:'#777'}, selectedStyle]}
                                 onPress={() => {
                                        highlightRow(sectionID, rowID);
                                        this._toggleSticker.call(this, rowData, sectionID, rowID);}}>
            <Image key={rowID} source={rowData.thumb} style={{width:80, height:80}} resizeMode="contain"/>
        </TouchableOpacity>;
    }

    _toSvg() {
        const { webviewbridge } = this.refs;
        webviewbridge.postMessage(JSON.stringify({type: 'toSvg'}));
    }

    _showWebview() {
        const {navigator} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: Webview,
                name: 'Webview',
                sceneConfigs: Navigator.SceneConfigs.FloatFromBottom,
                url: this.state.currentTag.url,
                title: this.state.currentTag.url ? '商品详情' : null
            });
        });
    }

    _colselinkedItem() {
        this.setState({currentTag: {}});
    }

    componentDidMount() {
        const the = this;
        const {height, width} = Dimensions.get('window');
        const { webviewbridge } = this.refs;
        _.each(this.state.stickers.myStickers, (v, k)=> {
            this.state.stickers.myStickers[k].added = false;
        });

        DeviceEventEmitter.addListener('newTag', (val)=> {
            the.setState({currentTag: Object.assign({}, the.state.currentTag,  {title: val.title})});
            the.state.currentTag.title = val.title;
            the.state.currentTag.imageUrl = val.imageUrl;
            the.state.currentTag.itemId = val.itemId;
            the.state.currentTag.price = val.price;
            the.state.currentTag.urlCategory = val.urlCategory;
            the.state.currentTag.url = val.url;
            the.setState({currentTag: Object.assign({}, the.state.currentTag,  {url: val.url})});

        });

        webviewbridge.injectJavaScript(`wHeight=`+(height-260)+`;`);
    }

    _delCurrentTag() {
        const { webviewbridge } = this.refs;
        const the = this;
        webviewbridge.postMessage(JSON.stringify({type: 'removeTag', data: this.state.currentTag}));
        _.remove(this.state.tags, function(n,k) {
            return k.index  == the.state.currentTag.index;
        });
        this.setState({showRemoveTagButton: false, currentTag: {x: the.state.currentTag.x, y: the.state.currentTag.y}})
    }

    render() {
        let {height, width} = Dimensions.get('window');

        let choseFilterStyle = {borderColor: '#fc7d30'};
        //console.log(height);

        return (
            <View style={[styles.container, {height: height - 21}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="编辑照片"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    rightText='继续'
                    onLeftIconClicked={this._onCancel.bind(this)}
                    onRightIconClicked={this._onContinue.bind(this)}
                    />

                {this.state.bHandlingFilter || this.state.next || !this.state.ready ? <Loading /> : null}

                <View style={styles.selectedPhotoContainer}>
                    {
                        Platform.OS === 'android' ?
                            <WebViewBridge ref="webviewbridge" javaScriptEnabled={true}
                                           onMessage={this._onBridgeMessage.bind(this)}
                                           scrollEnabled={false} allowFileAccessFromFileURLs={true}
                                           allowUniversalAccessFromFileURLs={true}
                                           domStorageEnabled={true}
                                           source={photoHtmlAndroid}>
                            </WebViewBridge> :
                            <WebViewBridge ref="webviewbridge" javaScriptEnabled={true}
                                           onMessage={this._onBridgeMessage.bind(this)}
                                           scrollEnabled={false} allowFileAccessFromFileURLs={true}
                                           allowUniversalAccessFromFileURLs={true}
                                           domStorageEnabled={true}
                                           scalesPageToFit={true}
                                           // source={{html: photoHtmlIos}}>
                                           source={photoHtmlAndroid}>
                            </WebViewBridge>
                    }

                </View>

                <ScrollableTabView
                    tabBarPosition='bottom' locked={true}
                    renderTabBar={this.state.oTabsBar}
                    onChangeTab={this._onChangeTab.bind(this)}
                    tabBarActiveTextColor="#fc7d30"
                    style={{marginBottom:-1}}
                    tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 2}}
                    >

                    <ScrollableTabView
                        tabLabel="贴图"
                        ref="nestedTabs"
                        locked={true}
                        tabBarPosition='top'
                        tabBarActiveTextColor="#fc7d30"
                        tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 0}}
                        renderTabBar={() =>
                                  <ChannelTabBar
                                    underlineHeight={1}
                                    textStyle={{ fontSize: 14, marginTop: 8 }}
                                    style={{height: 38}}
                                    underlineColor="#fc7d30"
                                    scrollButton={false}
                                  />
                                }
                        >
                        <ListView tabLabel="基本款" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceJbk} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="美人志" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceMrz} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="男人装" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceNrz} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="健身" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceJs} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="宝贝书" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceBbs} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="吃货志" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceChz} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="耍大牌" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceSdp} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="全球购" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourceQqg} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>
                        <ListView tabLabel="便宜有好货" style={{flex:1}} horizontal={true}
                                  contentContainerStyle={{justifyContent: 'center', alignItems:'center'}}
                                  dataSource={this.state.stickersDataSourcePyyhh} enableEmptySections={true}
                                  renderRow={this._renderSticker.bind(this)}/>

                    </ScrollableTabView>

                    <ScrollView tabLabel="标签" horizontal={true}
                                contentContainerStyle={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <View style={[styles.tabView]}>
                            {
                                this.state.tags.length > 0 ? (
                                    <View>
                                        <Text style={[styles.baseText]}>点击照片，继续添加相关信息</Text>
                                    </View>

                                ) : (
                                    <View>
                                        <Text style={[styles.baseText,{textAlign:'center'}]}>点击照片，添加相关信息</Text>
                                        <Text style={[styles.baseText,{fontSize:10}]}>添加标签可以让别人更好地阅读您推荐的商品噢～</Text>
                                    </View>
                                )
                            }
                        </View>
                    </ScrollView>

                    <ScrollView navigator={this.props.navigator} horizontal={true} tabLabel="美化"
                                contentContainerStyle={{flex:1}}>
                        <ScrollableTabView
                            ref="nestedTabs"
                            locked={true}
                            tabBarPosition='top'
                            tabBarActiveTextColor="#fc7d30"
                            tabBarUnderlineStyle={{backgroundColor:'#fc7d30',height: 0}}
                            renderTabBar={() => <DefaultTabBar
                                    style={{height: 38,borderBottomWidth: 0}}
                                    tabStyle={{paddingBottom: 0,marginTop: 8,marginBottom: 8, borderRightWidth: 1, borderColor: '#f1f1f1'}}
                                />
                                }
                            >
                            <ScrollView navigator={this.props.navigator} tabLabel="滤镜库" removeClippedSubviews={false}
                                        horizontal={true} style={{flex:1}}
                                        contentContainerStyle={{alignItems:'stretch'}}>
                                <TouchableOpacity onPress={() => {this._applyImageFilter.call(this, 'none');}}
                                                  style={[styles.filterBox, (this.state.currentFilter == 'none' ? choseFilterStyle : null)]}>
                                    <View style={styles.filterImageFrame}>
                                        <Image source={originImg}
                                               style={[styles.filterImage,(this.state.currentFilter == 'none' ? choseFilterStyle : null)]}
                                               resizeMode="contain"/>
                                        <Text
                                            style={[styles.baseText,{marginTop: 2},(this.state.currentFilter == 'none' ? {color: '#fc7d30'} : null)]}>原图</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {this._applyImageFilter.call(this, 'sepia');}}
                                                  style={[styles.filterBox, (this.state.currentFilter == 'sepia' ? choseFilterStyle : null)]}>
                                    <View style={styles.filterImageFrame}>
                                        <Image source={sepiaImg}
                                               style={[styles.filterImage,(this.state.currentFilter == 'sepia' ? choseFilterStyle : null)]}
                                               resizeMode="contain"/>
                                        <Text
                                            style={[styles.baseText,{marginTop: 2},(this.state.currentFilter == 'sepia' ? {color: '#fc7d30'} : null)]}>怀旧1</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {this._applyImageFilter.call(this, 'sepia2');}}
                                                  style={[styles.filterBox, (this.state.currentFilter == 'sepia2' ? choseFilterStyle : null)]}>
                                    <View style={styles.filterImageFrame}>
                                        <Image source={sepia2Img}
                                               style={[styles.filterImage,(this.state.currentFilter == 'sepia2' ? choseFilterStyle : null)]}
                                               resizeMode="contain"/>
                                        <Text
                                            style={[styles.baseText,{marginTop: 2},(this.state.currentFilter == 'sepia2' ? {color: '#fc7d30'} : null)]}>怀旧2</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {this._applyImageFilter.call(this, 'sharpen');}}
                                                  style={[styles.filterBox, (this.state.currentFilter == 'sharpen' ? choseFilterStyle : null)]}>
                                    <View style={styles.filterImageFrame}>
                                        <Image source={sharpenImg}
                                               style={[styles.filterImage,(this.state.currentFilter == 'sharpen' ? choseFilterStyle : null)]}
                                               resizeMode="contain"/>
                                        <Text
                                            style={[styles.baseText,{marginTop: 2},(this.state.currentFilter == 'sharpen' ? {color: '#fc7d30'} : null)]}>锐化</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                            <ScrollView navigator={this.props.navigator} tabLabel="美化照片" horizontal={true}
                                        style={{flex:1}} contentContainerStyle={{flex:1, backgroundColor:'#fff'}}>
                                {
                                    this.state.beautifyTab == 'default' ? (<View
                                        style={{flex:1, flexDirection: 'row', alignItems: 'stretch', justifyContent:'space-between', backgroundColor:'#999'}}>
                                        <TouchableHighlight onPress={this._onPressBrightness.bind(this)}
                                                            style={{flex:1}}>
                                            <View
                                                style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#eee'}}>
                                                {brightnessIcon}
                                                <Text>亮度</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={this._onPressRotate.bind(this)}
                                                            style={{flex:1}}>
                                            <View
                                                style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#eee'}}>
                                                {rotateIcon}
                                                <Text>旋转</Text>
                                            </View>
                                        </TouchableHighlight>

                                        <TouchableHighlight onPress={this._onPressContrast.bind(this)} style={{flex:1}}>
                                            <View
                                                style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#eee'}}>
                                                {contrastIcon}
                                                <Text>对比度</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>) : null
                                }

                                {
                                    this.state.beautifyTab == 'brightness' ? (
                                        <View style={{flex:1, justifyContent:'flex-end'}}>
                                            <Slider value={this.state.beautify.brightness.oldValue}
                                                    onSlidingComplete={(value) => this._adjustImageBrightness(value)}
                                                    minimumTrackTintColor={'#fc7d30'}
                                                    style={{flex:1}}></Slider>
                                            <ConfirmBar style={styles.confirmBar} title='亮度'
                                                        onCancel={() => {
                                                            this._adjustImageBrightness(this.state.beautify.brightness.oldValue)
                                                            this.setState({beautifyTab:'default', oTabsBar:null})}
                                                        }
                                                        onConfirm={() => {
                                                            this.state.beautify.brightness.oldValue = this.state.beautify.brightness.newValue;
                                                            this.setState({beautifyTab:'default', oTabsBar:null})}
                                                        }></ConfirmBar>
                                        </View>) : null
                                }

                                {
                                    this.state.beautifyTab == 'contrast' ? (
                                        <View style={{flex:1, justifyContent:'flex-end'}}>
                                            <Slider value={this.state.beautify.contrast.oldValue}
                                                    onSlidingComplete={(value) => this._adjustImageContrast(value)}
                                                    minimumValue={0} maximumValue={2} step={0.1}
                                                    minimumTrackTintColor={'#fc7d30'}
                                                    style={{flex:1}}></Slider>
                                            <ConfirmBar style={styles.confirmBar} title='对比度'
                                                        onCancel={() => {
                                                        this._adjustImageContrast(this.state.beautify.contrast.oldValue);
                                                        this.setState({beautifyTab:'default', oTabsBar:null})}}
                                                        onConfirm={() => {
                                                            this.state.beautify.contrast.oldValue = this.state.beautify.contrast.newValue;
                                                            this.setState({beautifyTab:'default', oTabsBar:null})}
                                                        }></ConfirmBar>
                                        </View>) : null
                                }
                            </ScrollView>
                        </ScrollableTabView>
                    </ScrollView>

                </ScrollableTabView>

                {this.state.tagOverlayVisible ?
                    (<KeyboardAvoidingView behavior={'position'} contentContainerStyle={{flex:1,backgroundColor:'#fff'}}
                                           style={[styles.overlay,this.state.currentTag.url?(this.state.showRemoveTagButton?{top:height - 260 + 21 + 20 - 30 - 50}:{top:height - 260 + 21 + 20 - 30}):null]}>
                        <View style={styles.tagHeader}>
                            <TouchableOpacity
                                onPress={() => this._onModalCancel.call(this)}>
                                <Text style={[styles.baseText,styles.tagHeaderText,styles.dimText]}>
                                    取消
                                </Text>

                            </TouchableOpacity>
                            <Text style={[styles.baseText,styles.tagHeaderText]}>
                                编辑标签
                            </Text>
                            <TouchableOpacity
                                onPress={() => this._onAddTag.call(this)}>
                                <Text
                                    style={[styles.baseText,styles.tagHeaderText,styles.dimText,styles.tagHeaderCompleteText]}>
                                    完成
                                </Text>

                            </TouchableOpacity>

                        </View>
                        <View style={styles.formRow}>
                            <FramedTextInput placeholder="名称" placeholderTextColor='#9b9b9b' clearTextOnFocus={false}
                                             contentContainerStyle={styles.framedTextInput}
                                             style={[styles.textInput, {color: '#000'}]}
                                             onChangeText={text => this.state.currentTag.title = text}
                                             defaultValue={this.state.currentTag.title}
                                             onSubmitEditing={(event) => {this.state.currentTag.title = event.nativeEvent.text;}}/>
                        </View>
                        <View style={styles.formRow}>
                            <FramedTextInput placeholder='价格' placeholderTextColor='#9b9b9b' clearTextOnFocus={false}
                                             keyboardType='numeric'
                                             defaultValue={this.state.currentTag.price}
                                             contentContainerStyle={styles.framedTextInput}
                                             style={[styles.textInput, {color: '#000'}]}
                                             onChangeText={text => this.state.currentTag.price = text}
                                             onSubmitEditing={(event) => {this.state.currentTag.price = event.nativeEvent.text;}}/>
                        </View>
                        <View style={styles.formRow}>
                            <FramedTextInput ref="categoryInput" placeholder='品类' placeholderTextColor='#9b9b9b'
                                             clearTextOnFocus={true} enablesReturnKeyAutomatically={true}
                                             blurOnSubmit={true}
                                             value={this.state.currentTag.category && this.state.currentTag.category.title}
                                             contentContainerStyle={styles.framedTextInput}
                                             style={[styles.textInput, {color: '#000'}]}
                                             onFocus={() => {this.showCategoryModal(true); this.refs.categoryInput.blur()}}/>
                        </View>
                        {
                            this.state.showRemoveTagButton?
                                <View style={[styles.formRow,styles.formRowLink]}>
                                    <TouchableOpacity onPress={() => this._delCurrentTag.call(this)}>
                                        <View style={styles.link}>
                                            <Text style={[styles.baseText,styles.linkText]}>删除标签</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>: null
                        }
                        <View style={[styles.formRow,styles.formRowLink]}>
                            <TouchableOpacity onPress={() => this._showWebview.call(this)}>
                                {
                                    this.state.currentTag.url ? (
                                        <View style={styles.linkedItem}>
                                            <Image source={{uri: this.state.currentTag.imageUrl , width: 50, height: 50}}
                                                   resizeMode="cover"/>
                                            <View style={styles.linkedItemTitle}>
                                                <Text style={{color: '#000',fontSize:11}} lineBreakMode={'tail'} numberOfLines={2}>{this.state.currentTag.title}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.closeLinkedItem}
                                                onPress={() => this._colselinkedItem.call(this)}>
                                                    <Text style={styles.closeLinkedItemText}>X</Text>
                                            </TouchableOpacity>

                                        </View>
                                    ):(
                                        <View style={styles.link}>
                                            <View>
                                                {linkIcon}
                                            </View>
                                            <Text style={[styles.baseText,styles.linkText]}>添加链接</Text>
                                        </View>
                                    )
                                }

                            </TouchableOpacity>
                        </View>

                    </KeyboardAvoidingView>) : null}

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.optionsModalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                    >
                    <View
                        style={[styles.container, {height: height - 21}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                        { this.state.categoryOptionsVisible ? <CategoryOptionList style={{flex:1}}
                                                                                  onCancel={() => {this.showCategoryModal.call(this, false);}}
                                                                                  onSelect={(rowData)=> this._onCategorySelect.call(this, rowData) }/> : null}
                        { this.state.brandOptionsVisible ?
                            <BrandOptionList onCancel={() => this.showBrandModal.call(this, false)}
                                             onSelect={(rowData)=> this._onBrandSelect.call(this, rowData) }/> : null}
                        { this.state.currencyOptionsVisible ?
                            <CurrencyOptionList onCancel={() => this.showCurrencyModal.call(this, false)}
                                                onSelect={(rowData)=> this._onCurrencySelect.call(this, rowData) }/> : null}
                        { this.state.nationOptionsVisible ?
                            <NationOptionList onCancel={() => this.showNationModal.call(this, false)}
                                              onSelect={(rowData)=> this._onNationSelect.call(this, rowData) }/> : null}
                    </View>
                </Modal>
            </View>
        );
    }
}

function mapStateToProps(state) {
    const { draftNote } = state;
    return {
        draftNote
    };
}

export default connect(mapStateToProps)(PhotoEditPage);
