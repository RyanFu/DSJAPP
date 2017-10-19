'use strict';

import React from 'react-native';

var {
    StyleSheet,
    Dimensions,
    Platform
    } = React;
const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    baseText: {
        fontSize: 13,
        color: '#4a4a4a',
        lineHeight: 18,
    },
    dimText: {
        color: '#9b9b9b',
    },
    scrollContainer: {
        paddingBottom: 150
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: width
    },
    buttonC: {
        position: 'absolute',
        height: 140,
        bottom: 0,
        left: 0,
        backgroundColor: '#fff'
    },
    button: {
        height: 36,
        backgroundColor: '#fc7d30',
        borderRadius: 4,
        alignItems: 'center',
        width: width - 40,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 34,
        color: '#fff'
    },
    block: {
        backgroundColor: '#fff',
        width: width,
        padding: 10,
        marginTop: 10
    },
    buttonGrey: {
        height: 32,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(178,178,178,0.3)',
        width: width - 23,
    },
    buttonGFont: {
        fontSize: 13,
        lineHeight: 28,
        color: '#000',
    },
    content: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    locationButton: {
        width: (width - 40) / 3,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10
    },
    priceText: {
        height: 32,
        width: (width - 66)/2   ,
        paddingLeft: 16,
        fontSize: 14,
        lineHeight: 30,
        borderWidth: 0,
        backgroundColor: 'rgba(155,155,155,0.1)',
        marginHorizontal: 10,
        flex: 1,
        paddingVertical: 3
    },
    locations: {
        height: 130,
        overflow: 'hidden'
    },
    buttonArrow: {
        height: 36,
        borderWidth: 1,
        borderColor: 'rgba(252, 125, 48, 0.4)',
        alignItems: 'center',
        width: width - 20,
        marginTop: 10,
    },
    buttonArrowFont: {
        fontSize: 16,
        lineHeight: 42,
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'rgba(252, 125, 48, 0.4)'
    }
});

export default styles;