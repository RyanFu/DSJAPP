/**
 * Created by lyan2 on 16/8/21.
 */
import React, { Component } from 'react';
import {
    CameraRoll,
    Dimensions,
    Image,
    ListView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    DeviceEventEmitter,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import Toast from 'react-native-root-toast';
import Geolocation from 'react-native/Libraries/Geolocation/Geolocation';
import { connect } from 'react-redux';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import configs from '../../constants/configs';
import StoreActions from '../../constants/actions';
import Toolbar from '../../components/toolbar';
import AddressModel from '../../components/models/AddressModel.js';
import colors from '../../constants/colors';
import SelectPhotoPage from './index';
import PhotosReviewPage from './PhotosReviewPage';
import styles from './style';
import Home from '../home';
import {
    Token
} from '../../utils/common';
// import Emoticons, * as emoticons from 'react-native-emoticons';
import Emoticons, * as emoticons from '../../components/emoticons';
import _ from 'lodash';

const dismissKeyboard = require('dismissKeyboard');
const locationImg = require('../../assets/upload/location_bubble.png');
let faceIcon = <Icon name="smile-o" size={25} color="#9b9b9b"/>;

class PostNotePage extends Component {
    constructor(props) {
        super(props);
        var addressDS = new ListView.DataSource({rowHasChanged: (r1, r2) => {
            r1.addr !== r2.addr;
        }});
        this.state = {
            title: '',
            content: '',
            address: '正在尝试获取当前位置...',
            draftNote: this.props.draftNote,
            token: null,
            posting: false,
            titleLength: 255,
            starCount: 0,
            addressModelVisible: false,
            addressDataSource: addressDS,
            showEmoticons: false,
            cursorL: 0,
            focus: 'title',
            titleMax: 255,
            contentMax: 2000
        };

        Token.getToken(navigator).then((token) => {
            this.state.token = token;
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
        let that = this;
        var address = '定位失败';
        Geolocation.getCurrentPosition(function (position) {
            let {coords} = position;
            let url = 'http://api.map.baidu.com/geoconv/v1/?from=1&to=5&ak=D8c7c1411571551ef8fe556f08c594bd&coords=' + coords.longitude + ',' + coords.latitude;
            fetch(url, {method:'GET'})
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson && responseJson.status == 0) {
                        let coords = responseJson.result[0] || {};
                        let url = 'http://api.map.baidu.com/geocoder/v2/?output=json&pois=1&ak=D8c7c1411571551ef8fe556f08c594bd&location=' + coords.y + ',' + coords.x;

                        fetch(url, {method: 'GET'})
                            .then((response) => response.json())
                            .then((responseJson) => {
                                let {formatted_address} = responseJson.result;
                                let pois = [].concat([{addr:formatted_address}]).concat(responseJson.result.pois);
                                that.setState({addressDataSource: that.state.addressDataSource.cloneWithRows(pois),
                                    address: responseJson.result.formatted_address, latitude: coords.x, longitude: coords.y});

                            })
                            .catch((error) => {
                                console.log('Unable to get BD position:', JSON.stringify(error));
                                that.setState({address: address});
                            });

                    }
                }).catch((error) => {
                    console.log("Failed to transfer GPS position to BD position：" + JSON.stringify(error));
                    that.setState({address: address});
                });

        }, function (error) {
            console.log("Failed to get geo location：" + error);
            that.setState({address: '定位失败'});
        }, {
            timeout: 20000,
            maximumAge: 1000,
            enableHighAccuracy: true
        });

        this.state.title = this.props.draftNote.noteTitleAndContent? this.props.draftNote.noteTitleAndContent.title : '';
        this.state.content = this.props.draftNote.noteTitleAndContent? this.props.draftNote.noteTitleAndContent.content : '';
        this._statCount(this.state.title);
        this._statContentCount(this.state.content);
    }

    _onCancel() {
        const { navigator, dispatch } = this.props;

        if (navigator) {
            // remove draft note since user canceled.
            dispatch({type: StoreActions.RESET_DRAFT_NOTE});
            navigator.popToTop();
        }
    }

    _addMorePhoto() {
        const { navigator, dispatch } = this.props;

        if (navigator) {
            navigator.push({
                name: 'SelectPhotoPage',
                component: SelectPhotoPage
            })
        }

        const content = {
            title: this.state.title,
            content: this.state.content
        };
        dispatch({type: StoreActions.ADD_NOTE_TITLE_AND_CONTENT, content});
    }

    _JumpToMyPage() {
        const { navigator } = this.props;
        DeviceEventEmitter.emit('newNote', true);
        navigator.popToTop();
    }

    _sendPhotos(noteId) {
        const { navigator, dispatch } = this.props;

        let data = {
            images: this.state.draftNote.notePhotos
        };

        if (data.images.length <= 0) return;

        data.images = data.images.map(image => {
            return {"image": image.image, "marks": image.marks}
        });

        fetch(configs.imageServiceUrl + 'notes/' + noteId + '/images', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-App-Token': this.state.token
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                return {
                    resultCode: 1,
                    resultErrorMessage: response.status === 413 ? '图片过大' : ''
                }
            }

        }).then((responseJson) => {
            if (responseJson.resultCode == 0) {
                // remove draft note since it has been post to server.
                dispatch({type: StoreActions.RESET_DRAFT_NOTE});
                this.state.posting = false;

                if (navigator) {
                    //navigator.popToTop();
                    Toast.show('笔记发布成功', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER
                    });
                    DeviceEventEmitter.emit('portraitUpdated', true);
                    this._JumpToMyPage();
                }
            } else {
                Toast.show('抱歉，笔记图片发布失败。', {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
                this.state.posting = false;
            }
        }).catch((error) => {
            console.error(error);
            this.state.posting = false;
        });

        Toast.show('正在努力发布中，请耐心等待...', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER
        });
    }

    _sendNote() {
        if (this.state.posting) return;
        this.state.posting = true;

        if (this.state.draftNote == null || this.state.draftNote.notePhotos == null) {
            Toast.show('发送笔记前，请先选择需要上传的图片。', {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            return;
        }

        let data = {
            title: emoticons.stringify(this.state.title),
            content: emoticons.stringify(this.state.content),
            address: this.state.address,
            latitude: this.state.latitude,
            longitude: this.state.longitude
        };


        if (!data.title || !data.content) {
            Toast.show('发布笔记需要您输入标题和内容。', {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            this.state.posting = false;
            return;
        }

        fetch(configs.serviceUrl + 'user/notes/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-App-Token': this.state.token
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((responseJson) => {
            if (responseJson && responseJson.resultCode == 0 && responseJson.resultValues) {
                this._sendPhotos(responseJson.resultValues.noteId);
            } else {
                Toast.show('发送笔记失败。', {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
                this.state.posting = false;
            }
        }).catch((error) => {
            Toast.show('发送失败，可能是网络中断。', {duration: Toast.durations.SHORT, position: Toast.positions.CENTER});
            this.state.posting = false;
        });
    }

    _renderPhotosRow(photos, photosPerRow, fromIndex) {

        if (photos != null && photos.length > 0) {
            return photos.slice(fromIndex, fromIndex + photosPerRow);
        }

        return null;
    }

    _callbackFromPreview() {
        this.setState({remove: true});
    }

    _onPressPhoto(index) {
        const { navigator } = this.props;

        if (navigator) {
            navigator.push({
                name: 'PhotosReviewPage',
                component: PhotosReviewPage,
                params: {index: index},
                removeCallback: this._callbackFromPreview.bind(this)
            })
        }
    }

    _inputContent(content) {
        if(!this._statContentCount(content)){
            content = emoticons.stringify(content);
            content = content.substring(0, this.state.contentMax);
            this.setState({content: emoticons.parse(content)});
        }
    }

    _statContentCount(content) {
        const length = emoticons.stringify(content).length;
        if(!content||length<=this.state.contentMax){
            this.setState({content: content});
            return true;
        }
        return false;
    }

    _inputTitle(title) {
        if(!this._statCount(title)){
            title = emoticons.stringify(title);
            title = title.substring(0, this.state.titleMax);
            this.setState({titleLength: 0});
            this.setState({title: emoticons.parse(title)});
        }
    }

    _statCount(title) {
        const length = emoticons.stringify(title).length;
        if(!title||length<=this.state.titleMax){
            this.setState({titleLength: this.state.titleMax - length});
            this.setState({title: title});
            return true;
        }
        return false;
    }

    _renderSelectedPhotos() {
        let {height, width} = Dimensions.get('window');
        let that = this;
        let morePhoto = (
            <TouchableOpacity key='morePhoto' style={styles.morePhotoBox} onPress={this._addMorePhoto.bind(this)}>
                <Icon size={16} name="plus" color={colors.gray}/>
            </TouchableOpacity>
        );

        let { notePhotos } = this.state.draftNote;
        let photos = [];
        let photoRows = [];
        let photosPerRow = 4;
        let rowIndex = 0;
        let {imageWidth, imageHeight} = {imageWidth: (width - 60) / photosPerRow, imageHeight: 80};

        if (notePhotos != null && notePhotos.length > 0) {
            notePhotos.forEach(function (notePhoto, index) {
                let image = (
                    <TouchableOpacity key={notePhoto.photo.uri+index}
                                        onPress={() => that._onPressPhoto.call(that, index)}>
                        <Image source={{uri:notePhoto.image}} style={styles.uploadAvatar} width={imageWidth}
                               height={imageHeight}/>
                    </TouchableOpacity>
                );
                photos.push(image);
            });
        }

        photos.push(morePhoto);

        rowIndex = Math.ceil(photos.length / photosPerRow) - 1;
        for (let i = 0; i <= rowIndex; i++) {
            let row = <View key={i}
                            style={{flexDirection:'row', paddingVertical: 5}}>{this._renderPhotosRow(photos, photosPerRow, i * photosPerRow)}</View>;
            photoRows.push(row);
        }

        return photoRows;
    }

    _onAddressSelected(rowData) {
        this.setState({addressModelVisible:false, address:rowData.addr});
    }

    _showEmoticons() {
        this.setState({showEmoticons: !this.state.showEmoticons});
        Keyboard.dismiss();
    }

    _Focus(val) {
        this.setState({showEmoticons: false});
        this.setState({focus: val});
    }

    _onEmoticonPress(val) {
        const commentLeft = _.slice(this.state[this.state.focus], 0, this.state.cursorL);
        const commentRight = _.slice(this.state[this.state.focus], this.state.cursorL, this.state[this.state.focus].length);

        if(this.state.focus === 'title'){
            if(emoticons.stringify(this.state.title+val.code).length<=this.state.titleMax){
                this.setState({title: _.join(commentLeft, '') + val.code + _.join(commentRight, '')});
                this.setState({titleLength: this.state.titleMax - emoticons.stringify(this.state.title).length - emoticons.stringify(val.code).length});

            }
        }
        if(this.state.focus === 'content'){
            if(emoticons.stringify(this.state.content+val.code).length<=this.state.contentMax){
                this.setState({content: _.join(commentLeft, '') + val.code + _.join(commentRight, '')});
            }
        }
    }


    _getSelection(event) {
        this.setState({cursorL: event.nativeEvent.selection.start});
    }

    _onBackspacePress() {
        let commentLeft = _.join(_.slice(this.state[this.state.focus], 0, this.state.cursorL),'');
        const commentRight = _.join(_.slice(this.state[this.state.focus], this.state.cursorL, this.state[this.state.focus].length),'');

        if(this.state.focus === 'title'){
            this._statCount(this.state.title);
            this.setState({title: _.join(_.dropRight(emoticons.splitter(commentLeft)), '') + _.join(commentRight, '')});
        }
        if(this.state.focus === 'content'){
            this._statContentCount(this.state.content);
            this.setState({content: _.join(_.dropRight(emoticons.splitter(commentLeft)), '') + _.join(commentRight, '')});
        }

    }

    render() {
        let {height, width} = Dimensions.get('window');
        height -= 21;

        return (
            <TouchableWithoutFeedback style={{flex:1}} onPress={dismissKeyboard}>

                <View
                    style={[styles.pushContainer, {minHeight: height}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                    <Toolbar
                        title="发布笔记"
                        navigator={this.props.navigator}
                        hideDrop={true}
                        rightText='取消'
                        onRightIconClicked={this._onCancel.bind(this)}
                        />
                    <AddressModel visible={this.state.addressModelVisible} dataSource={this.state.addressDataSource}
                                  onSelect={this._onAddressSelected.bind(this)}/>
                    <View style={styles.main}>
                        <View
                            style={{borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', paddingVertical: 8,height: 38, margin: 5,marginHorizontal:15}}>
                            <TextInput ref='titleInput' placeholder='添加标题' value={this.state.title}
                                       clearButtonMode='while-editing' underlineColorAndroid='transparent'
                                       onChangeText={(value) => this._inputTitle(value)}
                                       onFocus={()=>this._Focus('title')}
                                       onSelectionChange={(event)=>this._getSelection(event)}
                                       returnKeyType="next" maxLength={this.state.titleMax} style={[styles.textInputS, {flex:1}]}/>
                            <Text>{this.state.titleLength}</Text>
                        </View>
                        <View style={{flexDirection: 'row', paddingVertical:10, marginHorizontal: 15,height: 150}}>
                            <TextInput ref='contentInput' placeholder='说点你的心得吧' value={this.state.content}
                                       clearButtonMode='while-editing' underlineColorAndroid='transparent'
                                       returnKeyType="done" multiline={true} numberOfLines={8}
                                       style={[styles.textInputS, {flex:1}]}
                                       onFocus={()=>this._Focus('content')}
                                       maxLength={this.state.contentMax}
                                       onSelectionChange={(event)=>this._getSelection(event)}
                                       onChangeText={(value) => this._inputContent(value)}/>
                        </View>
                        <View
                            style={[{borderBottomWidth: 1, borderBottomColor: '#ccc', paddingVertical:10, marginHorizontal: 15}]}>
                            {this._renderSelectedPhotos()}
                        </View>

                        <View style={{flexDirection: 'row', alignItems: 'center', padding:10, marginHorizontal: 15}}>
                            <Image source={locationImg} style={{marginRight: 10}}/>
                            <Text>发布于：</Text>
                            <Text lineBreakMode={'tail'} numberOfLines={1}
                                  style={{color: colors.orange,maxWidth: width-140}}
                                onPress={() => this.setState({addressModelVisible:this.state.addressDataSource.getRowCount() > 0})}>{this.state.address}</Text>
                        </View>
                        <View style={styles.shortcut}>
                            <TouchableOpacity
                                onPress={this._showEmoticons.bind(this)}
                                style={styles.emoticon}>
                                {faceIcon}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Emoticons
                        onEmoticonPress={this._onEmoticonPress.bind(this)}
                        show={this.state.showEmoticons}
                        onBackspacePress={this._onBackspacePress.bind(this)}
                        concise={true}
                        showPlusBar={false}
                        style={{zIndex: 1000}}
                        />

                    <TouchableOpacity onPress={this._sendNote.bind(this)}
                                        style={{padding: 15, justifyContent:'center', backgroundColor: colors.orange, flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0}}>
                        <Text style={{color: '#fff', fontSize:18}}>发布</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
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

export default connect(mapStateToProps)(PostNotePage);