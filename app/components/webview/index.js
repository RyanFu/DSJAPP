'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    WebView,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import { connect } from 'react-redux';
import * as WechatAPI from '../../../node_modules/react-native-wx';
import {toast} from '../../utils/common';
import configs from '../../constants/configs';
import Toolbar from '../../components/toolbar';
import Loading from '../../components/loading';
import _ from 'lodash';
//import WebViewBridge from 'react-native-webview-bridge';
let {height, width} = Dimensions.get('window');
let WEBVIEW_REF = 'webview';
var DEFAULT_URL = configs.mobileServiceUrl + 'eSearch';
//let DEFAULT_URL = 'http://localhost:3000/esearch';
let WebViewBridge = WebView;
const injectedJavaScript1 = `
    delete window.postMessage;

    (function () {
        //var listeners = window.getEventListeners(window);
        alert('333)
        //console.log(listeners.message)
        //if (window.postMessage) {
             window.addEventListener('message', function (cmd) {
                cmd = JSON.parse(cmd);
                if (cmd.type === 'getMessage') {
                    alert('s')
                    var title = document.title;
                    if(title === '商品详情' && document.getElementsByClassName('title_share')[0]){
                        title = document.getElementsByClassName('title_share')[0].outerText;
                    }
                    var imageUrl = '';
                    if(document.images[0]){
                        imageUrl = document.images[0].src;
                    }
                    var message = {
                        title: title,
                        imageUrl: imageUrl
                    };
                    message = JSON.stringify(message);
                    window.postMessage(message);
                }

             },false);
        //}
    }());
`;
const patchPostMessageFunction = function() {
    var originalPostMessage = window.postMessage;
    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer);
    };

    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
    };

    window.postMessage = patchedPostMessage;

    window.document.addEventListener('message', function (e) {
        var message = {};
        var data = e.data;
        try {
            data = JSON.parse(data);
        } catch (e) {
            message.type = 'error';
            window.postMessage(e.message);
            return;
        }
        if (data.type === 'getMessage') {
            var title = document.title;
            if(title === '商品详情' && document.getElementsByClassName('title_share')[0]){
                title = document.getElementsByClassName('title_share')[0].outerText;
            }
            var imageUrl = '';
            if(document.images[0]){
                imageUrl = document.images[0].src;
            }
            var message = {
                type: 'get',
                title: title,
                imageUrl: imageUrl
            };
            message = JSON.stringify(message);
            window.postMessage(message);
        }

    },false);
};

const injectedJavaScript = '(' + String(patchPostMessageFunction) + ')();';

const propTypes = {
    press: PropTypes.func
};
let toolbarTitle = '添加商品';
let tag = {
    url: DEFAULT_URL,
    imageUrl: '',
    itemId: '',
    price: '',
    urlCategory: 'other',
    title: ''
};
let forceStopLoading;

class Webview extends React.Component {
    constructor(props) {
        super(props);
        this._onNavigationStateChange = this._onNavigationStateChange.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onLoadEnd = this._onLoadEnd.bind(this);
        this._onLoadStart = this._onLoadStart.bind(this);
        this._onError = this._onError.bind(this);
        this._getItem = this._getItem.bind(this);
        this._onShouldStartLoadWithRequest = this._onShouldStartLoadWithRequest.bind(this);
        this.state = {
            url: DEFAULT_URL,
            status: 'No Page Loaded',
            canGoBack: false,
            canGoForward: false,
            loading: true,
            scalesPageToFit: true,
            showGetButton: false
        };
        DEFAULT_URL = configs.mobileServiceUrl + 'eSearch';
        toolbarTitle = '添加商品';
    }

    componentDidMount() {
        const {route} = this.props;
        DEFAULT_URL = route.url ? route.url : DEFAULT_URL;
        toolbarTitle = route.title ? route.title : toolbarTitle;
    }

    componentWillUnmount() {
        clearTimeout(forceStopLoading);
    }

    componentWillMount() {
    }

    _goBack() {
        this.refs[WEBVIEW_REF].goBack();
        const { navigator } = this.props;

        if (navigator && !this.state.canGoBack) {
            navigator.pop();
        }
    }

