'use strict';

import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from 'react-redux';
import {showorHideFollow} from '../../actions/home';
import {pageRefresh} from '../../actions/flow';
import { Token } from '../../utils/common';

var {height, width} = Dimensions.get('window');

class HomeFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
            dropAnim: new Animated.Value(-150),
        }
    }

    componentDidMount() {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnim,
                {toValue: 0.4}
            ),
            Animated.timing(
                this.state.dropAnim,
                {toValue: 0}
            )
        ]).start();

    }

    componentWillMount() {
        this.props.home.filterMounted = true;
    }

    _filter(param) {
        const { dispatch, navigator} = this.props;
        if(param === 0){
            dispatch(showorHideFollow(false));
            dispatch(pageRefresh());
            return;
        }

        Token.getToken(navigator).then((token) => {
            if(param === 1 && token){
                dispatch(showorHideFollow(true));
            } else {
                dispatch(showorHideFollow(false));
                return;
            }

            dispatch(pageRefresh());
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.click}>
                <View style={styles.cate}>
                    <Animated.View style={[styles.cateList, {marginTop:0}]}>
                        <TouchableOpacity style={styles.cateItem} onPress={()=>this._filter(0)}>
                            <Text style={[styles.cateFont, !this.props.home.isFollowed? styles.active : '']}>全部</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cateItem} onPress={()=>this._filter(1)}>
                            <Text style={[styles.cateFont, this.props.home.isFollowed? styles.active : '']}>关注</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View  style={[styles.cateShadow, {opacity: this.state.fadeAnim}]}>

                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

const styles = StyleSheet.create({
    cate: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: 40,
        zIndex: 1,
        flexDirection: 'column',
    },
    cateShadow: {
        backgroundColor: '#000',
        width: width,
        height: height,
    },
    cateList: {
        backgroundColor: '#fff',
        height: 80,
        opacity: 1,
        width: width,
        zIndex: 1,
    },
    cateItem: {
        height: 40,
        borderWidth: 1,
        borderColor: '#fff',
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cateFont: {
        fontSize: 14,
        color: '#9b9b9b'
    },
    active: {
        color: '#fc7d30'
    }
});

function mapStateToProps(state) {
    const { home, flow } = state;
    return {
        home,
        flow
    };
}

export default connect(mapStateToProps)(HomeFilter);