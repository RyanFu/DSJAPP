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
    Image,
    TouchableHighlight
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {Token,request,toast } from '../../utils/common';
import deprecatedComponents from 'react-native-deprecated-custom-components';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import H5Page from '../h5';

const Navigator = deprecatedComponents.Navigator;
const logo = require('../../assets/logo/logo.png');
var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class About extends React.Component {
    constructor(props) {
        super(props);
        this._gotoH5Page = this._gotoH5Page.bind(this);
        this.state = {
            version: '1.1.0'
        };
    }

    _gotoH5Page(title, uri){
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'H5Page',
                component: H5Page,
                uri: uri,
                title: title
            })
        }
    }



    render() {
        return (
            <TouchableWithoutFeedback style={{flex:1}} >

                <View style={[styles.container, Platform.OS === 'android' ? null : {marginTop: 21}]}>
                    <Toolbar
                        title="关于剁手记"
                        navigator={this.props.navigator}
                        hideDrop={true}
                        />
                    <View style={styles.content}>
                        <View>
                            <Image style={styles.logo} source={logo}></Image>
                        </View>
                        <View style={styles.version}>
                            <Text style={[styles.baseText,styles.dimText]} >版本 {this.state.version}</Text>
                        </View>

                        <View style={[styles.separatorHorizontal]} />
                        <TouchableHighlight onPress={()=>this._gotoH5Page('功能说明','http://www.duoshouji.com/#mu-feature')}>
                            <View style={styles.row}>
                                <Text style={styles.text}>功能说明</Text>
                                {chevronRightIcon}
                            </View>
                        </TouchableHighlight>
                        <View style={styles.separatorHorizontal} />

                        <TouchableHighlight onPress={()=>this._gotoH5Page('常见问题','http://www.duoshouji.com/#mu-faq')}>
                            <View style={styles.row}>
                                <Text style={styles.text}>常见问题</Text>
                                {chevronRightIcon}
                            </View>
                        </TouchableHighlight>
                        <View style={styles.separatorHorizontal} />

                        <TouchableHighlight onPress={()=>this._gotoH5Page('联系我们','http://www.duoshouji.com/#mu-contact')}>
                            <View style={styles.row}>
                                <Text style={styles.text}>联系我们</Text>
                                {chevronRightIcon}
                            </View>
                        </TouchableHighlight>
                        <View style={styles.separatorHorizontal} />
                    </View>



                </View>
            </TouchableWithoutFeedback>
        )

    }
}


export default About;