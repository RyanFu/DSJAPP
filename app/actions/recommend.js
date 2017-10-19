import types from '../constants/actions';
import { request } from '../utils/common';

export function fetchRecommendList(noteId) {
    return dispatch => {

        return request('/notes/' + noteId + '/recommendations', 'get')
            .then((list) => {
                if (list.resultValues.length > 0) {
                    dispatch(receiveRecommendList(list.resultValues));
                } else {
                    dispatch(receiveRecommendList([]));
                }

            }, function (error) {
                dispatch(receiveRecommendList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveRecommendList([]));
                console.log('network error');
            });
    };
}
function receiveRecommendList(list) {
    return {
        type: types.RECEIVE_RECOMMEND_LIST,
        list
    };
}