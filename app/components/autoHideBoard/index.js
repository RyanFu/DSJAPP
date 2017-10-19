import React  from 'react';
import {
    View,
    TouchableWithoutFeedback
} from 'react-native';

const dismissKeyboard = require('dismissKeyboard');
export default (WrappedComponent) => class AutoHideKeyboard extends React.Component {
    constructor(props) {
        super(props);
    }
    _dismissKeyboard() {
        dismissKeyboard();
    }
    render() {
        return (
            <TouchableWithoutFeedback style={{flex:1}} onPress={this._dismissKeyboard}>
                <WrappedComponent {...this.props}/>
            </TouchableWithoutFeedback>
        )
    }
}