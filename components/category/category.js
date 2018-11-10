// 【选择类别】组件
var base = require('../../utils/base.js'); //引用公共函数文件
import { Config } from '../../utils/config.js'; // 引用全局常量
var app = getApp()

Component({

	properties: {
		theme: { // 主题
			type: "obj",
			value: {
				name: "default",
				iurl2: "default",
				iurl: "default",
				curl: "default"
			}
		},
		categoryArr: { // 类别数据
			type: "arror",
			value: []
		},
		selectCategory: { // 筛选的类别ID
			type: "num",
			value: -1
		},
		top: { // 位置纵坐标
			type: "num",
			value: 500
		},
		isShow: { // 是否显示
			type: "bool",
			value: false,
		}
	},

	data: {
		
	},

	methods: {
		// 点击类别图标，筛选类别
		onTapCategory: function (event) {
			var id = base.getDSet(event, 'id')
			if (id == this.data.selectCategory) { // 再次点击则取消选择
				id = -1
			}
			// 记录缓存，当前页面的筛选类别ID
			var page = app.globalData.currentPage
			base.setPageInfo(page, 'selectCategory', id)
			// 更新绑定数据
			this.setData({
				selectCategory: id,
			})
			// 冒泡点击事件，传回筛选的类别ID
			this.triggerEvent('CategoryTap', id)
		},

		// 点击遮罩，隐藏组件
		onTapMusk: function (event) {
			this.setData({
				isShow: false
			})
		}
	}
})