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
import Spinner from 'react-native-spinkit';
import Button from '../../components/button/Button';
import {isIphoneX, toast} from '../../utils/common';
import Icon from 'react-native-vector-icons/Ionicons';

var {height, width} = Dimensions.get('window');

class newFunctions extends React.Component {
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

    _close() {
        this.setState({show: false});
        if (this.props.onPressCross)
            this.props.onPressCross();
    }


    render() {
        if(!this.state.show)
            return null;
        return (
            <View style={[styles.container]}>
                <View style={styles.rectangle}>
                    <View style={styles.title}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleContent}>新功能</Text>
                        <View style={styles.titleLine}/>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.content1}>淘口令功能上线了</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.dimText}>秒秒钟帮您定位淘宝中的同款商品</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.dimText}>1：在手淘商品页右上角找到并点击<Text style={styles.important}>”分享“</Text></Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.dimText}>2：点击<Text style={styles.important}>”复制链接“</Text></Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.dimText}>3：关闭手淘，打开剁手记</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.dimText}>4：商品页自动弹出并显示红包，您可以直接购买了哦</Text>
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
        backgroundColor: 'rgba(0,0,0,.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    rectangle: {
        width: 270,
        height: 260,
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
        backgroundColor: '#F37D30',
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
        height: 30,
        marginTop: 4,
        alignItems: 'center',
    },
    content1: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10
    },
    dimText:{
        color: '#9b9b9b',
        lineHeight: 20
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
        width: 240,
        marginHorizontal: 15,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
});


export default newFunctions;