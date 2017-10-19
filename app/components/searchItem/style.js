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
        paddingBottom: 2
    },
    dimText: {
        color: '#9b9b9b',
    },
    container: {
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },
    itemList: {
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    itemRow: {
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 2,
        borderColor: '#f1f1f1',
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
    },
    pic: {
        marginRight: 10
    },
    itemContent: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    price: {
        fontSize: 15
    },
    title: {
        paddingRight: 50,
        width: width - 70
    },
    itemDigit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemDigitO: {
        marginRight: 60,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    loading: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#f1f1f1'
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 12,
        marginLeft: 10,
        color: '#bdbdbd'
    },
    tmallIcon: {
        width: 30,
        height: 16,
        backgroundColor: 'red',
        alignItems: 'center',
        borderRadius: 3
    }
});

export default styles;