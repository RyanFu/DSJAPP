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
    AsyncStorage
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import { Token, toast, request, naviGoBack } from '../../utils/common';
import { connect } from 'react-redux';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import StorageKeys from '../../constants/StorageKeys';
import BindZFBPage from '../settings/bindZFB';
const Navigator = deprecatedComponents.Navigator;
import _ from 'lodash';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this._submit = this._submit.bind(this);
        this._withDraw = this._withDraw.bind(this);
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
                this.setState({cash: me.availableRebate.toString()});
            }
        });
    }

    _submit() {
        const {navigator } = this.props;
        const bind = ()=>{
            Alert.alert(
                '支付宝绑定',
                '你还未绑定支付宝账号，绑定后才能提现',
                [
                    {text: '不需要', onPress: () => console.log('not bind')},
                    {text: '绑定', onPress: () =>{
                        this._jumpToBindPage();
                    }
                    }
                ]
            );
        };
        Token.getToken(navigator).then((token) => {
                if (token) {
                    request('user/bindings', 'get', '', token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                _.each(res.resultValues, (v, k)=> {
                                    if (v.bindingChannel === 'ALIPAY') {
                                        this._withDraw();
                                        return;
                                    }
                                });
                            } else {
                                bind();
                            }

                        }, function (error) {
                            console.log(error);
                            bind(false);
                        })
                        .catch(() => {
                            console.log('network error');
                            bind(false);
                        });
                }
            }
        );
    }

    _withDraw() {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    request('/user/withdraw-deposit', 'POST', '', token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast('提现成功');
                                naviGoBack(navigator);
                            } else {
                                toast('提现失败，请核对支付宝账户信息后再尝试。');
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

    _changeCash(num) {
        if(num > this.state.availableRebate)
            this.setState({cash: this.state.availableRebate.toString()});
        else
            this.setState({cash: num});
    }

    _jumpToBindPage() {
        const {navigator} = this.props;
        navigator.push({
            component: BindZFBPage,
            name: 'BindZFBPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight
        });
    }

    render() {
        return (
            <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="提现"
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <View style={styles.totalCash}>
                    <Text style={styles.baseText}>可提金额:</Text>
                    <Text style={styles.baseText}> ￥{this.state.availableRebate}</Text>
                </View>
                <View style={styles.input}>
                    <TextInput
                        style={[styles.inputText, Platform.OS === 'android' ? null : {height: 26}]}
                        placeholderTextColor='#bebebe'
                        underlineColorAndroid='transparent'
                        returnKeyType='done'
                        value={this.state.cash}
                        onChangeText={(num) => this._changeCash(num) }
                        keyboardType='numeric'
                        editable={false}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                    <Text style={styles.buttonFont}>提现</Text>
                </TouchableOpacity>
                <View style={styles.tip}>
                    <Icon style={[styles.tipIcon]} size={12} name="exclamation-circle"/>
                    <Text style={[styles.tipFont, styles.dimText]}>提示：目前系统只支持一次性提取</Text>
                </View>
            </View>
        )

    }
}



export default Withdraw;