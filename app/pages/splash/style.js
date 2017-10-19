import React from 'react';
import {Dimensions,StyleSheet} from 'react-native';

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
        width: width,
        height: height
    }
});

export default styles;