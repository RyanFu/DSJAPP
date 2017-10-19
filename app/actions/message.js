import types from '../constants/actions';
import { request } from '../utils/common';
import { AsyncStorage } from 'react-native';

export function fetchMessageNum(params) {
    return dispatch => {

        return request('user/notifications/summary', 'get','',params.token)
            .then((ret) => {
                if(ret.resultCode === 0 && ret.resultValues){
                    dispatch(receiveMessageNum(ret.resultValues));
                } else {
                    dispatch(receiveMessageNum({}));
                }

            }, function (error) {
                dispatch(receiveMessageNum({}));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveMessageNum({}));
                console.log('network error');
            });
    };
}

export function fetchMessageList(params) {
    return dispatch => {
        return request('/user/notifications/'+params.type, 'get','',params.token)
            .then((list) => {
                if(list.resultValues.length > 0){
                    dispatch(receiveMessageList(list.resultValues));
                } else {
                    dispatch(receiveMessageList([]));
                }

            }, function (error) {
                dispatch(receiveMessageList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveMessageList([]));
                console.log('network error');
            });
    };
}

export function markAsRead(params) {
    return dispatch => {
        return request('/notifications/'+params.type+'/'+params.id, 'post','',params.token)
            .then((res) => {
                if(res.resultCode == 0){
                    return dispatch(markAsReadR(params.id));
                } else {
                    return Promise.resolve(false);
                }

            }, function (error) {
                return Promise.resolve(false);
                console.log(error);
            })
            .catch(() => {
                return Promise.resolve(false);
                console.log('network error');
            });
    };
}


function receiveMessageNum(nums) {
    return {
        type: types.FETCH_MESSAGE_NUM,
        nums
    };
}

function receiveMessageList(list) {
    return {
        type: types.FETCH_MESSAGE_LIST,
        list
    };
}

function markAsReadR(id) {
    return {
        type: types.MAKE_MESSAGE_AS_READ,
        id
    };
}
