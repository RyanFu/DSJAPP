import types from '../constants/actions';
import { request } from '../utils/common';

export function fetchCommentsList(noteId) {
    return dispatch => {

        return request('/notes/'+ noteId + '/comments', 'get')
            .then((list) => {
                if(list.resultValues.length > 0){
                    dispatch(receiveCommentsList(list.resultValues));
                } else {
                    dispatch(receiveCommentsList([]));
                }

            }, function (error) {
                dispatch(receiveCommentsList([]));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveCommentsList([]));
                console.log('network error');
            });
    };
}
function receiveCommentsList(list) {
    return {
        type: types.RECEIVE_COMMENTS_LIST,
        list
    };
}