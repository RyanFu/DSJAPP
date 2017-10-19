'use strict';

import StoreActions from '../constants/actions';

const initialState = {
    showToolbar: true,
    showFilter: false,
    filterMounted: false,
    isFollowed: false
};

const home = function (state = initialState, action ={}) {
    switch (action.type) {
        case StoreActions.SHOW_FOLLOW:
            return Object.assign({}, state, {
                isFollowed: action.isFollowed,
                showFilter: action.showFilter
            });
        case StoreActions.SHOW_FILTER:
            return Object.assign({}, state, {
                showFilter: action.showFilter
            });
        default:
            return state;
    }

    return state;
};

export default home;
