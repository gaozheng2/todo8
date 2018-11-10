// 【添加按钮】组件

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
		}
	},

	data: {

	},

	methods: {
		onTapAdd: function (event) {
			wx.navigateTo({
				url: '/pages/edit/edit?from=' + app.globalData.currentPage + '&method=new&type=' + app.globalData.newType,
			})
		}
	}
})