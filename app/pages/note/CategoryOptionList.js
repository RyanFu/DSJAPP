/**
 * Created by lyan2 on 16/11/14.
 */
import React, { Component } from 'react';
import {
    ListView,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import OptionList from '../../components/optionlist';
import configs from '../../constants/configs';
import StoreActions from '../../constants/actions';

class CategoryOptionList extends Component {
    constructor(props) {
        super(props);

        /* we used the defaultGetRowData, this requires dataBlob has below structure:
         * dataBlob = {section:{rowID_1: rowData1, rowID_2: rowData2,...},...};
         *
         * Todo
         * We need to make sure rowID is noteID
         */
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 != s2
        });

        this.state = {
            dataSource: ds,
            categories: this.props.categories
        };
    }

    componentDidMount() {
        this._defaultOnChangeText('');
    }

    componentWillReceiveProps() {
        const { dispatch } = this.props;
        dispatch({type:StoreActions.FETCH_CATEGORIES});
    }

    _getValidCategories(text) {
        let source = {options:{}};

        if (this.state.categories && this.state.categories.length > 0) {
            var reg = new RegExp("\\w*" + text + "\\w*");
            let validCategories = this.state.categories.filter(function(category){
                return reg.test(category.name);
            });

            validCategories.forEach(function(category){
                source.options[category.id] = {title: category.name, id:category.id};
            });

            this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(source)});
        }
    }

    _defaultOnChangeText (text) {
        console.log(text);
        if (this.state.categories && this.state.categories.length > 0) {
            this._getValidCategories(text);
        } else {
            fetch(configs.serviceUrl + 'common/commodity/categories/',  {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.resultValues && responseJson.resultValues.length > 0) {
                    this.state.categories = responseJson.resultValues;
                    this._getValidCategories(text);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }

    }

    render() {
        return (
            <OptionList style={{flex:1}} dataSource={this.state.dataSource} onChangeText={this._defaultOnChangeText.bind(this)} {...this.props} />
        );
    }
}

// get selected photos from store.state object.
function mapStateToProps(state) {
    const { categories } = state;
    return {
        categories
    };
}

export default connect(mapStateToProps)(CategoryOptionList);