/**
 * Created by xiewang on 7/13/16.
 */

import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import Main from './pages/navigator';

import {
    NetInfo,
    Platform,
    Alert
} from 'react-native';
import { toast } from './utils/common';
import {
    isFirstTime,
    isRolledBack,
    packageVersion,
    currentVersion,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    switchVersionLater,
    markSuccess,
} from 'react-native-update';
import _updateConfig from '../update.json';
const {appKey} = _updateConfig[Platform.OS];

const store = configureStore();

class App extends React.Component {
    constructor(props) {
        super(props);
        this._checkUpdate = this._checkUpdate.bind(this);
        this._doUpdate = this._doUpdate.bind(this);
    }

    componentWillMount() {
        NetInfo.getConnectionInfo().done((connectionInfo) => {
            if(connectionInfo.type === 'none'){
                toast('网络连接不可用，请检查你的网络！');
            }
        });

        if (isFirstTime) {
            Alert.alert('提示', '这是当前版本第一次启动,是否要模拟启动失败?失败将回滚到上一版本', [
                {text: '是', onPress: ()=>{throw new Error('模拟启动失败,请重启应用')}},
                {text: '否', onPress: ()=>{markSuccess()}},
            ]);
        } else if (isRolledBack) {
            Alert.alert('提示', '刚刚更新失败了,版本被回滚.');
        }
    }

    componentWillUnmount() {
    }

    componentDidMount() {
        this._checkUpdate();
    }

    _doUpdate(info) {
        downloadUpdate(info).then(hash => {
            Alert.alert('提示', '下载完毕,是否重启应用?', [
                {text: '是', onPress: ()=>{switchVersion(hash);}},
                {text: '否',},
                {text: '下次启动时', onPress: ()=>{switchVersionLater(hash);}},
            ]);
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

    _checkUpdate() {
        checkUpdate(appKey).then(info => {
            if (info.expired) {
                Alert.alert('提示', '您的应用版本已更新,请前往应用商店下载新的版本', [
                    {text: '确定', onPress: ()=>{info.downloadUrl && Linking.openURL(info.downloadUrl)}},
                ]);
            } else if (info.upToDate) {
                Alert.alert('提示', '您的应用版本已是最新.');
            } else {
                Alert.alert('提示', '检查到新的版本'+info.name+',是否下载?\n'+ info.description, [
                    {text: '是', onPress: ()=>{this._doUpdate(info)}},
                    {text: '否',},
                ]);
            }
        }).catch(err => {
            Alert.alert('提示', '更新失败.');
        });
    };

    render() {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        );
    }
}

export default App;