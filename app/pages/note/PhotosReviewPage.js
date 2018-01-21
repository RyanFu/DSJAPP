/**
 * Created by lyan2 on 16/9/8.
 */
import React, { Component } from 'react';
import {
    CameraRoll,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import StoreActions from '../../constants/actions';
import Toolbar from '../../components/toolbar';
import colors from '../../constants/colors';
import { naviGoBack } from '../../utils/common';
import styles from './style';
import ImageSlider from '../../components/imageSlider';

const garbageImg = require('../../assets/note/garbage.png');

class PhotosReviewPage extends Component {
    constructor(props) {
        super(props);
        let { notePhotos } = this.props.draftNote;

        if (props.route) {
            this.refreshPostNotePage = props.route.removeCallback;
        }

        this.state = {
            currentPhotoIndex: props.index,
            notePhotos: notePhotos,
        };

        if (notePhotos != null && notePhotos.length > 0) {
            this.state.tabs = notePhotos.map(function(photo, i){
                return ""+i;
            });
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    shouldComponentUpdate() {
        return true;
    }

    _onChangeTab(data) {
        this.setState({currentPhotoIndex : data.i});
    }

    _onPressDelete(){
        const {dispatch, navigator} = this.props;
        let {currentPhotoIndex} = this.state;

        this.setState({currentPhotoIndex: currentPhotoIndex?currentPhotoIndex-1:currentPhotoIndex});

        dispatch({type:StoreActions.REMOVE_NOTE_PHOTO, index: currentPhotoIndex});
        this.refreshPostNotePage && this.refreshPostNotePage();
        //this.scrollableTab.goToPage(this.state.currentPhotoIndex);
        this.setState({notePhotos: this.props.draftNote.notePhotos});

        if (this.state.notePhotos.length === 0) {
            if(navigator) {
                navigator.pop();
            }
        }
    }

    _renderSelectedPhotos() {
        let {height, width} = Dimensions.get('window');
        let { notePhotos } = this.state;
        let photos = [];

        height -= 51;

        if (notePhotos != null && notePhotos.length > 0) {
            notePhotos.forEach(function(photo, index){
                let key = "" + index;
                let image = <Image key={key} tabLabel={key} source={{uri:photo.image}} resizeMode='contain' style={{height:height, width:width}}/>
                photos.push(image);
                console.log(index);
            });
        }

        return photos;
    }

    render() {
        let {height, width} = Dimensions.get('window');
        let images = [];
        let { notePhotos } = this.state;
        if (notePhotos != null && notePhotos.length > 0) {
            notePhotos.forEach(function(photo, index){
                let image = {
                    width: photo.width,
                    height:photo.height,
                    uri: photo.image
                };
                images.push(image);
            });
        } else {
            return null;
        }

        return (
            <View style={[styles.container, {height: height - 21}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title={this.state.currentPhotoIndex + 1 + "/" + this.state.notePhotos.length}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    rightImg={garbageImg}
                    onRightIconClicked={this._onPressDelete.bind(this)}
                    />
                <ScrollView style={{height: height - 60}}>
                    {
                        this.state.currentPhotoIndex>=0?  <ImageSlider
                            images={images}
                            initialPosition={this.state.currentPhotoIndex}
                            position={this.state.currentPhotoIndex}
                            onPositionChanged={position => this.setState({currentPhotoIndex: position})}
                        />: null
                    }

                </ScrollView>



            </View>
        );
    }
}

// get selected photos from store.state object.
function mapStateToProps(state) {
    const { draftNote } = state;
    return {
        draftNote
    };
}

export default connect(mapStateToProps)(PhotosReviewPage);