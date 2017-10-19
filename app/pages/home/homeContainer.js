'use strict';

import React from 'react';
import Toolbar from '../../components/toolbar';
import {Token} from '../../utils/common';
import { connect } from 'react-redux';
import styles from './style';
import AddFriends from '../addFriends';
import {showorHideFilter} from '../../actions/home';
import SearchPage from '../search';
import deprecatedComponents from 'react-native-deprecated-custom-components';

const ReactNative = require('react-native');
const {
    View,
    InteractionManager,
    Text
    } = ReactNative;
const addImg = require('../../assets/header/add.png');
const searchImg = require('../../assets/header/search.png');
const settingImg = require('../../assets/personal/setting.png');

class HomeContainer extends React.Component {
    constructor(props) {
        super(props);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this._onRightIconClicked.bind(this);
        this._showFilter = this._showFilter.bind(this);
        this.state = {
            showToolbar: this.props.home.showToolbar,
            filterMounted: false,
        }
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                InteractionManager.runAfterInteractions(() => {
                    navigator.push({
                        component: AddFriends,
                        name: 'AddFriends',
                        sceneConfigs: deprecatedComponents.Navigator.SceneConfigs.HorizontalSwipeJumpFromRight
                    });
                });
            }
        });
    }

    _onRightIconClicked() {
        const { navigator } = this.props;

        InteractionManager.runAfterInteractions(() => {
            navigator.push({
                component: SearchPage,
                name: 'SearchPage',
                sceneConfigs: Navigator.SceneConfigs.FadeAndroid
            });
        });
    }

    _showFilter() {
        const { dispatch} = this.props;
        if(this.props.home.showFilter){
            dispatch(showorHideFilter(false));
        } else {
            dispatch(showorHideFilter(true));
        }

    }

    render() {
        return(
            <View {...this.props}>
                <View>
                    <Toolbar
                        title={this.props.home.isFollowed ? '关注的' : '剁手记'}
                        navigator={this.props.navigator}
                        showFilter={this._showFilter}
                        leftImg={addImg}
                        rightImg={searchImg}
                        onLeftIconClicked={this._onLeftIconClicked}
                        onRightIconClicked={this._onRightIconClicked}
                        hideDrop={false}
                        />


                </View>
                {this.props.children}
            </View>


        )
    }
}

function mapStateToProps(state) {
    const { home, flow } = state;
    return {
        home,
        flow
    };
}

export default connect(mapStateToProps)(HomeContainer);