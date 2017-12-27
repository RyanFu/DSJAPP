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

class SyncPopup extends React.Component {
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
            <View style={styles.container}>
                <View style={styles.rectangle}>
                    <View style={styles.title}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleContent}>订单号</Text>
                        <View style={styles.titleLine}/>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.content1}>{this.props.order}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.dimText}>{this.props.text?this.props.text:'五分钟内，我们会审核完成您的订单，请耐心等待，谢谢！'}</Text>
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
        width: width * 8 / 13,
        height: height *1 / 4,
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
        height: 80,
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
    },
    important:{
        color: '#F37D30'
    }
});


export default SyncPopup;