// 【临时事项】页面
var base = require('../../utils/base.js'); //引用公共函数文件
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
		todoArr : [], // 临时事项数据
		categoryArr: [], // 类别数据
		isSee: true, // 是否显示已完成项
		isMoved: false // 是否处于滑动状态
    },

    onLoad: function(options) {
		// 跳转启动页
		if (wx.getStorageSync('loginPage') == 'today') {
			wx.switchTab({
				url: '/pages/today/today',
			})
		} 
    },

    onShow: function() {
        base.getNetStatus() // 检测网络状态
		theme.setTheme() // 设置主题
        app.globalData.currentPage = 'temp' // 设置当前页面
		app.globalData.newType = 'temp' // 设置新建todo的类型
        this.setData({
			theme: wx.getStorageSync('theme'), // 设置主题
			todoArr: wx.getStorageSync('tempData'), // 加载Todo数据
			categoryArr: wx.getStorageSync('category'), // 加载类别数据
            isSee: base.getPageInfo('temp', 'isSee'), // 设置isSee状态
			isMoved: false // 设置滑动状态
        })
	},

    // 响应see组件的changeSee事件
    onChangeSee: function(event) {
        this.setData({
            isSee: event.detail,
        })
    },

    // 点击头像，跳转到自定义设置页面
    onTapAvatar: function (event) {
       wx.navigateTo({
		   url: '/pages/setting/setting',
	   })
    },

})