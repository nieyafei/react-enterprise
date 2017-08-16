import "babel-polyfill";
import { Tool, merged } from '../Tool';
import Util from "../common/Util";
/**
 * 存储登录的用户信息
 * 
 * @param {string} [state=JSON.parse(Tool.localItem('User'))]
 * @param {Object} action
 * @returns Object
 */
const User = (state = JSON.parse(Tool.localItem('User')), action) => {

    switch (action.type) {
        case 'loginSuccess': //登录成功
            Tool.localItem("company",action.UserJson.org_name);
            Tool.localItem('User', JSON.stringify(action.UserJson));
            return action.UserJson;
        case 'loginOut': //退出
            Util.loginOut();
            return null;
        default:
            return state;
    }

}

/* 系统组件 */
const SysCommon=(state={
    code:"",
    isShow:false
},action)=>{
    switch (action.type){
        case 'set_sys_code':
            return Object.assign({}, state, {
                code: action.code,
                isShow:action.isShow
            });
        default:
            return state;
    }
};

/* 登录组件（弹层） */
const Login=(state={
    isLogin:false,
},action)=>{
    switch (action.type){
        case 'set_login_isLogin':
            return Object.assign({}, state, {
                isLogin: action.isLogin
            });
        default:
            return state;
    }
};

/* 登录组件（弹层） */
const Start=(state={
    comList:[],
},action)=>{
    switch (action.type){
        case 'set_start_company':
            return Object.assign({}, state, {
                comList: action.date
            });
        default:
            return state;
    }
};

const SystemAnimating = (state = {
    text:"正在加载",
    animating: false,
}, action)=> {
    switch (action.type) {
        case 'set_system_animating':
            return Object.assign({}, state, {
                text:((action.text ==null || action.text.length<1)?"正在加载":action.text),
                animating: action.animating
            });
        default:
            return state;
    }
};

const Home = (state={
    all:{date:[],page:-1,totalPages:1},
    question:{date:[],page:-1,totalPages:1},
    case:{date:[],page:-1,totalPages:1},
    tech:{date:[],page:-1,totalPages:1},
    opinion:{date:[],page:-1,totalPages:1},
    detail:{data:{},success:false},
    isLoadingMore:false
},action)=>{
    switch (action.type){
        case 'set_home_list':
            if(action.tabData.page==0){
                state[action.tabName].date=[];//重新计算情况数据
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page,totalPages:action.tabData.totalPages};
            return returnHomes(action.tabName,state,obj);
        case 'set_home_loadingMore':
            return Object.assign({}, state, {
                isLoadingMore: action.isLoadingMore
            });
        case 'set_home_detail':
            return Object.assign({}, state, {
                detail: action.detail
            });
        case 'set_home_follow':
            /* 更新state */
            let date = [];
            state[action.tabName].date.map(function(item,i){
                date.push(set_click_follow(item,action));
            })
            var obj = {date:date,page:state[action.tabName].page};
            return returnHomes(action.tabName,state,obj);
        case 'set_clear_home':
            /* 更新state */
            console.log("清空首页数据");
            state["all"]=state["question"]=state["case"]=state["tech"]=state["opinion"]={date:[],page:-1,totalPages:1};
            return state;
        default:
            return state;
    }
};

const IndustryCom = (state={
    all:{date:[],page:0,totalPages:1},
    question:{date:[],page:0,totalPages:1},
    case:{date:[],page:0,totalPages:1},
    tech:{date:[],page:0,totalPages:1},
    opinion:{date:[],page:0,totalPages:1},
},action)=>{
    switch (action.type){
        case 'set_industry_list':
            if(action.tabData.page==0){
                state[action.tabName].date=[];//重新计算情况数据
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page,totalPages:action.tabData.totalPages};
            return returnHomes(action.tabName,state,obj);
        case 'set_industry_follow':
            /* 更新state */
            let date = [];
            state[action.tabName].date.map(function(item,i){
                date.push(set_click_follow(item,action));
            })
            var obj = {date:date,page:state[action.tabName].page};
            return returnHomes(action.tabName,state,obj);
        default:
            return state;
    }
};

