import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    DeviceEventEmitter
} from 'react-native';
import styles from './filterStyle';
import { connect } from 'react-redux';
import Toolbar from '../../components/toolbar';
import {isIphoneX, naviGoBack} from '../../utils/common';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
const arrowUpIcon = <Icon name={'ios-arrow-up-outline'} size={26} color={ 'rgba(252, 125, 48, 0.4)'}/>;
const arrowDownIcon = <Icon name={'ios-arrow-down-outline'} size={26} color={ 'rgba(252, 125, 48, 0.4)'}/>;
import StoreActions from '../../constants/actions';

const locations = ['全部', '北京', '上海', '广州', '深圳', '杭州', '海外', '江浙沪', '珠三角', '京津冀', '东三省', '港澳台', '江浙沪皖', '长沙', '长春', '成都', '重庆', '大连', '东莞', '佛山', '福州', '贵阳', '合肥', '金华', '济南', '嘉兴', '昆明', '宁波', '南昌', '南京', '青岛', '泉州', '沈阳', '苏州', '天津', '温州', '无锡', '武汉', '西安', '厦门', '郑州', '中山', '石家庄', '哈尔滨', '安徽', '福建', '甘肃', '广东', '广西', '贵州', '海南', '河北', '河南', '湖北', '湖南', '江苏', '江西', '吉林', '辽宁', '宁夏', '青海', '山东', '山西', '陕西', '云南', '四川', '西藏', '新疆', '浙江', '澳门', '台湾', '内蒙古', '黑龙江'];
class Filter extends React.Component {
    constructor(props) {
        super(props);
        this._onButtonPress = this._onButtonPress.bind(this);
        this.state = {
            trigger: 0,
            dropped: false,
            startPrice: this.props.searchCondition.startPrice,
            endPrice: this.props.searchCondition.endPrice,
            tmall: this.props.searchCondition.tmall,
            location: this.props.searchCondition.location,
            coupon: this.props.searchCondition.coupon
        }
    }

    componentDidMount() {
        switch (this.state.location) {
            case 'all':
                this.refs['全部'].selected = true;
                break;
            case '美国,英国,法国,瑞士,澳大利亚,新西兰,加拿大,奥地利,韩国,日本,德国,意大利,西班牙,俄罗斯,泰国,印度,荷兰,新加坡,其它国家':
                this.refs['海外'].selected = true;
                break;
            case '江苏,浙江,上海':
                this.refs['江浙沪'].selected = true;
                break;
            case '广州,深圳,中山,珠海,佛山,东莞,惠州':
                this.refs['珠三角'].selected = true;
                break;
            case '北京,天津,河北':
                this.refs['京津冀'].selected = true;
                break;
            case '黑龙江,吉林,辽宁':
                this.refs['东三省'].selected = true;
                break;
            case '香港,澳门,台湾':
                this.refs['港澳台'].selected = true;
                break;
            case '江苏,浙江,上海,安徽':
                this.refs['江浙沪皖'].selected = true;
                break;
            default:
                this.refs[this.state.location].selected = true;
        }
        this.setState({trigger: this.state.trigger++});
    }

    _goBack() {
        const { navigator } = this.props;
        naviGoBack(navigator);
    }

    _complete() {
        const { dispatch } = this.props;

        let action = {
            sv: this.props.searchCondition.sv,
            moods: this.props.searchCondition.moods,
            price: this.props.searchCondition.price,
            redPacket: this.props.searchCondition.redPacket,
            priceSort: this.props.searchCondition.priceSort,
            priceRange: false,
            startPrice: 0,
            endPrice: 0,
            location: 'all',
            tmall: false,
            coupon: false
        };
        if (this.state.tmall) {
            action.tmall = true;
        }
        if (this.state.coupon) {
            action.coupon = true;
        }
        _.each(this.refs, ((val, key)=> {
            if (this.refs[key].selected && key !== 'tmall') {
                action.location = key;
                if (key === '全部')
                    action.location = 'all';
                if (key === '海外')
                    action.location = '美国,英国,法国,瑞士,澳大利亚,新西兰,加拿大,奥地利,韩国,日本,德国,意大利,西班牙,俄罗斯,泰国,印度,荷兰,新加坡,其它国家';
                if (key === '江浙沪')
                    action.location = '江苏,浙江,上海';
                if (key === '珠三角')
                    action.location = '广州,深圳,中山,珠海,佛山,东莞,惠州';
                if (key === '京津冀')
                    action.location = '北京,天津,河北';
                if (key === '东三省')
                    action.location = '黑龙江,吉林,辽宁';
                if (key === '港澳台')
                    action.location = '香港,澳门,台湾';
                if (key === '江浙沪皖')
                    action.location = '江苏,浙江,上海,安徽';
            }

        }));

        if (this.state.startPrice > 0 && this.state.endPrice > 0) {
            action.priceRange = true;
            action.startPrice = this.state.startPrice;
            action.endPrice = this.state.endPrice;
        }

        dispatch(Object.assign({}, {type: StoreActions.SEARCH_CONDITION_UPDATE}, action));

        this._goBack();
        setTimeout(()=> {
            DeviceEventEmitter.emit('filterChanged', true);
        }, 10)
    }

    _arrow() {
        this.setState({dropped: !this.state.dropped});
    }

