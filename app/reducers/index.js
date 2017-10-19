'use strict';

import { combineReducers } from 'redux';
import home from './home';
import prefetchedImages from './prefetchedImages';
import draftNote from './draftNote';
import flow from './flow';
import channel from './channel';
import detail from './detail';
import comments from './comments';
import recommend from './recommend';
import user from './user';
import categories from './categories';
import cities from './cities';
import follow from './follow';
import search from './search';
import searchCondition from './searchCondition';
import recent from './recent';
import message from './message';

const rootReducer = combineReducers({
    home,
    prefetchedImages,
    draftNote,
    flow,
    channel,
    detail,
    comments,
    recommend,
    user,
    categories,
    cities,
    follow,
    search,
    searchCondition,
    recent,
    message
});

export default rootReducer;