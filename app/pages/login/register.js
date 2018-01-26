'use strict';
import React, { Component } from 'react';
import {
    Alert,
    Flex,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    Modal,
    NavigatorIOS,
    Picker,
    Platform,
    ActivityIndicatorIOS,
    InteractionManager,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import Home from '../home';
import {
    Token,
    toast,
    request, isIphoneX
} from '../../utils/common';
import Button from '../../../app/components/button/Button';
import PhoneCodeButton from '../../../app/components/button/PhoneCodeButton';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import LoginPage from './LoginPage';
import configs from '../../constants/configs';
import StorageKeys from '../../constants/StorageKeys';
import {fetchUserInfo} from '../../actions/user';

const myIcon = (<Icon name="rocket" size={30} color="#900" />)

export default class ForgetPasswordPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: true,
            sending: false,
            sendSuccess: false
        };
    }

    _onPasswordLoginLink() {
        const { navigator } = this.props;

        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }
    }
    _sendCode() {
        if (this.state.sending) return false;

        if(!this.state.phone){
            toast('请填写正确的手机号码');
            return false;
        }

        this.setState({sending: true});

        let  body = JSON.stringify({
            purpose: 'login',
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

        const { navigator, HomeNavigator } = this.props;
        let {phone, code} = this.state;

        this.state.sending = true;

        fetch(configs.serviceUrl + 'user/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginMethod: 'VERIFICATION_CODE',
                secret: code,
                mobileNumber: phone
            })
        }).then((response) => {
            this.state.sending = false;
            if (response.ok) {
                return response.headers.map['x-app-token'];
            }
        }).then((responseJson) => {
            console.log(responseJson);
            if (responseJson && responseJson.length > 0) {
                InteractionManager.runAfterInteractions(() => {
                    setTimeout(function(){
                        navigator.jumpTo(navigator.getCurrentRoutes()[0]);
                    }, 1000);

                });
                toast('注册成功');
                Token.setToken(responseJson[0]);
                this._fetchMyInfo(responseJson[0]);
                DeviceEventEmitter.emit('newBuy', true);
                return true;
            } else {
                Alert.alert('注册失败', "注册失败，账号可能已经存在，请更换号码或稍后再试！");
            }


        }).catch((error) => {
            this.setState({sending: false});
            Alert.alert('注册失败', "网络连接失败：" + error);
        });
    }

    validate() {
        if (!this.state.phone || this.state.phone.length < 11) {
            this.setState({validForm:false});
            return;
        }

        if (!this.state.code || this.state.code.length < 6) {
            this.setState({validForm:false});
            return;
        }

        this.setState({validForm:true});
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
            <View style={[styles.container, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>

                <View style={styles.navigator}>
                    <Icon.Button name="angle-left" size={32} color="#4a4a4a" backgroundColor="transparent" onPress={this._onPasswordLoginLink.bind(this)}>
                        <Text style={{fontSize:24, color:'#4a4a4a'}}>返回登录</Text>
                    </Icon.Button>
                </View>

                <View style={[styles.fieldContainer,{marginTop:60}, this.state.focus == 'phone' ? styles.activeFieldContainer : {}]}>
                    <TextInput placeholder="请输入手机号码" maxLength={13}
                               clearButtonMode='while-editing' underlineColorAndroid='transparent'
                               style={[styles.textInput, Platform.OS === 'android' ? null : {height: 26}]}
                               onChangeText={(text) => {this.state.phone=text, this.validate()}}
                               value={this.state.text} autoFocus={true} keyboardType="numeric"
                               onFocus={(e) => {this.setState({focus:'phone'})}}/>
                    <Text style={{fontSize:20,color:'#696969',lineHeight:23,fontFamily:'ArialMT'}}>+86</Text>
                </View>

                <View style={[styles.fieldContainer,{marginTop:20}, this.state.focus == 'code' ? styles.activeFieldContainer : {}]}>
                    <TextInput placeholder="请输入验证码" maxLength={6}
                               clearButtonMode='while-editing' underlineColorAndroid='transparent'
                               style={[styles.textInput, Platform.OS === 'android' ? null : {height: 26}]}
                               keyboardType="numeric"
                               onChangeText={(text) => {this.state.code=text; this.validate();}}
                               value={this.state.text}
                               onFocus={(e) => this.setState({focus:'code'})}/>
                    <PhoneCodeButton onPress={this._sendCode.bind(this)} sendSuccess={this.state.sendSuccess}>发送验证码</PhoneCodeButton>
                </View>

                <View style={{marginTop:40, flexDirection:'row'}}>
                    <Button style={[styles.button, this.state.validForm ? styles.activeButton : null]} containerStyle={{flex:1}}
                            onPress={this._onPressLoginButton.bind(this)}>注册</Button>
                </View>

            </View>
        );
    }
}



var styles = StyleSheet.create({
    description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 30,
        alignItems: 'stretch'
    },
    navigator: {
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    fieldContainer: {
        borderColor: 'gray',
        borderBottomWidth: 1,
        flexDirection:'row',
        paddingVertical:3
    },
    activeFieldContainer: {
        borderColor: '#F37D30',
    },
    textInput: {
        flex:1,
        fontSize:18,
        color:'#696969',
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0
    },
    button: {
        paddingVertical:9,
        textAlignVertical: 'center', /* android */
        backgroundColor: '#DFDFDF',
        borderRadius:2,
        fontSize:18,
        color:'#fff',
        fontFamily:'STHeitiSC-Medium',
        alignItems:'center',
        justifyContent:"center"
    },
    activeButton: {
        backgroundColor: '#F37D30',
    }
});
