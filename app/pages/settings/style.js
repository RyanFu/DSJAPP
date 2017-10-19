/**
 * Created by lyan2 on 16/9/22.
 */
import React from 'react';
import {Dimensions,StyleSheet} from 'react-native';

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    row: {
        flexDirection:'row',
        backgroundColor:'#fff',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    separatorHorizontal: {
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
    },
    text: {
        fontSize:16,
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
        width: width/2,
        marginTop: 20
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 26,
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
    },
    genderButtonFont: {
        lineHeight: 22,
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

    },
    cancelButtonFont: {
        lineHeight: 22,
    },
    baseText:{
        fontSize: 13,
        color: '#4a4a4a',
        lineHeight: 18,
        paddingBottom: 2
    },
    dimText:{
        color: '#9b9b9b',
        marginRight: 10
    },
    flex: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.2)',
    },
});

export default styles;