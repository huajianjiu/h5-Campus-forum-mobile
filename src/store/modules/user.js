/* eslint-disable no-unused-vars */
import { reqUserLogin, reqUserInfo,reqUserRegister } from '@/api/user/index'
import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo:{}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, data) => {
    delete data.iat;
    delete data.exp;
    state.userInfo=data;
    // state.uID = data.uID
    // state.userNickname = data.userNickname
    // state.userBirthday = data.userBirthday
    // state.userGender = data.userGender
    // state.userStatement = data.userStatement
    // state.userAvatarUrl = data.userAvatarUrl
  },
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      reqUserLogin({ username: username.trim(), password: password }).then(response => {
        if(response.code===200){
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }else{
          throw new Error(response.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      reqUserInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          removeToken();
          return reject('登录验证失败，请重新登录')
        }
        commit('SET_INFO', data[0])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit, state }) {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
  },
  // 用户注册
  register({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      reqUserRegister({ username: username.trim(), password: password }).then(response => {
        if(response.code===200){
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }else{
          throw new Error(response.message);
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

