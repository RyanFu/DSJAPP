/**
 * Created by lyan2 on 16/8/21.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class TagLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let touchableProps = {};
        if (!this.props.disabled) {
            touchableProps.onPress = this.props.onPress;
            touchableProps.onPressIn = this.props.onPressIn;
            touchableProps.onPressOut = this.props.onPressOut;
            touchableProps.onLongPress = this.props.onLongPress;
        }

        return this.props.text ? (
            <View {...touchableProps} testID={this.props.testID} style={[styles.label, this.props.style]}>
                <Text style={[styles.text, this.props.textStyle]} numberOfLines={1}>{this.props.text}</Text>
            </View>
        ) : null;
    }
}

const styles = StyleSheet.create({
    text: {
        color: '#f1f1f1',
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    label: {
        borderBottomColor: '#fff',
        borderBottomWidth: 1
    }
});