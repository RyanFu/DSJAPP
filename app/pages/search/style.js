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
    searchHeader: {
        height: 42,
        paddingTop: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f1f1f1',
    },
    back: {
        marginLeft: 10,
        marginTop: Platform.OS === 'android' ? 6 : 0
    },
    searchText: {
        height: 24,
        width: width - 66,
        marginTop: 10,
        marginLeft: 12,
        paddingLeft: 16,
        fontSize: 14,
        lineHeight: 24,
        borderWidth: 0,
        backgroundColor: 'rgba(155,155,155,0.1)',
        marginHorizontal: 10,
        flex: 1,
        paddingVertical: 3
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBody: {
        marginBottom: 0
    },
    searchTab: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        backgroundColor: '#fff',
    },
    tab: {
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#f1f1f1',
        paddingBottom: 10,
        width: width / 2
    },
    tabActive: {
        borderColor: '#fc7d30'
    },
    sButton: {
        height: 24,
        backgroundColor: '#fc7d30',
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        width: 35
    },
    sButtonFont: {
        fontSize: 12,
        lineHeight: 22,
        color: '#fff'
    },
    delete: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
        backgroundColor: '#f1f1f1'
    },
    historyC: {
        flex: 1,
        backgroundColor: '#fff',
    },
    history: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },
    historyItem: {
        backgroundColor: '#f1f1f1',
        height: 26,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 4,
        borderRadius: 4,
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10
    },
    historyItemFont: {
        color: '#000',
        lineHeight: 25,
    },
    historyTitle: {
        marginLeft: 10,
        marginTop: 10
    },
    auto: {
        flex: 1
    },
    itemAutoList: {
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    itemAutoRow: {
        height: 40,
        paddingLeft: 20,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#f1f1f1',
    }
});

export default styles;