/**
 * Created by lyan2 on 17/6/1.
 */
'use strict';
var React = require('react');
var ReactNative = require('react-native');
var {
    ListView,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    } = ReactNative;

export default class AddressModel extends React.Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
            r1.addr !== r2.addr;
        }});
        this.state = {
            dataSource: ds
        }
    }

    _renderAddressRow (rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableHighlight onPress={() => {
                this._pressAddressRow(rowData);
                highlightRow(sectionID, rowID);
            }}>
                <View style={styles.addressRow}>
                    <Text>
                        {rowData.addr}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSeparator (sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: adjacentRowHighlighted ? 2 : 1,
                    backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
                }}/>
        );
    }

    _pressAddressRow (rowData) {
        this.setState({modalVisible:false, address:rowData.addr});

        this.props.onSelect && this.props.onSelect(rowData);
    }

    render() {
        // we don't' use state, because it's not changeable in this component.
        var dataSource = this.props.dataSource || this.state.dataSource;
        return (
            <Modal transparent={false} animationType={"slide"} {...this.props}>
                <View style={{marginTop: 22}}>
                    <ListView dataSource={dataSource}
                              renderRow={this._renderAddressRow.bind(this)}
                              renderSeparator={this._renderSeparator}
                        />
                </View>
            </Modal>
        );
    }
}

var styles = StyleSheet.create({
    addressRow: {
        paddingVertical: 10,
        paddingHorizontal: 10
    }
});