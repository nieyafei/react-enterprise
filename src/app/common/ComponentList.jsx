import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import  action from '../action/Index';
import {handleLogin,setSystemAnimating,loginUser,FollowOn,replyList,handleWeiXin,commonAction,commonNotify,updateNotify,commonEnterprise,setEnterprise,setNotify,getCode,setSysCode} from '../action/Action';
import { Tool, merged } from '../Tool';
import {Toast,ActivityIndicator,ListView} from 'antd-mobile';
import Util from '../common/Util';

/*import GetData from './GetData';
import GetNextPage from './GetNextPage';

export { GetData, GetNextPage }*/

/**
 * (加载动画)
 *
 * @class DataLoad
 * @extends {Component}
 */
export class DataLoad extends Component {
    render() {
        let {loadAnimation, loadMsg} = this.props;
        return (
            <div className={'data-load data-load-' + loadAnimation}>
                <div className="msg">{loadMsg}</div>
            </div>
        );
    }
}

DataLoad.defaultProps = {
    loadAnimation: true, //默认显示加载动画
    loadMsg: '正在加载中'
}

export class PageNullComm extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let {tips,icon,className} = this.props;
        if(Util.IsNull(tips)){
           tips = "暂无数据"
        }
        if(Util.IsNull(icon)){
            icon = "wuneirong1"
        }
        return (
            <div className={className + " page_null"} data-flex="main:center cross:center">
                <div>
                    <div className="im_icon">
                        <i className={"iconfont icon-" + icon}></i>
                    </div>
                    <div className="info_tip">{tips}</div>
                </div>
            </div>
        );
    }
}

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 * @param {string} title  头部标题
 * @param {string} leftTo 左侧按钮链接  leftIcon
 * @param {string} rightTo 右侧按钮  rightIcon   rightClick:右侧点击事件
 * @param {string} rightTo2 右侧按钮  rightIcon2   rightClick2:右侧第二个点击事件
 */

export class Header extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let {title, leftTo,backTo,leftInfo, rightTo, rightInfo, rightClick,rightIcon} = this.props;
        let left = null;

        if (leftTo && leftInfo) {//左侧链接
            left = (
                <Link to={leftTo}>
                    {leftInfo}
                </Link>
            );
        } else if (leftInfo === 'back') { //返回上一页
            if(backTo&&backTo.length>0){
                left = (
                    <Link to={backTo}>
                        <i className={'iconfont icon-' + leftInfo}></i><span>返回</span>
                    </Link>
                );
            }else{
                left = (
                    <a onClick={browserHistory.goBack}>
                        <i className={'iconfont icon-' + leftInfo}></i><span>返回</span>
                    </a>
                );
            }
        }

        let right = null;
        if (rightTo && rightInfo) {//右侧点击链接
            right = (
                <Link to={rightTo}>
                    {rightInfo}
                </Link>
            );
        } else if (rightClick=="closeQuestion") {//右侧关闭问题
            right = (
                <a onClick={this.props.closeQuestion}>
                    {rightInfo}
                </a>
            );
        }else if (rightClick=="replyAdd") {//回复问题
            right = (
                <a onClick={this.props.replyAdd}>
                    <i className="iconfont icon-shangchuan"></i><span>发布</span>
                </a>
            );
        }else if (rightTo && rightIcon){
            right = (
                <Link to={rightTo}>
                    <i className={"iconfont "+rightIcon}></i><span>{rightInfo}</span>
                </Link>
            )
        }

        return (
            <div className="header_height">
            <header className="common_header" data-flex>
                <div className="icon lef" data-flex="main:left cross:center" data-flex-box="0">
                    {left}
                </div>
                <h2 className="title" data-flex-box="1">{title}</h2>
                <div className="icon rig" data-flex="main:right cross:center" data-flex-box="0">
                    {right}
                </div>
            </header>
            </div>
        );
    }
}
Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

/**
 * 底部导航菜单
 *
 * @export
 * @class Footer
 * @extends {Component}
 */
