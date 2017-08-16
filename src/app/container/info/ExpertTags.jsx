import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadExpertTags,setTagList} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,PageNullComm} from '../../common/ComponentList';
import Util from '../../common/Util';
import {Toast} from "antd-mobile";
/*
 * 标签云页面
 * */
var uid,word_list,flag=false,backTo="";
class Main extends Component {

    componentDidMount(){
        flag = true;
        /*$(function() {
            setTimeout(function(){
                $(".my_favorite_latin_words").html("");
                $(".my_favorite_latin_words").jQCloud(word_list);
            },1000)
        });*/
    }

    constructor(props){
        super(props);
        this.state={
            title:"我的标签云",
        }

    }
    componentWillMount(){
        flag=false
        uid = this.props.params.id;//获取类型
        if(!Util.IsNull(uid)){
            let {dispatch} = this.props;
            dispatch(setTagList([]));
            dispatch(loadExpertTags(uid));
        }
    }
    render(){
        let {UserCenter} = this.props;
        word_list = UserCenter["tagList"];
        if(word_list && word_list.length>0 && flag){
            $(function() {
                setTimeout(function(){
                    $(".my_favorite_latin_words").html("");
                    $(".my_favorite_latin_words").jQCloud(word_list);
                },1000)
                flag = false;
            });
        }
        return(
            <div className="page cloud_cons">
                <Header title="大数据画像" backTo={backTo}  leftInfo="back" rightTo="/" rightIcon="icon-home2"/>
                {word_list && word_list.length>0?
                    <div className="active my_favorite_latin_words jqcloud jqcloud_full">
                    </div>:
                    <PageNullComm />
                }
            </div>
        )
    }
}

export default connect(state=>({
    User: state.User,
    UserCenter:state.UserCenter
}))(Main);

