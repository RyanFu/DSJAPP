import types from '../constants/actions';
import { request } from '../utils/common';
import { AsyncStorage } from 'react-native';

export function addRecentView(info) {
    return dispatch => {

        return dispatch(addRecentViewR(info));

    };
}

export function fetchRecentView() {
    return dispatch => {

        return getRecentView()
            .then((res)=> {
                dispatch(fetchRecentViewR(res ? JSON.parse(res) : []));
            });
    };
}

export function fetchRecentBuy(params) {
    return dispatch => {
        return request('user/orderitems', 'get','',params.token)
            .then((ret) => {
                if(ret.resultCode === 0 && ret.resultValues){
                    dispatch(fetchRecentBuyR(ret.resultValues));
                } else {
                    dispatch(fetchRecentBuyR([]));
                }

            }, function (error) {
                dispatch(fetchRecentBuyR([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(fetchRecentBuyR([]));
                console.log('network error');
            });
    };
}

function addRecentViewR(info) {
    return {
        type: types.ADD_RECENT_VIEW,
        info
    };
}

function fetchRecentViewR(info) {
    return {
        type: types.FETCH_RECENT_VIEW,
        info
    };
}

function fetchRecentBuyR(info) {
    return {
        type: types.FETCH_RECENT_BUY,
        info
    };
}

let getRecentView = async function () {
    let view = null;
    try {
        view = await AsyncStorage.getItem('recent_view', (error, result) => {
            if (error) {
                console.error(error);
            }
        });

        if (view == null) {
            return null;
        }
    } catch (error) {
        console.log(error.message);
    }

    return view;
};