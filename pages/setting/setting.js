// 【自定义设置】页面
import { Theme } from '../../theme/theme.js';
import { Category } from '../../utils/category.js';
var theme = new Theme()
var category = new Category()
var app = getApp();

Page({

    data: {
		theme: { // 设置主题
			name: "default",
			iurl: "default",
			iurl2: "default",
			curl: "default"
		},
        themeArr: [], // 主题数据
        pageArr: [ // 页面数据
            {
                name: '临时事项',
                value: 'temp'
            },
            {
                name: '今日规划',
                value: 'today'
            }
        ],
		page: 'temp', // 启动页面
		isNoSave: false // 控制是否可以保存
    },

    onLoad: function() {
		app.globalData.currentPage = 'setting' // 设置当前页面
		theme.setNavBar() // 重置导航栏颜色
        // 读取设置数据
        var page = wx.getStorageSync('loginPage')
        if (!page) {
            page = 'temp' // 默认启动页temp
        }
        this.setData({
			theme: wx.getStorageSync('theme'), // 设置主题
			themeArr: Theme.data, // 设置主题数据
			page: page, // 设置启动页数据
        })
    },

	// 响应隐藏/显示保存图标（已禁用冒泡函数）
	onNoSave: function (value) {
		this.setData({
			isNoSave: value.detail
		})
	},

    // 响应主题radio点击
    onThemeCheck: function (value) {
        var name = value.detail		
        theme.setTheme(name, true) // 预览主题
        this.setData({
            theme: Theme.data[name],
        })
    },

    // 响应启动页面radio点击
    onPageCheck: function(value) {
        var name = value.detail
        this.setData({
            page: name
        })
    },

    // 保存设置
    onTapSave: function() {
		var oldTheme = wx.getStorageSync('theme')		
        wx.setStorageSync('theme', this.data.theme) // 更新主题
		category.saveCategory('设置保存成功') // 保存类别数据
        wx.setStorageSync('loginPage', this.data.page) // 保存启动页面数据
		wx.navigateBack() // 退回上一页面
    }
})