class FooterInit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageCount: 0
        };
        this.getMessageCount = () => {
            /*判断是否登录状态*/
            if (Util.isLogin(this.props,1)) {
                /* 获取消息count */
                Tool.fetchGet(Util.getApi("messagesUnread"),"",{},'json','basic',
                    (res) => {
                        if(res.result){
                            this.setState({
                                messageCount: res.result
                            })
                        }else{
                        }
                    }, (err) => {
                        console.log(err);
                    });
            }
        }
    }
    render() {
        var myUrl = Util.getToken()? '/user': '/login';
        var arr = [];
        let {homeActive,attentionActive,notifyActive,myActive,className} = this.props;
        arr[this.props.index] = 'on';
        return (
            <div className={className+" footer_height"} id="footer_he">
            <footer className="common_footer">
                <div className="jgs"></div>
                <div className="menu">
                    <Link to="/" className={arr[0]}>
                        <span><i className={(homeActive!=null?"icon-home1":"icon-home2") + " iconfont " + {homeActive}}></i></span><br/>首页
                    </Link>
                    <Link to="/attention" className={arr[1]}>
                            <span><i className={(attentionActive!=null?"icon-guanzhu":"icon-guanzhu1") + " iconfont " + {attentionActive}}></i></span><br/>关注
                    </Link>
                    <Link to="/notify" className={arr[2]}>
                        <span><i className={(notifyActive!=null?"icon-tubiao07":"icon-xiaoxi1") + " iconfont " + {notifyActive}}></i>{this.state.messageCount > 0 ? <em>{this.state.messageCount>99?99:this.state.messageCount}</em> : ''}</span><br/>消息
                    </Link>
                    <Link to={myUrl} className={arr[3]}>
                        <span><i className={(myActive!=null?"icon-wode5":"icon-wode") + " iconfont " + {homeActive}}></i></span><br/>我的
                    </Link>
                </div>
            </footer>
            </div>
        );
    }
    componentDidMount() {
        this.getMessageCount();
    }
    shouldComponentUpdate(np, ns) {
        return this.props.index !== np.index || this.state.messageCount !== ns.messageCount; //防止组件不必要的更新
    }
    componentDidUpdate() {
        this.getMessageCount();
    }
}
FooterInit.defaultProps = {
    index: 0
};


var Footer = connect(state=>({
    User: state.User
}))(FooterInit);
export { Footer }
/**
 * 提示登录
 *
 * @export
 * @class TipMsgSignin
 * @extends {Component}
 */
export class TipMsgSignin extends Component {
    render() {
        return (
            <div className="tip-msg-signin">
                你还未登录，请先<Link to="/signin">登录</Link>
            </div>
        );
    }
}

/**
 * 用户头像
 *
 * @export
 * @class UserHeadImg
 * @extends {Component}
 */
export class UserHeadImg extends Component {
    render() {
        return (<div className="user-headimg" style={{ backgroundImage: 'url(' + this.props.url + ')' }}></div>)
    }
}

