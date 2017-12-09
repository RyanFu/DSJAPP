import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    AsyncStorage
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import { Token, toast, request, naviGoBack } from '../../utils/common';
import { connect } from 'react-redux';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import StorageKeys from '../../constants/StorageKeys';
import PhoneCodeButton from '../../../app/components/button/PhoneCodeButton';
const Navigator = deprecatedComponents.Navigator;
import configs from '../../constants/configs';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';

class BindZFB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableRebate: 0,
            account: null,
            name: null,
            code: null,
            sending: false,
            userId: '17321057664'
        };
    }

    componentDidMount() {
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY,(err,result)=>{
            if(!err){
                result = JSON.parse(result);
                this.setState({userId: result.userId});
            }
        });
    }

    _submit() {
        const { navigator } = this.props;
        if(!this.state.account){
            toast('请输入您的淘宝账户');
            return;
        }
        if(!this.state.name){
            toast('请输入您的姓名');
            return;
        }
        if(!this.state.code){
            toast('请输入验证吗');
            return;
        }

        let body = {
            account: this.state.account,
            realName: this.state.name,
            veryCode: this.state.code
        };
        body = JSON.stringify(body);
        Token.getToken(navigator).then((token) => {
                if (token) {
                    request('user/bindings/alipay/', 'POST', body, token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast('绑定成功');
                                naviGoBack(navigator);
                            } else if(res.resultCode === 1) {
                                if(res.resultErrorMessage == 'Verification code is invalid.')
                                    toast('验证码不正确');
                                else
                                    toast(res.resultErrorMessage);
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

    _validate() {
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

    _sendCode() {
        if (this.state.sending) return false;

        this.state.sending = true;

        fetch(configs.serviceUrl + 'message/verification-code', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purpose: 'bind',
                mobile: this.state.userId
            })
        }).then((response) => {
            this.state.sending = false;
            if (response.ok) {
                return response.json();
            }
            throw new Error('网络响应不正常');
        }).then((responseJson) => {
            if (responseJson.resultCode == 0) {
                toast('验证码已发送');
                return responseJson.resultCode;
            }
            throw new Error('验证码发送失败');
        }).catch((error) => {
            toast(error.message);
        });
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="绑定支付宝"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <View style={styles.title}>
                    <Text style={styles.baseText}>用于提现的支付宝账户</Text>
                </View>
                <View style={styles.input}>
                    <Text style={[styles.baseText,styles.inputLabel]}>收款方式</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 38}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        value={'支付宝'}
                        keyboardType='default'
                        editable={false}
                    />
                </View>
                <View style={styles.input}>
                    <Text style={[styles.baseText,styles.inputLabel]}>收款账户</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 38}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        value={this.state.account}
                        onChangeText={(text) => {this.setState({account: text})}}
                        keyboardType='default'
                        placeholder='请输入支付宝账户'
                    />
                </View>
                <View style={styles.input}>
                    <Text style={[styles.baseText,styles.inputLabel]}>收款人</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 38}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='next'
                        value={this.state.name}
                        onChangeText={(text) => {this.setState({name: text})}}
                        keyboardType='default'
                        placeholder='请输入真实姓名'
                    />
                </View>
                <View style={styles.input}>
                    <Text style={[styles.baseText,styles.inputLabel]}>手机验证码</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 38}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.code}
                        onChangeText={(text) => {this.setState({code: text}); this._validate();}}
                        keyboardType='numeric'
                        placeholder='请输入验证码'
                        maxLength={6}
                    />
                    <View style={styles.code}>
                        <PhoneCodeButton  onPress={this._sendCode.bind(this)} >发送验证码</PhoneCodeButton>
                    </View>
                </View>
                <View style={styles.submit}>
                    <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                        <Text style={styles.buttonFont}>绑定</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.tip}>
                    <Icon style={[styles.tipIcon]} size={12} name="exclamation-circle"/>
                    <Text style={[styles.tipFont, styles.dimText]}>提示：请填写正确的支付宝账户和真实的首款人姓名，否则将无法正常收款。</Text>
                </View>

            </View>
        )

    }
}

export default BindZFB;