    _onNavigationStateChange(navState) {
        const {route} = this.props;
        if (route.url)
            return false;
        if (navState.url.indexOf('wvb://message') > -1 || navState.url.indexOf('react-js-navigation://postMessage') > -1)
            return false;
        if (this.state.url === navState.url && !navState.isLoading) {
            this.setState({loading: false});
            return false;
        }

        var scheme = navState.url.split('://')[0];
        if (scheme === 'http' || scheme === 'https') {
            tag.url = navState.url;
        }

        this.setState({
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            scalesPageToFit: true
        });
        let res = this._analyzeUrl(navState.url);
        if (res) {
            this.setState({showGetButton: true});
            if (res > 0) {
                tag.itemId = res;
                tag.urlCategory = 'taobao';
            }
        } else {
            this.setState({showGetButton: false});
        }
    }

    _onMessage(message) {
        const { navigator } = this.props;

        try {
            message = JSON.parse(message.nativeEvent.data);
        } catch (e) {
            return;
        }

        if(message.type === 'get'){
            tag.title = message.title;
            tag.imageUrl = message.imageUrl;
            tag.url = encodeURI(tag.url);
            clearTimeout(forceStopLoading);

            DeviceEventEmitter.emit('newTag', tag);
            navigator.pop();
        }
    }

    _onLoadStart() {
        this.setState({loading: true});
        forceStopLoading = setTimeout(()=> {
            this.setState({loading: false});
        }, 4000);
    }

    _onLoadEnd() {
        this.setState({loading: false});
    }

    _onError() {
        this.setState({loading: false});
    }

    _getItem() {
        this.refs[WEBVIEW_REF].postMessage(JSON.stringify({type: 'getMessage'}));
    }

    _analyzeUrl(url) {
        //const url = this.state.url;
        _.each(configs, (v, k)=> {
            if (url === v) {
                return false;
            }
        });
        if (url === DEFAULT_URL) {
            return false;
        }

        let itemId = null;
        if (url.indexOf('tmall.com') >= 0 || url.indexOf('taobao.com') >= 0) {
            const params = url.split('?')[1] ? url.split('?')[1].split('&') : [];
            if (params.length > 0) {
                _.each(params, (v, k)=> {
                    const urlKeyValue = v.split('=');
                    if (urlKeyValue[0] === 'id') {
                        itemId = urlKeyValue[1];
                    }
                });
            }

            if (!itemId) {
                return false;
            }
            return itemId;
        }

        return true;
    }

    _onShouldStartLoadWithRequest (e){
        var scheme = e.url.split('://')[0];
        if (scheme === 'http' || scheme === 'https') {
            return true;
        }
        return false;
    }
    render() {
        return (
            <View style={[styles.container, {height: height - 21}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title={toolbarTitle}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    onLeftIconClicked={this._goBack.bind(this)}
                    />
                <WebViewBridge
                    source={{uri: DEFAULT_URL}}
                    style={styles.web}
                    ref={WEBVIEW_REF}
                    automaticallyAdjustContentInsets={false}
                    scalesPageToFit={false}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={this._onNavigationStateChange}
                    startInLoadingState={true}
                    injectedJavaScript={injectedJavaScript}
                    onLoadEnd={this._onLoadEnd}
                    onLoadStart={this._onLoadStart}
                    onError={this._onError}
                    onMessage={this._onMessage}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
                    >
                </WebViewBridge>
                {this.state.loading ? <Loading /> : null}
                {
                    this.state.showGetButton ?
                        <View style={styles.getItem}>
                            <TouchableOpacity onPress={this._getItem}>
                                <View style={styles.getButton}>
                                    <Text style={styles.getText}>找到了</Text>
                                </View>
                            </TouchableOpacity>

                        </View> : null
                }

            </View>

        )
    }

}

const styles = StyleSheet.create({
    web: {
        backgroundColor: '#fff',
        height: height,
        width: width,
        top: 0,
        left: 0,
        bottom: 0,
        position: 'absolute',
        flex: 1,
        zIndex: 0
    },
    getItem: {
        position: 'absolute',
        flex: 1,
        bottom: 0,
        height: 40,
        width: width,
        backgroundColor: '#f1f1f1',
        alignItems: 'center',
        justifyContent: 'center'
    },
    getButton: {
        height: 30,
        backgroundColor: '#fc7d30',
        width: width - 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    getText: {
        color: '#fff',
        fontSize: 13
    }
});

function mapStateToProps(state) {
    const { home } = state;
    return {
        home
    };
}

export default connect(mapStateToProps)(Webview);