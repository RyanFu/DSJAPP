/**
 * Created by xiewang on 7/13/16.
 */

import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import Main from './pages/navigator';

import {
    NetInfo,
} from 'react-native';
import { toast } from './utils/common';

const store = configureStore();

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        NetInfo.getConnectionInfo().done((connectionInfo) => {
            if(connectionInfo === 'none'){
                toast('网络连接不可用，请检查你的网络！');
            }
        });
    }

    componentWillUnmount() {
    }

    componentDidMount() {

    }

    render() {
        return (
            <Provider store={store}>
                <Main />
            </Provider>
        );
    }
}

export default App;