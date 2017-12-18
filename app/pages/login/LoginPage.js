'use strict';
import React, { Component } from 'react';
import {
    Alert,
    Flex,
    InteractionManager,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    NavigatorIOS,
    Picker,
    Platform,
    ActivityIndicatorIOS,
    KeyboardAvoidingView,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import Home from '../home';
import Button from '../../components/button/Button';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import RegisterPage from './register';
import PhoneCodeButton from '../../../app/components/button/PhoneCodeButton';
import BindingPage from './binding';
import configs from '../../constants/configs';
import * as WechatAPI from 'react-native-wx';
import {
    Token,
    toast,
    request
} from '../../utils/common';
import StorageKeys from '../../constants/StorageKeys';
import {fetchUserInfo} from '../../actions/user';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

const myIcon = (<Icon name="rocket" size={30} color="#900"/>)

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            region: 'China',
            modalVisible: true,
            sending: false,
            sendSuccess: false
        };
    }

    _onPressForgetLink() {
        const { navigator } = this.props;
        navigator.push({
            component: RegisterPage,
            name: 'RegisterPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromLeft
        });
    }

    _onPressWeixinIcon() {
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
                if(res)
                    the._checkBinding(res);
            })
    }

    _checkBinding(res) {
        const { navigator } = this.props;
        const body = {
            code: res.code
        };
        //Alert.alert('微信登录', "code：" + res.code);
        fetch(configs.serviceUrl + 'login/weixin', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            this.setState({sending: false});
            if (response.ok) {
                const xAppToken = response.headers.get("x-app-token");
                if(xAppToken) {
                    AsyncStorage.setItem(StorageKeys.X_APP_TOKEN, xAppToken);
                }
                return response.json();
            }
        }).then((responseJson) => {
            if (responseJson.resultValues.loginResult === 'failed') {
                toast('微信验证失败');
                return;
            }
            if (responseJson.resultValues.loginResult === 'success') {
                InteractionManager.runAfterInteractions(() => {
                    setTimeout(function () {
                        navigator.jumpTo(navigator.getCurrentRoutes()[0]);
                    }, 500);
                });

                AsyncStorage.getItem(StorageKeys.X_APP_TOKEN, (error, result) => {
                    toast('微信登录成功');
                    Token.setToken(result);
                    this._fetchMyInfo(result);
                });
            } else {
                navigator.push({
                    component: BindingPage,
                    name: 'BindingPage',
                    sceneConfigs: Navigator.SceneConfigs.FloatFromLeft,
                    bindMsg: responseJson.resultValues
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    _onPressCancel() {
        const { navigator } = this.props;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }
    }

    _sendCode() {
        if (this.state.sending)
            return;

        if (!this.state.phone) {
            toast('请填写正确的手机号码');
            return false;
        }

        this.setState({sending: true});

        let body = JSON.stringify({
            mobile: this.state.phone
        });

        request( 'message/verification-code', 'POST', body)
            .then((res) => {
                if (res.resultCode == 0) {
                    toast('验证码已发送');
                    this.setState({sendSuccess: true});
                } else {
                    toast('验证码发送失败');
                }
                this.setState({sending: false});

            }, function (error) {
                this.setState({sending: false});
                console.log(error);
            })
            .catch(() => {
                this.setState({sending: false});
                console.log('network error');
            });

    }

    _onPressLoginButton() {
        if (this.state.sending) return;

        if (!this.state.phone) {
            toast('请填写正确的手机号码');
            return false;
        }

        if (!this.state.code) {
            toast('请输入验证码');
            return false;
        }
        const { navigator, HomeNavigator } = this.props;
        let {phone, code} = this.state;

        this.setState({sending: true});

        fetch(configs.serviceUrl + 'user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: code,
                mobileNumber: phone
            })
        }).then((response) => {
            this.setState({sending: false});
            if (response.ok) {
                return response.headers.map['x-app-token'];
                //return response.json();
            }
        }).then((responseJson) => {
            console.log(responseJson);
            if (responseJson && responseJson.length > 0) {
                InteractionManager.runAfterInteractions(() => {
                    setTimeout(function () {
                        navigator.jumpTo(navigator.getCurrentRoutes()[0]);
                    }, 500);

                });
                toast('登录成功');
                Token.setToken(responseJson[0]);
                this._fetchMyInfo(responseJson[0]);
                DeviceEventEmitter.emit('newBuy', true);
                return true;
            } else {
                Alert.alert('登录失败', "验证码登录失败");
            }


        }).catch((error) => {
            this.setState({sending: false});
            Alert.alert('登录失败', "网络连接失败：" + error);
        });
    }

    validate() {
        if (!this.state.phone || this.state.phone.length < 11) {
            this.setState({validForm: false});
            return;
        }

        if (!this.state.code || this.state.code.length < 6) {
            this.setState({validForm: false});
            return;
        }

        this.setState({validForm: true});
    }

    _fetchMyInfo(token) {
        const params = {
            token: token
        };
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY,(err,result)=>{
            if(!result){
                fetchUserInfo(params);
            }
        });
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>


                <View style={styles.navigator}>
                    <Text style={{fontSize:24, flex:1, color:'#4a4a4a'}}>登录</Text>
                    <TouchableOpacity onPress={this._onPressCancel.bind(this)}>
                        <Image style={styles.close} source={require('../../assets/signin/close.png')}/>
                    </TouchableOpacity>
                </View>

                <View
                    style={[styles.fieldContainer,{marginTop:60}, this.state.focus == 'phone' ? styles.activeFieldContainer : {}]}>
                    <TextInput placeholder="请输入手机号码" maxLength={13}
                               clearButtonMode='while-editing' underlineColorAndroid='transparent'
                               style={[styles.textInput, Platform.OS === 'android' ? null : {height: 26}]}
                               onChangeText={(text) => {this.state.phone=text, this.validate()}}
                               value={this.state.text}  keyboardType="numeric"
                               onFocus={(e) => {this.setState({focus:'phone'})}}/>
                    <Text style={{fontSize:20,color:'#696969',lineHeight:23,fontFamily:'ArialMT'}}>+86</Text>
                </View>

                <View
                    style={[styles.fieldContainer,{marginTop:20}, this.state.focus == 'code' ? styles.activeFieldContainer : {}]}>
                    <TextInput placeholder="请输入验证码" maxLength={6}
                               clearButtonMode='while-editing' underlineColorAndroid='transparent'
                               style={[styles.textInput, Platform.OS === 'android' ? null : {height: 26}]}
                               keyboardType="numeric"
                               onChangeText={(text) => {this.state.code=text; this.validate();}}
                               value={this.state.text}
                               blurOnSubmit={true}
                               onFocus={(e) => this.setState({focus:'code'})}/>
                    <PhoneCodeButton onPress={this._sendCode.bind(this)} sendSuccess={this.state.sendSuccess}>发送验证码</PhoneCodeButton>
                </View>

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <TouchableHighlight>
                        <Text style={{ fontSize: 14, padding:3, color:'#888',lineHeight:23,fontFamily:'ArialMT'}}
                              onPress={this._onPressForgetLink.bind(this)}>快速注册</Text>
                    </TouchableHighlight>
                </View>

                <View style={{marginTop:40, flexDirection:'row'}}>
                    <Button style={[styles.button, this.state.validForm ? styles.activeButton : null]}
                            containerStyle={{flex:1, justifyContent: 'center', backgroundColor:'red'}}
                            onPress={this._onPressLoginButton.bind(this)}>登录</Button>
                </View>

                <View style={{marginTop:60, flexDirection:'row'}}>
                    <View
                        style={{borderBottomColor:'#989898', borderBottomWidth:1, flex:1, height:8, marginRight:5}}></View>
                    <Text style={{color:'#989898'}}>或合作账号登录</Text>
                    <View
                        style={{borderBottomColor:'#989898', borderBottomWidth:1, flex:1, height:8, marginLeft:5}}></View>
                </View>

                <View style={{flexDirection:'row', justifyContent:'center', marginTop:20}}>
                    <Icon.Button name="weixin" onPress={this._onPressWeixinIcon.bind(this)} size={26} color="#21b384"
                                 backgroundColor="transparent" borderRadius={24} iconStyle={{marginRight:0}}
                                 style={{borderWidth:1, borderColor:'#ccc',height:48, width:48}}/>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'stretch'
    },
    navigator: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fieldContainer: {
        borderColor: 'gray',
        borderBottomWidth: 1,
        paddingVertical: 3,
        flexDirection: 'row'
    },
    activeFieldContainer: {
        borderColor: '#F37D30',
    },
    textInput: {
        flex: 1,
        fontSize: 18,
        color: '#696969',
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0
    },
    button: {
        paddingVertical: 9,
        backgroundColor: '#DFDFDF',
        borderRadius: 2,
        fontSize: 18,
        textAlignVertical: 'center', /* android */
        color: '#fff',
        fontFamily: 'STHeitiSC-Medium',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeButton: {
        backgroundColor: '#F37D30',
    },
    close: {}
});