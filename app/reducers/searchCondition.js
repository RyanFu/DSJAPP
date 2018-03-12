import types from '../constants/actions';
import _ from 'lodash';

const initialState = {
    sv: true,
    moods: false,
    price: false,
    redPacket: false,
    priceSort: 0,
    priceRange: false,
    startPrice: 0,
    endPrice: 0,
    location: 'all',
    tmall: false
};

const searchCondition = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.SEARCH_CONDITION_RESET:
            return {
                sv: true,
                moods: false,
                price: false,
                redPacket: false,
                priceSort: 0,
                priceRange: false,
                startPrice: 0,
                endPrice: 0,
                location: 'all',
                tmall: false,
                coupon: false
            };
        case types.SEARCH_CONDITION_UPDATE:
            let ret;
            if (action.sv)
                ret = Object.assign({}, state, {
                    sv: true,
                    moods: false,
                    price: false,
                    redPacket: false,
                    priceRange: action.priceRange ,
                    startPrice: action.startPrice ,
                    endPrice: action.endPrice ,
                    location: action.location ,
                    tmall: action.tmall,
                    coupon: action.coupon
                });
            if (action.moods)
                ret = Object.assign({}, state, {
                    sv: false,
                    moods: true,
                    price: false,
                    redPacket: false,
                    priceRange: action.priceRange ,
                    startPrice: action.startPrice ,
                    endPrice: action.endPrice ,
                    location: action.location ,
                    tmall: action.tmall,
                    coupon: action.coupon
                });
            if (action.price)
                ret = Object.assign({}, state, {
                    sv: false,
                    moods: false,
                    price: true,
                    redPacket: false,
                    priceSort: action.priceSort,
                    priceRange: action.priceRange ,
                    startPrice: action.startPrice ,
                    endPrice: action.endPrice ,
                    location: action.location ,
                    tmall: action.tmall,
                    coupon: action.coupon
                });
            if (action.redPacket)
                ret = Object.assign({}, state, {
                    sv: false,
                    moods: false,
                    price: false,
                    redPacket: true,
                    priceSort: action.priceSort,
                    priceRange: action.priceRange ,
                    startPrice: action.startPrice ,
                    endPrice: action.endPrice ,
                    location: action.location ,
                    tmall: action.tmall,
                    coupon: action.coupon
                });
            return ret;
        default:
            return state;
    }
};

export default searchCondition;
