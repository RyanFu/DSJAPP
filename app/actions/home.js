import types from '../constants/actions';
import { request } from '../utils/common';

export function showorHideFollow(bool) {
    return dispatch => {
        dispatch( {
            type: types.SHOW_FOLLOW,
            isFollowed: bool,
            showFilter: false
        });
    };
}

export function showorHideFilter(bool) {
    return dispatch => {
        dispatch( {
            type: types.SHOW_FILTER,
            showFilter: bool
        });
    };
}