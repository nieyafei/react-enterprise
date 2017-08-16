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
            newActive:"active",
            title:type=="profession"?"提交专业问题":"提交项目需求",
            dateActive:dateActive,
            loginActive:"",
            textTitle:type=="profession"?"问题":"项目需求"
        }
        let {dispatch} = this.props;
        this.newQuestion=()=>{//提交新的问题
            /* 判断是否登录 */
            if(!Util.isLogin(this.props,1)){
                dispatch(handleLogin(true));
                return;
            }
            /* 显示new表单 */
            this.setState({
                newActive:"active",
            })
        }
        /* 提交表单 */
        this.submitQuestionForm=()=>{
            if(!Util.isLogin(this.props,1)){
                dispatch(handleLogin(true));
                return;
            }
            var question_title = this.refs.question_title.value;
            var keywords = this.refs.keywords.value;
            var content = this.refs.content.value;

            if(Util.IsNull(question_title)){
                Toast.info("请输入"+this.state.textTitle+"标题",3);
                return false;
            }

            if(Util.IsNull(keywords)){
                Toast.info("请输入"+this.state.textTitle+"关键词",3);
                return false;
            }

            if(Util.IsNull(content)){
                Toast.info("请输入"+this.state.textTitle+"描述",3);
                return false;
            }

            dispatch(setSystemAnimating("正在提交",true));
            Tool.fetchPost(Util.getApi("questionCommit"),JSON.stringify({
                question_title:question_title,
                    keywords:keywords,
                    content:Util.TransferString(content),
                    question_area:question_area,
                    token:this.props.User.token,
                    type:type=="profession"?0:1,
                    expert_id:Tool.getSession("contactExpertUid"),
                    source_id:source==1?Tool.getSession("contactSourceId"):"",
                    source_type:source==1?Tool.getSession("contactSourceTy"):0

            }),{},'json','basic',
                (res) => {
                    dispatch(setSystemAnimating("正在提交",false));
                    console.log(res.result);
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 提交成功 */
                        if(res.result){
                            console.log("开始跳转");
                            Util.clearContact();
                            //this.context.router.push({ pathname: "/question/payment/"+res.result+"?type="+type }); //支付页面
                            browserHistory.push("/question/payment/"+res.result+"?type="+type);
                        }else{
                            Toast.info(res.serror.desc,3);
                        }
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("正在提交",false));
                    Toast.info("提交失败",3);
                });

            //browserHistory.push("/question/payment/123");
        }
        /* 列表切换 */
        this.change=(type_area)=>{
            question_area = type_area;
            if(dateActive.indexOf(type_area+",")>-1){
                /*var array = dateActive.split(",");
                var newdate="";
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                    }
                }
                dateActive = newdate;*/
            }else{
                dateActive = type_area+",";
            }
            this.setState({
                dateActive:dateActive
            })
            console.log(dateActive);
        }
        /* close */
        this.closeLayer=()=>{
            this.setState({
                newActive:"",
            })
        }
    }
    componentWillMount(){
        Tool.localItem("prevPathName",this.props.location.pathname+this.props.location.search);
        source = this.props.location.query.source;
    }
    render() {
        return (
            <div className="question_icon page">
                <Header title={this.state.title} leftInfo="back"/>
                {/* new的表单 */}
                <div className={this.state.newActive + " new_question"}>
                    <div className="question_form layer_form_cons hei_cons">
                        <div className="form_cons">
                            <div className="div_scro">
                                <textarea className="title" ref="question_title" placeholder={this.state.textTitle+"标题/简要概括您的"+this.state.textTitle+"："}></textarea>
                                <textarea className="keyword" ref="keywords" placeholder={"请输入"+this.state.textTitle+"关键词："}></textarea>
                                <textarea className="content" ref="content" placeholder={"输入您的"+this.state.textTitle+"描述..."}></textarea>
                                <div className="que_field">
                                    <span className="ple_change">请选择{this.state.textTitle}所在的领域：</span>
                                    <ListLiFeild dateActive={this.state.dateActive} change={this.change}/>
                                </div>
                            </div>
                            <div className="btn">
                                <button className="btn_def" onClick={this.submitQuestionForm}>下一步</button>
                            </div>
                        </div>
                    </div>
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