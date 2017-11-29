import React from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    TouchableOpacity,
    InteractionManager,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import StoreActions from '../../constants/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import FilterPage from './filter';
const funnelIcon = <Icon name={'ios-funnel-outline'} size={12} color={ '#9b9b9b'} style={{marginLeft:4}}/>;

class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this._setAnimationValue = this._setAnimationValue.bind(this);

        this.state = {
            priceSort: 1
        };
        this.tabComponent = [];
    }


    static propTypes = {
        goToPage: PropTypes.func,
        activeTab: PropTypes.number,
        tabs: PropTypes.array,
    };

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this._setAnimationValue);
    }

    _setAnimationValue({ value, }) {
    }


    _onIconPress(i) {
        const { dispatch,navigator } = this.props;


        let action = {
            sv: true,
            moods: false,
            price: false,
            redPacket: false,
            priceSort: 0,
            priceRange: this.props.searchCondition.priceRange,
            startPrice: this.props.searchCondition.startPrice,
            endPrice: this.props.searchCondition.endPrice,
            location: this.props.searchCondition.location,
            tmall: this.props.searchCondition.tmall
        };
        if (i === 0) {
            action.sv = true;
        }
        if (i === 1) {
            action.moods = true;
        }
        if (i === 2) {
            action.redPacket = true;
        }
        if (i === 3) {
            this.state.priceSort = this.state.priceSort === 0 ? 1 : 0;
            action.price = true;
            action.priceSort = this.state.priceSort;
        }
        if (i !== 5) {
            setTimeout(()=> {
                this.props.goToPage(i);
            }, 10);
            dispatch(Object.assign({}, {type: StoreActions.SEARCH_CONDITION_UPDATE}, action));
        } else {
            navigator.push({
                component: FilterPage,
                name: 'FilterPage'
            });
        }

    }

    componentWillReceiveProps() {
    }

    render() {
        return (
            <View style={[styles.tabs, this.props.style, ]}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.container}
                    >
                    {this.props.tabs.map((tab, i) => {
                        if (i === 4) {
                            return <TouchableOpacity key='tabCut' style={styles.cut}>
                            </TouchableOpacity>
                        }
                        return <TouchableOpacity ref={(component) => this.tabComponent.push(component)}
                                                 key={tab} onPress={() => this._onIconPress(i)}
                                                 style={[styles.tab,
                                                    {borderBottomColor: (this.props.activeTab === i? '#fc7d30': 'rgba(178,178,178,0)')},
                                                    ]}>
                            <Text
                                style={[{fontSize: 12,color: (this.props.activeTab === i? '#fc7d30': '#9b9b9b')}]}>{this.props.tabs[i]}</Text>
                            {i === 5 ? funnelIcon : null}
                            {i === 3 ? <View style={styles.price}>
                                <Text style={styles.arrow}>
                                    <Icon name={'md-arrow-dropup'} size={12}
                                          color={ this.props.activeTab === i&&this.state.priceSort === 0 ?'#fc7d30':'#9b9b9b'}/>
                                </Text>
                                <Text style={styles.arrow}>
                                    <Icon name={'md-arrow-dropdown'} size={12}
                                          color={ this.props.activeTab === i&&this.state.priceSort === 1 ?'#fc7d30':'#9b9b9b'}/>
                                </Text>
                            </View> : null}
                        </TouchableOpacity>;
                    })}
                </ScrollView>

            </View>);
    }
}

const styles = {
    tabs: {
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomColor: 'rgba(178,178,178,0.1)',
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        borderWidth: 1,
        borderColor: 'rgba(178,178,178,0)',
        marginTop: 5,
        paddingBottom: 5,
        height: 25,
        flexDirection: 'row',
    },
    cut: {
        height: 12,
        width: .5,
        backgroundColor: 'rgba(178,178,178,0.5)'
    },
    price: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: -2
    },
    arrow: {
        height: 8,
        marginTop: -2,
        marginLeft: 4
    }
};

function mapStateToProps(state) {
    const { searchCondition } = state;
    return {
        searchCondition
    };
}

export default connect(mapStateToProps)(TabBar);