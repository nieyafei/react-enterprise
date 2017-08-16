import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,handleWeiXin,getProductPay} from '../../action/Action';
import {Header,ListLiFeild,WeiXinPayCom} from '../../common/ComponentList';
import Util from '../../common/Util';
import {Toast}  from  'antd-mobile';
/*
* 问答模板页面
* */
var dateActive="",payType=-1,type;
class Main extends Component {
    constructor(props){
        super(props);
        type = this.props.location.query.type;//根据不同的状态选择不同的支付显示
        var questionId = this.props.params.id;//获取问题的id
        console.log(type);//问题的类型profession :专业问题    project 项目需求
        this.state={
            newActive:"",
            title:type=="profession"?"选择服务类型和支付":"项目需求支付确认",
            dateActive:"",
            loginActive:""
        }
        let {dispatch} = this.props;
        this.toPay=()=>{//提交新的问题
            if(!Util.IsWeixin()){
                Toast.info("请在微信客户端进行使用并且重新提交问题或需求",4);
                return;
            }
            if(!Util.isLogin(this.props,1)){
                dispatch(handleLogin(true));
                return;
            }
            if(payType==-1){
                Toast.info("请选择服务类型",1);
                return ;
            }
            /* 操作支付 */
            dispatch(getProductPay(payType,questionId));
        }
        this.weiXinPay=()=>{
            /* 微信支付 */
            browserHistory.push("/question/result/success");
        }
        this.change=(type)=>{
            console.log(type);
            if(dateActive.indexOf(type+",")>-1){
                var array = dateActive.split(",");
                var newdate="";
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                    }
                }
                dateActive = newdate;
            }else{
                dateActive +=type+",";
            }
            this.setState({
                dateActive:dateActive
            })
            console.log(dateActive);
        }
        this.closeLayer=()=>{
            this.setState({
                newActive:"",
            })
        }
        this.closeLoginLayer=()=>{
            this.setState({
                loginActive:""
            })
        }

    }
    componentWillMount(){
        type = this.props.location.query.type;//根据不同的状态选择不同的支付显示
        if(type=="project"){
            payType = 3;
        }
        let {dispatch} = this.props;
        dispatch(handleWeiXin(false));
    }
    render() {
        var paymain;
        if(type=="profession"){
            paymain = <Profession />;
        }else{
            paymain = <Project />;
        }
        return (
            <div className="page question_icon payment_icons">
                <Header title={this.state.title} leftInfo="back"/>
                {paymain}
                <div className="btn_question no_bottom">
                <Link onClick={this.toPay}>下一步</Link>
                </div>
                {/* 选择支付表单 */}
                <WeiXinPayCom />
            </div>
        )
    }
}

/*
* 专业问题
* */
class Profession extends Component{
    constructor(props){
        super(props);
        this.state={
            type:-1
        }
        this.changePay=(type)=>{
            this.setState({
                type:type
            })
            payType = type;
        }
    }
    render(){
        var setCur = ["","",""];
        setCur[this.state.type] = 'active';
        return(
            <div className="profession_pay">
                <div className={setCur[0]+" pay_types1"} onClick={this.changePay.bind(this,0)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>5</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        20位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className={setCur[1]+" pay_types1 pay_types2"} onClick={this.changePay.bind(this,1)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>10</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        50位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className={setCur[2]+" pay_types1 pay_types2"} onClick={this.changePay.bind(this,2)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>20</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        100位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
            </div>
        )
    }
}

/*
 * 项目需求
 * */
class Project extends Component{
    render(){
        return(
            <div className="profession_pay project_pay">
                <div className="pay_tit_mon">您将支付200元</div>
                <div className="pay_types1 pay_types2" data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="1">
                        <i>￥</i><span>200</span><em>元</em>
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className="project_infos">
                    支付成功后，科学家在线将联系您，和您充分沟通确认后，为您找到最佳的4位专家，并促成您和每位专家的10分钟三方通话，由您来选择最合适的专家来进行项目需求的对接。
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User
}))(Main);