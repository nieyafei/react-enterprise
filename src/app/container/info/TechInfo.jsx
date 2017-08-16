import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {detail,FollowOn,commonAction} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,ReplyList} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
 * 技术详情页面
 * */
var type="tech",uri,is_top=false;
class Main extends Component {
    componentDidMount(){
        if(is_top){
            Tool.setScrollTop("detailScroll",type);
        }
    }
    constructor(props){
        super(props)
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
        this.toContactExpert=(contactName,contactTitle,uid)=>{
            Util.contactSession("技术",contactName,contactTitle,"other",uid,uri,6);
        }
    }

    componentWillMount(){
        /* 获取uri */
        Util.bodyOver(false);
        uri = this.props.params.uri;
        let {dispatch,Detail} = this.props;
        Util.setPathNameRecord(this.props,"replyPrevPath");
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
                return (
                    <div className="home_list_row">
                        <div className="row_question">
                            <div className="row_title">
                                <span className="color1">[技术]</span>
                                {detailInfo.title}
                            </div>
                            <div className="detail_nav">
                                <div data-flex className="detail_head">
                                    <div className="le" data-flex="cross:center" data-flex-box="1">
                                        <Link to={"/expert/info/"+detailInfo.expertIndexStream.uid}>
                                            <img src={Util.images(detailInfo.expertIndexStream.coverPic, 0)}/>
                                            <span>{detailInfo.expertIndexStream.name}&nbsp;&nbsp;{detailInfo.expertIndexStream.title}<em>{detailInfo.expertIndexStream.org}</em></span>
                                        </Link>
                                    </div>
                                    <div className="ri" data-flex="cross:center" data-flex-box="0">
                                        <Link onClick={this.toContactExpert.bind(this,detailInfo.expertIndexStream.name,detailInfo.title,detailInfo.expertIndexStream.uid)} className="color1">
                                            <i className="iconfont icon-phone color1"></i>
                                            联系专家
                                        </Link>
                                    </div>
                                </div>
                                <div className="from_type color1">来自{detailInfo.domain}领域</div>
                                <div className="form_ul">
                                    <div className="li">
                                        <label>特点：</label>
                                        <span>{detailInfo.describe}</span>
                                    </div>
                                    <div className="li">
                                        <label>合作价格：</label>
                                        <span>{Util.FormateFance(detailInfo.finance)}</span>
                                    </div>
                                    <div className="li">
                                        <label>合作方式：</label>
                                        <span>{Util.FormateCoop(detailInfo.cooperation)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row_quet_bot">
                                <span>{detailInfo.followAndLike.followCount}&nbsp;关注</span><em>|</em>
                                <span className={(detailInfo.followAndLike.userFollow ? ' active' : '') + " attentioned"}
                                    onClick={this.follow.bind(this, 6, detailInfo.id, detailInfo.followAndLike.userFollow ? 2 : 1,0,"set_detail_follow")}>
                                    {detailInfo.followAndLike.userFollow ?
                                        <font>
                                            <i className="iconfont icon-guanzhu"></i>
                                            取消关注
                                        </font>:
                                        <font>
                                            <i className="iconfont icon-guanzhu1"></i>
                                            关注技术
                                        </font>
                                    }
                                </span>
                                <span className={detailInfo.followAndLike.userLike ? "active like" : "like"}
                                      onClick={this.follow.bind(this, 6, detailInfo.id, detailInfo.followAndLike.userLike ? 0 : 3,0,"set_detail_follow")}>
                                 {detailInfo.followAndLike.likeCount > 0 ? detailInfo.followAndLike.likeCount : ""}
                                    <i className="iconfont icon-dianzan"></i>
                                 </span>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        //推荐列表
        var recommend = Detail["recommendList"];
        const recommendList =()=>{
            if(!Util.IsNullJson(recommend) && recommend.length>0){
                return (
                    <div className="recommend">
                        <div className="recommend_header" data-flex="cross:center">
                            <i className="iconfont icon-shezhi-copy"></i>
                            推荐技术
                        </div>
                        <div>
                        {
                            recommend.map(function (item,key) {
                                return (
                                    <div key={key} className="recommend_li">
                                        <Link to={"/tech/info/"+item.id}>
                                            <h2>新技术<em>|</em>来自{item.domain}领域</h2>
                                            <h1><span className="color1">[技术]</span>{item.title}</h1>
                                            <div className="info_tech">
                                                <div>合作价格：{Util.FormateFance(item.finance)}</div>
                                                <div>合作方式：{Util.FormateCoop(item.cooperation)}</div>
                                            </div>
                                        </Link>
                                        <div className="row_quet_bot">
                                            <span>关注{item.followAndLike.followCount}</span><em>|</em>
                                            <span
                                                onClick={this.follow.bind(this, 6, item.id, item.followAndLike.userFollow ? 2 : 1,1,"set_detail_follow")}>
                                                    {item.followAndLike.userFollow ? "取消关注" : "关注"}
                                                </span>
                                            <span className={item.followAndLike.userLike ? "active like" : "like"}
                                                  onClick={this.follow.bind(this, 6, item.id, item.followAndLike.userLike ? 0 : 3,1,"set_detail_follow")}>
                                                 {item.followAndLike.likeCount > 0 ? item.followAndLike.likeCount : ""}
                                                <i className="iconfont icon-dianzan"></i>
                                            </span>
                                        </div>
                                    </div>
                                );
                            }, this)
                        }
                        </div>

                    </div>
                )
            }
        }

        return (
            <div className="detail_cons page_hei_cons">
                <Header title="技术详情" leftInfo="back"/>
                <div className="page_body page_normal bg_color">
                    {info()}
                    {recommendList()}
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
    Detail:state.Detail
}))(Main);

