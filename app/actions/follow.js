import types from '../constants/actions';
import { request } from '../utils/common';

export function fetchFollowingList(userId, token) {
    return dispatch => {

        return request('/users/'+ userId + '/followings', 'get','',  token)
            .then((list) => {
                if(list.resultValues.length > 0){
                    dispatch(receiveFollowingList(list.resultValues));
                } else {
                    dispatch(receiveFollowingList([]));
                }

            }, function (error) {
                dispatch(receiveFollowingList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveFollowingList([]));
                console.log('network error');
            });
    };
}

export function fetchFollowerList(userId, token) {
    return dispatch => {

        return request('/users/'+ userId + '/followers', 'get', '', token)
            .then((list) => {
                if(list.resultValues.length > 0){
                    dispatch(receiveFollowerList(list.resultValues));
                } else {
                    dispatch(receiveFollowerList([]));
                }

            }, function (error) {
                dispatch(receiveFollowerList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveFollowerList([]));
                console.log('network error');
            });
    };
}

function receiveFollowingList(list) {
    return {
        type: types.RECEIVE_FOLLOWING_LIST,
        list
    };
}

function receiveFollowerList(list) {
    return {
        type: types.RECEIVE_FOLLOWER_LIST,
        list
    };
}