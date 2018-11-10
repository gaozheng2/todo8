// 【今日事项】页面
var base = require('../../utils/base.js'); //引用公共函数文件
import { Config } from '../../utils/config.js';
import { Theme } from '../../theme/theme.js';
var theme = new Theme()
var app = getApp();

Page({

	data: {
		theme: { // 设置主题
			name: "default",
			iurl: "default",
			iurl2: "default",
			curl: "default"
		},
		todoArr: [], // 事项数据
		categoryArr: [], // 类别数据
		isSee: true, // 是否显示已完成项
		isMoved: false, // 是否处于滑动状态

		date: {}, // 当前日期
	},

	onLoad: function () {
		var today = new Date()
		this.setData({
			date: this._setDate(today) // 设置当前日期
		})
	},

	onShow: function () {
		base.getNetStatus() // 检测网络状态
		theme.setTheme() // 设置主题
		app.globalData.currentPage = 'today' // 设置当前页面
		app.globalData.newType = 'date' // 设置新建todo的类型
		this.setData({
			theme: wx.getStorageSync('theme'), // 设置主题
			todoArr: wx.getStorageSync('tempData'), // 加载Todo数据
			categoryArr: wx.getStorageSync('category'), // 加载类别数据
			isSee: base.getPageInfo('today', 'isSee'), // 设置isSee状态
			isMoved: false // 设置滑动状态
		})
		
	},

	// 响应see组件的changeSee事件
	onChangeSee: function (event) {
		this.setData({
			isSee: event.detail,
		})
	},

	// 设置日期
	_setDate(date) {
		return {
			year: date.getFullYear(),
			month: Config.month[date.getMonth()],
			day: date.getDate(),
			week: Config.week[date.getDay()]
		}
	},
})