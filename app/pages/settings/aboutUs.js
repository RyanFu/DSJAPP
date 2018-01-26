import React  from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    Platform,
    WebView
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import {isIphoneX} from "../../utils/common";

class AboutUsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : (isIphoneX()? {marginTop: 41}: {marginTop: 21})]}>
                <Toolbar
                    title="关于我们"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />
                <WebView
                    ref="webviewbridge"
                    source={{uri: "http://share68.com/aboutus"}}/>

            </View>
        )
    }
}

export default AboutUsPage;