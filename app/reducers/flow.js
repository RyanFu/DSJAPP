
import types from '../constants/actions';

const initialState = {
    loading: false,
    refreshing: false,
    loadingMore: false,
    flowRefreshing: false,
    flowList: {},
    timestamp: {},
    noMoreData: false,
    pageRefresh: false,
    scrollId: '',
    currentTag: 'all'
};


const flow = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.FETCH_FLOW_LIST:
            state.timestamp[action.tag] = action.timestamp;
            return Object.assign({}, state, {
                loading: true,
                refreshing: action.refreshing,
                loadingMore: action.loadingMore,
                flowRefreshing: action.flowRefreshing,
                timestamp: state.timestamp,
                pageRefresh: false,
                currentTag: action.tag,
                scrollId: state.scrollId
            });
        case types.RECEIVE_FLOW_LIST:
            return Object.assign({}, state, {
                loading: false,
                refreshing: false,
                loadingMore: false,
                flowRefreshing: false,
                noMoreData: action.noMoreData,
                scrollId: action.scrollId,
                flowList: state.loadingMore ?  loadMore(state, action) : init(state, action)
            });
        case types.PAGE_REFRESH:
            return Object.assign({}, state, {
                pageRefresh: action.pageRefresh
            });
        default:
            return state;
    }
};

function init(state, action) {
    state.flowList[action.tag] = action.list;
    return state.flowList;
}

function loadMore(state, action) {
    state.flowList[action.tag] = state.flowList[action.tag].concat(action.list);
    return state.flowList;
}
export default flow;
