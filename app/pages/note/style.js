/**
 * Created by lyan2 on 16/8/2.
 */
import React from 'react';
//noinspection JSUnresolvedVariable
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import colors from '../../constants/colors';
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    baseText: {
        fontSize: 13,
        color: '#4a4a4a',
        lineHeight: 18
    },
    dimText: {
        color: '#9b9b9b',
    },
    container: {
        backgroundColor: colors.white
    },
    pushContainer: {
        backgroundColor: colors.bgGray
    },
    uploadAvatar: {
        marginRight: 10
    },
    selectedPhotoContainer: {
        backgroundColor: colors.black,
        flexDirection: 'row',
        height: height - 260
    },
    tabView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        flex: 1,
        margin: 0,
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: height - 260 + 21 + 20,
        bottom: 0,
        right: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'absolute'
    },
    modalContainer: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    textInput: {
        marginHorizontal: 10,
        padding: 0,
        height: 36,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 10,
        flex: 1,
        fontSize: 13,
        color: colors.white,
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 55,
        marginVertical: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 14,
        paddingLeft: 20
    },
    button: {
        marginVertical: 10,
        paddingVertical: 9,
        backgroundColor: colors.orange,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 18,
        color: colors.white,
        fontFamily: 'STHeitiSC-Medium'
    },
    cancelBtn: {
        backgroundColor: colors.bgGray
    },
    cancelBtnText: {
        color: colors.black
    },
    morePhotoBox: {
        backgroundColor: colors.bgGray,
        borderStyle: 'solid',
        borderColor: colors.gray,
        borderWidth: 1,
        width: 80,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filterBox: {
        width: 100,
        marginHorizontal: 6,
        marginVertical: 0,
        //backgroundColor:'#eee',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    filterImageFrame: {
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    filterImage: {
        width: 80,
        height: 80,
        marginVertical: 0,
        paddingVertical: 0,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    textInputS: {
        flex: 1,
        fontSize: 16,
        color: '#696969',
        borderWidth: 0,
        marginVertical: 0,
        paddingVertical: 0,
        textAlignVertical: 'top'
    },
    framedTextInput: {
        flex: 1,
        height: 28,
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 10,
        marginHorizontal: 5
    },
    tagHeader: {
        top: 0,
        height: 30,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    tagHeaderText: {
        paddingBottom: 0,
        marginBottom: 5,
        paddingBottom: 0
    },
    tagHeaderCompleteText: {
        color: '#fc7d30'
    },
    formRowLink: {
        backgroundColor: '#fff',
        paddingLeft: 0,
        justifyContent: 'center',

    },
    link: {
        width: 150,
        height: 28,
        backgroundColor: '#fc7d30',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    linkText: {
        color: '#fff',
        paddingLeft: 5
    },
    main: {
        backgroundColor: colors.white
    },
    linkedItem: {
        width: width - 110,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#f0f0f0'
    },
    closeLinkedItem: {
        position: 'absolute',
        right: 0,
        width: 50,
        height:50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeLinkedItemText: {
        fontSize: 24,
        color: '#9b9b9b'
    },
    linkedItemTitle: {
        width: width - 110 - 100 - 10,
        height: 50,
        flexWrap: 'wrap',
        paddingVertical: 8,
        marginLeft: 5,
        overflow: 'hidden'
    },
    emoticon:{
        marginLeft: 20,
        justifyContent: 'center'
    },
    shortcut:{
        flexDirection: 'row',
        height: 35,
        borderColor: "#e1e1e1",
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1
    }
});

export default styles;