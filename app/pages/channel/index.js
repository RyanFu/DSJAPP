'use strict';

import React from 'react';
const ReactNative = require('react-native');
const {
    ScrollView,
    Text,
    View,
    InteractionManager,
    TouchableOpacity
    } = ReactNative;
import { connect } from 'react-redux';
import styles from './style';
import Flow from '../../components/flow';
import ScrollableTabView  from 'react-native-scrollable-tab-view';
import ChannelTabBar from '../../components/channelTabBar';
import {fetchList} from '../../actions/channel';
import deprecatedComponents from 'react-native-deprecated-custom-components';

class Channel extends React.Component {
    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(fetchList());
    }

    render() {
        return (
            <ScrollableTabView
                scrollWithoutAnimation={true}
                tabBarPosition="top"
                renderTabBar={() =>
                          <ChannelTabBar
                            underlineHeight={2}
                            textStyle={{ fontSize: 14, marginTop: 8 }}
                            style={styles.toolbar}
                            underlineColor="#fc7d30"
                          />
                        }
                tabBarBackgroundColor="rgba(255,255,255,0.9)"
                tabBarActiveTextColor="#fc7d30"
                tabBarInactiveTextColor="#9b9b9b"
                >
                {
                    this.props.channel.channelList.map((val, key) => {
                        return (
                            <View
                                key={val.id}
                                tabLabel={val.name}
                                style={{ flex: 1 }}
                                >
                                <Flow tag={val.id} navigator={this.props.navigator}/>
                            </View>
                        )
                    })
                }

            </ScrollableTabView>

        );
    }
}

function mapStateToProps(state) {
    const { channel } = state;
    return {
        channel
    };
}

export default connect(mapStateToProps)(Channel);