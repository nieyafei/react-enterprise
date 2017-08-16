import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,setSystemAnimating} from '../../action/Action';
import {Header,ListLiFeild,LoginCom} from '../../common/ComponentList';
import {Tool} from '../../Tool';
import {Toast} from 'antd-mobile';
import Util from '../../common/Util';

/*
* 问答模板页面
* */
var dateActive="1,",question_area=1,source="";
class Main extends Component {
    constructor(props,context){
        super(props,context);
        var  type = this.props.params.type;
        //问题的类型profession :专业问题    project 项目需求
        this.state={
            newActive:"",
            title:type=="profession"?"提交专业问题":"提交项目需求",
            dateActive:dateActive,
            loginActive:"",
            textTitle:type=="profession"?"问题":"项目需求"
        }
        let {dispatch} = this.props;
        this.newQuestion=()=>{//提交新的问题
           browserHistory.push("/question/add/"+type+source);
        }
    }
    componentWillMount(){
        Tool.localItem("prevPathName",this.props.location.pathname+this.props.location.search);
        source = this.props.location.query.source;
        if(!Util.IsNull(source) && source==1){
            source = "?source=1";
        }else{
            source = "";
        }
    }
    render() {
        return (
            <div className="page question_icon">
                <Header title="问题/需求" leftInfo="back"/>
                <h2 className="tem_tits_info">为了能让专家更积极、快速的响应和回答您的专业问题，请参考如下的模板：</h2>
                <div className="ques_template ques_template_bg">
                    <div className="tim_lay">
                        <i className="iconfont icon-wenjuan"></i> 提问模板
                    </div>
                    <div className="tem_cons">
                        <div className="cons_flo">
                            <label>标&nbsp;&nbsp;&nbsp;&nbsp;题：</label>
                            <span>互联网医疗的发展现状和前景如何？</span>
                        </div>
                        <div className="cons_flo">
                            <label>关键词：</label>
                            <span>互联网医疗,移动医疗</span>
                        </div>
                        <div className="cons_flo">
                            <label>内&nbsp;&nbsp;&nbsp;&nbsp;容：</label>
                            <span>自2011年启，马云开始积极介入医疗健康领域，从大数据、医疗服务等领域布局阿里健康；近年来，各创业公司、研究团队纷纷涉足互联网医疗领域。企业希望了解经过这些年的发展，互联网医疗现阶段发展到什么程度？遇到了哪些瓶颈？未来发展的前景如何？</span>
                        </div>
                    </div>
                </div>
                <div className="ques_template">
                    <div className="tim_lay">
                        <i className="iconfont icon-wenjuan"></i> 需求模板
                    </div>
                    <div className="tem_cons">
                        <div className="cons_flo">
                            <label>标&nbsp;&nbsp;&nbsp;&nbsp;题：</label>
                            <span>企业废水处理解决方案</span>
                        </div>
                        <div className="cons_flo">
                            <label>关键词：</label>
                            <span>小型VOC处理,废水处理,光催化</span>
                        </div>
                        <div className="cons_flo">
                            <label>内&nbsp;&nbsp;&nbsp;&nbsp;容：</label>
                            <span>本企业在生产过程中产出的废水无法通过大规模处理完成，希望可以在技术上寻求小型的、分散的污水处理解决方案。</span>
                        </div>
                    </div>
                </div>
                <div className="tem_bot_heights"></div>
                <div className="btn_question">
                <Link onClick={this.newQuestion}>知道了，开始提问</Link>
                </div>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main);