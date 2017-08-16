import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {setSystemAnimating,setCommonList} from '../action/Action';
import {Header} from '../common/ComponentList';
import Util from '../common/Util';
import logoen from '../../img/logoen.png';
import {Toast} from "antd-mobile";
import {Tool} from "../Tool";
import leImage from '../../img/lef.png';
import riImage from '../../img/rig.png';
/*
* Login
* */
var tabName = "comList";
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start1active:"active",
            start2active:"",
            comList:false
        }
        this.start = ()=>{
            var company = Util.Trim(this.refs.company.value,"g");
            if(Util.IsNull(company)){
                Toast.info("请输入公司名称",3);
                return false;
            }
            /* 开始进行匹配cm */
            let {dispatch} = this.props;
            dispatch(setSystemAnimating("正在匹配",false));
            Tool.fetchGet(Util.getApi("companyQichacha")+company, "", {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        if(res.result.length>0){
                            if(res.result.length==1 && company==res.result[0]){
                                this.toField(company);
                            }else{
                                dispatch(setCommonList("set_start_company",tabName,res.result));
                                this.setState({
                                    comList:true
                                })
                            }
                        }else{
                            Toast.info("请输入正确的企业名称",2)
                        }
                    }else{
                        Toast.info("请输入正确的企业名称",2)
                    }
                    setTimeout(function () {
                        dispatch(setSystemAnimating("",false));
                    },500)
                }, (err) => {
                    dispatch(setSystemAnimating("",false));
                    console.log(err);
                });

        }
        /* 去选择领域 */
        this.toField=(company)=>{
            /*Tool.localItem("company",company);*/
            this.setState({
                start1active:"",
                start2active:"active",
                comList:false
            })
            setTimeout(function(){
                browserHistory.push("/user/cloud/me");
            },3000);
        }
        this.closeCoList=()=>{
            this.setState({
                start1active:"active",
                start2active:"",
                comList:false
            })
        }
    }
    componentWillMount() {
        Util.bodyOver(false);
    }
    render() {
        let {Start} = this.props;
        var comLists = Start[tabName];
        console.log(comLists);
        return (
            <div className="start_body" data-flex="main:center cross:center">
                <Header leftInfo="back" title="企业大数据诊断"/>
                {this.state.comList?
                    <div className="start_enterprise" data-flex="main:center cross:top">
                        <div className="cons">
                            <h1 className="tit">请选择匹配的公司
                                <span onClick={this.closeCoList.bind(this)}>
                                    <i className="iconfont icon-closev"></i>
                                </span>
                            </h1>
                        {/* 匹配筛选公司 */}
                        {comLists&&comLists.length>0?
                            <div className="enter_li">
                                <div>
                                {
                                    comLists.map(function(item,key){
                                        return (
                                            <div key={key} className="li_name" onClick={this.toField.bind(this,item)}>
                                                {item}
                                            </div>
                                        )
                                    }.bind(this))
                                }
                                </div>
                            </div>
                            :""

                        }
                        </div>
                    </div>
                    :
                    <div className="start_cons">
                        <div className="start_h">
                            <img src={logoen} className="logo_image"/>
                            <span>有专业问题，上科学家在线</span>
                        </div>
                        <div className={this.state.start1active +" start_1 start_2"}>
                            <div className="start_table">
                                <div className="start_cell">
                                    <div className="icos">
                                        <img src={riImage}/>
                                    </div>
                                    <span>超过1,100万科学家的专家数据库</span>
                                </div>
                                <div className="start_cell">
                                    <div className="icos">
                                        <img src={leImage}/>
                                    </div>
                                    <span>大数据技术为您量身定制解决问题</span>
                                </div>
                            </div>
                            <h2 className="tit_center">
                                体验不一样的精确诊断
                                <span></span>
                            </h2>
                            <div className="form_start">
                                <input ref="company" placeholder="请输入公司名称" type="text" disabled="disabled" defaultValue={Tool.localItem("company")}/>
                                <button onClick={this.toField}>开始诊断</button>
                            </div>
                            {/*<Link to="/login" className="my_to_login">已有账号，去登录</Link>*/}
                        </div>
                        {/*根据公司匹配加载中*/}
                        <div className={this.state.start2active + " start_1"}>
                            <div className="start_loading">
                                <div className="weui_loading">
                                    <div className="weui_loading_leaf weui_loading_leaf_0"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_1"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_2"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_3"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_4"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_5"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_6"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_7"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_8"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_9"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_10"></div>
                                    <div className="weui_loading_leaf weui_loading_leaf_11"></div>
                                </div>
                            </div>
                            <span className="loadtips">请稍后，大数据正在走遍互联网<br/>为您的公司进行诊断</span>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User,
    Start:state.Start
}))(Main);