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
    Navigator
} from 'react-native';
import styles from './bindingStyle';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { Token, toast, request } from '../../utils/common';
import { connect } from 'react-redux';
import SendCodePage from './sendCode';

class Binding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: ''
        };
    }

    _submit() {
        let the = this;
        if(!this.state.phone){
            toast('请填写正确的手机号码');
            return false;
        }
        
        let body = {
            phone: this.state.phone
        };
        body = JSON.stringify(body);
        request('/message/verification-code', 'POST', body)
            .then((res) => {
                if (res.resultCode === 0) {
                    the._jumpToCodePage();
                    toast('验证码已发送');
                } else {
                    toast('发送验证码失败，请重试！');
                }
            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _jumpToCodePage(){
        const {navigator, route} = this.props;
        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: SendCodePage,
                name: 'SendCodePage',
                sceneConfigs: Navigator.SceneConfigs.FloatFromLeft,
                phone: this.state.phone,
                bindMsg: route.bindMsg
            });
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
                        placeholder={'输入您已注册 或 常用的手机号'}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        onChangeText={(text) => {this.state.phone=text }}
                        />
                </View>
                <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                    <Text style={styles.buttonFont}>确认</Text>
                </TouchableOpacity>
            </View>
        )

    }
}



export default Binding;