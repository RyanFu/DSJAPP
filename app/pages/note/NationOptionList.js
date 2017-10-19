/**
 * Created by lyan2 on 16/8/13.
 */
import React, { Component } from 'react';
import {
    ListView,
    StyleSheet
} from 'react-native';
import OptionList from '../../components/optionlist';
import configs from '../../constants/configs';
import StoreActions from '../../constants/actions';

export default class NationOptionList extends Component {
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
            cities: this.props.cities,
            nation: null,
            city: null
        };
    }

    componentWillReceiveProps() {
        const { dispatch } = this.props;
        dispatch({type:StoreActions.FETCH_CITIES});
    }

    _filterCities(text) {
        let source = {options:{}};

        if (this.state.cities && this.state.cities.length > 0) {
            var reg = new RegExp("\\w*" + text + "\\w*");
            let cities = this.state.cities.filter(function(city){
                return reg.test(city.name);
            });

            cities.forEach(function(city){
                source.options[city.id] = {title: city.name, id: city.id};
            });

            this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(source)});
        }
    }

    _defaultOnChangeText (text) {
        if (this.state.cities && this.state.cities.length > 0) {
            this._filterCities(text);
        } else {
            fetch(configs.serviceUrl + 'common/geography/cities/',  {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.resultValues && responseJson.resultValues.length > 0) {
                    this.state.cities = responseJson.resultValues;
                    this._filterCities(text);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    _defaultOnSelect(rowData) {
        this.props.onSelect && this.props.onSelect(rowData);

        //if (this.state.nation == null) {
        //    this.state.nation = rowData.title;
        //
        //    let source = {options:
        //    {"beijing":{
        //        title: '北京'
        //    },"shanghai":{
        //        title: '上海'
        //    },"tianjing":{
        //        title: '天津'
        //    },"hangzhou":{
        //        title: '杭州'
        //    }, 'changsha': {
        //        title: '长沙'
        //    }, 'nanjing': {
        //        title: '南京'
        //    }, 'suzhou': {
        //        title: '苏州'
        //    }, 'hefei': {
        //        title: '合肥'
        //    }}};
        //
        //    this.setState({dataSource:this.state.dataSource.cloneWithRowsAndSections(source)});
        //} else {
        //    if (this.props.onSelect) {
        //        this.state.city = rowData.title;
        //
        //        let data = {
        //            nation: this.state.nation,
        //            city: this.state.city
        //        };
        //        this.props.onSelect(data);
        //    }
        //}
    }

    render() {
        return (
            <OptionList style={{flex:1}} dataSource={this.state.dataSource} onChangeText={this._defaultOnChangeText.bind(this)}
                        {...this.props} onSelect={this._defaultOnSelect.bind(this)} />
        );
    }
}

