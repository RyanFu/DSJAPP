
import types from '../constants/actions';
import _ from 'lodash';

const initialState = {
    recommendList: {},
};

//口罩：545078615667
//棒棒糖：520104863331
const testData = {
    providerItemId: 548223684559,
    title:'口罩',
    price: '100',
    image: ''
};

const channel = function (state = initialState, action = {}) {
    switch (action.type) {
        case types.RECEIVE_RECOMMEND_LIST:
            let list = {
                taobao: [],
                jingdong: []
            };
            _.each(action.list, function(v,k){
                if(v.provider === 'Taobao'){
                    list.taobao.push(v);
                }
                if(v.provider === 'Jingdong'){
                    list.jingdong.push(v);
                }
            });
            return Object.assign({}, state, {
                recommendList: list
            });
        default:
            return state;
    }
};

export default channel;
