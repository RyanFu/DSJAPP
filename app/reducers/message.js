import types from '../constants/actions';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const initialState = {
    messageNum: {},
    messageList: {}
};

const message = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_MESSAGE_NUM:
            return Object.assign({}, state, {
                messageNum: action.nums
            });
        case types.FETCH_MESSAGE_LIST:
            return Object.assign({}, state, {
                messageList: action.list
            });
        case types.MAKE_MESSAGE_AS_READ:
            _.find(state.messageList,{id:action.id}).isRead=true;
            return state;

        default:
            return state;
    }
};

export default message;
