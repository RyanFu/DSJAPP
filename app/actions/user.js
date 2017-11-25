import types from '../constants/actions';
import { request } from '../utils/common';
import StorageKeys from '../constants/StorageKeys';
import { AsyncStorage } from 'react-native';
export function fetchUserInfo(params) {
    // my info
    if (!params.userId) {
        return request('/user/profile', 'get', '', params.token)
            .then((list) => {
                if (list.resultCode == 0) {
                    let userInfo = list.resultValues;
                    const source = {
                        userId: userInfo.userId,
                        name: userInfo.nickname,
                        gender: userInfo.gender == 'FEMALE' ? 'women' : 'man',
                        income: userInfo.totalRevenue,
                        totalRevenue: userInfo.totalRevenue,
                        estimatedRebate: userInfo.estimatedRebate,
                        availableRebate: userInfo.availableRebate,
                        processingWithdraw: userInfo.processingWithdraw,
                        thumbUri: userInfo.portraitUrl,
                        summary: {
                            noteNum: userInfo.publishedNoteCount,
                            transNum: userInfo.transactionCount,
                            watcherNum: userInfo.watchCount,
                            fansNum: userInfo.fanCount
                        },
                        portraitHeight: userInfo.portraitHeight,
                        portraitWidth: userInfo.portraitWidth
                    };
                    AsyncStorage.removeItem(StorageKeys.ME_STORAGE_KEY);
                    return AsyncStorage.setItem(StorageKeys.ME_STORAGE_KEY, JSON.stringify(source));
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

    return dispatch => {
        return request('/users/'+params.userId+'/profile', 'get', '', params.token)
            .then((list) => {
                if (list.resultCode == 0) {
                    dispatch(receiveInfo(list.resultValues));
                } else {
                    dispatch(receiveInfo({}));
                }

            }, function (error) {
                dispatch(receiveInfo({}));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveInfo({}));
                console.log('network error');
            });
    };
}

export function fetchUserNotes(params) {
    const timestamp = (new Date()).getTime();
    const pageSize = 10000;
    const loadedSize = 0;
    return dispatch => {
        return request('/'+ (params.userId ? ('users/' + params.userId) : 'user') +'/notes?' +
            'timestamp=' + timestamp
            + '&pageSize=' + pageSize
            //+ (params.userId ? ('&userId=' + params.userId) : '')
            + '&loadedSize=' + loadedSize, 'get', '', params.token)
        //return request('/users/'+ params.userId +'/notes', 'get', '', params.token)
            .then((list) => {
                if (list.resultCode == 0) {
                    if (params.userId) {
                        dispatch(receiveNotes(list.resultValues));
                    } else {
                        dispatch(receiveMyNotes(list.resultValues));
                    }
                } else {
                    dispatch(receiveNotes([]));
                }

            }, function (error) {
                dispatch(receiveNotes([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveNotes([]));
                console.log('network error');
            });
    };
}

function receiveInfo(info) {
    return {
        type: types.RECEIVE_USER_INFO,
        info
    };
}

function receiveNotes(list) {
    return {
        type: types.RECEIVE_USER_NOTES,
        list
    };
}

function receiveMyNotes(list) {
    return {
        type: types.RECEIVE_MY_NOTES,
        list
    };
}