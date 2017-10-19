import types from '../constants/actions';
import { AsyncStorage } from 'react-native';
import _ from 'lodash';

const initialState = {
    recentView: [],
    recentBuy: []
};


const recent = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.ADD_RECENT_VIEW:
            const recentView = _.uniqBy(state.recentView.concat(action.info),'itemId');
            AsyncStorage.setItem('recent_view', JSON.stringify(recentView));
            return Object.assign({}, state, {
                recentView: recentView
            });
        case types.FETCH_RECENT_VIEW:
            return Object.assign({}, state, {
                recentView: action.info
            });
        case types.FETCH_RECENT_BUY:
            return Object.assign({}, state, {
                recentBuy: action.info
            });

        default:
            return state;
    }
};



export default recent;