/*
* Login模块
*
* @export
* @class LoginCom
* @extends {Component}
* */
var codeImg;
class LoginComInit extends Component {
    constructor(props,context){
        super(props,context);
        this.state = {
            button:"登录",
            active1:"active",
            active2:"",
            loginType:1,
            send:"发送验证码",
            activeSend:"",
            sendCodeFlag: true
        }
        let {dispatch} = this.props;
        /* 登录 */
        this.login = () => {
            var mobile = this.refs.mobile.value;
            var password = this.refs.password.value;
            var code = this.refs.code.value;
            if(!Util.Phone(mobile)){
                Toast.info("请输入正确格式手机号",3)
                return false;
            }
            if(this.state.loginType==1){
                /*this.props.setStateLayer(true);*/
                /*密码登录*/
                if(Util.IsNull(password)){
                    Toast.info("请输入密码",3);
                    return false;
                }
                dispatch(setSystemAnimating("正在登录",true));
                //this.props.User.loginSuccess();
                Tool.fetchPost("/api/login-password",JSON.stringify({mobile:mobile,password:password,openId:Util.getOpenId()}),{},'json','basic',
                (res) => {
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 登录成功 */
                        if(res.result){
                            this.closeLogin();
                            res.result.token=res.token;
                            //this.props.User.loginSuccess(res.result);//保存数据
                            dispatch(loginUser(res.result));dispatch(commonAction("set_clear_home"));
                            Toast.info('登录成功', 1, function (i) {
                                if(Util.IsNull(res.result.domain)){
                                    browserHistory.push('/field/userfield?from=1');//无领域去领域
                                }else{
                                    var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
                                    browserHistory.push(prePathName); //跳转到首页
                                }
                            })
                        }else{
                            Toast.info(res.serror.desc,3);
                        }
                    }
                }, (err) => {
                    console.log(err);
                    Toast.info("登录失败",3);
                    this.setState({button: '重新登录'});
                });
                dispatch(setSystemAnimating("正在登录",false));
            }else{
                /*验证码登录*/
                if(Util.IsNull(code)){
                    Toast.info("请输入验证码",3)
                    return false;
                }
                dispatch(setSystemAnimating("正在登录",true));
                Tool.fetchPost("/api/login-code",JSON.stringify({mobile:mobile,valid_code:code,openId:Util.getOpenId()}),{},'json','basic',
                (res) => {
                    dispatch(setSystemAnimating("正在登录",false));
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 登录成功 */
                        if(res.result){
                            this.closeLogin();
                            res.result.token=res.token;
                            dispatch(loginUser(res.result));dispatch(commonAction("set_clear_home"));
                            var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
                            return this.context.router.push({ pathname: prePathName }); //跳转到首页
                        }
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("正在登录",false));
                    Toast.info("登录失败",3);
                    this.setState({button: '重新登录'});
                });

            }
        }
        /*切换分支*/
        this.tab_change = (index) => {
            if(index==1){
                this.setState({active1:"active",
                    active2:"",loginType:1});
            }else{
                this.setState({active1:"",
                    active2:"active",loginType:2});
            }
        }
        /*发送验证码*/
        this.sendCode = () => {
            if(this.state.sendCodeFlag){
                var mobile = this.refs.mobile.value;//手机号
                var code = this.refs.code_s.refs.code.value;
                console.log(code)
                if(!Util.Phone(mobile)){
                    Toast.info("请输入正确格式手机号",3);
                    return false;
                }
                if(Util.IsNull(code)){
                    Toast.info("请输入图片验证码",2);
                    return false;
                }
                Tool.fetchPost("/api/mobile-request-code",JSON.stringify({mobile:mobile,type:1,verifyCode:code}),{},'json','basic',
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
                        this.refs.code_s.refCode();
                        Toast.info("短信发送失败",3);
                        console.log(err);
                    });
            }
        }
        this.closeLogin=()=>{
            dispatch(handleLogin(false));
        }
    }
    componentWillMount(){
        codeImg = "";
        let {dispatch} = this.props;
        dispatch(setSysCode("",false));
    }
    render() {
        let {SysCommon} = this.props;
        return (
            <div className={this.props.isLogin + " layer_login"}>
                <div className="com_cos_login">
                    <div className="bgs_all" onClick={this.closeLogin}></div>
                    <div className="login_form">
                        <div className="login_form_li">
                            <h1>欢迎来到科学家在线</h1>
                            <ul className="tab_uls">
                                <li className={this.state.active1} onClick={this.tab_change.bind(this,1)}>密码登录</li>
                                <li className={this.state.active2} onClick={this.tab_change.bind(this,2)}>验证码登录</li>
                            </ul>
                            <input type="text" ref="mobile" placeholder="请输入手机号"/>
                            <div className={this.state.active1 + " ps_login"}>
                                <input ref="password" type="password" placeholder="请输入密码"/>
                            </div>
                            {this.state.active2=="active" && !SysCommon.isShow?
                                <CodeCommon ref="code_s"/>:""
                            }
                            <div className={this.state.active2 + " ps_login"}>
                                <input ref="code" type="text" placeholder="请输入验证码"/>
                                <button className={this.state.activeSend + " send_yzm"} onClick={this.sendCode}>{this.state.send}</button>
                            </div>
                            <Link to="/register" className="to_register">没有账号，去注册</Link>
                            <button className="btn_def" onClick={this.login}>{this.state.button}</button>
                            <div className="close_bgs" onClick={this.closeLogin}><i className="iconfont icon-guanbi"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
LoginComInit.contextTypes = {
    router: React.PropTypes.object.isRequired
}
var LoginCom = connect((state) => ({
    User: state.User ,
    Login:state.Login,
    SysCommon:state.SysCommon
}))(LoginComInit);
export { LoginCom }

/*
 * 图片验证码
 * */
export class CodeCommon extends Component {
    constructor(props){
        super(props);
        this.state={
            code:Util.getApi("code")
        }
        this.refCode=()=>{
            this.refs.code.value="";
            this.setState({
                code:Util.getApi("code")+"?t="+(new Date().getTime())
            })
        }
    }
    render() {
        let {codeImg} = this.props;
        return (
            <div className="ps_login active code_image">
                <input ref="code" type="text" placeholder="请输入图片验证码" className=""/>
                <img src={this.state.code} onClick={this.refCode} className="code_img"/>
            </div>
        );
    }
}

/*
 * register模块
 *
 * @export
 * @class LoginCom
 * @extends {Component}
 * */

/*
* 获取领域列表组件
* */
export class ListLiFeild extends Component{
    render(){
        var liList = "";let {dateActive} = this.props;
        return(
            <ul className="field_list">
                {
                    Util.FieldList().map((item,index) => {
                        return (
                            <li key={index} className={(dateActive.indexOf(item.type+",")>-1?"active":"")} onClick={this.props.change.bind(this,item.type)}>
                                {item.name}
                            </li>
                        )}
                    )
                }
            </ul>
        )
    }
}

/*
* loading 加载中
* animating:true(显示)false:不显示
* title:显示标题（正在加载）
* */
export class LoadingToast extends Component{
    render(){
        return(
            <div className="loading_toast">
                <ActivityIndicator
                    toast
                    text={this.props.text}
                    color="white"
                    animating={this.props.animating}
                />
            </div>
        )
    }
}
LoadingToast.defaultProps = {
    text:"正在加载",
    animating:false
}

/*
* 展示信息
* */
export class FollowCommon extends Component {
    constructor(props){
        super(props);
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow=(tabName,ty,uid,clickType,sourceFrom,actionType)=>{
            console.log(clickType);
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props.prevProps)){
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props.prevProps);
                let {dispatch} = this.props.prevProps;console.log(tabName);
                dispatch(FollowOn(tabName,ty,uid,token,clickType,sourceFrom,actionType));
            }
        }
    }
    render() {
        let {rowData,tabName,type,sourceFrom,htmlType,actionType} = this.props;
        var left_html="";
        if(htmlType=="home_question"){
            left_html=(
                <font>
                <span>推送&nbsp;{Util.getCount(rowData.expertPushed)}&nbsp;专家</span><em>|</em>
                <span>{Util.getCount(rowData.answerCount)}&nbsp;回答</span><em>|</em>
                </font>
            )
        }else{
            left_html=(
                <font>
                <span>{Util.getCount(rowData.followAndLike.followCount)}&nbsp;关注</span><em>|</em>
                </font>
            )
        }
        var typeStr = "";
        if(type=="1"){typeStr="问题"}else if(type=="3"){typeStr="案例"}else if(type=="5"){typeStr="观点"}else if(type=="6"){typeStr="技术"}
        return (
            <div className="row_quet_bot">
                {left_html}
                <span className={(rowData.followAndLike.userFollow ? ' active' : '') + " attentioned"} onClick={this.follow.bind(this,tabName,type,rowData.id,rowData.followAndLike.userFollow ? 2 : 1,sourceFrom,actionType)}>
                                    {rowData.followAndLike.userFollow ?
                                        <font>
                                            <i className="iconfont icon-guanzhu"></i>
                                            取消关注
                                        </font>:
                                        <font>
                                            <i className="iconfont icon-guanzhu1"></i>
                                            关注{typeStr}
                                        </font>
                                    }
                                </span>
                <span className={rowData.followAndLike.userLike ? "active like" : "like"}
                      onClick={this.follow.bind(this,tabName,type,rowData.id,rowData.followAndLike.userLike ? 0 : 3,sourceFrom,actionType)}>
                                    {rowData.followAndLike.likeCount > 0 ? rowData.followAndLike.likeCount : ""}
                    <i className="iconfont icon-dianzan"></i>
                                </span>
            </div>
        );
    }
}
/*var FollowCommon = connect((state) => ({
    User: state.User
}))(FollowAssembly);
export { FollowCommon }*/

