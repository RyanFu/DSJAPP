'use strict';

import {
    AsyncStorage,
    InteractionManager,
    ToastAndroid,
    Platform,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';
import StorageKeys from '../constants/StorageKeys';
import configs from '../constants/configs';
import LoginPage from '../pages/login/LoginPage';
import Toast from 'react-native-root-toast';
import _ from 'lodash';
import deprecatedComponents from 'react-native-deprecated-custom-components';

export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}

export function naviGoBack(navigator) {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
};

export class Token {
};

Token.getToken = async function (navigator) {
    var token = null;
    try {
        token = await AsyncStorage.getItem(StorageKeys.TOKEN_STORAGE_KEY, (error, result) => {
            if (error) {
                console.error("Error happened when to get token: " + error);
            }
        });

        if (token == null) {
            if (navigator) {
                navigator.push({
                    component: LoginPage,
                    name: 'LoginPage',
                    sceneConfigs: deprecatedComponents.Navigator.SceneConfigs.FloatFromBottom
                });
            }
            return null;
        }
    } catch (error) {
        console.log('Failed to get token from server, AsyncStorage error: ' + error.message);
    }

    return token;
};

Token.setToken = function (token) {
    if (token) {
        try {
            AsyncStorage.setItem(StorageKeys.TOKEN_STORAGE_KEY, token);
        } catch (error) {
            console.error('Failed to store token, AsyncStorage error: ' + error.message);
        }
    }
};

Token.removeToken = function (token) {
    if (token) {
        try {
            AsyncStorage.removeItem(StorageKeys.TOKEN_STORAGE_KEY);
        } catch (error) {
            console.error('Failed to remove token, AsyncStorage error: ' + error.message);
        }
    }
};

Token.isTokenValid = async function () {
    let token = await Token.getToken();
    if (token) {
        await fetch(configs.serviceUrl + 'login/authenticate/token', {
            method: 'POST',
            headers: {
                'X-App-Token': token
            }
        }).then(response => {
            console.log(response);
            if (response.ok) {
                return response.json();
            }
        }).then((responseJson) => {
            if (responseJson && responseJson.resultCode == 0) {
                if (responseJson.resultValues && responseJson.resultValues.loginSuccess) {
                    AsyncStorage.setItem(TOKEN_STORAGE_KEY, responseJson.token);
                    return true;
                }
            }
        }).catch((error) => {
            Alert.alert('登录失败', "网络连接失败：" + error);
        });
    }

    return false;
};

export function request(request, method, body, token) {
    let success;
    let status = 200;

    let headers;
    if (request.headers) {
        headers = request.headers;
    } else {
        headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    if(token) {
        headers['X-App-Token'] = token
    }

    let options = {method, headers: headers};

    if (method.toLowerCase() === 'post') {
        options.body = body;
    }

    return new Promise((resolve, reject) => {
        let uri;
        if (typeof request === 'string') {
            uri = configs.serviceUrl + request;
        } else {
            uri = (request.host ? request.host : configs.serviceUrl) + request.route
        }
        uri = encodeURI(uri);
        fetch(uri, options).then((response) => {
            if (response.status == 200) {
                success = true;
            } else {
                success = false;
            }

            const json = response.json();
            const xAppToken = response.headers.get("x-app-token");
            if (xAppToken) {
                AsyncStorage.setItem(StorageKeys.X_APP_TOKEN, xAppToken);
            }
            if (response.status == 407) {
                toast('网络连接不可用，请检查您的网络！')
            }
            if(response.status == 403 && token) {
                if (request.navigator && response.status == 403 && token) {
                    request.navigator.push({
                        component: LoginPage,
                        name: 'LoginPage',
                        sceneConfigs: deprecatedComponents.Navigator.SceneConfigs.FloatFromBottom
                    });
                } else {
                    DeviceEventEmitter.emit('sessionExpired', true);
                }
                removeAllStorage();
            }

            status = response.status;
            return json;
        }).then((responseData) => {
            responseData.status = status;
            if (success) {
                resolve(responseData);
            } else {
                reject(responseData);
            }
        }).catch((error) => {
            if (error.message.indexOf('"Network request failed"')) {
                toast('网络连接不可用，请检查您的网络！');
            }

            reject(error);
        });
    });
}

export function like(noteId, token) {
    return request('/notes/' + noteId + '/likes', 'POST', '', token)
        .then((res) => {
            if (res.resultCode === 0) {
                return true;
            } else {
                return false;
            }
        }, function (error) {
            console.log(error);
            return false;
        })
        .catch(() => {
            console.log('network error');
            return false;
        });
}

export function follow(userId, token) {
    let body = {
        followeeId: userId
    };
    body = JSON.stringify(body);
    return request('/user/follows', 'POST', body, token)
        .then((res) => {
            if (res.resultCode === 0) {
                return true;
            } else {
                return false;
            }
        }, function (error) {
            console.log(error);
            return false;
        })
        .catch(() => {
            console.log('network error');
            return false;
        });
}

export function toast(message) {
    if (Platform.OS === 'ios') {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
            },
            onShown: () => {
                // calls on toast\`s appear animation end.
            },
            onHide: () => {
                // calls on toast\`s hide animation start.
            },
            onHidden: () => {
                // calls on toast\`s hide animation end.
            }
        });

    } else {
        ToastAndroid.show(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
}

export function timeFormat(time, parrent) {
    const data = new Date(time);
    let cal = (fmt) => {
        let o = {
            "M+": data.getMonth() + 1, //月份
            "d+": data.getDate(), //日
            "h+": data.getHours(), //小时
            "m+": data.getMinutes(), //分
            "s+": data.getSeconds(), //秒
            "q+": Math.floor((data.getMonth() + 3) / 3), //季度
            "S": data.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    return cal(parrent);
}

export function removeAllStorage() {
    _.each(StorageKeys, function (v, k) {
        if (k === 'SEARCH_ITEM' ||
            k === 'SEARCH_NOTE' ||
            k === 'SPLASH_SKIP' ||
            k === 'IS_FIRST_TIME') {
            return
        }
        try {
            AsyncStorage.removeItem(v);
        } catch (error) {
            console.error('Failed to remove token, AsyncStorage error: ' + error.message);
        }

    });
}

export function decimals(num, pos) {
    const pow = Math.pow(10, pos ? pos : 2);
    return Math.floor(num * pow) / pow;
}