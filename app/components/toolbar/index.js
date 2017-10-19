'use strict';

import PropTypes from 'prop-types';

import React from 'react';
import {
    StyleSheet,
    Platform,
    View,
    Text,
    Alert,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { naviGoBack } from '../../utils/common';
import ImageButton from './ImageButton';
import Button from './Button';
import ToolbarAndroid from 'ToolbarAndroid';

const arrowImg = require('../../assets/header/arrow.png');
var backImg = require('../../assets/upload/rg_left.png');
var {height, width} = Dimensions.get('window');

const propTypes = {
    title: PropTypes.string,
    actions: PropTypes.array,
    navigator: PropTypes.object,
    _onRightIconClicked: PropTypes.func,
    _onLeftIconClicked: PropTypes.func,
    navIcon: PropTypes.number,
    cate: PropTypes.object,
    leftImg: PropTypes.number,
    rightImg: PropTypes.number,
    rightText: PropTypes.string,
    onLeftIconClicked: PropTypes.func,
    hideDrop: PropTypes.bool,
    onRightIconClicked: PropTypes.func,
    showFilter: PropTypes.func,
    onTitlePress: PropTypes.func,
    filledToolBar: PropTypes.bool
};

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this._onLeftIconClicked = this._onLeftIconClicked.bind(this);
        this._onRightIconClicked = this.props.onRightIconClicked || this._onRightIconClicked.bind(this);
        this._onTitleClicked = this.props.onTitlePress || this._onArrowClicked.bind(this);
    }

    static defaultProps = {
        filledToolBar: false
    }

    _onLeftIconClicked() {
        const { navigator } = this.props;
        if (this.props.onLeftIconClicked) {
            this.props.onLeftIconClicked();
        } else {
            if (navigator) {
                naviGoBack(navigator);
            }
        }
    }

    _onRightIconClicked() {
        if (this.props.onRightIconClicked) {
            this.props.onRightIconClicked();
        }
    }

    _onArrowClicked() {
        if (!this.props.hideDrop) {
            //this.props.home.showFilter = !this.props.home.showFilter;
            this.props.showFilter();
        }
    }

    _renderToolbarAndroid() {
        return (
            <View>
                <ToolbarAndroid
                    style={styles.toolbarAndroid}
                    navIcon={this.props.leftImg ? this.props.leftImg : backImg}
                    onIconClicked={this._onLeftIconClicked}
                    actions={[{title: this.props.rightText, icon: this.props.rightImg  , show: 'always'}]}
                    onActionSelected={this._onRightIconClicked}
                    >
                    <View style={styles.titleAndroidV}>
                        <TouchableOpacity style={styles.titleViewAndroidClick} onPress={this._onTitleClicked}>
                            <Text
                                style={styles.titleIOS}
                                >
                                {this.props.title}
                            </Text>
                            {
                                !this.props.hideDrop ?
                                    <ImageButton
                                        source={arrowImg}
                                        onPress={this._onTitleClicked}
                                        style={styles.arrowIOS}
                                        /> : <View/>
                            }
                        </TouchableOpacity>
                    </View>
                </ToolbarAndroid>
                <View style={styles.underlineAndroid}></View>
            </View>

        );
    }

    _renderToolbarIOS() {
        return (
            <View style={[styles.toolbar,{paddingTop: !this.props.filledToolBar?0:21}]}>
                <ImageButton
                    source={this.props.leftImg ? this.props.leftImg : backImg}
                    style={styles.leftIOS}
                    onPress={this._onLeftIconClicked}
                    containerStyle={styles.leftIOSContainer}
                    />

                <View style={styles.titleViewIOS}>
                    <TouchableOpacity style={styles.titleViewIOSClick} onPress={this._onTitleClicked}>
                        <Text
                            style={styles.titleIOS}
                            >
                            {this.props.title}
                        </Text>
                        {
                            !this.props.hideDrop ?
                                <ImageButton
                                    source={arrowImg}
                                    onPress={this._onTitleClicked}
                                    style={styles.arrowIOS}
                                    /> : <View/>
                        }
                    </TouchableOpacity>

                </View>

                {
                    this.props.rightText ?
                        (
                            <TouchableOpacity style={[styles.rightIOS,styles.rightText]}
                                              onPress={this._onRightIconClicked}>
                                <Text >{this.props.rightText}</Text>
                            </TouchableOpacity>
                        )
                        : (<ImageButton source={this.props.rightImg} style={styles.rightIOS}
                                        onPress={this._onRightIconClicked}/>)
                }

            </View>

        );
    }

    render() {
        let Toolbar = Platform.select({
            android: () => this._renderToolbarAndroid(),
            ios: () => this._renderToolbarIOS()
        });
        return <Toolbar />;
    }
}

const styles = StyleSheet.create({
    toolbar: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        //height: 58,
        //shadowOffset: {width: 0, height: .2,},
        //shadowOpacity: .3,
        borderBottomWidth: 1,
        borderColor: '#eee',
        shadowColor: '#555',
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 10
    },
    titleIOS: {
        textAlign: 'center',
        color: '#696969',
        fontWeight: 'bold',
        fontSize: 20,
    },
    leftIOSContainer: {
        width: 40,
        height: 35,
        justifyContent: 'center',
    },
    leftIOS: {
        //height: 18,
        //width: 24,
        marginLeft: 10
    },
    rightIOS: {
        marginRight: 10,
        right: 0
    },
    rightText: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        paddingLeft: 8,
    },
    arrowIOS: {
        marginLeft: 10,
        width: 10,
        height: 7
    },
    titleViewIOS: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleViewIOSClick: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 40
    },
    toolbarAndroid: {
        backgroundColor: '#fff',
        height: 48,
        paddingBottom: 10,
        marginTop: -8,
        marginBottom: 1
    },
    titleViewAndroidClick: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width -110,
        height: 56
    },
    titleAndroidV: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
    },
    titleAndroidT: {
        color: '#000',
        fontSize: 20
    },
    underlineAndroid: {
        width: width,
        height: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#eee',
    }
});

Toolbar.propTypes = propTypes;

Toolbar.defaultProps = {
    rightText: ''
};


function mapStateToProps(state) {
    const { home } = state;
    return {
        home
    };
}

export default connect(mapStateToProps)(Toolbar);