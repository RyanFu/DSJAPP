/**
 * Created by lyan2 on 16/9/4.
 */
import PropTypes from 'prop-types';

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

var {height, width} = Dimensions.get('window');

const propTypes = {
    options: PropTypes.array,
    renderOption: PropTypes.func,
    onOptionPress: PropTypes.func
};

class ToolbarFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
            dropAnim: new Animated.Value(-150)
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

    defaultRenderOption(option) {
        return (
            <TouchableOpacity style={styles.cateItem} onPress={this.props.onOptionPress}>
                <Text style={styles.cateFont}>{typeof option == 'text' ? option : option.text}</Text>
            </TouchableOpacity>
        );
    }

    _renderOptions(options) {
        if (!options || options.length <= 0) return;

        let renderOptionFunc = this.props.renderOption ? this.props.renderOption : this.defaultRenderOption;
        renderOptionFunc.bind(this);

        options.map(function(option){
            return renderOptionFunc(option);
        });
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.click}>
                <View style={styles.cate}>
                    <Animated.View style={[styles.cateList, {marginTop: this.state.dropAnim}]}>
                        {this._renderOptions(this.props.options)}
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
        marginTop: 58,
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
        height: 120,
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
    }
});

ToolbarFilter.propTypes = propTypes;

function mapStateToProps(state) {
    const { home } = state;
    return {
        home
    };
}

export default connect(mapStateToProps)(HomeFilter);