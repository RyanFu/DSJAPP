/**
 * Created by lyan2 on 16/8/2.
 */
import React, { Component } from 'react';
const ReactNative = require('react-native');
const {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} = ReactNative;
import CameraRollView from './CameraRollView';
import Icon from 'react-native-vector-icons/FontAwesome';
import deprecatedComponents from 'react-native-deprecated-custom-components';

var cameraIcon = <Icon name="camera" size={40} color="#fc7d30" />;

class PhoneLib extends Component {
    constructor(props) {
        super(props);
        
        this._imageProps = {
        };

        this._cameraProps = {
            onPress : this.props.onPressCamera
        }

        this.imageCount = 0;
    }

    _onPressImage(node) {
        if (this.props.onPressImage) {
            this.props.onPressImage.call(null, node);
        }
    }

    _renderImage(asset){
        let {height, width} = Dimensions.get('window');
        let imageWidth = (width - 24) / 3;
        let imageHeight = imageWidth;
        //console.log(asset);

        return asset.camera ? (
            <TouchableHighlight key='camera' {...this._cameraProps} style={[styles.cameraContainer, {width:imageWidth, height:imageHeight}]}>
                {cameraIcon}
            </TouchableHighlight>
        ) : (
            <TouchableHighlight key={asset.node.image.uri} {...this._imageProps} onPress={() => {this._onPressImage(asset.node)}}>
                <Image style={styles.image}
                    source={asset.node.image}
                    height={imageHeight} width={imageWidth}
                />
            </TouchableHighlight>
        );
    }
    
    render() {
        let containerStyle = [styles.container, this.props.contentContainerStyle];

        return (
            <ScrollView contentContainerStyle={containerStyle} scrollEnabled={true} showsVerticalScrollIndicator={true}>
                <CameraRollView
                    batchSize={9}
                    groupTypes="SavedPhotos"
                    imagesPerRow={3}
                    assetType="Photos"
                    renderImage={this._renderImage.bind(this)}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF'
    },
    image: {
        margin: 3
    },
    cameraContainer: {
        backgroundColor: '#fff',
        margin: 3,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default PhoneLib;