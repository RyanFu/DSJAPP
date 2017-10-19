/**
 * Created by lyan2 on 16/12/7.
 */
/**
 * Created by lyan2 on 16/9/3.
 */
const initialState = {
    categories: []
};

import Actions from '../constants/actions';

const categories = function (state = initialState, action = {}) {
    switch (action.type) {
        case Actions.FETCH_CATEGORIES:
            let source = {options:null};
            fetch(configs.serviceUrl + 'common/commodity/categories/',  {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.resultValues && responseJson.resultValues.length > 0) {
                    state.categories = responseJson.resultValues.slice();
                }
            })
            .catch((error) => {
                console.error(error);
            });
            break;
        default:
            return state;
    }

    return state;
};

export default categories;
