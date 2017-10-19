import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import { naviGoBack } from '../../utils/common';
import UpdatePortraitPage from './updatePortrait';

var {height, width} = Dimensions.get('window');

class Portrait extends React.Component {
    constructor(props) {
        super(props);
    }

    _goToUpdatePage() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: 'UpdatePortraitPage',
                component: UpdatePortraitPage,
            })
        }
    }

    render() {
        const info = this.props.route.info;
        let pHeight = width;
        let pWidth = info.portraitWidth/info.portraitHeight*pHeight;
        if(pWidth > width){
            pWidth = width;
            pHeight = info.portraitHeight/info.portraitWidth*pWidth;
        }
        return(
            <View style={styles.portraitContainer}>

                <View style={styles.fullPortrait}>
                    <Image  style={[styles.fullPortraitImg]} source={{uri: info.thumbUri, width: pWidth, height: pHeight}} />
                </View>
                <TouchableOpacity style={styles.button} onPress={this._goToUpdatePage.bind(this)}>
                    <Text style={styles.buttonFont}>更换头像</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,styles.buttonGrey]} onPress={()=>naviGoBack(this.props.navigator)}>
                    <Text style={styles.buttonFont}>取消</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Portrait;