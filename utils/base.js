// 公共函数

import { User } from 'user.js'; // 引用User类
import { Config } from 'config.js'; // 引用全局常量


// 通用请求函数，当noRefetch为true时，不再重复调用请求
function request(params, noRefetch) {
	this.getNetStatus() // 检测网络状态
	var that = this;
	if (!params.type) { // 默认请求方式为GET
		params.type = 'GET';
	}
	wx.request({
		url: Config.restUrl + params.url, // 拼装请求url
		data: params.data,
		header: {
			'content-type': 'application/json',
			'token': wx.getStorageSync('token')
		},
		method: params.type,
		dataType: 'json',
		responseType: 'text',
		success: function (res) {
			var code = res.statusCode.toString(); // 读取http状态码
			var startChat = code.charAt(0); // 读取状态码第一位数字

			if (startChat == '2') { // 状态码为2，则调用成功回调函数
				params.sCallback && params.sCallback(res.data); // 回调函数存在则调用回调函数
			}
			else { // 服务器返回错误时，则重新调用1次
				// 遇到401问题，则重新申请token，并重新调用当前请求！！！！
				if (code == '401') {
					if (!noRefetch) { // 只能重复调用一次
						var user = new User();
						user.getTokenFromServer((token) => {
							that.request(params, true); // 获取token的回调函数，再次发送请求，但不再重复调用
						});
					}
				}
				if (noRefetch) { // 重复调用再次失败，则提示错误
					wx.showToast({
						icon: 'none',
						title: '服务器连接错误',
					})
				}
			}
		},
		fail: function (res) {
			// 一般网络中断才会出现fail
			wx.showToast({
				icon: 'none',
				title: '网络连接错误',
			})
		},
		complete: function (res) { },
	});
}

// 获得元素上绑定的data-值
function getDSet(event, key) {
	return event.currentTarget.dataset[key];
}

// 显示提示框
function showTips(title, message) {
	wx.showModal({
		title: title,
		content: message,
		showCancel: false
	});
}

// 按指定长度剪切字符串，并添加char
function cutString(str, len, char = '') {
	if (str.length * 2 <= len) {
		return str;
	}
	var strlen = 0;
	var s = "";
	for (let i = 0; i < str.length; i++) {
		s = s + str.charAt(i);
		if (str.charCodeAt(i) > 128) { //ASCII码表中大于128的为汉字，占用2个字符位
			strlen = strlen + 2;
		} else {
			strlen = strlen + 1;
		}
		if (strlen > len) {
			return s.substring(0, s.length-1) + char;
		}
	}
	return s;
}

// 获取元素自适应后的实际宽度
function getElePx(rpx) {
	var windowWidth = wx.getSystemInfoSync().windowWidth
	var scale = 750 / windowWidth // 缩放比例
	var px = rpx / scale
	return px
}

// 检测网络连接状态
function getNetStatus() {
	wx.getNetworkType({
		success: function (res) {
			// 返回网络类型：wifi/2g/3g/4g/none(无网络)
			if (res.networkType == 'none') {
				wx.showToast({
					icon: 'none',
					title: '无网络连接'
				})
			}
		}
	})
}

// 读取页面参数
function getPageInfo(page, key) {
	var pageInfo = wx.getStorageSync('pageInfo')
	if (!pageInfo) {
		pageInfo = Config.pageInfo
		wx.setStorageSync('pageInfo', pageInfo)
	}
	var info = pageInfo[page][key]
	return info
}

// 设置页面参数
function setPageInfo(page, key, value) {
	var pageInfo = wx.getStorageSync('pageInfo')
	if (!pageInfo) {
		pageInfo = Config.pageInfo
	}
	pageInfo[page][key] = value
	wx.setStorageSync('pageInfo', pageInfo)
}

// 交换数组元素
function swopArrItem(arr, index1, index2) {
	var tempItem = arr[index1]
	arr[index1] = arr[index2]
	arr[index2] = tempItem
	return arr
}

// 格式化日期
function formatDate(date) {
	var y = date.getFullYear()
	var m = date.getMonth() + 1
	m = m < 10 ? '0' + m : m
	var d = date.getDate()
	d = d < 10 ? ('0' + d) : d
	return y + '-' + m + '-' + d
}

module.exports = {
	request,
	getDSet,
	showTips,
	cutString,
	getElePx,
	getNetStatus,
	getPageInfo,
	setPageInfo,
	swopArrItem,
	formatDate
}