/**
 * Created by lyan2 on 16/12/5.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    View
} from 'react-native';
export default class FramedTextInput extends Component {
    blur () {
        this.refs.input.blur();
    }

    render() {
        return (
            <View style={this.props.contentContainerStyle}>
                <TextInput ref="input" underlineColorAndroid="transparent" {...this.props}/>
            </View>
        );
    }
}