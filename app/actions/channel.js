import types from '../constants/actions';
import { request } from '../utils/common';

export function fetchList() {
    return dispatch => {

        return request('/common/channels', 'get')
            .then((list) => {
                if(list.resultValues.length > 0){
                    dispatch(receiveChannelList(list.resultValues));
                } else {
                    dispatch(receiveChannelList([]));
                }

            }, function (error) {
                dispatch(receiveChannelList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveChannelList([]));
                console.log('network error');
            });
    };
}
function receiveChannelList(list) {
    return {
        type: types.RECEIVE_CHANNEL_LIST,
        list
    };
}