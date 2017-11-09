import types from '../constants/actions';
import { request, Token } from '../utils/common';
import _ from 'lodash';
import {fetchDetail} from './detail';
import home from '../reducers/home';
import configs from '../constants/configs';

export function fetchList(params) {

    return dispatch => {
        if (!params.loadingMore) {
            params.timestamp = (new Date()).getTime();
        }
        dispatch(fetchFlowList(params.refreshing, params.loadingMore, params.flowRefreshing, params.timestamp, params.tag));

        const pageSize = 10;
        params.loadedSize = params.loadedSize ? params.loadedSize : 0;

        if (params.tag === 'search') {
            let url = {
                host: configs.elasticSearch,
                route: 'duoshouji/elasticsearch/keyword/' + params.searchText + '/size/' + pageSize
            };
            if (params.loadingMore) {
                url.route = 'duoshouji/elasticsearch/scrollId/' + params.scrollId + '/size/' + pageSize
            }
            let success = true;
            return fetch(url.host + url.route)
                .then((res)=> {
                    if (res.status == 200) {
                        success = true;
                    } else {
                        success = false;
                    }
                    return res.json();
                }).then((list)=> {
                    if (!success) {
                        dispatch(receiveFlowList([], params.tag, true, list.scrollId));
                        return;
                    }
                    let idArray = [];
                    _.each(list.data, (v)=> {
                        idArray.push(v.noteId);
                    });
                    const ids = _.join(idArray, ',');
                    return request('notes?noteIdList=' + ids, 'get')
                        .then((ret) => {
                            if (ret.resultCode == 0 ) {
                                dispatch(receiveFlowList(ret.resultValues, params.tag, false, list.scrollId));
                            } else {
                                dispatch(receiveFlowList([], params.tag, true, list.scrollId));
                            }
                        });
                });
        } else {
            return Token.getToken().then((token) => {
                return request('/notes?' +
                    'timestamp=' + params.timestamp
                    + '&pageSize=' + pageSize
                    + '&loadedSize=' + params.loadedSize
                    + (params.myFollowOnly ? '&myFollowOnly' : ''), 'get', '', token)
                    .then((list) => {
                        if (list.resultCode === 0 && list.resultValues.length > 0) {
                            dispatch(receiveFlowList(list.resultValues, params.tag, false));
                        } else {
                            dispatch(receiveFlowList(list.resultValues, params.tag, true));
                        }

                        //_.each(list.resultValues, function (v, k) {
                        //    dispatch(fetchDetail(v.noteId));
                        //})

                    }, function (error) {
                        dispatch(receiveFlowList([], params.tag, true));
                        console.log(error);
                    })
                    .catch(() => {
                        dispatch(receiveFlowList([], params.tag, true));
                        console.log('network error');
                    });
            });
        }
    };
}

function fetchFlowList(refreshing, loadingMore, flowRefreshing, timestamp, tag) {
    return {
        type: types.FETCH_FLOW_LIST,
        refreshing,
        loadingMore,
        flowRefreshing,
        timestamp,
        tag
    };
}

function receiveFlowList(list, tag, noMoreData, scrollId) {
    return {
        type: types.RECEIVE_FLOW_LIST,
        noMoreData,
        tag,
        list,
        scrollId
    };
}

export function pageRefresh() {
    return dispatch => {
        dispatch({
            type: types.PAGE_REFRESH,
            pageRefresh: true
        })
    }
}