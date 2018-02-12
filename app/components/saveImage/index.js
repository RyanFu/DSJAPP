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
    Image,
    CameraRoll
} from 'react-native';
import { connect } from 'react-redux';
import {isIphoneX, toast} from '../../utils/common';
import configs from '../../constants/configs';

var {height, width} = Dimensions.get('window');
const propTypes = {
    press: PropTypes.func
};

class SaveImage extends React.Component {
    constructor(props) {
        super(props);
        this._saveImage = this._saveImage.bind(this);
        this.state = {
            fadeAnim: new Animated.Value(0),
            dropAnim: new Animated.Value(-150),
        }
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnim,
                {toValue: 0.4}
            ),
            Animated.timing(
                this.state.dropAnim,
                {toValue: 0}
            )
        ]).start();

    }

    componentWillMount() {
    }

    _saveImage() {
        CameraRoll.saveToCameraRoll(this.props.image.uri, 'photo')
            .then(()=>{
                toast('成功保存');
                this.props.press();
            },
                ()=>{
                toast('您未开启保存图片权限')
                });
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <View style={[styles.saveImage, isIphoneX()? {top: -41}: {top: -21}]}>
                    <Animated.View style={[styles.saveImageContent,{bottom: this.state.dropAnim}]}>

                        <TouchableOpacity style={styles.button} onPress={this._saveImage}>
                            <Text style={styles.buttonFont} >保存图片</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.props.press}>
                            <Text style={styles.buttonFont} >取消</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableWithoutFeedback onPress={this.props.press}>
                        <Animated.View  style={[styles.saveImageShadow, {opacity: this.state.fadeAnim}]}>

                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    saveImage: {
        flex: 1,
        top: -21,
        left: 0,
        zIndex: 10,
        flexDirection: 'column',
        position: 'absolute'
    },
    saveImageShadow: {
        top: 0,
        left: 0,
        backgroundColor: '#000',
        width: width,
        height: height,
    },
    saveImageContent: {
        position: 'absolute',
        backgroundColor: '#fff',
        opacity: 1,
        zIndex: 100,
        flexDirection: 'column',
        width: width,
        justifyContent: 'space-around',
        height: 100,
        paddingVertical: 5
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: width,
        padding: 30,
        height: 120,
    },
    saveImageItem: {
        height: 80,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    saveImageFont: {
        fontSize: 14,
        color: '#9b9b9b'
    },
    button: {
        height: 36,
        backgroundColor: '#efefef',
        margin: 30,
        marginVertical: 0,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonFont: {
        fontSize: 16,
        lineHeight: 26,
        color: '#9b9b9b'
    }
});

function mapStateToProps(state) {
    const { home } = state;
    return {
        home
    };
}

export default connect(mapStateToProps)(SaveImage);