
import types from '../constants/actions';

const initialState = {
    channelList: [],
};


const channel = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_CHANNEL_LIST:
            return Object.assign({}, state, {
                channelList: action.list
            });
        default:
            return state;
    }
};

export default channel;
