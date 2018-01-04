import React from 'react';
import {
    Dimensions,
    AsyncStorage
} from 'react-native';
import {
    Token
} from '../../utils/common';
import Home from '../home';
import styles from './style';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;
const splashImg = require('../../assets/logo/1.jpg');
import ImageSlider from '../../components/imageSlider';
import StorageKeys from '../../constants/StorageKeys';

class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            position: 0,
            countDown: 10
        }
    }

    componentDidMount() {
        const { navigator } = this.props;

        //InteractionManager.runAfterInteractions(() => {
        //    navigator.resetTo({
        //        component: Home,
        //        name: 'Home',
        //        params: {store: this.props.store}
        //    });
        //    //navigator.resetTo({
        //    //    component: LoginPage,
        //    //    name: 'LoginPage',
        //    //    params: {store: this.props.store}
        //    //});
        //});

        this.timer = setTimeout(() => {
            navigator.resetTo({
                component: Home,
                name: 'Home',
                params: {store: this.props.store}
            });
        }, this.state.countDown*1000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    _onCountDownPress() {
        const { navigator } = this.props;
        navigator.resetTo({
            component: Home,
            name: 'Home',
            params: {store: this.props.store}
        });

        AsyncStorage.setItem(StorageKeys.SPLASH_SKIP, 'true');
    }

    render() {
        // This will be replaced to webView for ads or user guide
        let images = [];
        const image1 = {
            width: maxWidth,
            height: maxHeight,
            uri: require('../../assets/logo/1.jpg')
        };
        const image2 = {
            width: maxWidth,
            height: maxHeight,
            uri: require('../../assets/logo/2.jpg')
        };
        images.push(image1);
        images.push(image2);

        return (
            <ImageSlider
                images={images}
                position={this.state.position}
                onPositionChanged={position => this.setState({position})}
                countDown={this.state.countDown}
                onCountDownPress={this._onCountDownPress.bind(this)}
                />

        );

    }
}

export default Splash;