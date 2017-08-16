import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,detail,FollowOn,replyList,commonAction} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,ReplyList} from '../../common/ComponentList';
import Util from '../../common/Util';
import {ListView,ActivityIndicator,Toast} from 'antd-mobile';
/*
* 问题详情页面
* */
var type="question",uri,page=-1,loadFlag=true,totalPages=1,if_Reply=true,fromReply=0,is_top=false;
class Main extends Component {
    componentDidMount(){
        if(is_top){
            Tool.setScrollTop("detailScroll",type);
        }
    }
    constructor(props){
        super(props);
        let {dispatch} = this.props;
        this.follow=(ty,uid,clickType,sourceFrom,actionType)=>{
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props)){
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                let {dispatch} = this.props;
                var token = Util.getToken(this.props);
                dispatch(FollowOn(type,ty,uid,token,clickType,sourceFrom,actionType));
            }
        }
        this.closeQuestion=()=>{
            //点击关闭
            console.log("点击关闭");
            Tool.fetchPost(Util.getApi("questionClose"), JSON.stringify({qid:uri}), {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        //dispatch();获取数据返回给state
                        Toast.info("问题成功关闭",3);
                    }
                }, (err) => {
                    console.log(err);
                });
        }
    }
    componentWillMount(){
        /* 获取uri */
        Util.bodyOver(false);
        uri = this.props.params.uri;
        let {dispatch,Detail} = this.props;
        Util.setPathNameRecord(this.props,"replyPrevPath");
        page=-1;loadFlag=true;totalPages=1;
        if(uri){
            if(Detail["detail"].id==uri){
                is_top = true;
                return ;
            }
            is_top = false;
            dispatch(commonAction("set_detail_init"));
            dispatch(detail(type,uri));
        }else{
            //uri不存在

        }
    }
    render() {
        let {Detail} = this.props;
        var detailInfo = Detail["detail"];
        const info =()=> {
            if (Util.IsNullJson(detailInfo)) {
                return (
                    <div className="home_list_row info_null">
                        暂无详情数据信息
                    </div>
                )
            } else {
                if(detailInfo.current_status<2){
                    return (
                        <div className="home_list_row info_null">
                            此问题正在审核中，暂不开放
                        </div>
                    )
                }else{
                    return (
                        <div className="home_list_row">
                            <div className="row_question">
                                <div className="row_title">
                                    <span className="color1">[问题]</span>
                                    {detailInfo.title}
                                </div>
                                <div className="detail_nav">
                                {detailInfo.userStreamProfile?
                                    <div data-flex className="detail_head">
                                        <div className="le" data-flex="cross:center" data-flex-box="1">
                                            <Link to={"/enterprise/info/"+detailInfo.uid} data-flex="cross:center">
                                                <img src={Util.images(detailInfo.userStreamProfile.pic,0)}/>
                                                <span className="over_hidden1">{detailInfo.userStreamProfile.username}&nbsp;&nbsp;{detailInfo.userStreamProfile.position}<em>{detailInfo.userStreamProfile.orgname}</em></span>
                                            </Link>
                                        </div>
                                    </div>:""
                                }
                                </div>
                                <div className="row_quet_info in_color">
                                    {detailInfo.content}
                                </div>
                                <div className="row_quet_bot">
                                    <span>{detailInfo.followAndLike.followCount}&nbsp;关注</span><em>|</em>
                                    <span className={(detailInfo.followAndLike.userFollow ? ' active' : '') + " attentioned"}
                                        onClick={this.follow.bind(this, 1, detailInfo.id, detailInfo.followAndLike.userFollow ? 2 : 1,0,"set_detail_follow")}>
                                        {detailInfo.followAndLike.userFollow ?
                                            <font>
                                                <i className="iconfont icon-guanzhu"></i>
                                                取消关注
                                            </font>:
                                            <font>
                                                <i className="iconfont icon-guanzhu1"></i>
                                                关注问题
                                            </font>
                                        }
                                    </span>
                                    <span className={detailInfo.followAndLike.userLike ? "active like" : "like"}
                                          onClick={this.follow.bind(this, 1, detailInfo.id, detailInfo.followAndLike.userLike ? 0 : 3,0,"set_detail_follow")}>
                                     {detailInfo.followAndLike.likeCount > 0 ? detailInfo.followAndLike.likeCount : ""}
                                        <i className="iconfont icon-dianzan"></i>
                                     </span>
                                    <div><br/></div>
                                    <span>推送{detailInfo.expertPushed}专家</span><em>|</em><span>{detailInfo.answerCount}回答</span>
                                    <span className="time">发布时间：{Tool.formatDateTime(detailInfo.create_time)}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        }

        var userQuestion = detailInfo.userQuestion;
        if(detailInfo.current_status==5 || detailInfo.current_status<2){
            userQuestion = false;
        }
        return (
            <div className="detail_cons page_hei_cons">
                <Header title="问题详情" leftInfo="back" rightClick={userQuestion?"closeQuestion":""} closeQuestion={this.closeQuestion} rightInfo={userQuestion?"关闭":""} />
                <div className="page_body page_normal bg_color">
                    {info()}
                    <ReplyList type={type} uri={uri}/>
                </div>
                {/* footer */}
                <Footer className="normal_footer"/>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    Detail:state.Detail,
}))(Main);

