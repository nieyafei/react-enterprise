import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,setSystemAnimating,loadReplyInfo,voteReplyInfo} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
import {Toast} from 'antd-mobile';
/*
回复页面
* */
var replyId,type,url;
class Main extends Component {
    constructor(props,context){
        super(props,context);
        let {dispatch} = this.props;
        this.setVote=(ty)=>{
            if(Util.isLogin(this.props)){
                var t=1;
                if(type=="case"){t=3}else if(type=="tech"){t=6}else if(type=="opinion"){t=5}
                dispatch(voteReplyInfo(ty,replyId,t));
            }
        }
    }
    componentWillMount(){
        replyId = this.props.params.id;
        type = this.props.params.type;
        if(!Util.IsNull(replyId)){
            let {dispatch} = this.props;
            Util.setPathNameRecord(this.props,"replyPrevPath");
            dispatch(loadReplyInfo(replyId,type));
        }
    }
    render() {
        let {Reply} = this.props;
        var replyInfo = Reply["info"];
        const info =()=> {
            if (Util.IsNullJson(replyInfo)) {
                return (
                    <div className="home_list_row info_null">
                        暂无回复数据信息
                    </div>
                )
            } else {
                var tiLeft="问题";
                if(type=="tech"){
                    tiLeft="技术";
                }else if(type=="case"){
                    tiLeft="案例";
                }else if(type=="opinion"){
                    tiLeft="观点"
                }
                return (
                    <div className="reply_info_cons">
                        <div className="reply_list no_mtop">
                            <div className="reply_cs">
                                <Link to={"/"+type+"/info/"+replyInfo.qid} className="row_title">
                                    <span className="color1">[{tiLeft}]</span>
                                    {replyInfo.title}
                                </Link>
                                <div data-flex className="reply_head">
                                    <div className="le" data-flex="cross:center" data-flex-box="1">
                                        {replyInfo.expertIndexStream?
                                            <Link data-flex="cross:center" to={replyInfo.expertIndexStream.isExpert=="EXPERT"?"/expert/info/"+replyInfo.expertIndexStream.uid:""}>
                                                <img src={Util.images(replyInfo.expertIndexStream.coverPic,0)}/>
                                                <span>{replyInfo.expertIndexStream.name}{Util.initString(replyInfo.expertIndexStream.title)}<em>{Util.initString(replyInfo.expertIndexStream.org)}</em></span>
                                            </Link>:""
                                        }
                                    </div>
                                    <div className="ri" data-flex="cross:center" data-flex-box="0">
                                        {Tool.formatDateTime(replyInfo.create_time)}
                                    </div>
                                </div>
                                <div className="reply_content" dangerouslySetInnerHTML={Util.createMarkup(replyInfo.content)}>
                                </div>
                                <br/><br/>
                            </div>
                        </div>
                        <div className="footer_height normal_footer">
                            <footer className="common_footer reply_footer">
                                <div className="jgs"></div>
                                <div className="menu">
                                    <Link className={replyInfo.userVote.userVote&&replyInfo.userVote.value==0?"active":""} onClick={this.setVote.bind(this,replyInfo.userVote.userVote&&replyInfo.userVote.value==0?2:0)}>
                                        <i className="iconfont icon-sanjiaoxing1"></i><br/>
                                        赞同({replyInfo.agreeCount})
                                    </Link>
                                    <Link className={replyInfo.userVote.userVote&&replyInfo.userVote.value==1?"active":""} onClick={this.setVote.bind(this,replyInfo.userVote.userVote&&replyInfo.userVote.value==1?2:1)}>
                                        <i className="iconfont icon-sanjiaoxing"></i><br/>
                                        不赞同({replyInfo.disagreeCount})
                                    </Link>
                                    <Link to={"/info/reply/"+type+"/"+replyInfo.qid+"?pid="+replyInfo.id+"&from=rin"}>
                                        <i className="iconfont icon-xiaoxi"></i><br/>
                                        回复
                                    </Link>
                                </div>
                            </footer>
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className="page page_hei_cons home_cons div_hidden">
                <Header title="回复详情" leftInfo="back" rightTo="/" rightIcon="icon-home2"/>
                {info()}
            </div>
        )
    }
    componentDidMount(){

    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    Reply:state.Reply
}))(Main);

