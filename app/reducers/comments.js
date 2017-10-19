
import types from '../constants/actions';

const initialState = {
    commentsList: [],
};


const comments = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_COMMENTS_LIST:
            return Object.assign({}, state, {
                commentsList: action.list
            });
        default:
            return state;
    }
};

export default comments;
