import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadTags,updateTags} from '../action/Action';
import { Tool, merged } from '../Tool';
import {Header,Footer} from '../common/ComponentList';
import Util from '../common/Util';
import {Toast} from "antd-mobile";
/*
* 标签云页面
* */
var type = "",editType,word_list,flag=false,backTo="";
class Main extends Component {

    componentDidMount(){
        flag = true;
        /*$(function() {
            $(".my_favorite_latin_words").html("");
            $(".my_favorite_latin_words").jQCloud(word_list);
        });*/
    }

    constructor(props){
        super(props);
        this.state={
            title:"企业大数据画像",
            rightTitle:"下一步",
            rightLink:Tool.localItem("toRegister")?"/register":"/"
        }
        let {dispatch} = this.props;
        this.addTags=()=>{
            var tag = this.refs.taginput.value;
            this.refs.taginput.value="";
            if(Util.isTags(tag)){
                Toast.info("此关键词已经存在",2);
                return ;
            }
            flag = true;
            dispatch(updateTags("",tag,1,1,type));
        }
        this.updateTags=(id,content,domain,ty)=>{
            dispatch(updateTags(id,content,domain,ty,type));
        }
    }
    componentWillMount(){
        flag = false;
        type = this.props.params.type;//获取类型
        editType = this.props.params.tab || '';
        /*editType = this.props.location.query.tab || '';*/
        let {dispatch} = this.props;
        if(type=="start"){//引导页
            this.setState({
                title:"分析结果"
            })
            dispatch(loadTags(0));
        }else if(type=="me"){//用户
            backTo = "/user";
            this.setState({
                rightTitle:"",
                rightLink:"/"
            })
            if(Util.isLogin(this.props)){
                dispatch(loadTags(1));
            }
        }else{
            browserHistory.push('/');//返回首页
        }
        if(editType=="edit"){//编辑标签云
            this.setState({
                title:"编辑标签云",
                rightTitle:"完成"
            })
            if(type=="me"){
                this.setState({
                    rightLink:"/user/cloud/me/"
                })
            }
        }
    }
    render(){
        let {UserCenter} = this.props;
        word_list = UserCenter["tagList"];
        var cloudHtml,cloudActive,linkTo=(<Link to={"/user/cloud/"+type+"/edit"} className="to_edit">去编辑已有关键词的标签</Link>);
        //console.log(editType);
        if(word_list!=null && word_list.length>0){
            if(editType=="edit"){
                linkTo=(
                    <Link to={"/user/cloud/"+type+""} className="to_edit">去查看标签云效果</Link>
                );
                cloudHtml = (
                    <div className="edit_cloud_list">
                        <ul>
                        {
                            word_list.map(function (item,key) {
                                return (
                                    <li key={key}>
                                        {item.text}
                                        <span className="del" onClick={this.updateTags.bind(this,item.id,item.text,item.weight,-1)}>
                                            <i className="iconfont icon-closev"></i>
                                        </span>
                                    </li>
                                );
                            }, this)
                        }
                        </ul>
                    </div>
                )
            }else{
                $(function() {
                    if(flag){
                        setTimeout(function(){
                            $(".my_favorite_latin_words").html("");
                            $(".my_favorite_latin_words").jQCloud(word_list);
                        },1000)
                        flag = false;
                    }
                });
                cloudActive = "active";
            }
        }else{
            cloudHtml = (
                <div className="no_cloud">
                    "{Tool.localItem("company")}"是一颗冉冉升起的新星，暂未找到匹配的标签，您可以手动添加标签描述贵公司的产品、业务、领域等。所有标签信息有助于科学家在线为您更精准地推荐解答、案例、技术成果和专家等信息。
                </div>
            )
        }
        return(
            <div className="page cloud_cons">
                <Header title={this.state.title} backTo={backTo}  leftInfo="back" rightTo={this.state.rightLink} rightInfo={this.state.rightTitle}/>
                {cloudHtml}
                <div className={cloudActive + " my_favorite_latin_words jqcloud"}>
                </div>
                <div className="edit_add_cloud">
                    <div className="add_cloud">
                        <input ref="taginput" type="text" className="inp" placeholder="你也可以自己添加标签"/>
                        <span onClick={this.addTags} className="add">添加</span>
                    </div>
                    {linkTo}
                </div>
            </div>
        )
    }
}

export default connect(state=>({
    User: state.User,
    UserCenter:state.UserCenter
}))(Main);

