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
    Image, Linking, AsyncStorage, DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {decimals, isIphoneX, Token} from "../../utils/common";
import baiChuanApi from 'react-native-taobao-baichuan-api';
import images from "../../constants/images";
import PrefetchImage from '../../components/prefetchImage';
import {addRecentView} from "../../actions/recent";
import StorageKeys from "../../constants/StorageKeys";
import ResultPage from "../../pages/search/result";
import configs from "../../constants/configs";
import deprecatedComponents from "react-native-deprecated-custom-components";
import H5Page from "../../pages/h5";

const Navigator = deprecatedComponents.Navigator;

var {height, width} = Dimensions.get('window');

class TklPopup extends React.Component {
    constructor(props) {
        super(props);
        this._gotoH5Page = this._gotoH5Page.bind(this);
        this.state = {
            show: this.props.show,
            ratio: 0.8
        }
    }

    componentDidMount() {
        const {navigator} = this.props;
        const the = this;

        this.setState({show: true});
        AsyncStorage.getItem('ratio', (error, result) => {
            the.setState({ratio: result});
        });

    }

    componentWillReceiveProps() {

    }

    componentWillUnmount() {
    }

    componentWillMount() {
    }

    _close(never) {
        this.setState({show: false});
        if (this.props.onPressCross)
            this.props.onPressCross(never);
    }

    _searchByTitle(data) {
        const {navigator} = this.props;
        navigator.push({
            component: ResultPage,
            name: 'ResultPage',
            text: data.name,
            from: 'tbk',
            sceneConfigs: Navigator.SceneConfigs.FadeAndroid,
        });
    }

