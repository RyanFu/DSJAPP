/**
 * Created by lyan2 on 16/9/22.
 */
import React from 'react';
import {Dimensions,StyleSheet} from 'react-native';

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f5f5f5',
        flex: 1
    },
    row: {
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    separatorHorizontal: {
        borderBottomWidth:1,
        borderBottomColor:'#eee'
    },
    text: {
        fontSize:14,
        color:'#686868',
        flex:1
    },
    phoneText: {
        color:'#ccc',
        marginRight: 10
    },
    boundText: {
        color:'#FC4D30',
        marginRight: 10
    },
    portraitContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center'
    },
    fullPortrait: {
        width: width,
        height: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        marginTop: 50
    },
    fullPortraitImg: {

    },
    button: {
        height: 36,
        backgroundColor: '#fc7d30',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: width/2,
        marginTop: 20
    },
    buttonFont: {
        fontSize: 16,
        // lineHeight: 34,
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#fff'
    },
    buttonGrey: {
        backgroundColor: '#dbdbdb',
    },
    profilePortrait: {
        borderRadius: 22.5
    },
    profileArrow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileText: {
        color:'#ccc',
        marginRight: 10,
    },
    genderPickerContainer: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: 260,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.2)',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    genderPicker: {
        flex: 1,
        position: 'relative',
        marginTop: 40,
    },
    genderPickerTab: {
        position: 'absolute',
        width: width,
        height: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowOffset: {width: 0, height: -2,},
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#555',
        shadowOpacity: .3,
        top: 0
    },
    inputContainer: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: 260,
        bottom: 0,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    inputTab: {
        width: width,
        height: 40,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowOffset: {width: 0, height: -2,},
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#555',
        shadowOpacity: .3,
        top: 0
    },
    genderButton: {
        right: 10,
        width: 60,
        height: 30,
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderButtonFont: {
        // lineHeight: 22,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    nameText: {
        height: 40,
        width: width,
        fontSize: 14,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        marginTop: 80,
        paddingLeft: 10
    },
    cancelButton: {
        left: 10,
        width: 60,
        height: 30,
        marginTop: 0,
        backgroundColor: '#bdbdbd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonFont: {
        // lineHeight: 22,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    baseText:{
        fontSize: 14,
        color: '#4a4a4a',
        lineHeight: 18,
    },
    dimText:{
        color: '#9b9b9b',
        marginRight: 10
    },
    flex: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
    title: {
        marginLeft: 10,
        marginVertical: 10
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        height: 38,
        borderBottomWidth: 1,
        borderColor: '#f1f1f1'
    },
    inputText: {
        flex:1,
        fontSize: 14,
        paddingLeft: 10,
        height: 32
    },
    inputLabel: {
        marginLeft: 10,
        lineHeight: 34,
    },
    submit: {
        width: width,
        alignItems: 'center'
    },
    code: {
        backgroundColor: '#ececec',
        height: 38,
        paddingTop: 5
    },
    tip: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height:12,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    tipFont: {
        fontSize: 11,
        height: 28,
        marginTop: 12,
        lineHeight: 14
    },
    tipIcon: {
        color: '#fc7d30',
        marginRight: 2
    },
    logout: {
        position: 'absolute',
        width: width,
        height: 40,
        bottom: 0,
        backgroundColor: '#fc7d30',
        borderTopWidth: 1,
        borderColor: 'rgba(155,155,155,0.1)',
        justifyContent: 'center'
    },
    logoutText:{
        fontSize: 16,
        color: '#fff',
        alignSelf: 'center'
    }
});

export default styles;