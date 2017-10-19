import React from 'react-native';

var {
    StyleSheet,
    Dimensions
} = React;
const {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
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
    separatorHorizontal: {
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#f5f4f5',
        paddingVertical: 12,
        borderBottomWidth:1,
        borderBottomColor: '#ccc'
    },
    messageHeaderTitle: {
        fontSize: 20
    },
    messageRow: {
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    messageTitle: {
        fontSize:16,
        color:'#686868',
        flex:1
    },
    messageNewMark: {
        backgroundColor:'#f00',
        marginRight:5,
        paddingHorizontal:5,
        borderRadius: 5
    },
    messageNewNum: {
        fontSize:12,
        lineHeight:16,
        color:'#fff'
    },
    messageIndicatortIcon: {
        color:'#9b9b9b',
        marginRight: 5,
        width: 20
    },
    messageLinkIcon: {
        color:'#9b9b9b',
        marginLeft: 5
    },
    
    messageListRow: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        paddingTop: 10,
        borderColor: 'rgba(155,155,155,0.1)',
        borderBottomWidth: 1,
        flexDirection: 'row',
    },
    messageListContent: {
        flexDirection: 'column',
        marginLeft: 10
    },
    messageListTimeC: {
        flexDirection: 'row',
        height: 20
    },
    messageListTime: {
        fontSize: 10,
        alignItems: 'flex-end',
        flex: 1,
        lineHeight: 15
    },
    messageListText: {
        width: width - 56,
        marginLeft: 8,
        borderWidth: 0,
        paddingVertical: 4,
    },
    messageList: {
    },
    unReadDot: {
        width: 6,
        height: 6,
        borderRadius: 6,
        backgroundColor: 'red',
    },
    messageListDetail: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});