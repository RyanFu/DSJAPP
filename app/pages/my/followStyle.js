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
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },
    search: {
        height: 42,
        paddingTop: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchText: {
        height: 24,
        width: width - 66,
        marginTop: 10,
        marginLeft: 12,
        paddingLeft: 26,
        fontSize: 14,
        lineHeight: 24,
        borderWidth: 0,
        backgroundColor: 'rgba(155,155,155,0.1)',
        marginHorizontal: 10,
        paddingVertical: 4
    },
    back: {
        marginLeft: 10,
        // marginTop:  Platform.OS === 'android' ? 6 : 0
    },
    magnifier: {
        position: 'absolute',
        // top: Platform.OS === 'android' ? 18 : 15,
        left: 42,
        //zIndex: 1
    },
    addressBook: {
        marginTop: 10,
        height: 50,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    addressText: {
        fontSize: 16,
        paddingLeft: 10,
        alignSelf: 'center'
    },
    listContainer: {
        minHeight: height,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingBottom: 30
    },
    friendsList: {},
    friendsRow: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        //paddingBottom: 15,
        //paddingTop: 15,
        borderColor: 'rgba(155,155,155,0.1)',
        borderBottomWidth: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    invite: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    float: {
        position: 'absolute',
        width: width,
        height: 40,
        bottom: 21,
        backgroundColor: '#4cd864',
        borderTopWidth: 1,
        borderColor: 'rgba(155,155,155,0.1)',
        justifyContent: 'center'
    },
    portrait: {
        height: 34,
        borderRadius: 17,
        alignSelf: 'center',
    },
    floatText: {
        fontSize: 16,
        color: '#fff',
        alignSelf: 'center'
    },
    trueSwitchIsOn: {
        alignSelf: 'center',
        right: 10,
    },
    button: {
        borderRadius: 6,
        height: 25
    },
    friendsRowC: {
        height: 50
    }
});

export default styles;