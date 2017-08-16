import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../action/Index';
import {Header} from '../common/ComponentList';
/*
* 404页面
* */
class Main extends React.Component {
    render() {
        return (
            <div className="page error_cons">
                <Header title="错误页面" leftInfo="back"/>
                <div className="error_404">
                    <i className="iconfont icon-404"></i>
                    <p>页面君没有找到，点击
                        <Link to="/">首页</Link>
                    </p>
                </div>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);