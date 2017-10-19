/**
 * Created by lyan2 on 16/8/7.
 */
import React from 'react';
import {
    Animated,
    Dimensions,
    ListView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';

class OptionList extends React.Component {
    constructor(props) {
        super(props);

        this._renderRow = this.props.renderRow || this._defaultRenderRow;
    }

    _defaultTextInput(event) {
        if (typeof this.props.onTextInput == 'function') {
            this.props.onTextInput(event.nativeEvent.text);
        }
    }

    _defaultOnChangeText(text) {
        if (typeof this.props.onChangeText == 'function') {
            this.props.onChangeText(text);
        }
    }

    _onPressOption(rowData) {
        if (typeof this.props.onSelect == 'function') {
            this.props.onSelect(rowData);
        }
    }

    _onCancel() {
        if (typeof this.props.onCancel == 'function') {
            this.props.onCancel();
        }
    }

    _defaultRenderRow(rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableHighlight onPress={() => {highlightRow(sectionID, rowID); this._onPressOption(rowData);}}>
                <View style={styles.optionRow}>
                    <Text style={[styles.text]}>{rowData.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View key={sectionID + '_' + rowID}
                  style={styles.separatorHorizontal} />
        );
    }

    render() {
        return (
            <View style={this.props.style}>
                <View style={styles.optionsHeader}>
                    <View style={styles.richTextInput}>
                        {searchIcon}
                        <TextInput autoFocus={false} autoCorrect={false} keyboardType='default' style={styles.textInput} selectTextOnFocus={true}
                                   clearButtonMode='while-editing'returnKeyType='search' enablesReturnKeyAutomatically={true} /* ios attributes */
                                   returnKeyLabel='search' underlineColorAndroid="transparent" /* android attributes */
                                   /* onSubmitEditing={(e) => console.log(e)} */
                                   onChangeText={(text) => this._defaultOnChangeText(text)} autoCapitalize='none'/>
                    </View>
                    <TouchableHighlight onPress={this._onCancel.bind(this)}>
                        <Text style={[styles.text, styles.cancelText]}>取消</Text>
                    </TouchableHighlight>
                </View>

                <ListView dataSource={this.props.dataSource} style={{flex:1}} enableEmptySections={true}
                          renderRow={this._renderRow.bind(this)}
                          renderScrollComponent={props => <ScrollView style={{flex:1}}/>}
                          renderSeparator={this._renderSeparator}/>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    text: {
        color: '#4a4a4a'
    },
    textInput: {
        marginHorizontal: 10,
        padding: 3,
        height: 26,
        flex:1,
        fontSize:20,
        color:'#4a4a4a'
    },
    richTextInput: {
        backgroundColor: '#bababa',
        borderColor: '#eee',
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    separatorHorizontal: {
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
    },
    optionsHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        alignItems: 'center'
    },
    cancelText: {
        marginLeft: 10
    },
    linkIcon: {
        color:'#9b9b9b'
    },
    optionRow: {
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});

var chevronRightIcon = <Icon style={[styles.linkIcon]} size={16} name="angle-right"/>;
var searchIcon = <Icon style={[styles.linkIcon]} size={16} name="search"/>;

export default OptionList;