// 用户相关操作类

import { Config } from '../utils/config.js'; // 引用全局属性


class User 
{
	constructor() { }

	// 校验令牌
	verify(callback) 
	{
		var that = this;
		var token = wx.getStorageSync('token');
		if (!token) { // 如果缓存中没有令牌，则去服务器调用令牌
			this.getTokenFromServer(callback);
		}
		else { // 如存在则校验令牌
			wx.request({
				url: Config.restUrl + 'user/verify',
				method: 'post',
				data: {
					token: token
				},
				success: function(res) {
					if (!res.data.isValid) { // 校验未通过则重新申请
						that.getTokenFromServer(callback);
					} else {
						callback && callback(res.data.token);
					}
				},
				fail: function(res) {
					wx.showToast({
						title: '网络连接错误',
					})
				}
			})
		}
	}

	// 从服务器获取令牌
	getTokenFromServer(callback) 
	{
		var that = this;
		wx.login({ // 登录微信服务器，获取code
			success: function (res) {
				wx.request({ // 请求服务器，换取Token
					url: Config.restUrl + 'user/token',
					method: 'post',
					data: {
						code: res.code
					},
					success: function (res) {
						wx.setStorageSync('token', res.data.token);
						callback && callback(res.data.token);
					},
					fail: function (res) {
						wx.showToast({
							title: '网络连接错误',
						})
					}
				})
			}
		})
	}

	// 获取用户昵称、头像等信息
	getUserInfo() 
	{
		wx.getSetting({
			success: function(res) {
				if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: function(res) {
							wx.setStorageSync('userInfo', res.userInfo) // 将用户信息存储在缓存中
						}
					})
				}
			}
		})
	}
}

module.exports = { User }