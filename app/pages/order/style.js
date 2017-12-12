'use strict';

import React from 'react-native';
var {
    StyleSheet,
    Dimensions
    } = React;
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    baseText:{
        fontSize: 13,
        color: '#4a4a4a',
        lineHeight: 18,
        paddingBottom: 2
    },
    dimText:{
        color: '#9b9b9b',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },
    order: {
        backgroundColor: '#fff',
        padding: 5
    },
    button: {
        height: 36,
        backgroundColor: '#fc7d30',
        margin: 30,
        marginTop: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonFont: {
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#fff'
    },
    orderRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: width,
        height: 70,
        borderColor: 'rgba(155,155,155,0.1)',
        borderBottomWidth: 1,
        paddingVertical: 5
    },
    itemThumb: {
        width: 60,
        height: 60
    },
    orderText: {
        flexDirection: 'column',
        width: width - 60,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        height: 60
    },
    totalCash: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        marginHorizontal: 10,
        height: 35,
        alignItems: 'center'
    },
    input: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginHorizontal: 10,
    },
    inputText: {
        fontSize: 13,
        justifyContent: 'flex-end'
    }
});

export default styles;