'use strict';

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
import { toast } from '../../utils/common';
import Icon from 'react-native-vector-icons/Ionicons';

var {height, width} = Dimensions.get('window');

class TbPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countDown: 8,
            interval: 8,
            show: this.props.show
        }
    }

    componentDidMount() {
        const { navigator } = this.props;
        const the = this;
        this.state.timer = setTimeout(() => {
            if (this.props.onPressButton)
                this.props.onPressButton();
        }, this.state.countDown * 1000);
        this.state.interval = setInterval(()=> {
            if (the.state.countDown > 1)
                the.setState({countDown: the.state.countDown - 1});
            else
                clearInterval(this.state.interval);

        }, 1000);
        this.setState({show: true});
    }

    componentWillReceiveProps(){

    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
        clearInterval(this.state.interval);
        this.setState({show: false});
    }

    componentWillMount() {
    }

    _onPressButton() {
        if (this.props.onPressButton) {
            this.props.onPressButton();
            clearTimeout(this.state.timer);
            clearInterval(this.state.interval);
            this.setState({show: false});
        }
    }

    _notGo() {
        clearTimeout(this.state.timer);
        clearInterval(this.state.interval);
        this.setState({show: false});
        if (this.props.onPressCross)
            this.props.onPressCross();
    }

    render() {
        if(!this.state.show)
            return null;
        return (
            <View style={styles.container}>
                <View style={styles.rectangle}>
                    <View style={styles.title}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleContent}>提示</Text>
                        <View style={styles.titleLine}/>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.content1}>您即将进入淘宝购物</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.dimText}>“付款”</Text><Text style={styles.content2}>后即可获得</Text><Text style={styles.redPacket}>￥{this.props.redPacket}</Text><Text style={styles.content2}>红包</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.dimText}>“确认收货”</Text><Text style={styles.content3}>后即可红包提现</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.content2}>下单后请返回剁手记,以便跟单!</Text>
                        </View>

                    </View>
                    <View style={{ bottom:10, flexDirection:'column'}}>
                        <Button style={styles.button}
                                containerStyle={{ justifyContent: 'center'}}
                                onPress={this._onPressButton.bind(this)}>知道了，继续购物</Button>
                        <TouchableOpacity style={styles.countDown}>
                            <Text style={styles.countDownText}>{this.state.countDown}秒后自动进入</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.cross}>
                        <TouchableOpacity onPress={() => this._notGo()}>
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
        width: width * 8 / 13,
        height: height *2 / 5,
        justifyContent: 'space-between',
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
        height: 50
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
        height: 120,
        alignItems: 'center',
    },
    content1: {
        fontSize: 18,
        color: 'red',
        marginBottom: 10
    },
    dimText:{
        color: '#9b9b9b',
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
    }
});


export default TbPopup;