/* 回复列表 */
var mapReply = {};
class Reply extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isLoading: true,
        }
        let {dispatch} = this.props;
        var page=-1,loadFlag=true,totalPages=1;
        this.onEndReached=()=>{
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        this.dataInit=()=>{
            if(loadFlag) {
                this.setState({isLoading: true});
                loadFlag = false;
                var pageNum = ++page;//页数
                if(totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    return;
                }
                Tool.fetchGet("/api/"+this.props.type+"/reply/"+ this.props.uri + "/" + pageNum + "/10", "", {}, 'json', 'basic',
                    (res) => {
                        if (!res.serror) {
                            //dispatch();获取数据返回给state
                            let obj = {date: res.content, page: pageNum};
                            totalPages = res.totalPages;
                            if(res.content.length>0){
                                dispatch(replyList(obj))
                            }
                        }
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                    }, (err) => {
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                        console.log(err);
                    });
            }
        }
        this.toLink=(url)=>{
            Tool.saveScroll("detailScroll",this.props.type);
            Util.bodyOver(true);
            setTimeout(function(){
                browserHistory.push(url);
            },100)
        }
    }
    componentWillMount(){
        /* 获取uri */
        let {Detail} = this.props;
        var fromReply = Tool.getSession("fromReply");
        if(!fromReply && Detail["detail"].id==this.props.uri){
            Tool.setSession("fromReply",false);
            this.setState({
                isLoading: false,
            })
            return ;
        }
        if(Detail["detail"].current_status && Detail["detail"].current_status!=2 && this.props.type=="question"){
            this.setState({
                isLoading: false,
            })
            return;
        }
        if(this.props.uri){
            this.dataInit();
        }
    }
    render() {
        let {Detail} = this.props;
        const row = (rowData, sectionID, rowID) => {
            if(Util.IsNullJson(rowData)){return;}
            return (
                <div key={rowID} className="reply_list">
                    <div className="reply_cs">
                        <div data-flex className="reply_head">
                            <div className="le" data-flex="cross:center" data-flex-box="1">
                                {rowData.expertIndexStream?
                                    <Link data-flex="cross:center" to={rowData.expertIndexStream.isExpert=="EXPERT"?"/expert/info/"+rowData.expertIndexStream.uid:"/enterprise/info/"+rowData.expertIndexStream.uid}>
                                        <img src={Util.images(rowData.expertIndexStream.coverPic,0)}/>
                                        <span className="over_hidden1">{rowData.expertIndexStream.name}&nbsp;&nbsp;{Util.initString(rowData.expertIndexStream.title)}<em>{Util.initString(rowData.expertIndexStream.org)}</em></span>
                                    </Link>:""
                                }
                            </div>
                            <div className="ri" data-flex="cross:center" data-flex-box="0">
                                {Detail["detail"].current_status!=2 && this.props.type=="question"?"":
                                    <Link to={"/info/reply/"+this.props.type+"/"+this.props.uri+"?pid="+rowData.pid}>
                                        <i className="iconfont icon-xiaoxi color1"></i>
                                    </Link>
                                }
                            </div>
                        </div>
                        <Link onClick={this.toLink.bind(this,"/reply/info/"+this.props.type+"/"+rowData.pid)} className="reply_content over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}>
                        </Link>
                        {rowData.parent_pid && mapReply[rowData.parent_pid]?
                            <div className="reply_parent_cons">
                                <span className="ji_top"><i className="iconfont icon-sanjiaoxing1"></i></span>
                                <div className="over_hidden2">
                                    <Link to={mapReply[rowData.parent_pid].user.isExpert == "EXPERT" ? "/expert/info/" + mapReply[rowData.parent_pid].user.uid : ("/enterprise/info/"+mapReply[rowData.parent_pid].user.uid)}>@{mapReply[rowData.parent_pid].user.name}：</Link>
                                    <span onClick={this.toLink.bind(this,"/reply/info/"+this.props.type+"/"+rowData.parent_pid)}>{mapReply[rowData.parent_pid].content}</span>
                                </div>
                            </div>
                            :""
                        }
                        <div className="vote_count">赞同&nbsp;&nbsp;{rowData.agreeCount}
                            <span className="right">发布时间：{Tool.formatDateTime(rowData.create_time)}</span>
                        </div>
                    </div>
                </div>
            )
        };

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = Detail["replyList"].date;
        if (data) {
            mapReply = Util.initDateMap(data);
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div>
                <div className="scroll_list">
                    <ListView
                        dataSource={dataSource.cloneWithRows(data)}
                        renderFooter={() => <div className="false footerRender" style={{ textAlign: 'center'}}>
                            {this.state.isLoading ? loadInfo : '暂无更多回复信息'}
                        </div>}
                        renderRow={row}
                        style={{
                            margin: '0',
                        }}
                        initialListSize={dataSource.length>10?(dataSource.length-2):dataSource.length}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        scrollerOptions={{ scrollbars: true }}
                        onScroll={()=>{}}
                        useBodyScroll
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={100}
                    />
                </div>
                {
                    Detail["detail"].current_status!=2 && this.props.type=="question"?"":
                    <Link className="inf_fixed_reply" to={"/info/reply/"+this.props.type+"/"+this.props.uri}>
                        <i className="iconfont icon-xiaoxi color1"></i>
                    </Link>
                }
            </div>
        )
    }
}

