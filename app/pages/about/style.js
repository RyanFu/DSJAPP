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
    logo:{
        width: 50,
        height: 50
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: width
    },
    version: {
        marginVertical: 10,
    },
    row: {
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: width
    },
    separatorHorizontal: {
        borderBottomWidth:1,
        borderBottomColor:'#eee',
    },
    text: {
        fontSize:14,
        color:'#686868',
        flex:1
    },

});

export default styles;