    _jumpToItemPage(data) {
        const {dispatch} = this.props;
        const the = this;
        this._close();
        if (!data.tkCommFee && data.is2in1 !== "true") {
            this._searchByTitle(data);
            return;
        }
        const patchData = {
            tkCommFee: decimals(data.tkCommFee * this.state.ratio, 2) || 0,
            itemPrice: data.Price || 0,
            itemTitle: data.name,
            itemPicUrl: data.picUrl,
            itemId: data.id
        };
        if(data.id)
            dispatch(addRecentView(patchData));
        DeviceEventEmitter.emit('newView', true);
        if (data.is2in1 === "true" && data.couponLink) {
            const couponLink = data.couponLink.replace('https://', '');
            const url = configs.taobaoLink + couponLink;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    the._gotoH5Page('优惠券详情',data.couponLink);
                }
            });
            return;
        }
        this._jumpToTaobaoPage(data);
    }

    _jumpToTaobaoPage(data) {
        const type = 'tmall';//统一跳到手淘

        const {navigator, dispatch} = this.props;
        Token.getToken(navigator).then((token) => {
            if (token) {
                baiChuanApi.jump(data.id.toString(), '', type, (error, res) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        });
    }

    _tryAgain() {
        this._close();
        this.props.tryAgain(this.props.data.source);
    }

    _gotoH5Page(title, uri) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'H5Page',
                component: H5Page,
                uri: uri,
                title: title
            })
        }
    }

    render() {
        if (!this.state.show)
            return null;
        return (
            <View style={[styles.container]}>
                <View style={styles.rectangle}>
                    <View style={styles.content}>

                        <View>
                            <Image source={{
                                uri: this.props.data.picUrl.indexOf('http') == 0 ? this.props.data.picUrl : ('http:' + this.props.data.picUrl),
                                width: 290,
                                height: 290
                            }}
                                   resizeMode={'stretch'}
                                   style={{borderTopLeftRadius: 4, borderTopRightRadius: 4}}/>

                        </View>
                        <View style={styles.row}>
                            <Text style={[styles.baseText, styles.dimText]}
                                  lineBreakMode={'tail'}
                                  numberOfLines={2}>
                                {this.props.data.name}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            {
                                this.props.data.Price ?
                                    <View style={styles.price}>
                                        <Text style={[styles.baseText, styles.dimText]}>
                                            ￥
                                        </Text>
                                        <Text style={[styles.baseText, styles.priceNum]}>
                                            {this.props.data.Price}
                                        </Text>
                                    </View> : null
                            }

                            {
                                this.props.data.tkCommFee ?
                                    <Image
                                        style={{width: 16, height: 16, marginLeft: 8}}
                                        resizeMode={'contain'}
                                        source={require('../../assets/footer/red.png')}
                                    />
                                    : null
                            }

                            {
                                this.props.data.tkCommFee ?
                                    <Text style={[styles.baseText, styles.dimText, {marginLeft: 2, color: '#fc7d30',}]}>
                                        ￥{decimals(this.props.data.tkCommFee * this.state.ratio, 2)}
                                    </Text> : null
                            }


                            {
                                this.props.data.couponAmount && this.props.data.couponAmount != '0' ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <View style={styles.coupon}>
                                            <Text
                                                style={[styles.baseText, styles.dimText, styles.couponText]}>{this.props.data.couponAmount}元券</Text>
                                        </View>
                                    </View> :
                                    null
                            }
                        </View>

                        {
                            this.props.data.store ?
                                <View style={styles.row}>
                                    <Image
                                        style={{width: 12, height: 12, opacity: 0.5, marginLeft: 4}}
                                        resizeMode={'cover'}
                                        source={require('../../assets/search/shop.png')}
                                    />
                                    <Text style={[styles.baseText, styles.dimText, styles.shopTitle, {marginLeft: 4}]}
                                          lineBreakMode={'tail'} numberOfLines={1}>
                                        {this.props.data.store}
                                    </Text>
                                </View> : null
                        }

                        {
                            this.props.data.is2in1 !== 'true' && !this.props.data.tkCommFee && !this.props.data.couponAmount ?
                                <View style={styles.row}>
                                    <Text style={[styles.baseText, styles.dimText, styles.emptyText, {marginLeft: 4}]}
                                          lineBreakMode={'tail'} numberOfLines={1}>
                                        此商品目前可能还没有红包可以拿！
                                    </Text>
                                </View> : null
                        }


                        <View style={[styles.row, styles.btnRow]}>
                            <TouchableOpacity style={styles.Button}
                                              onPress={() => this._jumpToItemPage(this.props.data)}>
                                <Text style={styles.ButtonFont}>
                                    {this.props.data.is2in1 === 'true' ? '领券购买' : (this.props.data.tkCommFee ? '立刻购买' : '找相似')}
                                </Text>
                            </TouchableOpacity>
                            {
                                this.props.data.is2in1 !== 'true' &&  !this.props.data.tkCommFee && !this.props.data.couponAmount ?
                                    <TouchableOpacity style={[styles.Button, styles.tryButton]}
                                                      onPress={() => this._tryAgain()}>
                                        <Text
                                            style={styles.ButtonFont}>再试试</Text>
                                    </TouchableOpacity> : null
                            }
                        </View>


                    </View>
                    <View style={styles.cross}>
                        <TouchableOpacity onPress={() => this._close()}>
                            <Icon
                                style={styles.crossIcon}
                                name='md-close'
                                size={30}
                                color={'#fff'}
                            />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        width: width,
        height: height,
        left: 0,
        top: 0,
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    rectangle: {
        width: 290,
        height: 446,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,1)',
        borderRadius: 4,
        paddingTop: 0
    },
    button: {
        paddingVertical: 4,
        paddingHorizontal: 24,
        borderRadius: 6,
        fontSize: 12,
        textAlignVertical: 'center', /* android */
        color: '#fff',
        fontFamily: 'STHeitiSC-Medium',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F37D30'
    },
    countDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countDownText: {
        color: '#F37D30',
        fontSize: 10
    },

    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 0
    },
    dimText: {
        color: '#9b9b9b',
    },
    cross: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 20,
        bottom: -50,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    crossIcon: {
        paddingTop: 2,
        borderRadius: 20,
        width: 40,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        fontWeight: "900"
    },
    important: {
        color: '#F37D30'
    },
    row: {
        width: 290,
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    Button: {
        height: 34,
        backgroundColor: '#fc7d30',
        marginLeft: 4,
        marginRight: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        marginBottom: 8
    },
    ButtonFont: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    greyBtn: {
        backgroundColor: '#ddd'
    },
    btnRow: {
        width: 290,
        alignItems: 'center',
        justifyContent: 'center'
    },
    firstLineText: {
        textAlign: "center",
        width: 262,
        fontSize: 16
    },
    coupon: {
        backgroundColor: '#ff6b6b',
        borderWidth: 1,
        borderColor: '#ff5252',
        paddingHorizontal: 4,
        borderRadius: 4,
        height: 20,
        marginLeft: 10
    },
    couponText: {
        color: '#fff',
        fontSize: 10,
        lineHeight: 17
    },
    price: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    priceNum: {
        fontSize: 18,
        lineHeight: 18,
    },
    tryButton: {
        backgroundColor: '#ff6b6b'
    },
    emptyText: {
        color: '#ff6b6b',
        flex: 1,
        textAlign: 'center'
    }
});


export default TklPopup;