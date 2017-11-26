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
        this.state = {
            region: 'China'
        };
    }

    componentWillMount() {
    }

    render() {
        return (

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


export default MessagesPage;