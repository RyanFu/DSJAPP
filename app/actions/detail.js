import types from '../constants/actions';
import { request } from '../utils/common';

export function fetchDetail(noteId) {
    return dispatch => {

        return request('/notes/' + noteId, 'get')
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
    };
}
function receiveNoteDetail(note, noteId) {
    return {
        type: types.RECEIVE_NOTE_DETAIL,
        note,
        noteId
    };
}