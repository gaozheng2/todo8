// 【新建/编辑事项】页面
var base = require('../../utils/base.js')
import { Config } from '../../utils/config.js'
import { Theme } from '../../theme/theme.js'
import { Category } from '../../utils/category.js'
var theme = new Theme()
var category = new Category()
var app = getApp()

Page({
	data: {
		theme: { // 设置主题
			name: "default",
			iurl: "default",
			iurl2: "default",
			curl: "default"
		},
		todoData: { // 事项数据
			type: 'date',
			isDone: false,
			isDelay: false,
			categoryId: 1,
			title: "",
			remark: "",
			planTime: "",
			endTime: "",
			memory: "",
			repeat: ""
		},
		memoryArr: [ // 记忆周期数组
			1, 2, 4, 7, 30, 60, 90
		],
		memoryIndex: 0, // 选择的记忆周期索引

		repeatArr: [ // 重复类型选择器数组
			['每天', '每周', '每月'],
			['每天']
		],
		repeatIndex: [0, 0], // 选择的重复类型索引
		repeatMonth: [1, 10, 15, 20, 30, 32], // 可选择的每月日期，32代表最后一天

		from: 'temp', // 请求来自的页面
		method: 'new', // 操作类型：新建/编辑/拷贝
		editIndex: -1, // 编辑的事项索引值或ID
		selectCategoryId: -1, // 选中的类别ID，传递给set-category控件
		todoType: 'temp', // 事项类型，temp/date/memory/repeat/plan
		
		isShowAdd: true, // 是否显示+按钮
		isShowSave: true, // 是否显示保存按钮
		isShowTitle: true, // 是否显示标题
		isShowPlanTime: true, // 是否显示计划日期
		isShowMemory: true, // 是否显示记忆周期
		isShowRepeat: true, // 是否显示重复类型
		isShowCategory: false, // 是否显示类别

		isEditPlanTime: true, // 是否隐藏计划日期radio
		isEditRepeat: true, // 是否可以编辑重复周期
		isEditCategory: false, // 是否处于编辑类别模式下

		isCheckPlanTime: false, // 是否勾选计划日期
		isCheckMemory: false, // 是否勾选记忆周期

		naviTitle: '编辑事项', // 导航栏标题
		startTime: '', // 时间拾取器的起始时间
		tempPlanTime: '', // 临时存储计划日期
		tempMemory: '', // 临时存储记忆周期
		y: 0, // 类别设置框的坐标
		focus: false // 标题输入框获取焦点
	},

	onLoad: function (options) {
		base.getNetStatus() // 检测网络状态
		theme.setNavBar() // 重置导航栏颜色
		app.globalData.currentPage = 'edit' // 设置当前页面
		this.animation = wx.createAnimation() // 初始化动画
		this.setData({
			theme: wx.getStorageSync('theme'), // 设置主题
			from: options.from // 设置from页面
		})

		console.log(options)
		// 根据新建/编辑/复制执行响应操作
		this.data.method = options.method // 操作类型：新建/编辑/拷贝
		switch (options.method) {
			case 'new':
				var categoryId = wx.getStorageSync('pageInfo')[options.from].defaultCategory // 读取当前页的默认类别
				this._setNew(options.from, categoryId) // 设置新建属性
				break
			case 'edit':
				this.data.naviTitle = '编辑' // 设置标题
				this.data.editIndex = options.index // 设置索引值，用于保存
				this.data.todoData = app.globalData.editData // 读取编辑事项的内容
				break
			case 'copy':
				this.data.naviTitle = '新建' // 设置标题
				this.data.editIndex = -1 // 索引值为-1，代表新建
				this.data.todoData = app.globalData.editData // 读取拷贝事项的内容
		}
		this._setType(options.type) // 根据类型设置控件
	},

	// 设置新建属性
	_setNew: function (fromPage, categoryId) {
		this.data.naviTitle = '新建' // 设置标题
		this.data.editIndex = -1 // 索引值为-1，代表新建
		if (fromPage != 'temp') { // 如果不是temp页，则计划日期设置为当前日期
			this.data.todoData.planTime = base.formatDate(new Date())
		} else {
			this.data.todoData.planTime = ''
		}
		this.data.todoData.title = ''
		this.data.todoData.remark = ''
		this.data.todoData.categoryId = categoryId // 选择该页面的默认类别
		this.setData({
			isShowAdd: false, // 隐藏+按钮
			isShowSave: false, // 隐藏保存按钮
			focus: true // 标题输入框获取焦点
		})
	},

	// 根据todo类型，设置控件
	_setType: function (todoType) {
		this.data.todoType = todoType
		this.data.todoData.type = todoType
		switch (todoType) {
			case 'temp':
				if (this.data.todoData.planTime) {
					var c1 = true
				} else {
					var c1 = false
				}
				this._setParams('临时事项', true, true, false, false,      true, false, c1, false)
				break
			case 'date':
				this._setParams('事项', true, true, true, false,          false, false, true, false)
				break
			case 'memory':
				this._setParams('事项', true, true, true, false,          false, false, true, true)
				this.setData({
					memoryIndex: this.data.todoData.memory // memory类型，设置记忆周期
				})
				break
			case 'repeat':
				this._setParams('规划事项',false, false, false, true,      true, false, true, false)
				this.setData({
					isShowAdd: false, // repeat类型，不显示+按钮
				})
				this._setRepeat()
				break
			case 'plan':
				this._setParams('规划', true, false, false, true,         true, true, true, false)
				this._setRepeat()
				break
		}
	},

	// 设置控件属性
	_setParams: function (title, s1, s2, s3, s4, e1, e2, c1, c2) {
		wx.setNavigationBarTitle({ // 设置导航栏标题
			title: this.data.naviTitle + title
		})
		this.setData({
			isShowTitle: s1, // 是否显示标题
			isShowPlanTime: s2, // 是否显示计划日期
			isShowMemory: s3, // 是否显示记忆周期
			isShowRepeat: s4, // 是否显示重复类型
			
			isEditPlanTime: e1, // 是否不隐藏计划日期radio
			isEditRepeat: e2, // 是否可以编辑重复周期

			isCheckPlanTime: c1, // 是否勾选计划日期
			isCheckMemory: c2, // 是否勾选记忆周期

			todoData: this.data.todoData, // 事项数据
			selectCategoryId: this.data.todoData.categoryId, // 当前类别
		})
	},

	// 设置重复周期属性
	_setRepeat: function () {
		var repeat = this.data.todoData.repeat,
			index1 = 0,
			index2 = 0
		if (repeat > 10 && repeat < 100) { // 每周
			index1 = 1
			index2 = repeat - 11
		} else if (repeat > 100) { //每月
			index1 = 2
			if (repeat > 131) { // 最后一天
				index2 = 5
			} else {
				switch (repeat) {
					case 101:
						index2 = 0
						break
					case 110:
						index2 = 1
						break
					case 115:
						index2 = 2
						break
					case 120:
						index2 = 3
						break
					case 130:
						index2 = 4
						break
				}
			}
		}
		this.data.repeatArr[1] = Config.repeatArr[index1] // 设置二级菜单
		this.setData({
			repeatArr: this.data.repeatArr,
			repeatIndex: [index1, index2],
		})
	},

	// 响应Todo组件的tap事件
	onTapTodo: function () {
		this.setData({ // 标题输入框获得焦点
			focus: true
		})
	},

	// 响应Todo组件的check事件
	onCheckTodo: function (event) {
		this.data.todoData.isDone = event.detail.isDone
		this.data.todoData.endTime = event.detail.endTime
	},

	// 响应Todo组件的tapCategoryTodo
	onTapCategoryTodo: function () {
		if (this.data.todoType == 'repeat') { // repeat类型不能选择类别
			return
		}
		this.setData({
			isShowCategory: !this.data.isShowCategory
		})
	},

	// 响应set-category组件的tapIcon事件
	onTapCategoryIcon: function (event) {
		this.data.todoData.categoryId = event.detail
		this.setData({
			todoData: this.data.todoData,
			selectCategoryId: event.detail
		})
	},

	// 响应set-category组件的tapEdit事件
	onTapCategoryEdit: function () {
		var that = this
		this.setData({ // 进入编辑状态
			isEditCategory: true,
		})
		// 计算set-category组件距离顶端的距离，动画移动组件
		var query = wx.createSelectorQuery()
		query.select('.box-top').boundingClientRect()
		query.select('.set-category').boundingClientRect()
		query.exec(function (res) {
			if (!res[0]||!res[1]) { return }
			that.data.y = res[0].bottom - res[1].top + 1
			that.animation.translateY(that.data.y).step() // 执行移动动画
			that.setData({ animation: that.animation.export() }) 
		})	
		wx.setNavigationBarTitle({ // 改变导航栏标题
			title: '编辑类别'
		})
	},

	// 点击saveCategory按钮
	onTapSaveCategory: function () {
		var that = this
		category.saveCategory('类别保存成功') // 保存类别数据
		this.animation.translateY(0).step()
		this.setData({
			animation: this.animation.export(), // 执行移动动画
			todoData: that.data.todoData // 更新事项的类别显示
		})
		setTimeout(function () { // 延迟400ms调用
			that.setData({ // 退出编辑状态
				isEditCategory: false,
			})
		}, 400)
	},

	// 更改标题内容
	onChangeTitle: function (event) {
		var value = event.detail.value.replace(/\s/ig, ''); // 去掉所有空格
		value = base.cutString(value, 30) // 限制类别名称的长度
		if (value == '') { // 如果类别名称为空则隐藏保存按钮
			var isShowAdd = false,
				isShowSave = false
		} else {
			var isShowAdd = true,
				isShowSave = true
		}
		this.data.todoData.title = value
		this.setData({ // 更新todo数据
			isShowAdd: isShowAdd,
			isShowSave: isShowSave,
			todoData: this.data.todoData
		}) 
	},

	// 更改备注内容
	onChangeRemark: function (event) {
		var value = event.detail.value.replace(/\s/ig, ''); // 去掉所有空格
		value = base.cutString(value, 40) // 限制类别名称的长度
		this.data.todoData.remark = value
		this.setData({ // 更新todo数据
			todoData: this.data.todoData
		})
	},

	// 点击计划日期按钮
	onTapPlanTime: function () {
		var isCheck = !this.data.isCheckPlanTime
		if (isCheck) { // 如果有计划日期，则默认为当前日期
			if (this.data.tempPlanTime) { // 如果有临时日期，则设置为临时日期
				this.data.todoData.planTime = this.data.tempPlanTime
			} else { // 如果没有临时日期，则设置为当前日期
				var date = base.formatDate(new Date())
				this.data.todoData.planTime = date
			}
		} else { // 如果没有计划日期，则清空
			this.data.tempPlanTime = this.data.todoData.planTime,
			this.data.todoData.planTime = ''
		}
		this.setData({
			isCheckPlanTime: isCheck,
			todoData: this.data.todoData
		})
	},

	// 更改计划日期
	onChangePlanTime: function (e) {
		var date = base.formatDate(new Date())
		this.data.todoData.planTime = e.detail.value
		this.setData({
			startTime: date, // 设置时间拾取器起始时间为当天
			todoData: this.data.todoData
		})
	},

	// 点击记忆周期按钮
	onTapMemory: function () {
		var isCheck = !this.data.isCheckMemory
		if (isCheck) { // 如果选中记忆周期
			if (this.data.tempMemory) { // 如果有临时记忆天数，则设置为临时记忆天数
				this.data.todoData.memory = this.data.tempMemory
			} else { // 如果没有临时记忆天数，则设置为第1天
				this.data.todoData.memory = 0
			}
			this.data.todoData.type = 'memory' // 切换数据类型
		} else { // 如果不选记忆周期，则记录临时记忆天数
			this.data.tempMemory = this.data.todoData.memory
			this.data.todoData.type = 'date' // 切换数据类型
		}
		this.setData({
			isCheckMemory: isCheck,
			todoData: this.data.todoData
		})
	},

	// 点击记忆周期子项目
	onTapMemoryItem: function (e) {
		var index = base.getDSet(e, 'index')
		this.data.todoData.memory = index
		this.setData({
			memoryIndex: index,
			todoData: this.data.todoData
		})
	},

	// 更改重复周期
	onChangeRepeat: function (e) {
		if (!e.detail.value[1]) { // 避免出现null情况
			e.detail.value[1] = 0
		}
		// 设置todo组件的repeat值
		if (e.detail.value[0] == 2) { // 如果选择了每月，则repeat值为100+对应的日期
			this.data.todoData.repeat = 100 + this.data.repeatMonth[e.detail.value[1]]
		} else { // 如果选择了每天，则repeat值为1；如果选择了每周，则repeat值为11-17
			this.data.todoData.repeat = 10 * e.detail.value[0] + (e.detail.value[1] + 1)
		}
		this.setData({
			repeatIndex: e.detail.value,
			todoData: this.data.todoData
		})
	},

	// 更改重复周期选择器的列
	onChangeRepeatColumn: function (e) {
		if (e.detail.column == 0) { // 如果改变的是第一列，变换第二列的显示内容
			this.data.repeatArr[1] = Config.repeatArr[e.detail.value]
			this.data.repeatIndex = [e.detail.value, 0]
			this.setData({
				repeatArr: this.data.repeatArr,
				repeatIndex: this.data.repeatIndex
			});
		}
	},

	// 点击save按钮
	onTapSave: function () {
		this._saveTodo() // 保存事项
		setTimeout(function () { // 延迟400ms调用
			wx.showToast({
				title: '保存成功',
				duration: 1000
			})
		}, 400)
		wx.navigateBack() // 返回上一页
	},

	// 点击+按钮
	onTapAdd: function () {
		// 保存当前事项
		this._saveTodo()
		wx.showToast({
			icon: 'none',
			title: '保存成功',
			duration: 1000
		})
		
		// 执行new操作
		this._setNew(this.data.todoType, this.data.selectCategoryId)
		this._setType(this.data.todoType)
		//wx.clearStorageSync() // 清除全部缓存
	},

	// 保存事项内容
	_saveTodo: function () {
		// 保存from页面的默认类别
		var pageInfo = wx.getStorageSync('pageInfo')
		pageInfo[this.data.from].defaultCategory = this.data.selectCategoryId
		wx.setStorageSync('pageInfo', pageInfo)
		// 保存
		if (this.data.method == 'edit') { // 编辑事项的保存
			switch (this.data.todoData.type) {
				case 'temp': // 临时类型，根据index写入缓存
					
					break;
				case 'repeat':
					// 向服务器发送请求
					break;
				case 'plan':
					// 向服务器发送请求
					break;
				default: // date+memory
					// 向服务器发送请求
					
			}
			var index = this.data.editIndex,
				todoArr = wx.getStorageSync('tempData')
			todoArr[index] = this.data.todoData
			wx.setStorageSync('tempData', todoArr)
		} else { // 新建事项的保存
			switch (this.data.todoData.type) {
				case 'temp': // 临时类型，写入缓存
					var todoArr = wx.getStorageSync('tempData')
					todoArr.push(this.data.todoData)
					wx.setStorageSync('tempData', todoArr)
					break;
				case 'repeat':
					// 向服务器发送请求
					break;
				case 'plan':
					// 向服务器发送请求
					break;
				default:
				// 向服务器发送请求
			}
		}
	},
})