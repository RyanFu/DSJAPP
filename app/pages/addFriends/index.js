'use strict';

import React  from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TextInput,
    Image,
    Switch,
    ListView,
    Dimensions,
    Animated,
    InteractionManager,
    Platform
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import { naviGoBack, Token ,request, toast, follow } from '../../utils/common';
import Contacts from 'react-native-contacts';
import images from '../../constants/images';
import UserPage from '../../pages/user';
import _ from 'lodash';
import Spinner from 'react-native-spinkit';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

const {height, width} = Dimensions.get('window');
var backImg = require('../../assets/upload/rg_left.png');

class Friends extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this._invite = this._invite.bind(this);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._filter = this._filter.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            trueSwitchIsOn: true,
            dataSource: this.ds.cloneWithRows([]),
            token: null,
            contacts: [],
            opacity: {},
            toLeft: {},
            height: {}
        };
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        if (navigator) {
            naviGoBack(navigator);
        }
    }

    componentDidMount() {

    }

    componentWillMount() {
        let the = this;
        new Promise((resolve, reject) => {
            Contacts.checkPermission((err, permission) => {
                // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
                if (permission === 'undefined') {
                    Contacts.requestPermission((err, permission) => {
                        resolve(true);
                    })
                }
                if (permission === 'authorized') {
                    resolve(true);
                }
                if (permission === 'denied') {
                    Contacts.requestPermission((err, permission) => {
                        resolve(true);
                    })
                }
            })
        }).then((res)=> {
                if (res)
                    return new Promise((resolve, reject) => {
                        Contacts.getAll((err, contacts) => {
                            if (err && err.type === 'permissionDenied') {
                                console.log('permissionDenied');
                            } else {
                                let array = [];
                                _.each(contacts, (list)=> {
                                    let phone = 0;
                                    if (list.phoneNumbers.length === 0) {
                                        phone = list.recordID;
                                    } else {
                                        phone = list.phoneNumbers[0].number;
                                    }
                                    phone = phone.toString().replace(/\+86/g, '')
                                        .replace(/\(/g, '')
                                        .replace(/\)/g, '')
                                        .replace(/\-/g, '')
                                        .replace(/\s/g, '')
                                        .replace(/\+/g, '')
                                        .replace(/(^\s*)|(\s*$)/g, '');
                                    let obj = {
                                        name: list.givenName || '' + ' ' + list.familyName || '',
                                        portrait: list.thumbnailPath,
                                        phone: phone,
                                        hasRegistered: false,
                                        hasBeFollowed: false,
                                        userId: 0
                                    };
                                    if(/^\d+$/.test(phone))
                                        array.push(obj);
                                });


                                Token.getToken(navigator).then((token) => {
                                    if (token) {
                                        the.setState({token: token});
                                        let body = '';
                                        _.each(array, (list)=> {
                                            body += 'mobiles=' + list.phone + '&';
                                        });
                                        //body = 'mobiles=' + body;
                                        request('/user/mobile-contacts/status?' + body, 'GET', '', token)
                                            .then((res) => {
                                                if (res.resultCode === 0) {
                                                    try {
                                                        _.each(res.resultValues, (list)=> {
                                                            let contact = _.find(array, {phone: list.mobile + ''});
                                                            contact.userId = list.userId || 0;
                                                            if (list.userId > 0)
                                                                contact.hasRegistered = true;
                                                            if (list.isFollowedBySessionUser)
                                                                contact.hasBeFollowed = true;
                                                        });
                                                    } catch (error) {
                                                        console.log(error)
                                                    }

                                                    resolve(array)
                                                }
                                            }, function (error) {
                                                console.log(error);
                                            })
                                            .catch(() => {
                                                console.log('network error');
                                            });
                                    }
                                });

                            }
                        });
                    });
            }).then((res)=> {
            res = _.sortBy(res, function(o) { return o.hasRegistered == true; });
            _.reverse(res);
            the.setState({dataSource: the.ds.cloneWithRows(res)});
                the.setState({contacts: res});
            });
    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        if (!rowData.hasBeFollowed) {
            this.state.opacity[rowData.phone] = new Animated.Value(1);
            this.state.toLeft[rowData.phone] = new Animated.Value(0);
            this.state.height[rowData.phone] = new Animated.Value(50);

            return (
                <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}>
                    <Animated.View
                        style={{opacity: this.state.opacity[rowData.phone],
                                left: this.state.toLeft[rowData.phone],
                                height: this.state.height[rowData.phone]}}>
                        <View style={styles.friendsRow}>
                            <View style={{flex:1}}>
                                <TouchableOpacity
                                    style={{flex:1,flexDirection: 'row'}}
                                    onPress={() => this._jumpToUserPage(rowData.userId)}
                                    >
                                    <Image style={styles.portrait}
                                           source={{uri: (rowData.portrait ? rowData.portrait : images.DEFAULT_PORTRAIT), width: 34, height: 34}}/>
                                    <View style={styles.name}>
                                        <Text>{rowData.name}</Text>
                                        <Text>{rowData.phone}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.invite}>
                                {
                                    rowData.hasRegistered ?
                                        <TouchableHighlight onPress={()=>this._follow(rowData)}
                                                            style={styles.button}>
                                            <Image source={require('../../assets/invite/follow.png')}></Image>
                                        </TouchableHighlight>
                                        :
                                        <TouchableHighlight onPress={()=>this._invite(rowData.phone)}
                                                            style={styles.button}>
                                            <Image source={require('../../assets/invite/invite.png')}></Image>
                                        </TouchableHighlight>

                                }
                            </View>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            );
        }
        else {
            return null;
        }
    }

    _animation(mobile) {
        Animated.sequence([
            Animated.timing(
                this.state.opacity[mobile],
                {
                    toValue: 0.1,
                    friction: 1,
                    duration: 400
                }
            ),
            Animated.timing(
                this.state.toLeft[mobile],
                {
                    toValue: -width,
                    friction: 1,
                    duration: 300
                }
            ),
            Animated.timing(
                this.state.height[mobile],
                {
                    toValue: 0,
                    friction: 1,
                    duration: 300
                }
            )
        ]).start();
    }

    _invite(mobile) {
        let body = '';
        let the = this;
        const token = this.state.token;

        if (mobile) {
            body = {
                mobiles: [mobile]
            };
            body = JSON.stringify(body);
        }
        else {
            let mobiles = [];
            _.each(this.state.contacts, (list)=> {
                if (!list.hasRegistered)
                    mobiles.push(list.phone);
            });
            body = {
                mobiles: mobiles
            };
            body = JSON.stringify(body);
        }

        request('/user/invitations', 'POST', body, token)
            .then((res) => {
                if (res.resultCode === 0) {
                    toast('邀请成功');
                    if (mobile) {
                        the._animation(mobile);
                    } else {
                        _.each(the.state.contacts, (list)=> {
                            if (!list.hasRegistered)
                                the._animation(list.phone);
                        });
                    }
                }
            }, function (error) {
                console.log(error);
            })
            .catch(() => {
                console.log('network error');
            });
    }

    _follow(rowData) {
        const userId = rowData.userId;
        const mobile = rowData.phone;
        follow(userId, this.state.token).then((res) => {
            toast('关注成功');
            this._animation(mobile);

            //let notes = _.filter(detail.note, {userId: userId});
            //_.each(notes, function (note) {
            //    note.isAuthorFollowedByVisitor = true;
            //});
            //this.setState({noteUpdated: true});
        });
    }

    _filter(content) {
        let contacts = [];
        _.each(this.state.contacts, (list)=> {
            const name = list.name;
            if (name.indexOf(content.text) > -1) {
                contacts.push(list);
            }
        });
        this.setState({dataSource: this.ds.cloneWithRows(contacts)});
    }

    _jumpToUserPage(userId) {
        if (userId <= 0)
            return null;
        const { navigator } = this.props;
        const token = this.state.token;
        if (token) {
            InteractionManager.runAfterInteractions(() => {
                navigator.push({
                    component: UserPage,
                    name: 'UserPage',
                    sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
                    userId: userId
                });
            });
        }
    }

    render() {
        return (
            <View style={[styles.container,{minHeight: height}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <View style={styles.search}>
                    <ImageButton
                        source={backImg}
                        style={styles.back}
                        onPress={this._onLeftIconClicked}
                        />
                    <Image style={styles.magnifier} source={require('../../assets/invite/search.png')}/>
                    <TextInput
                        style={styles.searchText}
                        placeholder={'搜索通讯录好友'}
                        placeholderTextColor='#bebebe'
                        multiline={false}
                        underlineColorAndroid='transparent'
                        returnKeyType='go'
                        onChangeText={(text) => this._filter({text})}
                        />
                </View>
                <View style={styles.addressBook}>
                    <Text style={[styles.baseText,styles.addressText]}>允许通过手机通讯录加好友</Text>
                    <Switch
                        onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
                        style={styles.trueSwitchIsOn}
                        value={this.state.trueSwitchIsOn}
                        />
                </View>
                {
                    this.state.contacts.length === 0 ?
                        <View style={{marginTop: 40,alignItems: 'center'}}>
                            <Spinner style={styles.spinner} isVisible size={80} type="FadingCircleAlt"
                                     color={'#fc7d30'}/>
                        </View>
                        :
                        <View style={styles.listContainer}>
                            <ListView
                                contentContainerStyle={styles.friendsList}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow}
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                                enableEmptySections={true}
                                />
                        </View>
                }

                <TouchableOpacity style={styles.float} onPress={()=>this._invite()}>
                    <View >
                        <Text style={[styles.baseText,styles.floatText]}>
                            邀请所有人
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )

    }
}

export default Friends;