var ReplyList = connect((state) => ({
    Detail:state.Detail
}))(Reply);
export { ReplyList }

/*
 * 微信支付
 * */
class WeiXinPayCoer extends Component {
    constructor(props){
        super(props);
        let {dispatch} = this.props;
        this.closeWeiXinPay=()=>{
            dispatch(handleWeiXin(false));
        }
        var weiXinPayInfo,weiXinPayProduct;
        this.weiXinPay=()=>{
            if(Util.IsWeixin){
                let {WeChatPay} = this.props;
                weiXinPayInfo = WeChatPay["weiXinPayInfo"];
                weiXinPayProduct=WeChatPay["weiXinPayProduct"];
                /*alert("开始支付");
                alert("openid:"+JSON.stringify(Tool.localItem("OpenId")));
                alert(JSON.stringify(weiXinPayInfo));*/
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }else{
                    onBridgeReady();
                }
            }
        }
        function onBridgeReady(){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId":weiXinPayInfo.appId,     //公众号名称，由商户传入
                    "timeStamp":weiXinPayInfo.timestamp,         //时间戳，自1970年以来的秒数
                    "nonceStr":weiXinPayInfo.nonce, //随机串
                    "package":weiXinPayInfo.packageName,
                    "signType":weiXinPayInfo.signType,         //微信签名方式：
                    "paySign":weiXinPayInfo.signature //微信签名
                },
                function(res){
                    /*alert(JSON.stringify(res));*/
                    if(res.err_msg == "get_brand_wcpay_request:ok" ) {//支付成功
                        dispatch(handleWeiXin(false));
                        browserHistory.push("/pay/result/"+weiXinPayProduct.sub_type+"/success");
                    }else if(res.err_msg == "get_brand_wcpay_request:fail" ){//支付失败
                        browserHistory.push("/pay/result/"+weiXinPayProduct.sub_type+"/fail");
                    }else if(res.err_msg == "get_brand_wcpay_request:cancel"){//支付过程取消
                        Toast.info("取消",2);
                    }else{
                        Toast.info("失败",2);
                    }// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                }
            );
        }
    }
    render() {
        let {WeChatPay} = this.props;
        return (
            <div className={(WeChatPay.isShow?"active":"") + " new_question layer_form"} data-flex>
                <div className="bgs_all"></div>
                <div className="layer_form_cons little">
                    <div className="form_cons">
                        <div className="div_scro">
                            <div className="lay_top"><h3>请选择支付方式</h3></div>
                            <div className="ls_wx">
                                <div className="weixin_pay_link" onClick={this.weiXinPay}>
                                    <i className="iconfont icon-weixin"></i>
                                    微信支付
                                </div>
                            </div>
                            <div className="close_bgs" onClick={this.closeWeiXinPay}><i className="iconfont icon-guanbi"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
var WeiXinPayCom = connect((state) => ({
    WeChatPay:state.WeChatPay
}))(WeiXinPayCoer);
export { WeiXinPayCom }

/* 消息通知列表 */
class NotifyListCommon extends Component {
    constructor(props, context) {
        super(props, context);
        this.onEndReached = () => {
            let {dispatch,Notify} = this.props;
            if (Notify["isLoading"][this.props.tabName]) {
                return;
            }
            var page = Notify[this.props.tabName].page+1;
            this.dataInit(page);
        }
        this.dataInit =(page)=> {
            let {dispatch,Notify} = this.props;
            dispatch(commonNotify(this.props.tabName,page,Notify[this.props.tabName].totalPages));
        }

        this.cliRead=(type,_read,msgId,tabName,form)=>{
            let {dispatch,Notify} = this.props;
            if(!_read){//type==0 代表不是链接   ==1代表是链接
                dispatch(updateNotify(0,_read,msgId,tabName,form));
            }
        }

    }

    componentWillMount() {
        /* 获取uri */
        let {dispatch} = this.props;
        var obj = {date:[],number:-1,totalPages:1}
        dispatch(setNotify(obj,this.props.tabName));
        this.dataInit(0);
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var _html = <div></div>;
            if (rowData) {
                _html = <div key={rowID} className={rowData._read + " notify_lists"} onClick={this.cliRead.bind(0,this,rowData._read,rowData.msgid,this.props.tabName,this.props.type-1)}>
                        <Link to={this.props.type==1?Util.NotifyUrl(rowData):Util.NotifyUrlSysm(rowData)} className={" lis_div"}>
                            <div className="title" data-flex>
                                <div className="le" data-flex="main:left cross:center" data-flex-box="1">
                                    {rowData.title}
                                </div>
                                <div className="ri" data-flex="cross:center" data-flex-box="0">
                                    <div>
                                        <i className="iconfont icon-shizhong"></i>
                                        {Tool.formatDateTime(rowData.create_time)}
                                    </div>
                                </div>
                            </div>
                            <div className="info">
                                {rowData.content}
                            </div>
                        </Link>
                        {!rowData._read?
                            <span className="notify_bj"><i className="iconfont icon-rno"></i></span>:""
                        }
                    </div>
            }
            return (
                _html
            )
        };
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Notify} = this.props;
        var data = [];
        if (Notify[this.props.tabName] && Notify[this.props.tabName].date) {
            data = Notify[this.props.tabName].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        return (
            <div className="scroll_list">
                <ListView
                    dataSource={dsNew}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                        {Notify["isLoading"][this.props.tabName] ? loadInfo : ('暂无更多消息')}
                    </div>}
                    renderRow={row}
                    style={{
                        margin:"0"
                    }}
                    initialListSize={(data.length>10?(data.length-2):data.length)}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{scrollbars: true}}
                    onScroll={() => {
                    }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={20}
                />
            </div>
        )
    }
}

