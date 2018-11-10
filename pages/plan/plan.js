// 【规划】页面
var base = require('../../utils/base.js'); //引用公共函数文件
import { Theme } from '../../theme/theme.js';
var theme = new Theme()
var app = getApp()

Page({

	data: {
		theme: { // 设置主题
			name: "default",
			iurl: "default",
			iurl2: "default",
			curl: "default"
		},
	},

	onLoad: function (options) {
		
	},

	onShow: function () {
		base.getNetStatus() // 检测网络状态
		theme.setTheme() // 设置主题
		app.globalData.currentPage = 'plan' // 设置当前页面
		app.globalData.newType = 'plan' // 设置新建todo的类型
		this.setData({
			theme: wx.getStorageSync('theme'), // 设置主题
			isMoved: false // 重置页面组件滑动状态
		})
		
		console.log('plan.show')
	},


})