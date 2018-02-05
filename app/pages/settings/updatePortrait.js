import React, { Component } from 'react';
import {
    CameraRoll,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ImageStore,
    ImageEditor,
    DeviceEventEmitter
} from 'react-native';
import Toast from 'react-native-root-toast';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Toolbar from '../../components/toolbar';
import PhoneLib from '../../components/camera/PhoneLib';
import StoreActions from '../../constants/actions';
import ImageButton from '../../components/toolbar/ImageButton';
import styles from '../note/style';
import {request, Token, toast, isIphoneX} from '../../utils/common';
import configs from '../../constants/configs';
import Loading from '../../components/loading';
const arrowImg = require('../../assets/header/arrow.png');


class UpdatePortrait extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            avatarSource: {}
        };

        this.cameraOptions = {
            title: '选择照片',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            }
        };

        this.phoneLibOptions = {
            title: '选择照片',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
    }

    _onPressCamera() {
        // The first arg is the options object for customization (it can also be null or omitted for default options),
        // Launch Camera:
        let the = this;
        ImagePicker.launchCamera(this.cameraOptions, (response)  => {
            if (response.didCancel) {
            } else if (response.error) {
                Toast.show(response.error, {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            } else if (response.customButton) {
            } else {
                // You can display the image using either data...
                //let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                the.setState({
                    avatarSource: response
                });
            }
        });
    }

    _onPressImageLib() {
        // Open Image Library:
        let the = this;
        ImagePicker.launchImageLibrary(this.phoneLibOptions, (response)  => {
            if (response.didCancel) {
            } else if (response.error) {
                Toast.show(response.error, {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            } else if (response.customButton) {
            } else {
                // You can display the image using either data...
                //let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                the.setState({
                    avatarSource: response
                });
            }
        });
    }

    _onPressImage(imageNode) {
        this.setState({
            avatarSource: imageNode.image
        });
    }

    _getFirstImage(data) {
        if (data != null) {
            let assets = data.edges;
            if (assets.length > 0) {
                this.setState({avatarSource: assets[0].node.image});
            }
        }
    }

    _onContinue() {
        const photo = this.state.avatarSource;
        const imageSize = {width,height} = photo;
        const {navigator} = this.props;
        this.setState({loading: true});
        const the = this;
        ImageEditor.cropImage(photo.uri, {offset: {x: 0, y: 0}, size: imageSize, displaySize: imageSize}, (url) => {
            ImageStore.getBase64ForTag(url, (base64) => {
                base64 = 'data:image/jpg;base64,' + base64;
                let body = {
                    image: base64
                };
                Token.getToken(navigator).then((token) => {
                    if (token) {
                        fetch(configs.serviceUrl + 'user/settings/personal-information/portrait', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'X-App-Token': token
                            },
                            body: JSON.stringify(body)
                        }).then((response) => {
                            return response.json();
                        }).then((responseJson) => {
                            if (responseJson.resultCode == 0) {
                                toast('修改头像成功');
                                DeviceEventEmitter.emit('portraitUpdated', true);
                            } else {
                                toast('修改头像失败');
                            }
                            navigator.popToTop();
                            the.setState({loading: false});
                        }).catch((error) => {
                            console.error(error);
                            the.setState({loading: false});
                        });
                    }
                });
            }, (error) => {
                console.log(error);
                the.setState({loading: true});
            });
        }, (error) => {
            console.log(error);
            the.setState({loading: true});
        });


    }

    componentDidMount() {
        // only fetch JPEG images.
        var fetchParams:Object = {
            first: 1,
            groupTypes: 'SavedPhotos',
            assetType: "Photos",
            mimeTypes: ['image/jpeg']
        };

        if (Platform.OS === 'android') {
            // not supported in android
            delete fetchParams.groupTypes;
        }

        CameraRoll.getPhotos(fetchParams)
            .then((data) => this._getFirstImage(data), (e) => logError(e));
    }

    render() {
        let {height, width} = Dimensions.get('window');
        height -= 21; // top navigator

        let pHeight = 200;
        let pWidth = width;
        if (this.state.avatarSource.width) {
            const image = this.state.avatarSource;
            pWidth = image.width / image.height * pHeight;
            if (pWidth > width) {
                pWidth = width;
                pHeight = image.height / image.width * pWidth;
            }
        }

        return (
            <View style={[styles.container, {height}, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <Toolbar
                    title="所有照片"
                    onTitlePress={this._onPressImageLib.bind(this)}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    rightText='上传'
                    onRightIconClicked={this._onContinue.bind(this)}
                    />
                <View
                    style={{marginBottom: 4,width: width, height: 200,alignItems: 'center',justifyContent: 'center'}}>
                    <Image source={this.state.avatarSource}
                           style={styles.uploadAvatar} width={pWidth}
                           height={pHeight} resizeMode={'contain'}/>
                </View>
                <PhoneLib contentContainerStyle={{flex:1}} navigator={this.props.navigator}
                          onPressCamera={this._onPressCamera.bind(this)} onPressImage={this._onPressImage.bind(this)}/>
                {this.state.loading ? (<Loading/>) : null}
            </View>
        );
    }
}


export default UpdatePortrait;