var NotifyList = connect((state) => ({
    Notify: state.Notify
}))(NotifyListCommon);
export {NotifyList}


/*
 * 首页列表
 * */
class ProjectListComonent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {rowData, tabName, prevProps, htmlType, type, linkTo, linkToID,actionType} = this.props;
        return (
            <div className="row home_list_row">
                <div className="row_question">
                    <Link to={linkTo + linkToID}>
                        <div className="over_hidden1"><div className="row_title">{rowData.title}</div></div>
                        <div className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}>
                        </div>
                    </Link>
                    <FollowCommon prevProps={prevProps} rowData={rowData} tabName={tabName} type={type} sourceFrom="0" htmlType={htmlType} actionType={actionType}/>
                </div>
            </div>
        );
    }
}
var ProjectList = connect((state) => ({
    Home: state.Home,
    User: state.User,
    Detail: state.Detail
}))(ProjectListComonent);
export {ProjectList}

/* 企业信息展示 */
class EnterpriseListCommon extends Component {
    constructor(props, context) {
        super(props, context);
        this.onEndReached = () => {
            let {dispatch,Enterprise} = this.props;
            if (Enterprise["isLoading"][this.props.tabName]) {
                return;
            }
            var page = Enterprise[this.props.tabName].page+1;
            this.dataInit(page);
        }
        this.dataInit =(page)=> {
            let {dispatch,Enterprise} = this.props;
            dispatch(commonEnterprise(this.props.tabName,page,Enterprise[this.props.tabName].totalPages,this.props.uid));
        }
    }

