'use strict';

import React from 'react';
import {Dimensions,StyleSheet} from 'react-native';

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#def',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 950,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        paddingTop: 5,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopColor: 'rgba(178,178,178,0.1)',
        backgroundColor: 'rgba(255,255,255,1)',
    },
    tabTitle: {
        fontSize: 10,
        color: 'rgb(155,155,155)'
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },
    flow: {
        flex: 1,
    },
    HomeContainer: {
        position: 'absolute',
        left : 0,
        top: 0,
    }
});

export default styles