import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Alert,
    Platform,
    Linking
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import SecurityPage from './security';
import ProfilePage from './profile';
import AboutUsPage from './aboutUs';
import {request, Token, toast, removeAllStorage, isIphoneX} from '../../utils/common';
import Home from '../home';
import About from '../about';
import configs from '../../constants/configs';

//import * as CacheManager from 'react-native-http-cache';

var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class SettingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    _onPressSecurity() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'SecurityPage',
                component: SecurityPage
            })
        }
    }

    _onPressAboutUs() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'About',
                component: About
            })
        }
    }

    _signOut() {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                return request('user/logout', 'post', '', token)
                    .then((ret) => {
                        if(ret.resultCode === 0){
                            removeAllStorage();
                            toast('登出成功');
                            navigator.resetTo({
                                component: Home,
                                name: 'Home'
                            });

                        } else {
                            Alert.alert('登出失败', "登出失败");
                        }
                    }, function (error) {
                        console.log(error);
                        Alert.alert('登出失败', "出错：" + error);
                    })
                    .catch(() => {
                        Alert.alert('登出失败', "网络连接失败：" + error);
                    });
            } else {
                console.log('signed out');
            }
        });

    }

    _onPressSignOut() {
        Alert.alert(
            '登出',
            '确定要退出登录吗？',
            [
                {text: '取消', onPress: () => console.log('still sign in')},
                {text: '确定', onPress: () => this._signOut()}
            ]
        )
    }

    _clearCache() {
        Alert.alert(
            '',
            '确定要清除缓存吗？',
            [
                {text: '取消', onPress: () => console.log('still sign in')},
                {text: '确定', onPress: () =>{
                        //fake clear
                        setTimeout(()=>{
                            toast('清除成功')
                        },2000)

                    }
                    //CacheManager.clearCache()
                    //    .then(()=>{
                    //        toast('清除成功');
                    // })
                },
            ]
        )
    }

    _onProfilePress() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'ProfilePage',
                component: ProfilePage
            })
        }
    }

    _checkVersion() {
        toast('当前已是最新版本');
    }

    _gotoMarket() {
        const url = configs.appStoreLink + "?action=write-review";
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('无法打开该URI: ' + url);
            }
        })
    }

    render() {
        return(
            <View style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <Toolbar
                    title="设置"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />

                <View style={[styles.separatorHorizontal,{marginTop: 10}]} />
                <TouchableHighlight onPress={this._onProfilePress.bind(this)} >
                    <View style={styles.row}>
                        <Text style={styles.text}>个人资料</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal} />

                <TouchableHighlight onPress={this._onPressSecurity.bind(this)}>
                    <View style={styles.row}>
                        <Text style={styles.text}>账号绑定</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal} />

                <TouchableHighlight onPress={this._onPressAboutUs.bind(this)}>
                    <View style={styles.row}>
                        <Text style={styles.text}>关于剁手记</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal} />

                <TouchableHighlight onPress={this._gotoMarket.bind(this)}>
                    <View style={styles.row}>
                        <Text style={styles.text}>鼓励一下</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal} />

                <TouchableHighlight onPress={this._clearCache.bind(this)}>
                    <View style={styles.row}>
                        <Text style={styles.text}>清除缓存</Text>
                        {chevronRightIcon}
                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal} />

                {
                    Platform.OS === 'android'?
                        <View>
                            <TouchableHighlight onPress={this._checkVersion.bind(this)}>
                                <View style={styles.row}>
                                    <Text style={styles.text}>检查新版本</Text>
                                    {chevronRightIcon}
                                </View>
                            </TouchableHighlight>
                            <View style={styles.separatorHorizontal} />
                        </View> :null
                }


                <TouchableHighlight style={styles.logout}  onPress={this._onPressSignOut.bind(this)}>
                    <View>
                        <Text style={[styles.logoutText]}>登出</Text>
                    </View>
                </TouchableHighlight>

            </View>
        )
    }
}

export default SettingPage;