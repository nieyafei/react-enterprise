import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {setSystemAnimating,handleLogin,loginUser,setSysCode,setCommonList} from '../action/Action';
import Util from '../common/Util';
import {Tool} from "../Tool";
import {Header,LoadingToast,CodeCommon} from '../common/ComponentList';
import {Toast} from 'antd-mobile';
/*
* register页面
* */
var com,tabName="comList";
class Main extends Component {
    componentDidMount(){
        /* 判断是否登录状态 */
        Tool.removeLocalItem("toRegister");
        /*if(Util.IsNull(Tool.localItem("company")) || Util.IsNull(Tool.localItem("fieldType"))){
            Tool.localItem("toRegister","/register");
            return this.context.router.push({ pathname: "/start" }); //跳转到首页
        }*/
    }
    constructor(props,context){
        super(props,context);
        this.state = {
            button:"注册",
            active1:"active",
            active2:"",
            loginType:1,
            send:"发送验证码",
            activeSend:"",
            sendCodeFlag: true, //发送验证码
            text:"正在注册",
            animating:false,
            comList:false
        }
        let {dispatch} = this.props;
        var mobile,password,enterpriseName,firstName,lastName,position,validCode;
        this.start = ()=>{
            /*var company = Util.Trim(this.refs.enterpriseName.value,"g");
            if(Util.IsNull(company)){
                Toast.info("请输入公司名称",3);
                return false;
            }*/
            if(!this.verification()){
                return false;
            }
            /* 开始进行匹配cm */
            let {dispatch} = this.props;
            dispatch(setSystemAnimating("正在匹配",false));
            Tool.fetchGet(Util.getApi("companyQichacha")+enterpriseName, "", {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        if(res.result.length>0){
                            if(res.result.length==1 && enterpriseName==res.result[0]){
                                //this.toField(company);
                                this.register();//直接注册
                            }else{
                                dispatch(setCommonList("set_start_company",tabName,res.result));
                                this.setState({
                                    comList:true
                                })
                            }
                        }else{
                            Toast.info("请输入正确的企业名称",2)
                        }
                    }else{
                        Toast.info("请输入正确的企业名称",2)
                    }
                    setTimeout(function () {
                        dispatch(setSystemAnimating("",false));
                    },500)
                }, (err) => {
                    dispatch(setSystemAnimating("",false));
                    console.log(err);
                });

        }

        this.verification=()=>{
            mobile = this.refs.mobile.value;//手机号
            password = this.refs.password.value;//密码
            enterpriseName = this.refs.enterpriseName.value;//企业名称
            firstName = this.refs.firstName.value;//姓
            lastName = this.refs.lastName.value;//名
            position = this.refs.position.value;//职位
            validCode = this.refs.validCode.value;//validCode
            if(Util.IsNull(enterpriseName)){
                Toast.info("请输入企业名称",3);
                return false;
            }

            if(Util.IsNull(firstName)){
                Toast.info("请输入姓",3);
                return false;
            }
            if(Util.IsNull(lastName)){
                Toast.info("请输入名",3);
                return false;
            }
            if(Util.IsNull(position)){
                Toast.info("请输入职位",3);
                return false;
            }
            if(Util.IsNull(validCode)){
                Toast.info("请输入验证码",3);
                return false;
            }
            if(!Util.Phone(mobile)){
                Toast.info("请输入正确格式手机号",3);
                return false;
            }
            /*密码登录*/
            if(Util.IsNull(password)){
                Toast.info("请输入密码",3);
                return false;
            }
            return true;
        }
        this.changeCom=(com)=>{
            enterpriseName = com;
            this.setState({
                comList:false
            })
            this.register();
        }

        this.closeCoList=()=>{
            this.setState({
                comList:false
            })
        }

