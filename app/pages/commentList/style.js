'use strict';

import React from 'react-native';

var {
    StyleSheet,
    Dimensions
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
    portrait: {
        backgroundColor: '#fff',
        borderRadius: 17,
        borderColor: '#dedede',
        borderWidth: 1,
    },
    portraitC: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderColor: '#dedede',
        borderWidth: 1,
    },
    float: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        width: width,
        height: 40,
        bottom: 0,
        backgroundColor: '#fff',
        paddingTop: 6,
        paddingLeft: 10
    },
    commentRow: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        paddingTop: 10,
        borderColor: 'rgba(155,155,155,0.1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    commentContent: {
        flexDirection: 'column',
        marginLeft: 10
    },
    commentUserAndTime: {
        flexDirection: 'row',
        height: 20
    },
    commentTime: {
        fontSize: 10,
        alignItems: 'flex-end',
        flex: 1,
        lineHeight: 15
    },
    commentText: {
        height: 26,
        width: width - 56,
        marginLeft: 8,
        borderWidth: 0,
        backgroundColor: 'rgba(155,155,155,0.1)',
        paddingVertical: 4,
    },
    commentTextArea: {
        fontSize: 14,
        lineHeight: 16,
        color: '#bebebe',
        paddingLeft: 8,
    },
    commentList: {
        paddingBottom: 40
    },
    commentListText: {
        paddingTop:4,
        flexWrap: 'wrap',
        width: width -70
    }
});

export default styles;