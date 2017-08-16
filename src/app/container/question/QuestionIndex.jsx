import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import {Header} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
* 问答引导页面
* */
var source="";
class Main extends Component {
    componentWillMount(){
        /* 获取uri */
        source = this.props.location.query.source;
        if(!Util.IsNull(source) && source==1){
            source = "?source=1";
        }else if(!Util.IsNull(source) && source==2){

        }else{
            source = "";
        }
    }
    render() {
        return (
            <div className="question_icon">
                <Header title="问题/需求" leftInfo="back" backTo={source==2?"/":""}/>
                <div className="page page_normal">
                    <div className="question_nav">
                        <Link to={"/question/template/profession"+source} className="quest_link">
                            <i className="iconfont icon-wenhao left_icon"></i>
                            向专家提问
                            <i className="right_icon iconfont icon-jiantou"></i>
                        </Link>
                        <div className="li_mess">
                            您提交的专业问题，支付一定的信息服务费后，将通过短信、邮件等方式推送给专家，由感兴趣的专家进行问题的回答。
                        </div>
                    </div>
                    <div className="que_height"></div>
                    <div className="question_nav">
                        <Link to={"/question/template/project"+source} className="quest_link">
                            <i className="iconfont icon-wenj2 left_icon"></i>
                            项目需求找专家
                            <i className="right_icon iconfont icon-jiantou"></i>
                        </Link>
                        <div className="li_mess">
                            项目需求提交成功后，科学家在线将联系您，和您充分沟通确认后，为您找到最佳的4位专家，并促成您和每位专家的10分钟的三方电话，由您来选择最适合的专家进行项目需求的对接。<br/>
                            该服务将收取200元信息服务费。
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);