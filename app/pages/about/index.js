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
const Navigator = deprecatedComponents.Navigator;
const logo = require('../../assets/logo/logo.png');
var chevronRightIcon = <Icon style={[styles.messageLinkIcon]} size={16} name="angle-right"/>;

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            version: '1.1.0'
        };
    }

    _gotoFunctionPage(){

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
                        <TouchableHighlight onPress={this._gotoFunctionPage.bind(this)}>
                            <View style={styles.row}>
                                <Text style={styles.text}>功能说明</Text>
                                {chevronRightIcon}
                            </View>
                        </TouchableHighlight>
                        <View style={styles.separatorHorizontal} />

                        <TouchableHighlight onPress={this._gotoFunctionPage.bind(this)}>
                            <View style={styles.row}>
                                <Text style={styles.text}>服务条款</Text>
                                {chevronRightIcon}
                            </View>
                        </TouchableHighlight>
                        <View style={styles.separatorHorizontal} />

                        <TouchableHighlight onPress={this._gotoFunctionPage.bind(this)}>
                            <View style={styles.row}>
                                <Text style={styles.text}>隐私政策</Text>
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