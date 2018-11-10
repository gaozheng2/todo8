// 【显示/隐藏按钮】组件
var base = require('../../utils/base.js'); //引用公共函数文件
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
		isSee: { // 是否显示已完成项目
			type: "bool",
			value: true
		}
	},

	data: {

	},

	methods: {
		// 点击显示/隐藏按钮
		onTapSee: function (event) {
			this.setData({
				isSee: !this.data.isSee
			})
			// 存储按钮选择状态
			var page = app.globalData.currentPage
			base.setPageInfo(page, 'isSee', this.data.isSee)
			// 向引用组件冒泡事件
			this.triggerEvent('ChangeSee', this.data.isSee)
		}
	}
})