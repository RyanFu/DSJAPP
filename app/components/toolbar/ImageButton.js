'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ViewPropTypes
} from 'react-native';

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    source: PropTypes.oneOfType([
        PropTypes.shape({
            uri: PropTypes.string,
        }),
        // Opaque type returned by require('./image.jpg')
        PropTypes.number,
    ]),
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style
};

class ImageButton extends React.Component {
    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        if (this.props.disabled) {
            return;
        }
        this.props.onPress();
    }

    render() {
        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={this.onPress}
                >
                <Image
                    style={this.props.style}
                    source={this.props.source}
                    />
            </TouchableOpacity>
        );
    }
}

ImageButton.propTypes = propTypes;

ImageButton.defaultProps = {
    onPress() {
    },
    disabled: false
};

export default ImageButton;
