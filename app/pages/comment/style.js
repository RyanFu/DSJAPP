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
    comment: {
        backgroundColor: '#fff',
        padding: 5
    },
    commentText: {
        textAlignVertical: 'top',
        height: 120,
        fontSize: 14,
        borderWidth: 0,
        paddingVertical: 10
    },
    shortcut:{
        flexDirection: 'row',
        height: 35,
        borderColor: "#e1e1e1",
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    at: {
        color: "#9b9b9b",
        fontSize: 25,
        marginLeft: 20,
        lineHeight: 30
    },
    button: {
        height: 36,
        backgroundColor: '#fc7d30',
        margin: 30,
        marginTop: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: "center",
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 26,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    emoticon:{
        marginLeft: 20,
        justifyContent: 'center'
    },
    starContainer: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 120,
        alignItems: 'flex-start',
        paddingLeft: 10,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingVertical: 10,
    },
    title: {
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#efefef',
        width: width -20,
        paddingBottom: 5,
        marginBottom: 5
    },
    titleText: {
        fontSize: 16
    },
});

export default styles;