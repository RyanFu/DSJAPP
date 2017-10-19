
import types from '../constants/actions';

const initialState = {
    note: {},
};


const detail = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_NOTE_DETAIL:
            return Object.assign({}, state, {
                note:  load(state, action)
            });
        default:
            return state;
    }
};

function load(state, action) {
    if(!state.note[action.noteId]){
        state.note[action.noteId] = action.note;
    }
    return state.note;
}
export default detail;
