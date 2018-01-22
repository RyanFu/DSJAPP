import React  from 'react';
import {
    View,
    Text,
    Platform,
    WebView
} from 'react-native';
import Toolbar from '../../components/toolbar/index';

class H5 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={[{backgroundColor: '#f5f5f5', flex: 1},Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title={this.props.route.title}
                    navigator={this.props.navigator}
                    hideDrop={true}
                />
                <WebView
                    ref="webview"
                    source={{uri: this.props.route.uri}}/>

            </View>
        )
    }
}

export default H5;