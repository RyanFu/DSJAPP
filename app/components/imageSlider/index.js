import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableHighlight,
    TouchableOpacity,
    Dimensions,
    LayoutAnimation,
    UIManager,
    Platform
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        overflow: 'hidden'
    },
    image: {
        width: Dimensions.get('window').width
    },
    sequences: {
        height: 20,
        width: 45,
        bottom: 20,
        position: 'absolute',
        right: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgba(74,73,74,0.3)',
        borderRadius: 10
    },
    sequence: {
        color: '#fff',
        fontSize: 12,
    },
    count: {
        height: 36,
        width: 36,
        top: 40,
        right: 20,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(74,73,74,0.3)',
        borderRadius: 18
    },
    countText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default class ImageSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 0,
            height: new Animated.Value(this._scaleHeight(this.props.images[0])),
            left: new Animated.Value(0),
            scrolling: false,
            timeout: null,
            countDown: this.props.countDown? this.props.countDown : 0
        };

        // Enable LayoutAnimation under Android
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }

    }

    _move(index) {
        const width = Dimensions.get('window').width;
        const to = index * -width;
        const scaleH = this._scaleHeight(this.props.images[index]);
        if (!this.state.scrolling) {
            return;
        }
        Animated.timing(this.state.left, {toValue: to, friction: 10, tension: 10, velocity: 1, duration: 400}).start();
        Animated.timing(this.state.height, {
            toValue: scaleH,
            friction: 10,
            tension: 10,
            velocity: 1,
            duration: 400
        }).start();

        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
        this.setState({
            position: index, timeout: setTimeout(() => {
                this.setState({scrolling: false, timeout: null});
                if (this.props.onPositionChanged) {
                    this.props.onPositionChanged(index);
                }
            }, 400)
        });
    }

    _scaleHeight(image) {
        const imageWidth = image.width;
        const imageHeight = image.height;
        return Dimensions.get('window').width * imageHeight / imageWidth;
    }
    _getPosition() {
        if (typeof this.props.position === 'number') {
            return this.props.position;
        }
        return this.state.position;
    }

    componentWillReceiveProps(props) {
        if (props.position !== undefined) {
            this.setState({scrolling: true});
            this._move(props.position);
        }
    }

    componentWillMount() {
        const width = Dimensions.get('window').width;

        if (typeof this.props.position === 'number') {
            this.state.left.setValue(-(width * this.props.position));
        }

        let release = (e, gestureState) => {
            const width = Dimensions.get('window').width;
            const relativeDistance = gestureState.dx / width;
            const vx = gestureState.vx;
            let change = 0;

            if (relativeDistance < -0.5 || (relativeDistance < 0 && vx <= 0.5)) {
                change = 1;
            } else if (relativeDistance > 0.5 || (relativeDistance > 0 && vx >= 0.5)) {
                change = -1;
            }
            const position = this._getPosition();
            if (position === 0 && change === -1) {
                change = 0;
            } else if (position + change >= this.props.images.length) {
                change = (this.props.images.length) - (position + change);
            }
            this._move(position + change);
            return true;
        };

        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dx) > 5,
            onPanResponderRelease: release,
            onPanResponderTerminate: release,
            onPanResponderMove: (e, gestureState) => {
                const dx = gestureState.dx;
                const width = Dimensions.get('window').width;
                const position = this._getPosition();
                let left = -(position * width) + Math.round(dx);
                if (left > 0) {
                    left = Math.sin(left / width) * (width / 2);
                } else if (left < -(width * (this.props.images.length - 1))) {
                    const diff = left + (width * (this.props.images.length - 1));
                    left = Math.sin(diff / width) * (width / 2) - (width * (this.props.images.length - 1));
                }
                this.state.left.setValue(left);
                if (!this.state.scrolling) {
                    this.setState({scrolling: true});
                }

                //scale
                let change = 0;

                if (dx >= 0) {
                    change = -1;
                } else if (dx < 0) {
                    change = 1;
                }
                if (position === 0 && change === -1) {
                    change = 0;
                } else if (position + change >= this.props.images.length) {
                    change = (this.props.images.length) - (position + change);
                }
                const originH = this._scaleHeight(this.props.images[position]);
                const scaleH = this._scaleHeight(this.props.images[position + change]);
                Animated.timing(this.state.height, {
                    toValue: (scaleH - originH)*Math.abs(dx/width) + originH,
                    friction: 10,
                    tension: 10,
                    velocity: 1,
                    duration: 0
                }).start();
            },
            onShouldBlockNativeResponder: () => true
        });

    }

    componentDidMount() {
        let interval = null;
        let the = this;
        if(this.props.countDown)
            interval = setInterval(()=>{
                if(  the.state.countDown > 1)
                    the.setState({countDown: the.state.countDown-1});
                else
                    clearInterval(interval);
            }, 1000);
    }

    componentWillUnmount() {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
    }

    componentWillUpdate() {
        const CustomLayoutAnimation = {
            duration: 100,
            //create: {
            //    type: LayoutAnimation.Types.linear,
            //    property: LayoutAnimation.Properties.opacity,
            //},
            update: {
                type: LayoutAnimation.Types.linear
            }
        };
        LayoutAnimation.configureNext(CustomLayoutAnimation);
        //LayoutAnimation.linear();
    }

    render() {
        const customStyles = this.props.style ? this.props.style : {};
        const width = Dimensions.get('window').width;
        const position = this._getPosition();
        return (<View>
            <Animated.View
                style={[styles.container, customStyles, {height: this.state.height, width: width * this.props.images.length, transform: [{translateX: this.state.left}]}]}
                {...this._panResponder.panHandlers}>
                {this.props.images.map((image, index) => {

                    const imageWidth = image.width;
                    const imageHeight = image.height;
                    const scaleH = Dimensions.get('window').width * imageHeight / imageWidth;
                    let imageComponent = <Animated.Image
                        key={index}
                        source={{uri: image.uri}}
                        style={{height: this.state.height, width}}
                        resizeMode={Image.resizeMode.stretch}
                        />;
                    if(typeof image.uri === 'number') {
                        imageComponent = <Animated.Image
                            key={index}
                            source={image.uri}
                            style={{height: this.state.height, width}}
                            resizeMode={Image.resizeMode.stretch}
                            />;
                    }
                    if (this.props.onPress) {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    this.props.onPress({ image, index })
                                }}
                                delayPressIn={200}
                                >
                                {imageComponent}
                            </TouchableOpacity>
                        );
                    } else {
                        return imageComponent;
                    }
                })}
            </Animated.View>
            <View style={styles.sequences}>

                <Text style={styles.sequence}>{position+1}/{this.props.images.length}</Text>
            </View>
            {
                this.props.countDown ?  <View style={styles.count}>
                    <Text style={styles.countText}>{this.state.countDown}s</Text>
                </View>: null
            }

        </View>);
    }
}
