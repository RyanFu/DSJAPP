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
            let recentView = _.uniqBy(state.recentView.concat(action.info),'itemId');
            if(recentView.length > 20){
                recentView = _.tail(recentView);
            }
            AsyncStorage.setItem('recent_view', JSON.stringify(recentView));
            return Object.assign({}, state, {
                recentView: recentView
            });
        case types.FETCH_RECENT_VIEW:
            return Object.assign({}, state, {
                recentView: action.info
            });
        case types.FETCH_RECENT_BUY:
            if(action.info&&action.info.length>0)
                return Object.assign({}, state, {
                    recentBuy: action.info
                });
            else
                return Object.assign({}, state, {
                    recentBuy: []
                });
        default:
            return state;
    }
};



export default recent;
