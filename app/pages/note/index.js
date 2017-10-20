/**
 * Created by lyan2 on 16/8/2.
 */
import React, { Component } from 'react';
import {
    CameraRoll,
    Dimensions,
    Image,
    InteractionManager,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import Toast from 'react-native-root-toast';
import ImagePicker from 'react-native-image-picker';
import { connect } from 'react-redux';
import Toolbar from '../../components/toolbar';
import PhoneLib from '../../components/camera/PhoneLib';
import StoreActions from '../../constants/actions';
import PhotoEditPage from './PhotoEditPage';
import ImageButton from '../../components/toolbar/ImageButton';
const arrowImg = require('../../assets/header/arrow.png');
import styles from './style';

class SelectPhotoPage extends Component {
    constructor(props, context) {
        super(props);
        this._onContinue = this._onContinue.bind(this);

        this.state = {
            selectedPhoto: {},
            continuePressed: false
        };

        this.cameraOptions = {
            title: '选择照片',
            storageOptions: {
                skipBackup: true,
                path: 'images'
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
        ImagePicker.launchCamera(this.cameraOptions, (response)  => {

            if (response.didCancel) {

            } else if (response.error) {
                Toast.show(response.error, {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            } else if (response.customButton) {

            } else {
                // You can display the image using either data...
                //let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                this.setState({
                    selectedPhoto: response
                });
            }
        });
    }

    _onPressImageLib() {
        // Open Image Library:
        ImagePicker.launchImageLibrary(this.phoneLibOptions, (response)  => {
            if (response.didCancel) {
            } else if (response.error) {
                Toast.show(response.error, {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            } else if (response.customButton) {
            } else {
                // You can display the image using either data...
                //let source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                this.setState({
                    selectedPhoto: response
                });
            }
        });
    }

    _onPressImage(imageNode) {
        console.log(imageNode);
        this.setState({
            selectedPhoto: imageNode.image
        });
    }

    _getFirstImage(data) {
        if (data != null) {
            let assets = data.edges;
            if (assets.length > 0) {
                this.setState({selectedPhoto: assets[0].node.image});
            }
        }
    }

    _onCancel() {
        const { navigator } = this.props;

        if (navigator) {
            navigator.pop();
        }
    }

    _onContinue() {
        const { navigator, dispatch } = this.props;

        if (!this.state.continuePressed) {
            this.state.continuePressed = true;

            dispatch({type: StoreActions.ADD_NOTE_PHOTO, photo: this.state.selectedPhoto});

            InteractionManager.runAfterInteractions(() => {
                if (navigator) {
                    navigator.push({
                        name: 'PhotoEditPage',
                        component: PhotoEditPage,
                        params: {photo: this.state.selectedPhoto}
                    })
                }
                this.state.continuePressed = false;
            });
        }
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
        if (this.state.selectedPhoto) {
            const image = this.state.selectedPhoto;
            pWidth = image.width / image.height * pHeight;
            if (pWidth > width) {
                pWidth = width;
                pHeight = image.height / image.width * pWidth;
            }
        }
        return (
            <View style={[styles.container, {height}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="所有照片"
                    onTitlePress={this._onPressImageLib.bind(this)}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    rightText='继续'
                    onRightIconClicked={this._onContinue.bind(this)}
                    />
                <View
                    style={{borderBottomWidth: 1, borderColor: '#f1f1f1', width: width, height: 200,alignItems: 'center',justifyContent: 'center'}}>
                    <Image source={this.state.selectedPhoto} style={{}} width={pWidth}
                           height={pHeight} resizeMode={'contain'}/>
                </View>
                <PhoneLib contentContainerStyle={{flex:1,paddingLeft:3,paddingTop:3,paddingBottom: 3}} navigator={this.props.navigator}
                          onPressCamera={this._onPressCamera.bind(this)} onPressImage={this._onPressImage.bind(this)}/>

            </View>
        );
    }
}

// get selected photos from store.state object.
function mapStateToProps(state) {
    return {};
}

export default connect(mapStateToProps)(SelectPhotoPage);