import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../action/Index'
/*
* 消息页面
* */
class Main extends React.Component {
    render() {
        return (
            <div className="page">
                <Link to="login">点击链接</Link>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);