import React ,{ Component, PropTypes }from 'react';
import { Router, Route,IndexRoute,browserHistory,hashHistory,IndexRedirect} from 'react-router';
import {connect} from 'react-redux';
import Home from '../container/Home';//首页
import NotFound from '../container/NotFound';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';//page切换渲染
import {Tool} from '../Tool';
import {handleLogin} from '../action/Action';
import {ActivityIndicator} from 'antd-mobile';
import Util from  '../common/Util';
import {LoginCom} from '../common/ComponentList';
import Login from "../container/Login";
import Register from "../container/Register";
import Start from '../container/Start';
/* 提问 */
import QuestionIndex from '../container/question/QuestionIndex';
import QuestionTemplate from '../container/question/QuestionTemplate';
import Payment from '../container/question/Payment';
import PaymentResult from '../container/question/PaymentResult';
import AddQuestion from '../container/question/AddQuestion';
/* user */
import UserIndex from '../container/user/UserIndex';
import Field from '../container/user/Field';
import Cloud from '../container/Cloud';
import PayList from '../container/user/PayList';
import UserIssue from '../container/user/UserIssue';
import UserQuestion from '../container/user/UserQuestion';
import UserExpert from '../container/user/UserExpert';
import UserCall from '../container/user/UserCalls';
/* 详情 */
import QuestionInfo from '../container/info/QuestionInfo';
import CaseInfo  from '../container/info/CaseInfo';
import TechInfo from '../container/info/TechInfo';
import OpinionInfo from '../container/info/OpinionInfo';
import Reply from '../container/info/Reply';
import ContactExpert from '../container/info/ContactExpert';
import ContactPay from '../container/info/ContactPay';
import ExpertInfo from '../container/info/ExpertInfo';
import ReplyInfo from '../container/info/ReplyInfo';
import EnterpriseInfo from '../container/info/EnterpriseInfo';
import ExpertTags from '../container/info/ExpertTags';
/* 关注 */
import Attention from '../container/Attention';
/* 消息 */
import Notify from '../container/Notify';
/*
 * 配置路由
 * (路由根目录组件，显示当前符合条件的组件)
 *
 * @class Roots
 * @extends {Component}
 */
class Roots extends Component {
    componentDidMount(){
        /* 过滤是否微信授权 */
        Util.WeiXinLogin();
    }
    componentWillReceiveProps() {
        document.body.style.margin = "0px";
        //必须登录状态
        Util.ComUserLogin();
        /*
        // 这是防止页面被拖拽
        document.body.addEventListener('touchmove', (ev) => {
            ev.preventDefault();
        });*/
    }
    render() {
        return (
            <div className="root_page">
                {/* loading */}
                <div className="loading_toast">
                    <ActivityIndicator
                        toast
                        text={this.props.SystemAnimating.text}
                        color="white"
                        animating={this.props.SystemAnimating.animating}
                    />
                </div>
                {/* 公用登录 login 判断是否打开登录 */}
                <LoginCom isLogin={this.props.Login.isLogin}/>
            <ReactCSSTransitionGroup
                component="div"
                className="wc_dis"
                transitionName="page"
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                style={{height: '100%'}}
            >
                {React.cloneElement(this.props.children, { key: this.props.location.pathname })}
            </ReactCSSTransitionGroup>
            </div>
        );
    }
}

var NewRoots = connect(state=>({
    SystemAnimating:state.SystemAnimating,
    Login:state.Login
}))(Roots);

var history = process.env.NODE_ENV !== 'production' ? browserHistory : hashHistory;
const RouteMap = (
    <Router history={browserHistory}>
        <Route path="/" component={NewRoots}>
            <IndexRoute component={Home}/>
            {/*<IndexRedirect to="/tab=all" />
            <Route path="/tab=:tabName" component={Home}/>*/}
            <Route path="login" component={Login}/>
            <Route path="register" component={Register}/>
            {/* 引导页 */}
            <Route path="start" component={Start}/>
            {/* 提问 */}
            <Route path="question" component={QuestionIndex}/>
            <Route path="question/template/:type" component={QuestionTemplate}/>
            <Route path="question/add/:type" component={AddQuestion}/>
            <Route path="question/payment/:id" component={Payment} />
            <Route path="pay/result/:paytype/:type" component={PaymentResult}/>
            {/* 关注 */}
            <Route path="attention" component={Attention}/>
            {/* 消息通知 */}
            <Route path="notify" component={Notify}/>
            {/* 个人中心 */}
            <Route path="user" component={UserIndex}/>
            <Route path="field/:type" component={Field}/>
            <Route path="user/cloud/:type" component={Cloud}/>
            <Route path="user/cloud/:type/:tab" component={Cloud}/>
            <Route path="user/paylist" component={PayList}/>
            <Route path="user/issue" component={UserIssue}/>
            <Route path="user/question" component={UserQuestion}/>
            <Route path="user/expert" component={UserExpert}/>
            <Route path="user/call" component={UserCall}/>
            {/* 详情 */}
            <Route path="case/info/:uri" component={CaseInfo}/>
            <Route path="question/info/:uri" component={QuestionInfo}/>
            <Route path="tech/info/:uri" component={TechInfo}/>
            <Route path="opinion/info/:uri" component={OpinionInfo}/>
            <Route path="/info/reply/:type/:id" component={Reply}/>
            <Route path="expert/info/:uid" component={ExpertInfo}/>
            <Route path="/contact/expert/:type/:id" component={ContactExpert}/>
            <Route path="/contact/pay/:id" component={ContactPay}/>
            <Route path="/reply/info/:type/:id" component={ReplyInfo}/>
            <Route path="/expert/tags/:id" component={ExpertTags}/>
            {/*企业主页*/}
            <Route path="/enterprise/info/:id" component={EnterpriseInfo}/>

            <Route path="*" component={NotFound}/>
        </Route>
    </Router>
);
export default RouteMap;