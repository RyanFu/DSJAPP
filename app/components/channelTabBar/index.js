const React = require('react');
import PropTypes from 'prop-types'
var createReactClass = require('create-react-class');
const ReactNative = require('react-native');
const {
    StyleSheet,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
    ViewPropTypes
    } = ReactNative;
const Button = require('./Button');
var {height, width} = Dimensions.get('window');
let numberOfTabs;
let tabsLength;
let tabLength;
let arrowWidth = 0;

const ChannelTabBar = createReactClass({
    propTypes: {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
        underlineColor: PropTypes.string,
        underlineHeight: PropTypes.number,
        backgroundColor: PropTypes.string,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        textStyle: Text.propTypes.style,
        tabStyle: ViewPropTypes.style,
    },

    getDefaultProps() {
        return {
            activeTextColor: 'navy',
            inactiveTextColor: 'black',
            underlineColor: 'navy',
            backgroundColor: null,
            underlineHeight: 4,
        };
    },

    getInitialState() {
        return {
            barLeft: 0
        };
    },

    goToPage(page) {
        this.props.goToPage(page);
        const scrollLength = tabLength * (page - 1);
        if ((scrollLength + tabLength) > 0 && (scrollLength + width - arrowWidth) < tabsLength) {
            this.setState({barLeft: scrollLength});
            _scrollView.scrollTo({x: scrollLength});
        }

    },

    renderTabOption(name, page) {
        const isTabActive = this.props.activeTab === page;
        const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';

        return <Button
            style={{flex: 1}}
            key={name}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => this.goToPage(page)}
            >
            <View style={[styles.tab, this.props.tabStyle,{width: tabLength}]}>
                <Text style={[styles.textStyle, {color: textColor, fontWeight, }, textStyle, ]} ellipsizeMode="tail"
                      numberOfLines={1}>
                    {name}
                </Text>
            </View>
        </Button>;
    },

    _scrollTo(_scrollView) {
        let left = this.state.barLeft;
        if ((left + width - arrowWidth) < tabsLength) {
            this.setState({barLeft: left + tabLength});
            _scrollView.scrollTo({x: left + tabLength});
        }
    },

    _onScroll(event) {
        let offset = event.nativeEvent.contentOffset.x;
        this.setState({barLeft: offset});
    },

    render() {
        arrowWidth = this.props.scrollButton ? arrowWidth : 0;
        //const containerWidth = this.props.containerWidth;
        numberOfTabs = this.props.tabs.length;
        tabsLength = Math.ceil(numberOfTabs / 5) * (width - arrowWidth);
        tabLength = tabsLength / numberOfTabs;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: tabLength,
            height: this.props.underlineHeight,
            backgroundColor: this.props.underlineColor,
            bottom: 0,
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1,], outputRange: [0, tabLength,],
        });


        return (
            <View style={[styles.tabView, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
                <View style={{width: width - arrowWidth}} style={styles.scroll}>
                    <ScrollView
                        ref={(scrollView) => { _scrollView = scrollView; }}
                        contentContainerStyle={[styles.tabs, {width: tabsLength}]}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={200}
                        onScroll={this._onScroll}
                        >
                        {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
                        <Animated.View style={[styles.tabUnderline,tabUnderlineStyle, { left, }, ]}/>
                    </ScrollView>
                </View>

                {
                    this.props.scrollButton ?
                        <Button
                            style={styles.arrow}
                            onPress={() => this._scrollTo(_scrollView)}
                            >
                            <Image style={styles.magnifier} source={require('../../assets/channel/channel_more.png')}/>
                        </Button> : null
                }

            </View>
        );
    },
});
let _scrollView = ScrollView;
const styles = StyleSheet.create({
    tabView: {
        width: width,
        height: 38,
        flexDirection: 'row',
    },
    scroll: {
        width: width - arrowWidth,
        shadowOffset: {width: 0, height: 1}, shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 4,
        marginTop: 1,
        paddingBottom: 38,
        //marginRight: 10
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderBottomColor: '#ccc',
        minWidth: width - arrowWidth,
        //paddingRight: arrowWidth
    },
    textStyle: {
        minWidth: 10,
        height: 38,
        textAlign: 'center'
    },
    arrow: {
        flex: 1,
        backgroundColor: '#fff',
        borderLeftWidth: 1,
        borderColor: '#f4f4f4',
        position: 'absolute',
        width: arrowWidth,
        height: arrowWidth,
        marginTop: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOffset: {width: -2, height: 1}, shadowColor: 'black', shadowOpacity: 0.2, shadowRadius: 1,
    },
    tabUnderline: {
        backgroundColor: '#f4f4f4'
    }
});

module.exports = ChannelTabBar;
