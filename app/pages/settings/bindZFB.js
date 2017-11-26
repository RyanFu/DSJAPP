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
import { Token, toast, request } from '../../utils/common';
import { connect } from 'react-redux';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import StorageKeys from '../../constants/StorageKeys';
const Navigator = deprecatedComponents.Navigator;

class BindZFB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            availableRebate: 0,
            cash: '0'
        };
    }

    componentDidMount() {
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail) => {
            if (meDetail !== null) {
                const me =  JSON.parse(meDetail);
                this.setState({availableRebate: me.availableRebate?me.availableRebate:0});
            }
        });
    }

    _submit() {
    }

    _changeCash(num) {
        if(num > this.state.availableRebate)
            this.setState({cash: this.state.availableRebate.toString()});
        else
            this.setState({cash: num});
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="绑定支付宝"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <View style={styles.totalCash}>
                    <Text style={styles.baseText}>用于提现的支付宝账户:</Text>
                </View>
                <View style={styles.input}>
                    <Text>收款方式</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.cash}
                        onChangeText={(num) => this._changeCash(num) }
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.input}>
                    <Text>收款账户</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.cash}
                        onChangeText={(num) => this._changeCash(num) }
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.input}>
                    <Text>收款人</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.cash}
                        onChangeText={(num) => this._changeCash(num) }
                        keyboardType='numeric'
                    />
                </View>
                <View style={styles.input}>
                    <Text>手机验证码</Text>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.cash}
                        onChangeText={(num) => this._changeCash(num) }
                        keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                    <Text style={styles.buttonFont}>确定</Text>
                </TouchableOpacity>
            </View>
        )

    }
}

export default BindZFB;