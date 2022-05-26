import request from '@/utils/request'
const baseUrl="";
// 用户登录
export const reqUserLogin=(data)=>request({url:baseUrl+'/app/user/login',method:'post',data});

// 获取用户信息
export const reqUserInfo=()=>request({url:baseUrl+'/app/user/userInfo',method:'get'});

// 获取用户评论数量
export const reqUserReplyCount=(data)=>request({url:baseUrl+'/app/user/replyCount',method:'get',params:data});

// 上传头像
export const changeAvatar=(data)=>request({url:baseUrl+'/app/upload/avatar',method:'post',data});

// 修改编辑用户信息
export const reqEditInfo=(data)=>request({url:baseUrl+'/app/user/editUserInfo',method:'put',data});

// 校验账号是否已注册
// validatorUsername
export const reqvalidator=(params)=>request({url:baseUrl+'/app/user/validatorUsername',method:'get',params});

// 用户注册
export const reqUserRegister=(data)=>request({url:baseUrl+'/app/user/register',method:'post',data});
