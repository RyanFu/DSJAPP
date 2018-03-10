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
    },
    dimText:{
        color: '#9b9b9b',
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        paddingBottom: 50
    },
    block: {
        backgroundColor: '#fff',
        width: width,
        flexDirection: 'column',
        // marginBottom: 5,
        padding: 10,
        paddingVertical: 0,
        // paddingBottom: 5
    },
    search: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    history: {
        minHeight: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },
    recent: {
        minHeight: 220
    },
    searchHeader: {
        height: 42,
        paddingTop: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop : 10
    },
    searchText: {
        height: 34,
        width: width - 86,
        marginLeft: 12,
        paddingLeft: 16,
        fontSize: 14,
        lineHeight: 24,
        borderWidth: 0,
        backgroundColor: 'rgba(155,155,155,0.1)',
        marginHorizontal: 10,
        flex: 1,
        paddingVertical: 3,
        marginTop: 0
    },
    sButton: {
        height: 34,
        backgroundColor: '#fc7d30',
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 45
    },
    sButtonFont: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    historyC: {
      flex: 1
    },
    delete: {
        position: 'absolute',
        right: 10,
        top: 7,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0)',
        flexDirection: 'row',
        alignItems: 'center'
    },
    auto: {
        flex: 1,
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
    },
    sync: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fc7d30',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 3
    },
    syncTitle: {
        color: '#fff',
        marginLeft: 2,
        paddingBottom: 2,
        fontSize: 12
    },
    historyItem: {
        backgroundColor: '#f1f1f1',
        height: 26,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 4,
        borderRadius: 14,
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 5,
        marginTop: 5
    },
    historyItemFont: {
        color: '#000',
        lineHeight: 25,
    },
    historyTitle: {
        marginLeft: 0,
    },
    itemList: {
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-start',
        marginTop: 6
    },
    sysRow: {
        marginTop: 2,
        marginBottom: 0,
        width: width / 3,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    sysThumb: {
        width: width / 3 - 5
    },
    recFlowPrice: {
        flex: 1,
        backgroundColor: 'rgba(80,80,80,0.9)',
        height: 20,
        bottom: 37,
        marginLeft: 3,
        width: width/3-6,
        position: 'absolute',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    recFlowText: {
        color: '#fc7d30',
        paddingLeft: 4,
        lineHeight: 20,
        paddingBottom: 0,
        height: 20
    },
    blockTitle: {
        backgroundColor: '#f1f1f1',
        height: 40,
        justifyContent: 'center',
        width: width,
        marginLeft: -10,
        marginTop: 0,
        paddingLeft: 10
    },
    recentBuy: {
        marginBottom: 20,
        marginTop: 10
    },
    recentView: {
        marginTop: 10
    },
    syncShadow: {
        marginTop: 2,
        marginBottom: 0,
        width: width / 3 - 4,
        marginLeft: 2,
        backgroundColor: 'rgba(255,255,255,.95)',
        position: 'absolute',
        height: width/3 + 38
    },
    syncShadowBG: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    syncShadowCircle: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    syncShadowText: {
        color: '#fc7d30',
        fontSize: 10,
        textAlign: 'center'
    },
    loadMore: {
        width: 40,
        marginTop: 2,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0, .5)'
    },
    loadMoreText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        marginBottom: 5
    },
    moreIcon: {
        color: '#fff'
    },
    historyContent: {
        marginVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-start'
    },
    redPacketPrice: {
        position: 'absolute',
        bottom: 37,
        right: 4,
        justifyContent: 'flex-end',
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0)',
        paddingRight: 2,
        flexDirection: 'row',
    },
    redPacketText: {
        fontSize: 12,
        paddingLeft: 2
    },
    redIcon:{
        width: 14,
        height: 14,
        marginTop: 3
    },
    syncBlock: {
        width: width,
        height: 44,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        paddingRight: 10
    },
    syncS:{
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginTop: 6
    },
    what: {
        marginLeft: 4
    },
    suspend: {
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 200,
        right: 28,
        backgroundColor: 'rgba(252, 125, 48, 1)',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 4},
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    suspendText: {
        color: '#fff',
        fontWeight: '900',
        backgroundColor: 'rgba(255,255,255,0)',
        fontSize: 10
    },
    suspendIcon: {
        position: 'absolute',
        lineHeight: 50,
        backgroundColor: 'rgba(255,255,255,0)',
    },
    whatSuspend: {
        position: 'absolute',
        bottom: 215,
        right: 5,
        width: 18,
        height: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#aaa',
    },
    suspendWhatIcon: {
        backgroundColor: 'rgba(255,255,255,0)',
    },
    noOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    noOrderText: {
        color: '#9b9b9b',
    },
    noOrderGo: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    noOrderGoText: {
        color: '#fc7d30',
        fontWeight: '500',
        fontSize: 16,
        marginRight: 4
    }
});

export default styles;