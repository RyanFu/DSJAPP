import types from '../constants/actions';
import { request, Token } from '../utils/common';

export function fetchDetail(noteId) {
    return dispatch => {
        Token.getToken().then((token) => {
            return request('/notes/' + noteId, 'get','',token)
                .then((ret) => {
                    if(ret.resultCode === 0 && ret.resultValues){
                        dispatch(receiveNoteDetail(ret.resultValues, noteId));
                    } else {
                        dispatch(receiveNoteDetail());
                    }

                }, function (error) {
                    dispatch(receiveNoteDetail());
                    console.log(error);
                })
                .catch(() => {
                    dispatch(receiveNoteDetail());
                    console.log('network error');
                });
        });
    };
}
function receiveNoteDetail(note, noteId) {
    return {
        type: types.RECEIVE_NOTE_DETAIL,
        note,
        noteId
    };
}