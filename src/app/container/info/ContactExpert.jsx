import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList';
import Util from "../../common/Util";
/*
* 联系专家页面
* */
var id,type;
class Main extends Component {
    constructor(props){
        super(props)
        this.state={
            title:""
        }

    }
    componentWillMount(){
        /* 获取专家id */
        if(Util.isLogin(this.props)){
            id = this.props.params.id;
            type = this.props.params.type;//来源
            if(Tool.getSession("contactExpertUid")!=id){
                browserHistory.push("/");
            }
            if(type=="other"){
                this.setState({
                    title:"您正在就"+Tool.getSession("contactTitle")+"联系专家"+Tool.getSession("contactName")
                })
            }else if(type=="info"){
                this.setState({
                    title:"您正在联系专家"+Tool.getSession("contactName")
                })
            }
        }
    }
    render() {
        return (
            <div className="page question_icon">
                <Header title="联系专家" leftInfo="back"/>
                <div className="question_tops">
                    {this.state.title}，您可以选择：
                </div>
                <div className="question_nav">
                    <Link to={"/contact/pay/"+id+"?type="+type} className="quest_link">
                        <i className="iconfont icon-dianhua left_icon"></i>
                        电话咨询
                        <i className="right_icon iconfont icon-jiantou"></i>
                    </Link>
                    <div className="li_mess">
                        您需要支付58元服务费，平台将确保您与该专家进行10分钟的三方通话沟通。
                    </div>
                </div>
                <div className="que_height"></div>
                <div className="question_nav">
                    <Link to="/question?source=1" className="quest_link">
                        <i className="iconfont icon-wenj2 left_icon"></i>
                        在线咨询
                        <i className="right_icon iconfont icon-jiantou"></i>
                    </Link>
                    <div className="li_mess">
                        待您成功提交问题或需求后，“科学家在线”将为您联系该专家以及相关领域其他专家进行解答（平台不保证专家一定答复）。
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){

    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main);