    componentWillMount() {
        /* 获取uri */
        let {dispatch,Enterprise} = this.props;
        if(Enterprise["info"].user && (this.props.uid == Enterprise["info"].user.uid) && Enterprise[this.props.tabName].page>-1){
            return ;
        }
        var obj = {date:[],number:-1,totalPages:1}
        dispatch(setEnterprise(obj,this.props.tabName));
        this.dataInit(0);
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var _html = <div></div>;
            if (rowData) {
                if (rowData.type == "1") {//问题
                    _html = <div key={rowID} className="">
                        <ProjectList {...this.props} rowData={rowData} tabName="question" type="1" linkTo={"/question/info/"} linkToID={rowData.id} actionType="set_enterprise_follow"/>
                    </div>
                }else if (rowData.type == "2") {//需求
                    _html = <div key={rowID} className="">
                        <ProjectList {...this.props} rowData={rowData} tabName="issue" type="2" linkTo={"/issue/info/"} linkToID={rowData.id} actionType="set_enterprise_follow"/>
                    </div>
                }
            }
            return (
                _html
            )
        };
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Enterprise} = this.props;
        var data = [];
        if (Enterprise[this.props.tabName] && Enterprise[this.props.tabName].date) {
            data = Enterprise[this.props.tabName].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        return (
            <div className="scroll_list">
                <ListView
                    dataSource={dsNew}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                        {Enterprise["isLoading"][this.props.tabName] ? loadInfo : ('暂无更多消息信息')}
                    </div>}
                    renderRow={row}
                    style={{
                        margin:"0"
                    }}
                    initialListSize={(data.length>10?(data.length-2):data.length)}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{scrollbars: true}}
                    onScroll={() => {
                    }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={20}
                />
            </div>
        )
    }
}

