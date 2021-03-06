import PropTypes from 'prop-types';

import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {isIphoneX, Token} from "../../utils/common";
import baiChuanApi from 'react-native-taobao-baichuan-api';

var {height, width} = Dimensions.get('window');

class SyncTipsPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        }
    }

    componentDidMount() {
        const { navigator } = this.props;
        const the = this;

        this.setState({show: true});
    }

    componentWillReceiveProps(){

    }

    componentWillUnmount() {
    }

    componentWillMount() {
    }

    _close(never) {
        this.setState({show: false});
        if (this.props.onPressCross)
            this.props.onPressCross(never);
    }

    _jumpToOrderPage() {
        const {navigator} = this.props;
        const type = 'tmall';

        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump('', '0', type, (error, res) => {
                    if (error) {
                        console.error(error);
                    }
                })
            }
        });
        this.setState({openOrderPage: true});
    }

    render() {
        if(!this.state.show)
            return null;
        return (
            <View style={[styles.container, isIphoneX()? {marginTop: -61}: {marginTop: -41}]}>
                <View style={styles.rectangle}>
                    <View style={styles.title}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleContent}>提示</Text>
                        <View style={styles.titleLine}/>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Text style={[styles.baseText,styles.firstLineText]}>
                                下单后请“复制单号”才能获得红包
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dimText}>
                                1：点击 <Text style={styles.important}>“复制单号”</Text>,跳到淘宝APP订单页
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dimText}>
                                2：在“我的订单”中找到您刚才购买的订单，并点击打开“订单详情”
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dimText}>
                                3：在“订单详情”页点击<Text style={styles.important}>“订单编号”</Text>旁边的<Text style={styles.important}>“复制”</Text>按钮
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dimText}>
                                4：点击<Text style={styles.important}>“返回”</Text>按钮，系统会返回剁手记，并自动跟单
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dimText}>
                                5：约5分钟内您可以看到跟单成功的订单详情以及红包
                            </Text>
                        </View>
                        <View style={[styles.row, styles.btnRow]}>
                            <TouchableOpacity style={styles.Button} onPress={() => this._jumpToOrderPage()}>
                                <Text style={styles.ButtonFont}>复制单号</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.Button, styles.greyBtn]} onPress={() => this._close()}>
                                <Text style={styles.ButtonFont}>还没下单，再逛逛</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                    <View style={styles.cross}>
                        <TouchableOpacity onPress={() => this._close()}>
                            <Icon
                                style={styles.crossIcon}
                                name='md-close'
                                size={30}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: height + 21,
        left: 0,
        top: 0,
        marginTop: -21,
        backgroundColor: 'rgba(0,0,0,.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    rectangle: {
        width: 290,
        height: 375,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 4,
        paddingTop: 18
    },
    spinner: {
        marginLeft: -10,
        marginTop: -10,
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 24,
        borderRadius: 6,
        fontSize: 12,
        textAlignVertical: 'center', /* android */
        color: '#fff',
        fontFamily: 'STHeitiSC-Medium',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F37D30'
    },
    countDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countDownText: {
        color: '#F37D30',
        fontSize: 10
    },
    title: {
        flexDirection: 'row',
        height: 30
    },
    titleLine: {
        width: 40,
        height: 2,
        backgroundColor: '#F37D30',
        marginTop: 10,
    },
    titleContent: {
        color: '#F37D30',
        paddingHorizontal: 10,
        fontSize: 22,
        fontWeight: 'bold'
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 14
    },
    content1: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10
    },
    dimText:{
        color: '#9b9b9b',
        lineHeight: 16
    },
    content2: {
        fontSize: 12,
        lineHeight:14,
        marginLeft:4,
        marginBottom: 6
    },
    content3: {
        fontSize: 12,
        lineHeight:14,
        marginLeft:4,
        marginBottom: 6
    },
    redPacket: {
        fontSize: 14,
        color: 'red',
    },
    cross: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 20,
        bottom: -50,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    crossIcon: {
        paddingTop: 2,
        borderRadius: 20,
        width: 40,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        fontWeight: "900"
    },
    important:{
        color: '#F37D30'
    },
    row: {
        marginTop: 8
    },
    Button: {
        height: 34,
        backgroundColor: '#fc7d30',
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        marginBottom: 8
    },
    ButtonFont: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    greyBtn: {
      backgroundColor: '#ddd'
    },
    btnRow: {
        flex: 1,
        alignItems: 'center',
        width: 262,
        justifyContent: 'flex-start'
    },
    firstLineText: {
        textAlign: "center",
        width: 262,
        fontSize: 16
    }
});


export default SyncTipsPopup;