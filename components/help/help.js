// 【帮助按钮】组件
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
		onTapHelp: function () {
			wx.showToast({
				title: app.globalData.currentPage,
			})
		}
    }
})