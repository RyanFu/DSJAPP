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

var {height, width} = Dimensions.get('window');

class TbPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countDown: 8,
            interval: 8
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
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer);
        clearInterval(this.state.interval);
    }

    componentWillMount() {
    }

    _onPressButton() {
        if (this.props.onPressButton) {
            this.props.onPressButton();
            clearTimeout(this.state.timer);
            clearInterval(this.state.interval);
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.rectangle}>
                    <View style={styles.title}>
                        <View style={styles.titleLine}/>
                        <Text style={styles.titleContent}>提示</Text>
                        <View style={styles.titleLine}/>
                    </View>
                    <View style={{position: 'absolute', bottom:10, flexDirection:'column'}}>
                        <Button style={styles.button}
                                containerStyle={{ justifyContent: 'center'}}
                                onPress={this._onPressButton.bind(this)}>知道了，继续购物</Button>
                        <TouchableOpacity style={styles.countDown}>
                            <Text style={styles.countDownText}>{this.state.countDown}秒后自动进入</Text>
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
        width: width * 2 / 3,
        height: height / 2,
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
    },
    titleLine: {
        width: 40,
        height: 2,
        backgroundColor: '#F37D30',
        marginTop: 6,
    },
    titleContent: {
        color: '#F37D30',
        paddingHorizontal: 14,
        fontSize: 18,
        fontWeight: 'bold'
    }
});


export default TbPopup;