//App初始化文件
import { Config } from '/utils/config.js'; // 引用全局常量
import { User } from '/utils/user.js';
import { Category } from '/utils/category.js';
import { Theme } from '/theme/theme.js';
var user = new User()
var category = new Category()
var theme = new Theme()

App({
    onLaunch: function() {
        // 校验令牌
		user.verify()

        // 获取用户信息
		user.getUserInfo()
		
		// 加载类别数据
		category.getCategory()

		// 清理已完成超过一个月的临时Todo事项
		var tempData = wx.getStorageSync('tempData') // 加载临时Todo事项
		if (!tempData) { // 如果不存在则读取Config文件中的默认临时Todo
			tempData = Config.tempData
		}
		var index = 0
		for (var value of tempData) {
			var today = new Date(),
				endTime = new Date(value['endTime']),
				delta = today - endTime
			if (value['isDone'] && value['endTime'] && delta > 2592000000) { // 3600s * 24h * 30d * 1000ms = 2592000000
				tempData.splice(index, 1)
			}
			index ++
		}
		wx.setStorageSync('tempData', tempData) // 写入缓存

		// 设置主题
		var themeName = wx.getStorageSync('theme')['name']
		if (!themeName) {
			themeName = 'default'
		}
		theme.setTheme(themeName)

		// 设置置顶文字
		wx.setTopBarText({
			text: '轻松打卡，认真生活8'
		})

		// 初始化页面设置信息
		var pageInfo = wx.getStorageSync('pageInfo')
		if (!pageInfo) {
			pageInfo = Config.pageInfo
			wx.setStorageSync('pageInfo', pageInfo)
		}
	},

	// 全局变量
	globalData: {
		currentPage: "today", // 当前页面
		newType: 'temp', // 新建事项的类型
		isScroll: false, //是否处于滚动状态
		isMoved: { // 是否有组件处于已滑动状态
			'temp': false,
			'today': false,
			'plan': false,
			'share': false
		},
		tempCategory: [], // 设置类别中的临时类别信息
		editData: {}, // 待编辑的Todo数据
	}
})