        /* 注册 */
        this.register = () => {
            dispatch(setSystemAnimating("正在注册",true));
            //this.props.User.loginSuccess();
            Tool.fetchPost("/api/register",JSON.stringify({mobile:mobile,password:password,enterpriseName:enterpriseName,firstName:lastName,lastName:firstName,position:position,validCode:validCode,openId:Util.getOpenId(),domain:Tool.localItem("fieldType"),tags:Tool.localItem("tagList")}),{},'json','basic',
                (res) => {
                    dispatch(setSystemAnimating("",false));
                    /* 注册成功 */
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 注册成功 */
                        res.result.token=res.token;
                        dispatch(loginUser(res.result));//保存数据
                        Toast.info("注册成功，欢迎您的加入",1);
                        browserHistory.push("/field/userfield?from=1");
                        /*var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
                        return this.context.router.push({ pathname: prePathName }); //跳转到首页*/
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("",false));
                    Toast.info("注册失败",2);
                    this.setState({button: '重新注册'});
                });
            /* 企查查 */
            /*Tool.fetchGet("/api/qichacha/"+enterpriseName,"",{},'json','basic',
            (res) => {
                if(res.status==200 || res.status==112){//公司存在res.status==200 || res.status==112

                }else{
                    dispatch(setSystemAnimating("",false));
                    Toast.info("请输入完整的企业名称，必须以“公司”结尾",3);
                }
            }, (err) => {
                console.log(err);
            });*/
        }
        /*发送验证码*/
        this.sendCode = () => {
            if(this.state.sendCodeFlag){
                var mobile = this.refs.mobile.value;//手机号
                var code = this.refs.code_s.refs.code.value;
                if(!Util.Phone(mobile)){
                    Toast.info("请输入正确格式手机号",3);
                    return false;
                }
                if(Util.IsNull(code)){
                    Toast.info("请输入图片验证码",2);
                    return false;
                }

                Tool.fetchPost("/api/mobile-request-code",JSON.stringify({mobile:mobile,type:0,verifyCode:code}),{},'json','basic',
                    (res) => {
                        if(!res.serror){
                            Toast.info("短信发送成功",3);
                            var t=61;
                            var tim = setInterval(function () {
                                t--;
                                if(t<1){
                                    window.clearInterval(tim);
                                    this.setState({
                                        send:"重新发送",
                                        activeSend:"",
                                        sendCodeFlag:true
                                    })
                                }else{
                                    this.setState({
                                        send:t+"s",
                                        activeSend:"active",
                                        sendCodeFlag:false
                                    })
                                }
                            }.bind(this),1000);
                        }else{
                            this.refs.code_s.refCode();
                            Toast.info(res.serror.desc,3);
                        }
                    }, (err) => {
                        this.setState({
                            send:"重新发送",
                            activeSend:"",
                            sendCodeFlag:true
                        })
                        this.refs.code_s.refCode();
                        Toast.info("短信发送失败",3);
                        console.log(err);
                    });
            }
        }

    }

    componentWillMount(){
        let {dispatch} = this.props;
        dispatch(handleLogin(false));
        Tool.removeLocalItem("domainArray");
        var token = this.props.User ? this.props.User.token : '';
        //返回地址
        var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
        if(token){
            return this.context.router.push({ pathname: prePathName }); //跳转到首页
        }
        com = Tool.localItem("company")?Tool.localItem("company"):"";
        dispatch(setSysCode("",false));
    }
    render() {
        let {SysCommon,Start} = this.props;
        var comLists = Start[tabName];
        return (
            <div className="com_cos_confull page_hei_cons">
                <Header title="注册" />
                <div className="page page_normal">
                    <div className="login_form login_form_index reg">
                        <div className="login_form_li">
                            <h1 className="rei">欢迎来到科学家在线</h1>
                            <input type="text" ref="enterpriseName" defaultValue={com} placeholder="企业名称"/>
                            <div className="input_two">
                                <input type="text" ref="firstName" placeholder="姓"/>
                                <input type="text" ref="lastName" placeholder="名"/>
                            </div>
                            <input type="text" ref="position" placeholder="职位"/>
                            <input type="text" ref="mobile" placeholder="联系电话"/>
                            {!SysCommon.isShow?
                                <CodeCommon ref="code_s"/>:""
                            }
                            <div className="active ps_login">
                                <input ref="validCode" type="text" placeholder="请输入验证码"/>
                                <button className={this.state.activeSend + " send_yzm"} onClick={this.sendCode}>{this.state.send}</button>
                            </div>

                            <input type="password" ref="password" placeholder="请输入密码"/>
                            <Link to="/login" className="to_register">有账号，去登录</Link>
                            <button className="btn_def" onClick={this.start}>{this.state.button}</button>
                        </div>
                    </div>
                </div>
                {this.state.comList?
                    <div className="start_body start_body_register" data-flex="main:center cross:center">
                        <div className="start_enterprise" data-flex="main:center cross:top">
                            <div className="cons">
                                <h1 className="tit">选择正确的公司名称
                                    <span onClick={this.closeCoList.bind(this)}>
                                <i className="iconfont icon-closev"></i>
                            </span>
                                </h1>
                                {/* 匹配筛选公司 */}
                                {comLists&&comLists.length>0?
                                    <div className="enter_li">
                                        <div>
                                            {
                                                comLists.map(function(item,key){
                                                    return (
                                                        <div key={key} className="li_name" onClick={this.changeCom.bind(this,item)}>
                                                            {item}
                                                        </div>
                                                    )
                                                }.bind(this))
                                            }
                                        </div>
                                    </div>
                                    :""

                                }
                            </div>
                        </div>
                    </div>:""
                }
            </div>
        )
    }
}



Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    Login:state.Login,
    SysCommon:state.SysCommon,
    Start:state.Start
}))(Main); //连接redux