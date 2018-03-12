import types from '../constants/actions';
import { request } from '../utils/common';
import configs from '../constants/configs';
import _ from 'lodash';

export function fetchItemSearchList(params) {
    return dispatch => {
        //let url = {
        //    host: configs.itemSearchUrl,
        //    route:  'duoshouji/search/' + keyWord
        //};
        const pageSize = 20;
        const timeStamp = (new Date()).getTime();
        let query = '';
        //shortcut
        if (params.searchCondition && params.searchCondition.sv) {
            query = '&ueryType=0&sortType=9';
        }
        if (params.searchCondition && params.searchCondition.moods) {
            query = '&queryType=2';
        }
        if (params.searchCondition && params.searchCondition.price) {
            query = '&ueryType=0&sortType=' + (params.searchCondition.priceSort === 0 ? 4 : 3);
        }
        if (params.searchCondition && params.searchCondition.moods) {
            query = '&queryType=2';
        }
        if (params.searchCondition && params.searchCondition.redPacket) {
            query = '&queryType=0&sortType=1';
        }

        //filter
        if (params.searchCondition && params.searchCondition.priceRange) {
            query += '&startPrice=' + params.searchCondition.startPrice + '&endPrice=' + params.searchCondition.endPrice;
        }
        if (params.searchCondition && params.searchCondition.tmall) {
            query += '&userType=1';
        }
        if (params.searchCondition && params.searchCondition.location !== 'all') {
            query += '&loc=' + params.searchCondition.location;
        }
        if (params.searchCondition && params.searchCondition.coupon) {
            query += '&dpyhq=1&shopTag=dpyhq';
        } else {
            query += '&shopTag=';
        }
        let url = {
            host: configs.itemSearchUrlFromAli,
            route: 'items/search.json?q=' + params.text
            + '&t=' + timeStamp
            + '&perPageSize=' + pageSize
            + '&toPage=' + (params.currentPage ? params.currentPage : 1)
            + '&_t=1489972949888&auctionTag=&t=1489972949891&_tb_token_=&pvid=10_202.76.247.11_429_1489972855472'
            + query
        };

        dispatch(fetchingItemSearchList(params.loadingMore));

        return request(url, 'get')
            .then((list) => {
                if (list.data && list.data.pageList.length > 0) {
                    let items = [];
                    _.each(list.data.pageList, (v, k) => {
                        const item = {
                            itemTitle: v.title.replace(/<span[^>]+>|<\/span>/g, ''),
                            itemPrice: v.zkPrice,
                            itemId: v.auctionId,
                            itemPicUrl: 'http:' + v.pictUrl,
                            shopTitle: v.shopTitle,
                            tkCommFee: v.tkCommFee,
                            tkRate: v.tkRate,
                            biz30day: v.biz30day,
                            userType: v.userType,
                            couponAmount: v.couponAmount
                        };
                        items.push(item);
                    });
                    dispatch(receiveItemSearchList(items, params.currentPage));
                } else {
                    dispatch(receiveItemSearchList([], params.currentPage));
                }

            }, function (error) {
                dispatch(receiveItemSearchList([], params.currentPage));
                console.log(error);
            })
            .catch(() => {
                dispatch(receiveItemSearchList([], params.currentPage));
                console.log('network error');
            });
    };
}

function fetchingItemSearchList(loadingMore) {
    return {
        type: types.FETCH_ITEM_SEARCH_LIST,
        loadingMore
    };
}

function receiveItemSearchList(list, currentPage) {
    return {
        type: types.RECEIVE_ITEM_SEARCH_LIST,
        list,
        currentPage
    };
}