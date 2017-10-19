'use strict';

import React  from 'react';
import {
    View,
    Text,
    ScrollView,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import styles from './style';
import Toolbar from '../../components/toolbar';
import Content from '../my/content';
import {Token} from '../../utils/common';
import {fetchUserInfo, fetchUserNotes} from '../../actions/user';
import { connect } from 'react-redux';

class User extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { dispatch ,route } = this.props;
        Token.getToken(navigator).then((token) => {
            let params = {
                token: token,
                userId: route.userId
            };
            dispatch(fetchUserInfo(params));
            //dispatch(fetchUserNotes(params)).then(() => {
            //    DeviceEventEmitter.emit('receiveNotes', this.props.user);
            //});
        });

    }

    render() {
        return(
            <View style={[{flex: 1},Platform.OS === 'android' ? null : {marginTop: 21}]}>
                <Toolbar
                    title="Ta的主页"
                    navigator={this.props.navigator}
                    hideDrop={true}
                    />
                <ScrollView style={{flex: 1,backgroundColor: '#f1f1f1'}}>
                    <Content userInfo={this.props.user.userInfo} userId={this.props.route.userId} {...this.props} key="0"/>
                </ScrollView>
            </View>
        )

    }
}

function mapStateToProps(state) {
    const { user } = state;
    return {
        user
    };
}

export default connect(mapStateToProps)(User);