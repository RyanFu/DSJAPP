/**
 * Created by lyan2 on 16/12/7.
 */
/**
 * Created by lyan2 on 16/9/3.
 */
const initialState = {
    cities: []
};

import Actions from '../constants/actions';

const cities = function (state = initialState, action = {}) {
    switch (action.type) {
        case Actions.FETCH_CITIES:
            let source = {options:null};
            fetch(configs.serviceUrl + 'common/geography/cities/',  {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.resultValues && responseJson.resultValues.length > 0) {
                    state.cities = responseJson.resultValues.slice();
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

export default cities;
