'use strict';

import React from 'react';
import {
    StyleSheet,
    StatusBar,
    BackHandler,
    View,
    DeviceEventEmitter,
    AsyncStorage
} from 'react-native';
import {connect, storeShape} from 'react-redux';
import Splash from '../pages/splash';
import {naviGoBack} from '../utils/common';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import StorageKeys from '../constants/StorageKeys';
import Home from './home';

const Navigator = deprecatedComponents.Navigator;

let tempNavigator;
let isRemoved = false;

class Nav extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log(context); // get react native store object
        this._renderScene = this._renderScene.bind(this);
        this._goBack = this._goBack.bind(this);

        BackHandler.addEventListener('hardwareBackPress', this._goBack);
        this.state = {
            animated: true,
            hidden: false,
            firstOpen: true,
            check: false,
        };
    }

    componentWillMount() {
        const the = this;
        AsyncStorage.getItem(StorageKeys.SPLASH_SKIP).then((res) => {
            if (res === 'true') {
                the.setState({firstOpen: false})
            }
            the.setState({check: true})
        });
    }

    _goBack() {
        return naviGoBack(tempNavigator);
    }

    _configureScene(route) {
        return route.sceneConfigs || Navigator.SceneConfigs.FloatFromRight;
    }

    _renderScene(route, navigator) {
        let Component = route.component;
        tempNavigator = navigator;

        if (route.name === 'Home') {
            DeviceEventEmitter.emit('newView', true);
            DeviceEventEmitter.emit('newBuy', true);
        }
        return (
            <Component {...route.params} navigator={navigator} route={route}/>
        );
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar
                    hidden={this.state.hidden}
                    backgroundColor="#000"
                    barStyle="default"
                />
                {
                    this.state.firstOpen && this.state.check ? <Navigator
                        ref="navigator"
                        style={styles.navigator}
                        configureScene={this._configureScene}
                        renderScene={this._renderScene}
                        initialRoute={{
                            component: Splash,
                            name: 'Splash'
                        }}
                    /> : (this.state.check ?
                        <Navigator
                            ref="navigator"
                            style={styles.navigator}
                            configureScene={this._configureScene}
                            renderScene={this._renderScene}
                            initialRoute={{
                                component: Home,
                                name: 'Home'
                            }}
                        /> : null)
                }

            </View>
        );
    }
}

Nav.contextTypes = {
    store: () => storeShape
}

const styles = StyleSheet.create({
    navigator: {
        flex: 1
    }
});

export default Nav;