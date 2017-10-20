import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    Image,
    AsyncStorage,
    Picker,
    TouchableOpacity,
    DeviceEventEmitter,
    TextInput,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import StorageKeys from '../../constants/StorageKeys';
import images from '../../constants/images';
import portraitPage from '../settings/portrait';
import { toast, Token, request } from '../../utils/common';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this._updatePortrait = this._updatePortrait.bind(this);
        this.state = {
            user: {},
            cacheUser: {},
            showPicker: false,
            showInput: false,
            showChanger: false
        }
    }

    componentWillMount() {
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail)=> {
            if (meDetail !== null) {
                const detail = JSON.parse(meDetail);
                this.setState({user: detail});
                this.setState({cacheUser: detail});
            }
        })

    }

    _showChanger(name) {
        this.setState({showChanger: true})
        if(name === 'showInput'){
            this.setState({showInput: true});
            this.setState({showPicker: false});
        }

        if(name === 'showPicker')
        {
            this.setState({showPicker: true});
            this.setState({showInput: false});
        }

    }

    _updatePortrait(info) {
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'portraitPage',
                component: portraitPage,
                sceneConfigs: Navigator.SceneConfigs.FadeAndroid,
                info: info
            })
        }
    }

    _updateGender(gender) {
        this.setState({
            cacheUser: Object.assign({}, this.state.user,{gender: gender})
        });
    }

    _updateName(text) {
        this.setState({
            cacheUser: Object.assign({}, this.state.user,{name: text})
        });
    }

    _updateOnServer() {
        this.setState({showChanger: false});
        this._updateProfile();
    }

    _updateProfile() {
        this.setState({
            user: Object.assign({}, this.state.user,this.state.cacheUser)
        });
        const {navigator } = this.props;
        Token.getToken(navigator).then((token) => {
                if (token) {
                    let body = {
                        nickname: this.state.user.name ,
                        gender: (this.state.user.gender === 'man' ? 'MALE' : 'FEMALE')
                    };
                    body = JSON.stringify(body);
                    request('/user/settings/personal-information', 'POST', body, token)
                        .then((res) => {
                            if (res.resultCode === 0) {
                                toast('修改成功');
                                DeviceEventEmitter.emit('portraitUpdated', true);
                            }
                        }, function (error) {
                            console.log(error);
                        })
                        .catch(() => {
                            console.log('network error');
                        });
                }
            }
        );
    }

    _cancel() {
        this.setState({showChanger: false});
    }

    render() {
        return (
            <View key="m"
                  style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="个人资料"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />

                <TouchableHighlight onPress={()=>this._updatePortrait(this.state.user)}>
                    <View style={styles.row}>
                        <Text style={styles.text}>
                            <Image style={styles.profilePortrait}
                                   source={{uri: this.state.user.thumbUri?this.state.user.thumbUri:images.DEFAULT_IMAGE, width: 45, height: 45}}/>
                        </Text>
                        <View style={styles.profileArrow}>
                            <Text style={styles.profileText}>修改头像</Text>
                            <View>{chevronRightIcon}</View>
                        </View>

                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>

                <TouchableHighlight onPress={()=>this._showChanger('showInput')}>
                    <View style={styles.row}>
                        <Text style={styles.text}>昵称</Text>
                        <View style={styles.profileArrow}>
                            <Text style={styles.profileText}>{this.state.user.name}</Text>
                            <View>{chevronRightIcon}</View>
                        </View>

                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>

                <TouchableHighlight onPress={()=>this._showChanger('showPicker')}>
                    <View style={styles.row}>
                        <Text style={styles.text}>性别</Text>
                        <View style={styles.profileArrow}>
                            <Text
                                style={styles.profileText}>{ this.state.user.gender && this.state.user.gender == 'women' ? '女' : '男' }</Text>
                            <View>{chevronRightIcon}</View>
                        </View>

                    </View>
                </TouchableHighlight>
                <View style={styles.separatorHorizontal}/>

                {
                    this.state.showChanger && this.state.showPicker ?
                        <View style={styles.genderPickerContainer}>
                            <View style={styles.genderPickerTab}>
                                <TouchableOpacity style={[styles.button,styles.cancelButton]}
                                                  onPress={()=>this._cancel()}>
                                    <Text style={[styles.buttonFont, styles.cancelButtonFont]}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button,styles.genderButton]}
                                                  onPress={()=>this._updateOnServer()}>
                                    <Text style={[styles.buttonFont, styles.genderButtonFont]}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                selectedValue={this.state.cacheUser.gender}
                                style={[styles.genderPicker]}
                                onValueChange={(gender) => this._updateGender(gender)}>
                                <Picker.Item label="男" value="man"/>
                                <Picker.Item label="女" value="women"/>
                            </Picker>

                        </View>
                     : (
                        <View></View>
                    )
                }

                {
                    this.state.showChanger &&  this.state.showInput ?
                        <KeyboardAvoidingView behavior={'position'} contentContainerStyle={styles.flex} style={styles.inputContainer}>
                            <View style={styles.inputTab}>
                                <TouchableOpacity style={[styles.button,styles.cancelButton]}
                                                  onPress={()=>this._cancel()}>
                                    <Text style={[styles.buttonFont, styles.cancelButtonFont]}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button,styles.genderButton]}
                                                  onPress={()=>this._updateOnServer()}>
                                    <Text style={[styles.buttonFont, styles.genderButtonFont]}>确定</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.nameText}
                                placeholder={this.state.user.name}
                                placeholderTextColor='#bebebe'
                                multiline={false}
                                onChangeText={(text) => this._updateName(text)}
                                />

                        </KeyboardAvoidingView>
                        : (
                        <View></View>
                    )
                }


            </View>
        )
    }
}

export default ProfilePage;