    _onButtonPress(v) {
        const the = this;
        if (v === 'tmall') {
            the.setState({tmall: !this.state.tmall});
        } else if(v === 'coupon'){
            the.setState({coupon: !this.state.coupon});
        }else {
            _.each(this.refs, ((val, key)=> {
                if (key !== 'tmall')
                    the.refs[key].selected = false;
            }));
            this.refs[v].selected = true;
        }

        this.setState({trigger: this.state.trigger++});

    }

    render() {
        if (this.state.trigger >= 0)
            return (
                <View
                    style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : (isIphoneX()? {paddingTop: 20}: {paddingTop: 0})]}>
                    <Toolbar
                        title="筛选"
                        navigator={this.props.navigator}
                        hideDrop={true}
                        filledToolBar={true}
                        />
                    <KeyboardAvoidingView behavior={'position'} contentContainerStyle={{flex:1}} style={{flex:1}}>
                        <View style={styles.container}>
                            <ScrollView
                                contentContainerStyle={styles.scrollContainer}
                                >
                                <View style={[styles.block]}>
                                    <View style={styles.title}>
                                        <Text>商家</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <TouchableOpacity ref='tmall'
                                                          style={[styles.buttonGrey,
                                                          {borderColor: this.state.tmall?'rgba(252, 125, 48, 0.3)':'rgba(178,178,178,0.3)'},
                                                          {backgroundColor: this.state.tmall?'rgba(252, 125, 48, 0.3)':'#fff'},

                                                          ]}
                                                          onPress={()=>{this._onButtonPress('tmall')}}>
                                            <Text style={[styles.buttonGFont,
                                                            {color: this.state.tmall?'#fc7d30':'#000'}
                                                ]}>天猫</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={[styles.block]}>
                                    <View style={styles.title}>
                                        <Text>优惠券</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <TouchableOpacity ref='tmall'
                                                          style={[styles.buttonGrey,
                                                              {borderColor: this.state.coupon?'rgba(252, 125, 48, 0.3)':'rgba(178,178,178,0.3)'},
                                                              {backgroundColor: this.state.coupon?'rgba(252, 125, 48, 0.3)':'#fff'},

                                                          ]}
                                                          onPress={()=>{this._onButtonPress('coupon')}}>
                                            <Text style={[styles.buttonGFont,
                                                {color: this.state.coupon?'#fc7d30':'#000'}
                                            ]}>仅搜含优惠券</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                                <View style={[styles.block]}>
                                    <View style={styles.title}>
                                        <Text>所在地</Text>
                                    </View>
                                    <View
                                        style={[styles.content,styles.locations,{height: this.state.dropped? 1050:130}]}>
                                        {locations.map((v)=> {
                                            return (
                                                <TouchableOpacity ref={v} key={v}
                                                                  style={[styles.buttonGrey,styles.locationButton,
                                                                  {borderColor: this.refs[v] && typeof this.refs[v].selected !== 'undefined' && this.refs[v].selected?'rgba(252, 125, 48, 0.3)':'rgba(178,178,178,0.3)'},
                                                                  {backgroundColor: this.refs[v] && typeof this.refs[v].selected !== 'undefined' && this.refs[v].selected?'rgba(252, 125, 48, 0.3)':'#fff'},
                                                                  ]}
                                                                  onPress={()=>{this._onButtonPress(v)}}>
                                                    <Text style={[styles.buttonGFont,
                                                                 {color: this.refs[v] && typeof this.refs[v].selected !== 'undefined' && this.refs[v].selected?'#fc7d30':'#000'}
                                                                ]}>
                                                        {v}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        })}

                                    </View>
                                    <View>
                                        <TouchableOpacity style={styles.buttonArrow} onPress={this._arrow.bind(this)}>
                                            <Text
                                                style={styles.buttonArrowFont}>{this.state.dropped ? arrowUpIcon : arrowDownIcon}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.block]}>
                                    <View style={styles.title}>
                                        <Text>价格</Text>
                                    </View>
                                    <View style={styles.content}>
                                        <TextInput
                                            style={styles.priceText}
                                            placeholder={'最低价格'}
                                            placeholderTextColor='#bebebe'
                                            multiline={false}
                                            underlineColorAndroid='transparent'
                                            returnKeyType='next'
                                            keyboardType='numeric'
                                            defaultValue={this.state.startPrice}
                                            onChangeText={(value) => this.state.startPrice = value ||0}
                                            />
                                        <Text>至</Text>
                                        <TextInput
                                            style={styles.priceText}
                                            placeholder={'最高价格'}
                                            placeholderTextColor='#bebebe'
                                            multiline={false}
                                            underlineColorAndroid='transparent'
                                            returnKeyType='done'
                                            keyboardType='numeric'
                                            defaultValue={this.state.endPrice}
                                            onChangeText={(value) => this.state.endPrice = value||0}
                                            />
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={styles.buttonC}>
                                <TouchableOpacity style={styles.button} onPress={this._complete.bind(this)}>
                                    <Text style={styles.buttonFont}>完成</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                </View>
            )
    }
}

function mapStateToProps(state) {
    const { searchCondition } = state;
    return {
        searchCondition
    };
}

export default connect(mapStateToProps)(Filter);