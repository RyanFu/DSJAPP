import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    TouchableOpacity,
    Navigator,
    InteractionManager,
    Platform,
    Image
} from 'react-native';
import styles from './style';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginPage from '../../pages/login';
import { Token } from '../../utils/common';

let tabIcons = [];
let tabTitle = [];

class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this._setAnimationValue = this._setAnimationValue.bind(this);

        this.state = {
            cameraPressed: false
        };
        this.tabComponent = [];
    }


    static propTypes = {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
    };

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this._setAnimationValue);
    }

    _setAnimationValue({ value, }) {
        tabIcons.forEach((icon, i) => {
            if ( i !== 2) {
                const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
                icon.setNativeProps({
                    style: {
                        color: this._iconColor(progress),
                    },
                });
                tabTitle[i].setNativeProps({
                    style: {
                        color: this._iconColor(progress),
                    },
                });
            }
        });
    }

    //color between rgb(252, 125, 48) and rgb(155,155,155)
    _iconColor(progress) {
        const red = 252 + (155 - 252) * progress;
        const green = 125 + (155 - 125) * progress;
        const blue = 48 + (155 - 48) * progress;
        return `rgb(${red}, ${green}, ${blue})`;
    }

    _onIconPress(i) {
        const { navigator } = this.props;
        let the = this;
        Token.getToken().then((token) => {
            if (!token && (i === 2 || i === 3 || i === 4)) {
                InteractionManager.runAfterInteractions(() => {
                    the.props.navigator.push({
                        component: LoginPage,
                        name: 'LoginPage',
                        sceneConfigs: Navigator.SceneConfigs.FloatFromBottom
                    });
                });
            } else {
                if(i !== 2) {
                    this.props.goToPage(i);
                }else{
                    if (this.state.cameraPressed) return;
                    this.state.cameraPressed =  true;
                    const { navigator } = this.props;
                    this.props.cameraPress(navigator);
                    this.state.cameraPressed = false;
                }
            }
        });


    }

    componentWillReceiveProps(){
        if(this.props.newNote) {
            this.tabComponent[4].props.onPress();
        }
    }

    render() {
        return (<View style={[styles.tabs, this.props.style, ]}>
            {this.props.tabs.map((tab, i) => {
                return <TouchableOpacity ref={(component) => this.tabComponent.push(component)}
                                         key={tab} onPress={() => this._onIconPress(i)} style={styles.tab}>
                    {
                        i == 0 ?
                            <Image
                                style={{width: 24,height: 24,marginBottom:4,marginTop: 4}}
                                resizeMode={'contain'}
                                source={require('../../assets/footer/red.png')}
                                />:
                            <Icon
                                name={tab}
                                size={i===2 ? 44 : 26}
                                color={i===2 ? 'rgb(252, 125, 48)' : (this.props.activeTab === i ? 'rgb(252, 125, 48)' : 'rgb(155,155,155)')}
                                ref={(icon) => { tabIcons[i] = icon; }}
                                style={i===2&&Platform.OS === 'android'? {marginTop : 6}: (i===2?{marginTop : 18}:{marginTop : 4})}
                                />
                    }

                    <Text
                        style={[styles.tabTitle, {color: (this.props.activeTab === i ? 'rgb(252, 125, 48)' : 'rgb(155,155,155)')}]}
                        ref={(title) => { tabTitle[i] = title; }}
                        >
                        {this.props.tabTile[i]}
                    </Text>
                </TouchableOpacity>;
            })}
        </View>);
    }
}

export default TabBar;