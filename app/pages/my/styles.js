/**
 * Created by lyan2 on 16/7/26.
 */
import React from 'react-native'

var {
    StyleSheet,
    Dimensions
} = React;
var {height, width} = Dimensions.get('window');

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: height,
        overflow: 'scroll',
        backgroundColor: '#f1f1f1'
    },
    text:{
        color: '#4a4a4a'
    },
    userContainer: {
        flexDirection:'column',
        alignItems: 'center',
        paddingTop: 0,
        backgroundColor: '#f1f1f1'
    },
    portrait: {
        borderRadius: 45,
        borderColor: '#fff',
        borderWidth: 2,
    },
    portraitImg: {
        borderRadius: 22.5,
    },
    user: {
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        marginTop:5,
        width: width/10*3,
        marginLeft: 5
    },
    gender: {
        marginLeft: 4,
    },
    income: {
        flexDirection:'column',
        justifyContent: 'space-between',
        alignItems:'center',
        marginTop:5,
        width: width/10*7,
        paddingLeft: 0
    },
    summaryContainer: {
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'stretch',
        backgroundColor:'#fff',
        marginTop: 10,
        marginBottom: 5,
        paddingVertical:5
    },
    asset: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    assetText: {
        fontSize:12
    },
    separatorVertical: {
        borderLeftWidth:1,
        borderLeftColor:'#ccc'
    },
    //separatorHorizontal: {
    //    borderBottomWidth:1,
    //    borderBottomColor:'#ccc'
    //},
    count: {
        fontSize:20,
        color:'#FC4D30'
    },
    myNotesTitle: {
        backgroundColor: '#fff',
        padding: 16,
    },
    myNoteContainer: {
        paddingBottom: 60,
    },
    myNote:{
        borderTopWidth: 4,
        borderTopColor: '#f1f1f1',
        backgroundColor: '#fff',
        padding: 20,
    },
    noteUserBox: {
        flexDirection: 'row'
    },
    noteUserMsgBox: {
        marginLeft: 5,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    noteUserTitle: {
        fontSize: 16
    },
    noteCreateTime: {
        fontSize: 12,
        color: '#9B9B9B'
    },
    noteThumbBox: {
        marginTop: 10,
    },
    noteThumb: {
        overflow:'hidden'
    },
    noteTitle: {
        fontSize: 14,
        marginVertical: 10
    },
    noteAssets: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    noteAsset: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    noteAssetIcon: {
        color:'#FC4D30'  
    },
    loading: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f1f1f1',
        marginTop: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modal: {
        width: width * .6,
        height: 80,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: 6,
    },
    op: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width : width * .6,
    },
    line: {
        borderBottomWidth: .6,
        borderColor: '#cecece'
    },
    redText: {
        color: 'red'
    },
    delete: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    my: {
        flexDirection:'row',
        justifyContent: 'space-around',
        alignItems:'center',
        marginTop:5
    },
    incomeLine: {
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
        height: 24
    },
    button: {
        height: 22,
        backgroundColor: '#fc7d30',
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: "center",
        width: 50,
        marginLeft: 0
    },
    buttonFont: {
        fontSize: 12,
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#fff'
    },
    myNameText: {
        fontSize: 14,
        color: '#9b9b9b',
        paddingLeft: 6
    },
    emptyTip: {
        width: '70%',
        alignSelf: 'center',
        alignItems: 'center',
        height: height,
        marginTop: 20
    },
    emptyTipText: {
        textAlign: 'center',
        lineHeight: 20
    },

    what: {
        marginLeft: 5
    }
});