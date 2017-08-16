import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {loginOut,commonAction} from '../../action/Action';
import {Tool} from '../../Tool';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
* 个人中心页面
* */
class Main extends Component {
    constructor(props,context){
        super(props,context);
        let {dispatch} = this.props;
        this.userLoginOut=()=>{
            /* 退出登录 */
            dispatch(loginOut());dispatch(commonAction("set_clear_home"));
            this.context.router.replace({ pathname: '/' });
        }
    }
    componentWillMount(){
        /* 判断是否登录状态 */
        Util.bodyOver(true);
        //console.log(this.props.location.pathname+this.props.location.search);
        Tool.localItem("prevPathName",this.props.location.pathname+this.props.location.search);
        Util.isLogin(this.props);
    }
    render() {
        let User = this.props.User?this.props.User:JSON.parse(Tool.localItem("User"));
        return (
            <div className="page user_cons">
                <Header title="我的"  rightTo="/question" rightIcon="icon-tiwen"/>
                <div className="my_info">
                    <div className="user_head" data-flex>
                        <div className="user_head_le" data-flex="main:center cross:center" data-flex-box="0">
                            <img className="user_image" src={Util.images(User?User.portrait:"",0)}/>
                        </div>
                        <div className="user_head_ri" data-flex="main:left cross:center" data-flex-box="1">
                            <div>
                                {User?User.full_name:""}
                                <font>{User?User.org_name:""}</font><br/>
                                <em>主要领域：{User?User.domain:""}</em>
                            </div>
                        </div>
                    </div>
                    <div className="user_menus">
                        <ul>
                            <li>
                                <Link to="/start">{/*/user/cloud/me*/}
                                    <i className="iconfont icon-cloud"></i>
                                    企业大数据诊断
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/issue">
                                    <i className="iconfont icon-bianji"></i>
                                    我的需求
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/question">
                                    <i className="iconfont icon-bianji"></i>
                                    我的问题
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/call">
                                    <i className="iconfont icon-phone"></i>
                                    我的电话咨询
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            {/*<li>
                                <Link to="/cold">
                                    <i className="iconfont icon-bianji"></i>
                                    我的项目需求
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>*/}
                            <li>
                                <Link to="/user/expert">
                                    <i className="iconfont icon-guanzhu2"></i>
                                    关注我的专家
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/field/userfield">
                                    <i className="iconfont icon-shezhi-copy"></i>
                                    我的领域
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            {/*<li>
                                <Link to="/">
                                    <i className="iconfont icon-zhongbiao"></i>
                                    浏览历史
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>*/}
                            <li>
                                <Link to="user/paylist">
                                    <i className="iconfont icon-qianbao"></i>
                                    付费历史
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>

                        </ul>
                    </div>
                    <button className="btn_def" onClick={this.userLoginOut}>退出</button>
                </div>
                {/* footer */}
                <Footer myActive="active" className="normal_footer"/>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main); //连接redux