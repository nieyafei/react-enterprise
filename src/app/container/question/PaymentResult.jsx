import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import {Header,Footer,ListLiFeild,LoginCom} from '../../common/ComponentList';
import {Tool} from '../../Tool';
/*
* 问答模板页面
* */
var dateActive="";
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            tit1:"",
            link:"",
            failLink:""
        }
    }
    componentWillMount(){
        var  paytype = this.props.params.paytype;//0,1,2,  3,  4
        var tit1="项目需求",link="/user/issue",failLink="/question/template/project";
        if(paytype==0 || paytype == 1 || paytype==2){
            tit1="专业问题";link="/user/question";failLink="/question/template/profession";
        }else if(paytype==4){
            tit1="专家电话咨询";link="/user/call";failLink="/contact/pay/info/"+Tool.getSession("contactExpertUid");
        }
        this.setState({
            tit1:tit1,
            link:link,
            failLink:failLink
        })
    }
    render() {
        var result;
        if(this.props.params.type=="success"){
            result = <Success tit1={this.state.tit1} link={this.state.link}/>;
        }else{
            result = <Fail tit1={this.state.tit1} link={this.state.failLink}/>;
        }
        return (
            <div className="page question_icon">
                <Header title="支付结果" leftInfo="back"/>
                {result}
                {/* footer */}
                <Footer className="normal_footer"/>
            </div>
        )
    }
}
/*
* success
* */
class Success extends Component{
    render(){
        return(
            <div className="pay_result">
                <div className="result_cos" data-flex>
                    <div className="fl2" data-flex="main:center cross:center" data-flex-box="1">
                        <i className="iconfont icon-finish"></i>
                        <div>
                            <span>支付成功</span>
                            {this.props.tit1}提交成功
                        </div>
                    </div>
                </div>
                <div className="result_tips">
                    科学家在线将按照您的服务类型将问题推送给专家，请留意专业的响应和回复。
                </div>
                <Link to={this.props.link} className="btn_def">查看详情</Link>
            </div>
        )
    }
}

/*
 * fail
 * */
class Fail extends Component{
    render(){
        return(
            <div className="pay_result">
                <div className="result_cos result_cos2" data-flex>
                    <div className="fl1" data-flex="main:center cross:center" data-flex-box="1">
                    <i className="iconfont icon-iconsb-copy"></i>
                        <span>支付失败</span>
                    </div>
                </div>
                <div className="result_tips center">
                    支付失败，请重新提交您的{this.props.tit1}。
                </div>
                <Link to={this.props.link} className="btn_def">重新提交{this.props.tit1}</Link>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User
}))(Main);