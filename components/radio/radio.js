// 【单选按钮】组件

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
		index: { // 序号
			type: "num",
			value: 1
		},
		isChecked: { // 是否已选中
			type: "bool",
			value: false
		},
		name: { // 显示文字
			type: "string",
			value: ''
		},
		value: { // 保留值
			type: "string",
			value: ''
		}
	},

	data: {

	},

	methods: {
		// 点击raido框体
		onTapRadio: function (event) {
			if (this.data.isChecked) { //如果处于已选中，则退出
				return
			}
			this.triggerEvent('RadioCheck', this.data.value) // 向引用组件冒泡事件
		}
	}
})