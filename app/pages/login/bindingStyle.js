
import React from 'react-native';

var {
    StyleSheet
    } = React;

const styles = StyleSheet.create({
    baseText:{
        fontSize: 13,
        color: '#4a4a4a',
        lineHeight: 18,
        paddingBottom: 2
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f1f1f1',
    },
    button: {
        height: 36,
        backgroundColor: '#fc7d30',
        margin: 30,
        marginTop: 40,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 32,
        color: '#fff'
    },
    phone: {
        borderColor: '#f1f1f1',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical:3,
        flexDirection:'row',
        marginTop: 30,
        backgroundColor: '#fff'
    },
    phoneText: {
        flex:1,
        fontSize: 16,
        color:'#696969',
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0,
        paddingLeft: 10,
        backgroundColor: '#fff'
    },
    bindPhone: {
        marginTop: 10,
        marginLeft: 10
    }
});

export default styles;