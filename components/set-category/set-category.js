// 【设置类别】组件
var base = require('../../utils/base.js'); //引用公共函数文件
import { Config } from '../../utils/config.js'; // 引用全局常量
import { Category } from '../../utils/category.js'; // 引用类别类
var category = new Category
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
		isEdit: { // 是否处于编辑模式
			type: "bool",
			value: true
		},
		selectCategoryId: { // 选中的类别ID
			type: "num",
			value: -1,
			observer: function (value) { // 数据变化时，更新选中的类别信息
				if (value == -1) { return } // 未选中类别则退出
				this.setData({
					selectCategory: category.getCategoryByID(value)
				})
			}
		}
	},

    data: {
		categoryArr: [], // 类别数据
		iconArr: [], // 图标数据
		selectCategoryIndex: -1, // 选中的类别index
		selectCategory: {} // 选中的类别信息
    },

	attached: function () {
		app.globalData.tempCategory = wx.getStorageSync('category')
		this.setData({
			categoryArr: wx.getStorageSync('category'), // 设置类别数据
			iconArr: Config.icon // 设置图标数据
		})
	},

    methods: {
		// 点击类别图标
		onTapCategory: function (event) {
			var id = base.getDSet(event, 'id')
			// 如果处于设置页面，再次点击则取消选择
			if (id == this.data.selectCategoryId && app.globalData.currentPage == 'setting') { 
				this.data.selectCategoryId = -1
				this.data.selectCategoryIndex = -1
			} else {
				this.data.selectCategoryId = id
				this.data.selectCategoryIndex = base.getDSet(event, 'index')
			}
			this._RefreshCategory() // 更新类别数据
			this.triggerEvent('TapCategoryIcon', id)// 冒泡点击类别图标事件
		},

		// 更改类别名称
		onChangeName: function (event) {
			var index = this.data.selectCategoryIndex,
				value = event.detail.value.replace(/\s/ig, ''); // 去掉所有空格
			value = base.cutString(value, 7) // 限制类别名称的长度
			if (value == '') { // 如果类别名称为空则自动设为--
				this.data.categoryArr[index].name = '--' 
			} else {
				this.data.categoryArr[index].name = value
			}
			//this.triggerEvent('NoSave', isNoSave) // 冒泡，禁止或允许保存
			this._RefreshCategory() // 更新类别数据
		},

		// 点击左箭头
		onTapLeft: function (event) {
			var index = this.data.selectCategoryIndex
			if (index > 0) { // 当前数组和-1数组互换数据
				this.data.categoryArr = base.swopArrItem(this.data.categoryArr, index, index-1)
				this.data.selectCategoryIndex = index - 1
				this._RefreshCategory()
			} 
		},

		// 点击右箭头
		onTapRight: function (event) {
			var index = this.data.selectCategoryIndex
			if (index < 9) { // 当前数组和+1数组互换数据
				this.data.categoryArr = base.swopArrItem(this.data.categoryArr, index, index + 1)
				this.data.selectCategoryIndex =  index + 1
				this._RefreshCategory()
			} 
		},

		// 点击小图标
		onTapIcon: function (event) {
			var icon = base.getDSet(event, 'icon'),
				index = this.data.selectCategoryIndex
			this.data.categoryArr[index].icon = icon
			this._RefreshCategory()
		},

		// 点击编辑类别按钮
		onTapEdit: function (event) {
			this.setData({
				isEdit: true
			})
			this.triggerEvent('TapCategoryEdit') // 冒泡点击编辑按钮事件
		},

		// 更新类别信息
		_RefreshCategory: function () {
			var index = this.data.selectCategoryIndex
			if (index == -1 ) { // 避免当前未选中类别时报错
				index = 0
			}
			this.setData({
				categoryArr: this.data.categoryArr,
				selectCategoryId: this.data.selectCategoryId,
				selectCategoryIndex: this.data.selectCategoryIndex,
				selectCategory: this.data.categoryArr[index]
			})
			app.globalData.tempCategory = this.data.categoryArr // 更新全局变量
		}
    }
})