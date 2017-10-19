
import types from '../constants/actions';
import _ from 'lodash';

const initialState = {
    itemList: [],
    loadingMore: false,
    currentPage: 1
};

const search = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_ITEM_SEARCH_LIST:
            return Object.assign({}, state, {
                loadingMore: action.loadingMore
            });
        case types.RECEIVE_ITEM_SEARCH_LIST:
            return Object.assign({}, state, {
                itemList: state.loadingMore ?  loadMore(state, action) : init(state, action),
                loadingMore: false,
                currentPage: action.currentPage
            });
        default:
            return state;
    }
};

function init(state, action) {
    return action.list;
}

function loadMore(state, action) {
    state.itemList = state.itemList.concat(action.list);
    return state.itemList;
}

export default search;
