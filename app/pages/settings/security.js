/**
 * Created by lyan2 on 16/9/23.
 */
import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    Alert,
    AsyncStorage,
    InteractionManager
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import { Token, toast, request } from '../../utils/common';
import _ from 'lodash';
import * as WechatAPI from 'react-native-wx';
import { connect } from 'react-redux';
import StorageKeys from '../../constants/StorageKeys';
import BindZFBPage from './bindZFB';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class SecurityPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'WEIXIN': {},
            'WEIBO': {},
            'QQ': {},
            'TAOBAO': {},
            'ALIPAY': {},
            userId: 13585979772
        }
    }

    componentWillMount() {
        const {navigator } = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    request('user/bindings', 'get', '', token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                _.each(res.resultValues, (v, k)=> {
                                    if (v.bindingChannel === 'WEIXIN') {
                                        this.setState({'WEIXIN': Object.assign({}, v, {
                                            isBound: true
                                        })});
                                    }
                                    if (v.bindingChannel === 'WEIBO') {
                                        this.setState({'WEIBO': Object.assign({}, v, {
                                            isBound: true
                                        })});
                                    }
                                    if (v.bindingChannel === 'QQ') {
                                        this.setState({'QQ': Object.assign({}, v, {
                                            isBound: true
                                        })});
                                    }
                                    if (v.bindingChannel === 'TAOBAO') {
                                        this.setState({'TAOBAO': Object.assign({}, v, {
                                            isBound: true
                                        })});
                                    }
                                    if (v.bindingChannel === 'ALIPAY') {
                                        this.setState({'ALIPAY': Object.assign({}, v, {
                                            isBound: true
                                        })});
                                    }

                                });
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

    componentDidMount() {
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY,(err,result)=>{
            if(!err){
                result = JSON.parse(result);
                this.setState({userId: result.userId});

            }
        });
    }

    _unbind(channel) {
        const the = this;
        if(channel !== 'WEIXIN')
            // return false;
        if (this.state[channel].isBound) {
            Alert.alert(
                '解除绑定',
                '确定解除绑定吗？',
                [
                    {text: '取消', onPress: () => console.log('still bind')},
                    {
                        text: '确定', onPress: () => {
                        const {navigator } = this.props;
                        let url = 'user/unbind/' + channel;
                        if(channel === 'ALIPAY') {
                            url = 'user/bindings/alipay/unbind';
                        }
                        Token.getToken(navigator).then((token) => {
                                if (token) {
                                    request(url, 'post', '', token)
                                        .then((res) => {
                                            if (res.resultCode === 0) {
                                                let obj = this.state[channel];
                                                obj.isBound = false;
                                                if (channel === 'WEIXIN')
                                                    this.setState({'WEIXIN': obj});
                                                if (channel === 'WEIBO')
                                                    this.setState({'WEIBO': obj});
                                                if (channel === 'QQ')
                                                    this.setState({'QQ': obj});
                                                if (channel === 'TAOBAO')
                                                    this.setState({'TAOBAO': obj});
                                                if (channel === 'ALIPAY')
                                                    this.setState({'ALIPAY': obj});
                                                toast('成功解除绑定');
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
                    }
                ]
            );
        } else {
            if (channel === 'ALIPAY')
                this._jumpToZFBPage();
            else if (channel === 'TAOBAO')
                Alert.alert(
                    '绑定',
                    '需要绑定账号吗？',
                    [
                        {text: '取消', onPress: () => console.log('still bind')},
                        {
                            text: '确定', onPress: () => {
                            the._JumpToWeiXin();
                        }
                        }
                    ]
                );
        }

    }

    _jumpToZFBPage() {
        const {navigator} = this.props;
        navigator.push({
            component: BindZFBPage,
            name: 'BindZFBPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight
        });
    }

    _JumpToWeiXin() {
        var the = this;
        const config = {
            scope: 'snsapi_userinfo', // 默认 'snsapi_userinfo'
        };
        WechatAPI.isWXAppInstalled()
            .then((res) => {
                if (!res)
                    toast('您还未安装微信');
                else
                    return WechatAPI.login(config);
            })
            .then((res) => {
                the._bindingWeixin(res);
            })
    }

    _bindingWeixin(res) {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    let body = {
                        code: res.code
                    };
                    body = JSON.stringify(body);
                    request('/user/bindings/weixin', 'POST', body, token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast('绑定微信成功');
                                let obj = this.state['WEIXIN'];
                                obj.isBound = true;
                                this.setState({'WEIXIN': obj});
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

    render() {
        return (
            <View style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="账号与安全"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />

                <TouchableHighlight>
                    <View style={styles.row}>
                        <Text style={styles.text}>手机号</Text>
                        <Text style={styles.phoneText}>{this.state.userId}</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>

                <TouchableHighlight onPress={() => this._unbind('WEIXIN')}>
                    <View style={styles.row}>
                        <Text style={styles.text}>微信</Text>
                        <Text
                            style={[styles.baseText,styles.dimText, (this.state.WEIXIN.bindingChannel && styles.boundText) ]}>{this.state.WEIXIN.bindingChannel ? '已绑定' : '马上绑定'}</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>
                {
                    //<TouchableHighlight onPress={() => this._unbind('WEIBO')}>
                    //    <View style={styles.row}>
                    //        <Text style={styles.text}>微博</Text>
                    //        <Text
                    //            style={[styles.baseText,styles.dimText, (this.state.WEIBO.isBound && styles.boundText) ]}>{this.state.WEIBO.isBound ? '已绑定' : '马上绑定'}</Text>
                    //        {chevronRightIcon}
                    //    </View>
                    //</TouchableHighlight>
                    //<View style={styles.separatorHorizontal}/>
                    //
                    //<TouchableHighlight onPress={() => this._unbind('QQ')}>
                    //<View style={styles.row}>
                    //<Text style={styles.text}>QQ</Text>
                    //<Text
                    //style={[styles.baseText,styles.dimText, (this.state.QQ.isBound && styles.boundText) ]}>{this.state.QQ.isBound ? '已绑定' : '马上绑定'}</Text>
                    //{chevronRightIcon}
                    //</View>
                    //</TouchableHighlight>
                    //<View style={styles.separatorHorizontal}/>
                }


                <TouchableHighlight onPress={() => this._unbind('TAOBAO')}>
                    <View style={styles.row}>
                        <Text style={styles.text}>淘宝</Text>
                        <Text
                            style={[styles.baseText,styles.dimText, (this.state.TAOBAO.bindingChannel && styles.boundText) ]}>{this.state.TAOBAO.bindingChannel ? '已绑定' : '马上绑定'}</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>

                <TouchableHighlight onPress={() => this._unbind('ALIPAY')}>
                    <View style={styles.row}>
                        <Text style={styles.text}>支付宝</Text>
                        <Text
                            style={[styles.baseText,styles.dimText, (this.state.ALIPAY.bindingChannel && styles.boundText) ]}>{this.state.ALIPAY.bindingChannel ? '已绑定' : '马上绑定'}</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>

            </View>
        )
    }
}

export default SecurityPage;