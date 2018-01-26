'use strict';

import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Alert,
    DeviceEventEmitter,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {isIphoneX, request, toast} from '../../utils/common';
import { Token } from '../../utils/common';
import {fetchCommentsList} from '../../actions/comments';
import { connect } from 'react-redux';
//import Emoticons, * as emoticons from 'react-native-emoticons';
import Emoticons, * as emoticons from '../../components/emoticons';
import AutoHideKeyboard from '../../components/autoHideBoard';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
let faceIcon = <Icon name="smile-o" size={25} color="#9b9b9b"/>;
const dismissKeyboard = require('dismissKeyboard');
import StarRating from 'react-native-star-rating';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import {fetchDetail} from '../../actions/detail';
const Navigator = deprecatedComponents.Navigator;

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this._getSelection = this._getSelection.bind(this);
        this.state = {
            comment: '',
            showEmoticons: false,
            cursorL: 0
        };
    }

    _submit() {
        let the = this;
        const {navigator, route } = this.props;
        const noteId = route.noteId;
        if (!this.state.comment) {
            return;
        }
        Token.getToken(navigator).then((token) => {
                if (token) {
                    let body = {
                        comment: emoticons.stringify(this.state.comment),
                        rating: this.state.starCount,
                        longitude: 0,
                        latitude: 0
                    };
                    body = JSON.stringify(body);
                    //const body = 'comment=' + this.state.comment + '&rating=0&longitude=0&latitude=0';
                    request('/notes/' + noteId + '/comments', 'POST', body, token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast('评论成功');
                                the._jumpToListPage()
                            }
                        }, function (error) {
                            console.log(error);
                        })
                        .catch(() => {
                            console.log('network error');
                        });
                } else {
                    navigator.push({
                        component: LoginPage,
                        name: 'LoginPage',
                        sceneConfigs: Navigator.SceneConfigs.FloatFromBottom
                    });
                }
            }
        );

    }

    _jumpToListPage() {
        const {navigator, dispatch, route, comments } = this.props;
        dispatch(fetchCommentsList(route.noteId)).then(() => {
            DeviceEventEmitter.emit('newComment', route.noteId);
            dispatch(fetchDetail(route.noteId));
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
            }
        });

    }

    _onEmoticonPress(val) {
        const commentLeft = _.slice(this.state.comment, 0, this.state.cursorL);
        const commentRight = _.slice(this.state.comment, this.state.cursorL, this.state.comment.length);

        this.setState({comment: _.join(commentLeft, '') + val.code + _.join(commentRight, '')});
        //this.refs['comment'].blur();
    }

    _showEmoticons() {
        this.setState({showEmoticons: !this.state.showEmoticons});
        //dismissKeyboard();
        Keyboard.dismiss();
    }

    _commentFocus() {
        this.setState({showEmoticons: false});
    }

    _getSelection(event) {
        this.setState({cursorL: event.nativeEvent.selection.start});
    }

    _onBackspacePress() {
        let commentLeft = _.join(_.slice(this.state.comment, 0, this.state.cursorL),'');
        const commentRight = _.join(_.slice(this.state.comment, this.state.cursorL, this.state.comment.length),'');
        this.setState({comment: _.join(_.dropRight(emoticons.splitter(commentLeft)), '') + _.join(commentRight, '')});
    }

    _onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback style={{flex:1}} onPress={dismissKeyboard}>

                <View style={[styles.container, Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                    <Toolbar
                        title="评论"
                        navigator={this.props.navigator}
                        hideDrop={true}
                        />

                    <View style={styles.comment}>
                        <TextInput
                            ref='comment'
                            style={styles.commentText}
                            placeholder={'来说说你的心得吧'}
                            placeholderTextColor='#bebebe'
                            multiline={true}
                            underlineColorAndroid='transparent'
                            returnKeyType='done'
                            numberOfLines={8}
                            defaultValue={this.state.comment}
                            onChangeText={(text) => {this.state.comment=text }}
                            onFocus={this._commentFocus.bind(this)}
                            onSelectionChange={(event)=>this._getSelection(event)}
                            />
                    </View>
                    <View style={styles.shortcut}>
                        {
                            //<Text style={styles.at}>
                            //    @
                            //</Text>
                        }
                        <TouchableOpacity
                            onPress={this._showEmoticons.bind(this)}
                            style={styles.emoticon}>
                            {faceIcon}
                        </TouchableOpacity>
                    </View>
                    {
                        //<View style={styles.starContainer}>
                        //    <View style={styles.title}>
                        //        <Text style={[styles.baseText,styles.titleText]} >评分</Text>
                        //    </View>
                        //    <View style={{marginTop: 15}}>
                        //        <StarRating
                        //            disabled={false}
                        //            maxStars={10}
                        //            emptyStar={'md-star-outline'}
                        //            fullStar={'md-star'}
                        //            halfStar={'md-star-half'}
                        //            iconSet={'Ionicons'}
                        //            starColor={'#fc7d30'}
                        //            emptyStarColor={'#efefef'}
                        //            starSize={38}
                        //            rating={this.state.starCount}
                        //            selectedStar={(rating) => this._onStarRatingPress(rating)}
                        //            />
                        //    </View>
                        //
                        //</View>
                    }
                    <Emoticons
                        onEmoticonPress={this._onEmoticonPress.bind(this)}
                        show={this.state.showEmoticons}
                        onBackspacePress={this._onBackspacePress.bind(this)}
                        concise={true}
                        showPlusBar={false}
                        />
                    <TouchableOpacity style={styles.button} onPress={()=>this._submit()}>
                        <Text style={styles.buttonFont}>发布</Text>
                    </TouchableOpacity>


                </View>
            </TouchableWithoutFeedback>
        )

    }
}

function mapStateToProps(state) {
    const { comments } = state;
    return {
        comments
    };
}

export default connect(mapStateToProps)(Comment);