const ScienceCom = (state={
    all:{date:[],page:0,totalPages:1},
    project:{date:[],page:0,totalPages:1},
    patent:{date:[],page:0,totalPages:1},
    paper:{date:[],page:0,totalPages:1},
    cooperativePaper:{date:[],page:0,totalPages:1},
},action)=>{
    switch (action.type){
        case 'set_science_list':
            if(action.tabData.page==0){
                state[action.tabName].date=[];//重新计算情况数据
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page,totalPages:action.tabData.totalPages};
            switch (action.tabName){
                case 'all':
                    return Object.assign({}, state, {
                        all: obj
                    });
                case 'project':
                    return Object.assign({}, state, {
                        project: obj
                    });
                case 'patent':
                    return Object.assign({}, state, {
                        patent: obj
                    });
                case 'paper':
                    return Object.assign({}, state, {
                        paper: obj
                    });
                case 'cooperativePaper':
                    return Object.assign({}, state, {
                        cooperativePaper: obj
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
};

const Search = (state={
    all:{date:[],page:0},
    question:{date:[],page:0},
    case:{date:[],page:0},
    tech:{date:[],page:0},
    opinion:{date:[],page:0},
    history:[]
},action)=>{
    switch (action.type){
        case 'set_search_list':
            if(action.tabData.page==0){
                state[action.tabName].date=[];//重新计算情况数据
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page};
            return returnHomes(action.tabName,state,obj);
        case 'set_search_follow':
            let date = [];
            console.log("关注搜索");
            state[action.tabName].date.map(function(item,i){
                date.push(set_click_follow(item,action));
            })
            var obj = {date:date,page:state[action.tabName].page};
            return returnHomes(action.tabName,state,obj);
        case 'set_history_list':
            return Object.assign({}, state, {
                history: JSON.parse(Tool.localItem("searchHistory"))||[]
            });
        case 'set_search_null':
            state["all"] = {date:[],page:0};
            state["question"] = {date:[],page:0};
            state["case"] = {date:[],page:0};
            state["tech"] = {date:[],page:0};
            state["opinion"] = {date:[],page:0};
            return state;
        default:
            return state;
    }
}; //首页

const returnHomes =(tabName,state,obj)=>{
    switch (tabName){
        case 'all':
            return Object.assign({}, state, {
                all: obj
            });
        case 'question':
            return Object.assign({}, state, {
                question: obj
            });
        case 'case':
            return Object.assign({}, state, {
                case: obj
            });
        case 'tech':
            return Object.assign({}, state, {
                tech: obj
            });
        case 'opinion':
            return Object.assign({}, state, {
                opinion: obj
            });
        case 'issue':
            return Object.assign({}, state, {
                issue: obj
            });
        default:
            return state;
    }
}

const Attention = (state={
    expert:{date:[],page:-1},
    question:{date:[],page:-1},
    case:{date:[],page:-1},
    tech:{date:[],page:-1},
    opinion:{date:[],page:-1},
},action)=>{
    switch (action.type){
        case 'set_attention_list':
            if(action.tabData.page==0){
                state[action.tabName].date=[];//重新计算情况数据
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page};
            return returnAttention(action.tabName,state,obj);
        case 'set_attention_follow':
            /* 更新state 取消关注 */
            let date = [];
            state[action.tabName].date.map(function(item,i){
                var da = item;
                if(da.id == action.uid){
                    if(action.clickType==2){//取消关注
                        da={};
                    }else if(action.clickType==3){//点赞
                        da.likeCount=parseInt(da.likeCount)+1;
                        da.is_like=1;
                    }
                }
                date.push(da);
            })
            var obj = {date:date,page:state[action.tabName].page};
            return returnAttention(action.tabName,state,obj);
        default:
            return state;
    }
}; //首页

const returnAttention =(tabName,state,obj)=>{
    switch (tabName){
        case 'expert':
            return Object.assign({}, state, {
                expert: obj
            });
        case 'question':
            return Object.assign({}, state, {
                question: obj
            });
        case 'case':
            return Object.assign({}, state, {
                case: obj
            });
        case 'tech':
            return Object.assign({}, state, {
                tech: obj
            });
        case 'opinion':
            return Object.assign({}, state, {
                opinion: obj
            });
        default:
            return state;
    }
}

const Notify = (state={
    list:{date:[],page:-1,totalPages:1},
    personal:{date:[],page:-1,totalPages:1},
    isLoading:{list:false,personal:false}
},action)=>{
    switch (action.type){
        case "set_notify":
            if(action.tabData.number<1){
                state[action.tabName].date=[];
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.content),page:action.tabData.number,totalPages:action.tabData.totalPages};
            if(action.tabName=="personal"){
                return Object.assign({}, state, {
                    personal: obj
                });
            }else{
                return Object.assign({}, state, {
                    list: obj
                });
            }
        case "set_notify_read":
            var obj = state[action.tabName];
            var newObj=[];
            if(obj.date){
                obj.date.map(function(item,key){
                    if(item.msgid == action.msgId){
                        item._read=true;
                    }
                    newObj.push(item);
                })
            }
            obj.date = newObj;
            if(action.tabName=="list"){
                return Object.assign({}, state, {
                    list: obj
                });
            }else{
                return Object.assign({}, state, {
                    personal: obj
                });
            }
        case "set_notify_loading":
            var obj = state["isLoading"];
            obj[action.tabName]=action.flag;
            return Object.assign({}, state, {
                isLoading: obj
            });
            //return state;
        default:
            return state;
    }
}

const PayList = (state={
    list:{date:[],page:0}
},action)=>{
    switch (action.type){
        case "set_pay_list":
            if(action.tabData.page==0){
                state[action.tabName].date=[];
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.date),page:action.tabData.page};
            return Object.assign({}, state, {
                list: obj
            });
        default:
            return state;
    }
}

const Detail = (state={
    detail:{},
    recommendList:[],
    replyList:{date:[],page:0},
},action)=>{
    switch (action.type) {
        case "set_detail":
            //存储数据
            return Object.assign({}, state, {
                detail: action.detail
            });
        case "set_recommend_list":
            //存储推荐数据
            return Object.assign({}, state, {
                recommendList: action.recommendList
            });
        case "set_detail_follow":
            switch (action.sourceFrom) {
                case 1:
                    var list = state["recommendList"];
                    const remList = [];
                    list.map(function (item, i) {
                        var da = item;
                        if (da.id == action.uid) {
                            if (action.clickType == 1) {//关注
                                da.followAndLike.followCount = da.followAndLike.followCount + 1;
                                da.followAndLike.userFollow = true;
                            } else if (action.clickType == 2) {//取消关注
                                da.followAndLike.followCount = da.followAndLike.followCount - 1;
                                da.followAndLike.userFollow = false;
                            } else if (action.clickType == 3) {//点赞
                                da.followAndLike.likeCount = da.followAndLike.likeCount + 1;
                                da.followAndLike.userLike = true;
                            }
                        }
                        remList.push(da);
                    })
                    return Object.assign({}, state, {
                        recommendList: remList
                    });
                case 0:
                    /* 详情更新点赞和关注 */
                    var detail = state["detail"];
                    if (action.clickType == 1) {//关注
                        detail.followAndLike.followCount = detail.followAndLike.followCount + 1;
                        detail.followAndLike.userFollow = true;
                    } else if (action.clickType == 2) {//取消关注
                        detail.followAndLike.followCount = detail.followAndLike.followCount - 1;
                        detail.followAndLike.userFollow = false;
                    } else if (action.clickType == 3) {//点赞
                        detail.followAndLike.likeCount = detail.followAndLike.likeCount + 1;
                        detail.followAndLike.userLike = true;
                    }
                    return Object.assign({}, state, {
                        detail: detail
                    });
                default:
                    return state;
            }
        case "set_reply_list":
            if(action.list.page==0){state["replyList"].date=[];}
            var replyList = {date: state["replyList"].date.concat(action.list.date),page:action.list.page};
            return Object.assign({}, state, {
                replyList: replyList
            });
        case "set_detail_init":
            state["detail"]={};
            state["recommendList"]=[];
            state["replyList"]={date:[],page:0};
            return state;
        default:
            return state;
    }
}

/*
* 专家
* */
const Expert = (state={
    info:{},
    industryList:{},
    scienceList:{}
},action)=>{
    switch (action.type) {
        case "set_expert_info":
            //存储数据
            return Object.assign({}, state, {
                info: action.info
            });
        case "set_industry_list":
            //存储数据
            return Object.assign({}, state, {
                industryList: action.industryList
            });
        case "set_science_list":
            //存储数据
            return Object.assign({}, state, {
                scienceList: action.scienceList
            });
        case "set_expert_follow":
            var da = state["info"];
            console.log(action);
            if (action.clickType == 1) {//关注专家
                da.followAndLike.userFollow = true;
            } else if (action.clickType == 2) {//取消关注专家
                da.followAndLike.userFollow = false;
            }
            return Object.assign({}, state, {
                info: da
            });
        default:
            return state;
    }
}

/* 通用处理点赞、关注 */
const set_click_follow = function(item,action){
    var da = item;
    if (da.id == action.uid) {
        if (action.clickType == 1) {//关注
            da.followAndLike.followCount = da.followAndLike.followCount + 1;
            da.followAndLike.userFollow = true;
        } else if (action.clickType == 2) {//取消关注
            da.followAndLike.followCount = da.followAndLike.followCount - 1;
            da.followAndLike.userFollow = false;
        } else if (action.clickType == 3) {//点赞
            da.followAndLike.likeCount = da.followAndLike.likeCount + 1;
            da.followAndLike.userLike = true;
        }
    }
    return da;
}

/*
 * UserCenter
 * */
const UserCenter = (state={
    domainList:[],
    tagList:[],
    expertList:{date:[],page:0},
    questionList:{date:[],page:0},
    issueList:{date:[],page:0},
    callList:{date:[],page:-1,totalPages:1},
    isLoading:{callList:false}
},action)=>{
    switch (action.type) {
        case "set_user_domain":
            //存储数据
            var domainList = [action.domainList];
            return Object.assign({}, state, {
                domainList: domainList
            });
        case "set_tag_list":
            //存储数据
            var tagList = state["tagList"],newTagsList=[];
            if(action.typeName==0 || action.typeName==-1) {
                tagList.map(function (item, i) {
                    if(action.typeName==-1){//删除
                        if(action.userType=="start"){
                            if(action.tagList.text!=item.text){
                                newTagsList.push(item);
                            }
                        }else{
                            if(action.tagList.id!=item.id){
                                newTagsList.push(item);
                            }
                        }
                    }else if(action.typeName==0){//修改
                        if(action.userType=="start"){
                            if(action.tagList.text==item.text){
                                item = action.tagList;
                            }
                        }else{
                            if(action.tagList.id==item.id){
                                item = action.tagList;
                            }
                        }
                        newTagsList.push(item);
                    }
                })
            }else if(action.typeName==1){
                //增加
                tagList.push(action.tagList);
                newTagsList = tagList;//列表获取
            }else{
                newTagsList = action.tagList;//列表获取
            }
            Tool.localItem("tagList",JSON.stringify(newTagsList));
            return Object.assign({}, state, {
                tagList:newTagsList
            });
        case "set_expert_list":
            //存储数据
            if(action.expertList.page==0){
                state["expertList"].date=[];
            }
            let expertList={date: state["expertList"].date.concat(action.expertList.date),page:action.expertList.page};
            return Object.assign({}, state, {
                expertList: expertList
            });
        case "set_question_list":
            //存储数据
            let questionList={date: action.questionList,page:0};
            return Object.assign({}, state, {
                questionList: questionList
            });
        case "set_issue_list":
            //存储数据
            let issueList={date: action.issueList,page:0};
            return Object.assign({}, state, {
                issueList: issueList
            });
        case "set_call_list":
            //存储数据
            if(action.callList.number==0){
                state["callList"].date=[];
            }
            let obj={date: state["callList"].date.concat(action.callList.content),page:action.callList.number,totalPages:action.callList.totalPages};
            return Object.assign({}, state, {
                callList: obj
            });
        case "set_user_center_loading":
            var obj = state["isLoading"];
            obj[action.tabName]=action.flag;
            return Object.assign({}, state, {
                isLoading: obj
            });
        default:
            return state;
    }
}

/* 企业信息 */
const Enterprise = (state={
    info:{},
    question:{date:[],page:-1,totalPages:1},
    issue:{date:[],page:-1,totalPages:1},
    isLoading:{
        question:false,issue:false
    },
},action)=>{
    switch (action.type){
        case "set_enterprise_info":
            return Object.assign({}, state, {
                info: action.tabData
            });
        case "set_enterprise":
            if(action.tabData.number<1){
                state[action.tabName].date=[];
            }
            let obj={date: state[action.tabName].date.concat(action.tabData.content),page:action.tabData.number,totalPages:action.tabData.totalPages};
            return returnHomes(action.tabName, state, obj);

        case 'set_enterprise_follow':
            /* 更新state */
            let date = [];
            state[action.tabName].date.map(function (item, i) {
                date.push(set_click_follow(item, action));
            })
            var obj = {date: date, page: state[action.tabName].page,totalPages:state[action.tabName].totalPages};
            return returnHomes(action.tabName, state, obj);
        case "set_enterprise_loading":
            var obj = state["isLoading"];
            obj[action.tabName]=action.flag;
            return Object.assign({}, state, {
                isLoading: obj
            });
        case "set_enterprise_info_follow":
            var infoObj = state["info"];
            if (action.clickType == 1) {//关注
                infoObj.attention=true;
                infoObj.expertAttentCount +=1;
            } else if (action.clickType == 2) {//取消关注
                infoObj.attention=false;
                infoObj.expertAttentCount -=1;
            }
            return Object.assign({}, state, {
                info: infoObj
            });
        //return state;
        default:
            return state;
    }
}

/*
 * 专家
 * */
const Reply = (state={
    info:{},
},action)=>{
    switch (action.type) {
        case "set_reply_info":
            //存储数据
            return Object.assign({}, state, {
                info: action.info
            });
        case "set_reply_vote":
            var obj = state["info"];
            if(action.typeVote==0){
                if(obj.userVote.userVote){
                    obj.disagreeCount=obj.disagreeCount-1;
                }
                obj.agreeCount=obj.agreeCount+1;
                obj.userVote.userVote=true;
                obj.userVote.value=0;
            }else if(action.typeVote==1){
                if(obj.userVote.userVote){
                    obj.agreeCount=obj.agreeCount-1;
                }
                obj.disagreeCount=obj.disagreeCount+1;
                obj.userVote.userVote=true;
                obj.userVote.value=1;
            }else if(action.typeVote==2){
                if(obj.userVote.value==0){
                    obj.agreeCount=obj.agreeCount-1;
                }else if(obj.userVote.value==1){
                    obj.disagreeCount=obj.disagreeCount-1;
                }
                obj.userVote.value=2;
                obj.userVote.userVote=false;
            }
            return Object.assign({}, state, {
                info: obj
            });
        default:
            return state;
    }
}

/* 支付组件（弹层） */
const WeChatPay=(state={
    isShow:false,
    weiXinPayInfo:{},
    weiXinPayProduct:{},
},action)=>{
    switch (action.type){
        case 'set_pay_info':
            console.log("微信pay信息");
            console.log(action.weiXinPayInfo);
            return Object.assign({}, state, {
                weiXinPayInfo: action.weiXinPayInfo
            });
        case 'set_pay_product_info':
            console.log("微信pay商品信息");
            console.log(action.weiXinPayProduct);
            return Object.assign({}, state, {
                weiXinPayProduct: action.weiXinPayProduct
            });
        case 'set_weixin_is_show':
            return Object.assign({}, state, {
                isShow: action.isShow
            });
        default:
            return state;
    }
};

export default {
    Home,IndustryCom,ScienceCom,
    Attention,Reply,SysCommon,
    User,WeChatPay,
    SystemAnimating,
    Login,Start,
    Notify,
    Detail,
    Search,Enterprise,
    PayList,Expert,UserCenter
};