import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {LoginCom,Header} from '../common/ComponentList';
import Util from '../common/Util';
import {Tool} from '../Tool';
import {setSystemAnimating} from '../action/Action';
/*
* Login
* */
class Main extends Component {
    constructor(props,context) {
        super(props,context);
    }
    componentWillMount(){
        /* 判断是否登录状态 */
        //Tool.removeLocalItem('User');
        let {dispatch} = this.props;
        dispatch(setSystemAnimating("",false));
        /*var token = this.props.User ? this.props.User.token : '';
        var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
        if(token && token.length >0){//已经登录
            return this.context.router.push({ pathname:prePathName }); //跳转到上一页
        }*/
        if(Util.isLogin(this.props,1,0)){
            browserHistory.push("/");
        }
    }
    render() {
        return (
            <div className="page login_cons com_cos_confull">
                <Header title="登录"/>
                <LoginCom isLogin="true" closeLoginLayer={this.closeLoginLayer} setStateLayer={this.setStateLayer}/>
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