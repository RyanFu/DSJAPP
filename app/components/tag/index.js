/**
 * Created by lyan2 on 16/8/20.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import Circle from './Circle';
import TagLabel from './TagLabel';

export default class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            circleSize: 12,
            labelHeight: 16
        };
    }

    componentWillMount() {
        let labelIndex = 0;
        let labels = this.props.labels || [];

        this._computePos();

        let positions = this.state.positions;

        labels = labels.map((value, index) => {
            let width = value ? value.length * 14 : 0;
            let posStyle = ({left, top} = positions[index]);
            return (
                <TagLabel key={'label_' + labelIndex++} style={[styles.tagLabel, {width: width}, posStyle]}
                          textStyle={styles.tagText} numberOfLines={1} text={value}>  </TagLabel>
            )});

        this.state.labels = labels;
    }

    _computePos() {
        let labels = this.props.labels;
        if (labels && labels.length > 0) {
            switch(labels.length) {
                case 1: this._oneLabel(); break;
                case 2: this._twoLabels(); break;
                case 3: this._threeLabels(); break;
            }
        }
    }

    _oneLabel() {
        let positions = [{left: 20, top: (this.state.circleSize - this.state.labelHeight) / 2}];
        this.state.positions = positions;
    }

    _twoLabels() {
        let central = {left: 0, top: (this.state.circleSize) / 2};
        let positions = [{left: 20, top: central.top - this.state.labelHeight}, {left: 20, top: central.top}];
        this.state.positions = positions;
    }

    _threeLabels() {
        let central = {left: 0, top: (this.state.circleSize) / 2};
        let positions = [{left: 20, top: central.top - this.state.labelHeight * 1.5},
            {left: 20, top: central.top - this.state.labelHeight * 0.5},
            {left: 20, top: central.top + this.state.labelHeight * 0.5}];
        this.state.positions = positions;
    }

    render() {
        let touchableProps = {};
        if (!this.props.disabled) {
            touchableProps.onPress = this.props.onPress;
            touchableProps.onPressIn = this.props.onPressIn;
            touchableProps.onPressOut = this.props.onPressOut;
            touchableProps.onLongPress = this.props.onLongPress;
        }

        // TouchableWithoutFeedback doesn't support position, because it doesn't have size and position.
        // so we have to transfer position to Circle component.
        let position = this.props.position ? this.props.position : {left: 0, top: 0};
        let size = this.state.circleSize;
        let half = size / 2;
        let posStyle= position == null ? null : {position: 'absolute', left: position.left - half, top: position.top - half};

        this._computePos();

        return (
            <View style={[posStyle, {backgroundColor: 'transparent'}]}>
                <Circle size={size}></Circle>
                {this.state.labels}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tagText: {
        color: '#f1f1f1',
        fontFamily: 'STHeitiSC-Medium',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
        minWidth: 24,
        lineHeight: 16
    },
    tagLabel: {
        position: 'absolute',
        borderColor: '#fff',
        borderBottomWidth: 1,
        left: 0,
        top: 0
    },
    tag: {

    }
});