import {Api} from './Api';
import {Tool} from '../Tool';
export default (_ID) => {
    var action = {};
    var arr = [
        'loginSuccess', //登录成功
        'loginOut', //退出登录
        'setState' //设置状态
    ];
    /*/!*
    * 需要备注：
    * 1、公司名
    * 2、标签云   需要权重
    * *!/*/
    for (let i = 0; i < arr.length; i++) {
        action[arr[i]] = (target) => {
            return { _ID: _ID, target: target, type: arr[i] };
        }
    }

    return action;
}
