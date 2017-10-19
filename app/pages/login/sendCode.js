import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    DeviceEventEmitter,
    Platform,
    InteractionManager,
    navigator,
    AsyncStorage
} from 'react-native';
import styles from './bindingStyle';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { Token, toast, request } from '../../utils/common';
import { connect } from 'react-redux';
import PhoneCodeButton from '../../../app/components/button/PhoneCodeButton';
import StorageKeys from '../../constants/StorageKeys';
import {fetchUserInfo} from '../../actions/user';

class SendCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: this.props.route.phone,
            secret: '',
            loginChannel: this.props.route.loginChannel,
            loginChannelUserId: this.props.route.loginChannelUserId,
            sending: true
        };
    }

    _submit() {
        const {navigator, route} = this.props;
        let body = {
            secret: this.state.secret,
            mobileNumber: this.state.phone,
            loginChannel: route.bindMsg.loginChannel,
            loginChannelUserId: route.bindMsg.loginChannelUserId
        };
        body = JSON.stringify(body);
        request('user/login', 'POST', body)
            .then((res) => {
                if (res.resultCode === 0) {
                    InteractionManager.runAfterInteractions(() => {
                        setTimeout(function(){
                            navigator.jumpTo(navigator.getCurrentRoutes()[0]);
                        }, 500);
                    });
                    AsyncStorage.getItem(StorageKeys.X_APP_TOKEN, (error, result) => {
                        toast('绑定成功');
                        Token.setToken(result);
                        this._fetchMyInfo(result);
                    });
                }
                toast('绑定失败');
            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _sendCode() {
        if (this.state.sending) return;
        this.state.sending = true;

        let body = {
            mobile: this.state.phone
        };
        body = JSON.stringify(body);
        request('message/verification-code', 'POST', body)
            .then((res) => {
                this.state.sending = false;
                if (res.resultCode === 0) {
                    toast('验证码已发送');
                    Token.setToken(responseJson.token);
                }
                toast('验证码发送失败');
            }, function (error) {
                this.state.sending = false;
                toast('验证码发送失败');
                console.log(error);
            })
            .catch(() => {
                this.state.sending = false;
                toast('验证码发送失败');
                console.log('network error');
            });
    }

    componentDidMount() {
        this.codeBtn.codeBtn.props.onPress();
        this.state.sending = false;
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
                <Toolbar
                    title="账号绑定"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />
                <View style={styles.phone}>
                    <TextInput
                        style={[styles.phoneText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholder={'验证码'}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        onChangeText={(text) => {this.state.secret=text }}
                        />
                    <View style={{marginRight: 8}}>
                        <PhoneCodeButton ref={(component) => this.codeBtn = component}
                            onPress={this._sendCode.bind(this)}>再次发送</PhoneCodeButton>
                    </View>
                </View>
                <View style={styles.bindPhone}>
                    <Text style={styles.baseText}>即将绑定手机：{this.state.phone}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                    <Text style={styles.buttonFont}>完成绑定并登录</Text>
                </TouchableOpacity>
            </View>
        )

    }
}



export default SendCode;