var EnterpriseList = connect((state) => ({
    Enterprise: state.Enterprise
}))(EnterpriseListCommon);
export {EnterpriseList}

/*
 * 学术common组件
 * */
export class ScienceCommon extends Component {
    constructor(props){
        super(props);

    }
    render() {
        let {rowData,typeStr} = this.props;
        return (
            <div className="row home_list_row border_bot">
                <div className="row_question">
                    <div className="row_title">{rowData.title}</div>
                    <div className="row_quet_info">
                        {typeStr==3?
                            <div className="sci_content">{rowData.paperAbstract}</div>:""
                        }
                        {typeStr==2?
                            <div className="sci_content">
                                {/*{rowData.content}*/}
                                专利号：{rowData.public_num}
                            </div>:""
                        }
                        {typeStr==1?
                            <div className="sci_content">
                                时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：{rowData.approval_year}<br/>
                                资助金额：{rowData.funding}万
                            </div>:""
                        }
                    </div>
                    {typeStr == 3 ?
                        <div className="row_quet_bot">
                            <span>引用数 {rowData.cited}</span>
                        </div>:""
                    }
                </div>
            </div>
        );
    }
}

/*
 * 学术common组件
 * */
export class ShowHideCommon extends Component {
    constructor(props){
        super(props);
        this.state={
            class:"",
            title:"展开",
            iconArea:"iconfont icon-arrowDown"
        }
        this.toggleDetails=()=>{
            if(this.state.class==""){
                this.setState({
                    class:"folding-down",
                    title:"收起",
                    iconArea:"iconfont icon-top"
                })
            }else{
                this.setState({
                    class:"",
                    title:"展开",
                    iconArea:"iconfont icon-arrowDown"
                })
            }

        }
    }
    render() {
        let {info,className} = this.props;
        return (
            <div className={className}>
                <div className={this.state.class+" more_content"}>
                    <div className='folding-detail'>
                        <div className="item_detail_nav_li">
                            <span className="color1">简介</span>：
                            {info}
                        </div>
                    </div>
                    <div className="folding-area" onClick={this.toggleDetails.bind(this)}>
                        <i className={this.state.iconArea}></i> {this.state.class=="folding-down"?"收起":"展开"}
                    </div>
                </div>

            </div>
        );
    }
}




