
import types from '../constants/actions';

const initialState = {
    followingList: [],
    followerList: []
};


const follow = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_FOLLOWING_LIST:
            return Object.assign({}, state, {
                followingList: action.list
            });
        case types.RECEIVE_FOLLOWER_LIST:
            return Object.assign({}, state, {
                followerList: action.list
            });
        default:
            return state;
    }
};

export default follow;
