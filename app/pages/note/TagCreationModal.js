/**
 * Created by lyan2 on 16/8/11.
 */
/**
 * Created by lyan2 on 16/8/2.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import styles from './style';

class TagCreationPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            //avatarSource: this.props.selectedPhoto
        };

    }

    _onCancel() {
        const { navigator } = this.props;

        if(navigator) {
            navigator.pop();
        }
    }

    _onImageLoad() {
    }

    render() {
        let {height, width} = Dimensions.get('window');

        return (
            <View style={styles.container}>
            </View>
        );
    }
}

export default TagCreationPage;