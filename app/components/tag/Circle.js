/**
 * Created by lyan2 on 16/8/20.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const propTypes = {
    disabled: PropTypes.bool,
    style: Text.propTypes.style,
    size: PropTypes.number
};

export default class Circle extends Component {
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
            touchableProps.onResponderTerminate = this.props.onResponderTerminate;
            touchableProps.onResponderGrant = this.props.onResponderGrant;
            touchableProps.onResponderMove = this.props.onResponderMove;
            touchableProps.onResponderRelease = this.props.onResponderRelease;
        }

        let size = this.props.size ? this.props.size : 12;

        return (
            <View {...touchableProps} testID={this.props.testID} style={[{height: size, width: size, borderRadius: size}, this.props.style]}>
            </View>
        );
    }
}

Circle.propTypes = propTypes;

Circle.defaultProps = {
    style:{backgroundColor: '#fff'},
    disabled: false
};

const styles = StyleSheet.create({
});