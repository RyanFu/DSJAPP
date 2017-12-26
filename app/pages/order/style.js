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
        margin: 20,
        marginBottom: 10,
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
        height: 100,
        borderColor: 'rgba(155,155,155,0.1)',
        borderBottomWidth: 1,
        paddingVertical: 5
    },
    itemThumb: {
        width: 90,
        height: 90
    },
    orderText: {
        flexDirection: 'column',
        width: width - 90,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        height: 60
    },
    totalCash: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    },
    tip: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height:12,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    tipFont: {
        fontSize: 11,
        height: 12,
    },
    tipIcon: {
        color: '#fc7d30',
        marginRight: 2
    },
    orderTextDetail: {
        flexDirection: 'column'
    },
    sText: {
        fontSize: 11,
        color: '#9b9b9b'
    },
    red: {
        color: '#ff0000'
    },
    green: {
        color: '#00d05d'
    },
    darkGreen: {
        color: '#026734'
    }
});

export default styles;