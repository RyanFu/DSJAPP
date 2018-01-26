import React, { Component } from 'react';
import {
    AsyncStorage,
    Flex,
    InteractionManager,
    StyleSheet,
    Text,
    View,
    Platform,
    WebView
} from 'react-native';

import styles from './styles';
import Toolbar from '../../components/toolbar';
import {isIphoneX} from "../../utils/common";

export default class MessageDetailPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <Toolbar
                    title="消息"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />
                <WebView
                    ref="webviewbridge"
                    source={{uri: "http://share68.com"}}/>

            </View>
        );
    }
}