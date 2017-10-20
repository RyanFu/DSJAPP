'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import StoreActions from '../../constants/actions';
import Toolbar from '../../components/toolbar';
import MyMessagesPage from './MyMessagesPage';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

class MessagesPage extends Component {
    constructor(props) {
        super(props);

        console.log(this);
        this.state = {
            region: 'China'
        };
    }

    componentWillMount() {
        let { dispatch } = this.props;
        dispatch({type: StoreActions.HIDE_HOME_TOOLBAR});
    }

    render() {
        let defaultName = 'MyMessagesPage';
        let defaultComponent = MyMessagesPage;
        return (
            // <Navigator
            //     initialRoute={{ name: defaultName, component: defaultComponent, title:'登陆'}}
            //     configureScene={(route, routeStack) => {
            //             return Navigator.SceneConfigs.VerticalDownSwipeJump;
            //         }}
            //     renderScene={(route, navigator) => {
            //             let Component = route.component;
            //             return <Component {...route.params} navigator={navigator} />
            //         }}/>
            <MyMessagesPage navigator={this.props.navigator} {...this.props}/>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

// get selected photos from store.state object.
function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(MessagesPage);