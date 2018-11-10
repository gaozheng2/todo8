// 【事项列表】组件
var base = require('../../utils/base.js') //引用公共函数文件
import { Theme } from '../../theme/theme.js'
var theme = new Theme()
var app = getApp()

Component({
	properties: {
		theme: { // 主题
			type: "obj",
			value: {
				name: "default",
				iurl: "default",
				iurl2: "default",
				curl: "default"
			}
		},
		todoArr: { // 事项数据矩阵
			type: "array",
			value: []
		},
		categoryArr: { // 类别数据矩阵
			type: "array",
			value: []
		},
		isSee: { // 已完成项是否可见
			type: "bool",
			value: true,
			observer: function (value) { // 数据变化时
				this.setData({
					isMoved: false
				})
				this._checkShowTip() // 检查是否显示提示文字
			}
		},
		isMoved: { // 是否处于滑动状态
			type: "bool",
			value: false
		}
	},

	data: {
		selectCategory: -1, // 筛选的类别ID
		categoryTop: 100, // 类别筛选框纵坐标
		isShowCategory: false, // 是否显示类别筛选框
		isShowTip: false // 是否显示提示
	},

	ready: function () {
		var page = app.globalData.currentPage
		this.setData({
			categoryArr: wx.getStorageSync('category'), // 加载类别数据
			selectCategory: base.getPageInfo(page, 'selectCategory'), // 设置筛选的类别ID
			isShowCategory: false, // 隐藏类别筛选框
			isMoved: false // 重置页面组件滑动状态
		})
		this._checkShowTip() // 检查是否显示提示文字
	},

	methods: {
		// 响应Todo组件的reMove事件
		onReMovedTodo: function (event) {
			this.setData({ // 所有事项滑块归位
				isMoved: false
			})
		},

		// 响应Todo组件的inMove事件
		onInMoveTodo: function (event) {
			this.setData({
				isInMove: event.detail
			})
		},

		// 响应Todo组件的check事件
		onCheckTodo: function (event) {
			if (app.globalData.currentPage == 'temp') { // 如果在临时页，则更新缓存数据
				var tempData = wx.getStorageSync('tempData') // 在缓存中存储数据
				tempData[event.detail.index].isDone = event.detail.isDone
				tempData[event.detail.index].endTime = event.detail.endTime
				wx.setStorageSync('tempData', tempData)
			}
			this._checkShowTip() // 检查是否显示提示文字
		},

		// 响应Todo组件的tapDel事件
		onTapDelTodo: function (event) {
			var data = this.data.todoArr
			data.splice(event.detail, 1) // 删除对应节点数据
			if (app.globalData.currentPage == 'temp') { // 如果在临时页，则更新缓存数据
				wx.setStorageSync('tempData', data)
			}
			this.setData({ // 重新绑定数据
				todoArr: data
			})
			this._checkShowTip() // 检查是否显示提示文字
		},

		// 响应Todo组件的tapCategory事件
		onTapCategoryTodo: function (event) {
			this.setData({ // 设置类别筛选框的纵坐标
				categoryTop: event.detail,
				isShowCategory: true
			})
		},

		// 响应category组件的categoryTap事件
		onCategoryTap: function (event) {
			this.setData({
				selectCategory: event.detail // 更新筛选的类别ID
			})
			this._checkShowTip() // 检查是否显示提示文字
		},

		// 移动滚动条
		onScroll: function (event) {
			if (event.detail.deltaY > 2 || event.detail.deltaY < -2) { // 设定滚动阈值
				app.globalData.isScroll = true
			}
		},

		// 停止移动滚动条
		onScrollEnd: function () {
			app.globalData.isScroll = false
		},

		// 滚动条移动到顶端
		onScrollTop: function () {
			wx.showToast({
				title: '111',
			})
		},
		
		// 点击显示所有类别
		onTapShowAllCategory: function (event) {
			var page = app.globalData.currentPage 
			this.setData({
				selectCategory: -1
			})
			base.setPageInfo(page, 'selectCategory', -1)
		},

		// 检查是否已经没有事项，显示提示信息
		_checkShowTip: function () {
			var that = this
			// 获取2个节点的位置，相差1px则视为无todo事项
			var query1 = wx.createSelectorQuery()
			query1.select('.box-top').boundingClientRect()
			query1.exec(function (res) { 
				if (!res[0]) { return }
				var query2 = wx.createSelectorQuery().in(that)
				query2.select('.box-blank').boundingClientRect()
				query2.exec(function (res2) { 
					if (!res2[0]) { return }
					if (res2[0].top - res[0].bottom == 1 && that.data.selectCategory == -1) { // 显示类别提示时，不显示提示文字
						var isShowTip = true
					} else {
						var isShowTip = false
					}
					that.setData({
						isShowTip: isShowTip
					})
				})
			})				
		}
	}
})
