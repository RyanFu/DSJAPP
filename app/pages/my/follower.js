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
    Platform,
    AsyncStorage
} from 'react-native';
import styles from './followStyle';
import Toolbar from '../../components/toolbar';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageButton from '../../components/toolbar/ImageButton.js';
import { naviGoBack, Token ,request, toast, follow } from '../../utils/common';
import Contacts from 'react-native-contacts';
import images from '../../constants/images';
import UserPage from '../../pages/user';
import _ from 'lodash';
import Spinner from 'react-native-spinkit';
import { connect } from 'react-redux';
import {fetchFollowerList} from '../../actions/follow';
import StorageKeys from '../../constants/StorageKeys';
import deprecatedComponents from 'react-native-deprecated-custom-components';
const Navigator = deprecatedComponents.Navigator;

const {height, width} = Dimensions.get('window');
var backImg = require('../../assets/upload/rg_left.png');

class Follower extends React.Component {
    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: this.ds.cloneWithRows([]),
            title: '我'
        };
    }

    componentDidMount() {
        const { dispatch, route, navigator } = this.props;
        let the = this;
        Token.getToken(navigator).then((token) => {
            dispatch(fetchFollowerList(route.userId, token)).then(()=>{
                the.setState({dataSource: the.ds.cloneWithRows(the.props.follow.followerList)});
            });
        });

    }

    componentWillMount() {
        const { route } = this.props;
        AsyncStorage.getItem(StorageKeys.ME_STORAGE_KEY).then((meDetail)=> {
            if (meDetail !== null) {
                const user = JSON.parse(meDetail);
                if(user.userId !== route.userId){
                    this.setState({title: 'Ta'});
                }
            }
        });
    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        return (
            <TouchableOpacity underlayColor="transparent" activeOpacity={0.5}>
                <View style={styles.friendsRowC}>
                    <View style={styles.friendsRow}>
                        <View style={{flex:1}}>
                            <TouchableOpacity
                                style={{flex:1,flexDirection: 'row'}}
                                onPress={() => this._jumpToUserPage(rowData.userId)}
                                >
                                <Image style={styles.portrait}
                                       source={{uri: (rowData.portraitUrl ? rowData.portraitUrl : images.DEFAULT_PORTRAIT), width: 34, height: 34}}/>
                                <View style={styles.name}>
                                    <Text>{rowData.nickname}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {
                            !rowData.isFollowedBySessionUser?
                                <View style={styles.invite}>
                                    <TouchableHighlight onPress={()=>this._follow(rowData)}
                                                        style={styles.button}>
                                        <Image source={require('../../assets/invite/follow.png')}></Image>
                                    </TouchableHighlight>
                                </View>: null
                        }

                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    _follow(rowData) {
        let {navigator} = this.props;
        const the = this;
        Token.getToken(navigator).then((token) => {
            if (token) {
                follow(rowData.userId, token).then((res) => {
                    _.each(this.props.follow.followerList, function (list,key) {
                        if(list.userId == rowData.userId)
                            the.props.follow.followerList[key].isFollowedBySessionUser = true;
                    });
                    the.setState({dataSource: the.ds.cloneWithRows(the.props.follow.followerList)});
                    toast('关注成功');
                });
            }
        });
    }

    _jumpToUserPage(userId) {
        if (userId <= 0)
            return null;
        const { navigator } = this.props;
        navigator.push({
            component: UserPage,
            name: 'UserPage',
            sceneConfigs: Navigator.SceneConfigs.FloatFromRight,
            userId: userId
        });
    }

    render() {
        return (
            <View style={[styles.container,{minHeight: height}, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title= {this.state.title+"的粉丝"}
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />

                {
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

            </View>
        )

    }
}

function mapStateToProps(state) {
    const { follow } = state;
    return {
        follow
    };
}

export default connect(mapStateToProps)(Follower);