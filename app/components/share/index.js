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
    Image
} from 'react-native';
import { connect } from 'react-redux';
import * as WechatAPI from '../../../node_modules/react-native-wx';
//import * as WeiboAPI from 'react-native-weibo';
import {toast} from '../../utils/common';
import configs from '../../constants/configs';
import * as Emoticons from '../../components/emoticons';

var {height, width} = Dimensions.get('window');
const propTypes = {
    press: PropTypes.func
};

class Share extends React.Component {
    constructor(props) {
        super(props);
        this._shareToWechat = this._shareToWechat.bind(this);
        this._shareToMoment = this._shareToMoment.bind(this);
        this.state = {
            fadeAnim: new Animated.Value(0),
            dropAnim: new Animated.Value(-150),
        }
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnim,
                {toValue: 0.4}
            ),
            Animated.timing(
                this.state.dropAnim,
                {toValue: 0}
            )
        ]).start();

    }

    componentWillMount() {
    }

    _shareToWechat() {
        const data = {
            type: 'news',
            title : Emoticons.parse(this.props.note.title),
            description : Emoticons.parse(this.props.note.content.substring(0,100)),
            webpageUrl : configs.mobileServiceUrl+ 'detail/'+this.props.noteId,
            imageUrl: this.props.thumbUrl,
        };
        WechatAPI.isWXAppInstalled()
            .then((res) =>{
                if(!res)
                    toast('您还未安装微信');
                else
                    WechatAPI.shareToSession(data)
                        .catch((error) => {
                            toast('分享失败，请重试')
                        });
            });
    }

    _shareToMoment() {
        const data = {
            type: 'news',
            title : this.props.note.title,
            description : this.props.note.content,
            webpageUrl : configs.mobileServiceUrl + 'detail/'+this.props.noteId,
            imageUrl: this.props.thumbUrl,
        };
        WechatAPI.isWXAppInstalled()
            .then((res) =>{
                if(!res)
                    toast('您还未安装微信');
                else
                    WechatAPI.shareToTimeline(data)
                        .catch((error) => {
                            toast('分享失败，请重试')
                        });;
            });
    }

    _shareToWeibo() {
        const data = {
            type: 'image',
            text : this.props.note.title,
            imageUrl: this.props.thumbUrl,
        };
        //WeiboAPI.share(data);
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={styles.share}>
                    <Animated.View style={[styles.shareContent,{bottom: this.state.dropAnim}]}>
                        <View style={styles.list}>
                            <TouchableOpacity style={styles.shareItem} onPress={this._shareToWechat}>
                                <Image style={styles.follow} source={require('../../assets/note/wechat.png')}/>
                                <Text style={styles.shareFont}>微信</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareItem}onPress={this._shareToMoment}>
                                <Image style={styles.follow} source={require('../../assets/note/moment.png')}/>
                                <Text style={styles.shareFont}>朋友圈</Text>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity style={styles.button} onPress={this.props.press}>
                            <Text style={styles.buttonFont} >取消</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableWithoutFeedback onPress={this.props.press}>
                        <Animated.View  style={[styles.shareShadow, {opacity: this.state.fadeAnim}]}>

                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    share: {
        flex: 1,
        top: -21,
        left: 0,
        zIndex: 10,
        flexDirection: 'column',
        position: 'absolute',
    },
    shareShadow: {
        top: 0,
        left: 0,
        backgroundColor: '#000',
        width: width,
        height: height,
    },
    shareContent: {
        position: 'absolute',
        backgroundColor: '#fff',
        opacity: 1,
        zIndex: 100,
        flexDirection: 'column',
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width,
        padding: 30,
        height: 120,
    },
    shareItem: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    shareFont: {
        fontSize: 14,
        color: '#9b9b9b'
    },
    button: {
        height: 36,
        backgroundColor: '#efefef',
        margin: 30,
        marginTop: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 26,
        color: '#9b9b9b'
    }
});

function mapStateToProps(state) {
    const { home } = state;
    return {
        home
    };
}

export default connect(mapStateToProps)(Share);