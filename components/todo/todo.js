// 【待办事项】组件
var base = require('../../utils/base.js'); //引用公共函数文件
import { Category } from '../../utils/category.js';
var category = new Category()
var app = getApp()

Component({
    // 公开属性
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
        isSee: { // 已完成项是否可见
            type: "bool",
			value: true, 
			observer: function (value) { // 数据变化时，判断当前事项是否显示
				this._checkIsShow()
			}
        },
		isEdit:{ // 是否处于编辑模式，编辑模式无法点击框体进入编辑，也无法滑动
			type: "bool",
			value: false, 
		},
		isMoved: { // 是否已滑动
			type: "bool",
			value: false,
			observer: function (value) { // 数据变化时，调用设置按钮显示状态方法
				this._setMoved(value)
			}
		},
		isInMove: { // 是否已经开始滑动
			type: "bool",
			value: false,
			observer: function (value) {
				this.triggerEvent('InMove', value) // 向引用组件冒泡事件，禁止view纵向滚动
			}
		},
		selectCategory: { // 筛选的类别ID
			type: "num",
			value: -1,
			observer: function (value) { // 数据变化时，判断当前事项是否显示
				this._checkIsShow()
			}
		},
        todoData: {
            type: "obj",
            value: {
				type: 'temp', // 事项类型：temp/date/memory/repeat/plan
                isDone: false, // 是否已完成
                isDelay: false, // 是否已推迟
                categoryId: 0, // 类别ID,
                title: "跑步", // 事项内容
                remark: "5km", // 备注
                planTime: "2018-06-07", // 计划完成时间
                endTime: "2018-06-09", // 实际完成时间
                repeat: "1", // 重复类型
            },
			observer: function (value) { // 数据变化时，重新构造内部属性
				this.setData({
					category: category.getCategoryByID(this.data.todoData.categoryId), // 构造内部属性 - category
					showTitle: this._setTitle(), // 构造显示属性，显示的标题
					showPlanTime: this._setTime(this.data.todoData.planTime), // 显示的计划完成时间
					showEndTime: this._setTime(this.data.todoData.endTime), // 显示的实际完成时间
					showDelay: this._setDelay(), // 显示是否延迟完成
					showRepeat: this._setRepeat() // 显示的重复类型
				})
				this._checkIsShow() // 判断是否可显示
			}
        }
    },

    // 私有数据
    data: {
		slideWidth: 150, // 最小滑动距离，单位rpx
		category: {
			id: 0, // 类别ID
			name: '默认类别', // 类别名称
			icon: 'carrot' // 类别图标
		},
		memoryArr: [ // 记忆周期数组
			1, 2, 4, 7, 30, 60, 90
		],
		isShow: true, // 是否显示
		noTitle: false, // 无标题，则提示
        showTitle: '', // 事项内容+备注
		showPlanTIme: '', // 显示的计划完成时间
		showEndTime: '', // 显示的实际完成时间
		showDelay: false, // 显示是否延迟完成
        showRepeat: '每天', // 显示的重复类型
		isShowCopy: true, // 是否显示copy按钮，不显示delay按钮
    },

	// 构造函数
	attached: function () {
		if (app.globalData.currentPage == 'today') { // 设置是否显示copy按钮
			this.setData({
				 isShowCopy: false
			})
		}
	},

    // 组件方法
    methods: {
        // 点击Todo框体
        onTapTodo: function(event) {
			if (this.data.isEdit) { // 如果处于编辑模式，则退出
				this.triggerEvent('TapTodo') // 冒泡点击框体事件
				return
			}
            if (this.data.isMoved) { // 如果处于已滑动状态，则复原
                this.setData({
                    isMoved: false
                })
            } else {
                if (!this.data.noTap) { // 如果可以点击，则进入Todo编辑页面
					app.globalData.editData = this.data.todoData // 将待编辑数据保存
                    wx.navigateTo({
                        url: '/pages/edit/edit?from=' + app.globalData.currentPage + '&method=edit&type=' + this.data.todoData.type + '&index=' + this.data.index,
                    })
                }
            }
        },

        // 点击完成框
        onTapCheck: function(event) {
            if (this.data.isMoved) { //如果处于已滑动状态，则复原
                this.setData({
                    isMoved: false
                })
            } else {
                if (!this.data.noTap) { // 如果可以点击，则设置完成状态
                    this.data.todoData.isDone = !this.data.todoData.isDone
					if (this.data.todoData.isDone) { // 如果为已完成，更新完成时间
						this.data.todoData.endTime = base.formatDate(new Date())
					}
					this.setData({ // 更新todo数据
                        todoData: this.data.todoData,
						showEndTime: this._setTime(this.data.todoData.endTime), // 显示的实际完成时间
						showDelay: this._setDelay(), // 显示是否延迟完成
                    })
					this._checkIsShow() // 检查自身是否可见
                    wx.vibrateShort() //手机振动
					var res = {
						index: this.data.index,
						isDone: this.data.todoData.isDone,
						endTime: this.data.todoData.endTime
					}
					this.triggerEvent('CheckTodo', res) // 冒泡点击事件，改写数据，并检查是否显示提示文字
                }
            }
        },

		// 点击类别图标
		onTapCategory: function (event) {
			var that = this
			var query = wx.createSelectorQuery().in(this)
			query.select('.todo-container').boundingClientRect()
			query.exec(function (res) {
				var top = res[0].top - base.getElePx(120)
				if (top < 0) {
					top = 10
				} else if (top > wx.getSystemInfoSync().windowHeight - base.getElePx(270)) {
					top = wx.getSystemInfoSync().windowHeight - base.getElePx(300)
				}
				that.triggerEvent('TapCategoryTodo', top) // 冒泡点击事件，在当前位置弹出类别筛选框
			})
		},

		// 点击拷贝按钮
		onTapCopy: function () {
			app.globalData.editData = this.data.todoData // 将待新建数据保存
			wx.navigateTo({ // 跳转到新建界面
				url: '/pages/edit/edit?from=' + app.globalData.currentPage + '&method=copy&type=' + this.data.todoData.type,
			})
		},

        // 点击删除按钮
        onTapDel: function (event) {
			if (this.data.isEdit) { // 如果处于编辑模式，则退出
				return
			}
            var that = this
            // 弹出确认框
            wx.showActionSheet({
                itemList: ['确认删除'],
                itemColor: '#ff0000',
                success: function(res) {
                    if (res.tapIndex == 0) { // 如果确认删除
                        that.triggerEvent('TapDel', that.data.index) // 向引用组件冒泡点击删除事件
                    }
                },
                complete: function(res) { // 无论成功失败都调用
					that.triggerEvent('ReMoved') // 向引用组件冒泡重置滑动状态事件
					app.globalData.isMoved[app.globalData.currentPage] = false // 设置全局变量，当前页没有已滑动的事项组件
                }
            })
        },

        // 手指接触屏幕触发
        onTouchS: function(e) {
			if (this.data.isEdit) { // 如果处于编辑模式，则退出
				return
			}
            // 如果自身不处于已滑动状态，且有其他组件处于已滑动状态，复原所有已滑动组件
            var otherMoved = app.globalData.isMoved[app.globalData.currentPage]
            if (otherMoved && !this.data.isMoved) {
                this.triggerEvent('ReMoved') // 向引用组件冒泡事件
                this.data.noTap = true // 此时不可执行点击事件
            } else {
                this.data.noTap = false // 可以执行点击事件
            }
            if (e.touches.length == 1) { // 判断是否只有一个触摸点
                this.data.preStartX = e.touches[0].clientX // 记录触摸起始位置的X坐标
            }
        },

        // 触摸移动时触发，手指在屏幕上每移动一次，触发一次
        onTouchM: function(e) {
			if (this.data.isEdit) { // 如果处于编辑模式，则退出
				return
			}
			if (app.globalData.isScroll) { // 如果滚动view处于滚动状态，则退出
				return
			}
            if (e.touches.length == 1) {
                var moveX = e.touches[0].clientX; // 记录触摸点位置的X坐标

                // 如果移动未开始，且移动超过30rpx，则判为移动开始，记录起始点X坐标
                if (!this.data.isInMove) { // 判断滑动阈值
                    if (!this.data.isMoved) { //如果处于未滑动状态，则可以向左滑
                        if (this.data.preStartX - moveX > 30) {
                            this.data.startX = moveX // 设置移动起始坐标
                            this.setData({
                                isInMove: true // 移动开始
                            })
                        }
                    } else { // 如果处于已滑动状态，则可以向右滑
                        if (moveX - this.data.preStartX > 30) {
                            this.data.startX = moveX
                            this.setData({
                                isInMove: true
                            })
                        }
                    }
                } else {
                    // 如果移动已开始，则计算X坐标差值，设置组件属性
                    if (!this.data.isMoved) { // 左滑
                        var disX = this.data.startX - moveX,
                            slideWidth = this.data.slideWidth,
                            disPx = base.getElePx(disX) // 计算rpx对应的像素
                        if (disX > 0) { // 移动距离大于0，文本层left值等于手指移动距离
                            var txtStyle = "left:-" + disPx + "px";
                            if (disX > slideWidth) { // 控制手指移动距离最大值
                                var setPx = base.getElePx(slideWidth)
                                txtStyle = "left:-" + setPx + "px";
                            }
                            this.setData({ //更新格式
                                txtStyle: txtStyle
                            });
                        }
                    } else { // 右滑
                        var disX = moveX - this.data.startX,
                            slideWidth = this.data.slideWidth,
                            disPx = base.getElePx(slideWidth - disX)

                        if (disX > 0) {
                            var txtStyle = "left:-" + disPx + "px";
                            if (disX > slideWidth) { // 控制手指移动距离最大值
                                var setPx = base.getElePx(slideWidth)
                                txtStyle = "left:0px";
                            }
                            this.setData({
                                txtStyle: txtStyle
                            });
                        }
                    }
                }
            }
        },

        // 触摸结束时触发
        onTouchE: function(e) {
			if (this.data.isEdit) { // 如果处于编辑模式，则退出
				return
			}
            if (!this.data.isInMove) { //如果没开始移动，则取消操作
                return
            }
            if (e.changedTouches.length == 1) {
                var endX = e.changedTouches[0].clientX,
                    disX = this.data.startX - endX,
                    slideWidth = this.data.slideWidth,
                    txtStyle = '',
                    isMoved = this.data.isMoved
                // 如果滑动距离大于设定宽度/2，则设置处于已滑动状态，否则复原
                if (((disX < slideWidth / 2) && !isMoved) || ((disX < -slideWidth / 2) && isMoved)) {
                    isMoved = false
                    txtStyle = "left:0px"
                } else {
                    var setPx = base.getElePx(this.data.slideWidth)
                    isMoved = true
                    txtStyle = "left:-" + setPx + "px"
                }
                this.setData({
                    isMoved: isMoved, // 是否已滑动
                    txtStyle: txtStyle, // 组件样式
                    isInMove: false // 移动结束
                });
            }
        },

        // 设置是否处于已滑动状态
        _setMoved: function(mStatus) {
            var txtStyle = '', // 滑动格式
                setPx = base.getElePx(this.data.slideWidth), // 滑动像素
                index = -1 // 组件索引值

            if (mStatus) { // 处于已滑动状态
                txtStyle = "left:-" + setPx + "px"
                index = this.data.index
            } else { // 未处于已滑动状态
                txtStyle = "left:0px"
            }
            this.setData({ // 绑定数据
                txtStyle: txtStyle
            })
            // 设置全局变量状态
            app.globalData.isMoved[app.globalData.currentPage] = mStatus
        },

        // 构造标题
        _setTitle: function() {
            var content = ''
			if (this.data.todoData.title) { // 如果有标题
				if (this.data.todoData.remark) { // 如果有备注，截取过长字符，增加...）
					content = base.cutString(this.data.todoData.title, 24, '')
					content = content + '（' + this.data.todoData.remark + '）'
					content = base.cutString(content, 28, '...）')
				} else { // 如果没有备注，截取标题，增加...
					content = base.cutString(this.data.todoData.title, 30, '')
				}
				this.data.noTitle = false
			} else { // 如果没有标题
				content = '未命名'
				this.data.noTitle = true
			}
            this.setData({
				noTitle: this.data.noTitle
			})
            return content
        },

		// 构造日期
		_setTime: function (time) {
			if (!time) { // 如果没有参数，则返回临时
				return '临时'
			}
			var date = new Date(Date.parse(time.replace(/-/g, "/"))) // 字符串转换为日期格式
			var month = date.getMonth() + 1
			var day = date.getDate()
			return month + '月' + day
		},

		// 构造是否延迟
		_setDelay: function () {
			var pTime = base.formatDate(new Date(this.data.todoData.planTime.replace(/\-/g, "\/"))),
				today = base.formatDate(new Date())
			if (pTime && pTime < today) {
				return true
			} else {
				return false
			}
		},

        // 构造repeat
        _setRepeat: function () {
			if (!this.data.todoData.repeat) { // 如果没有重复周期，则返回空
				return ''
			}
			var weekArr = ['一', '二', '三', '四', '五', '六', '日',],
				repeat = this.data.todoData.repeat,
				result = '每天'
			if (repeat > 10 && repeat < 100) { // 每周
				var week = repeat - 11
				result = '每周' + weekArr[week]
			} else if (repeat > 100) { //每月
				if (repeat > 131) { // 最后一天
					result = '每月最后一天'
				} else {
					var day = repeat - 100
					result = '每月' + day + '日'
				}
			}
			return result
        },

		// 判断是否可显示
		_checkIsShow: function () {
			var isShow = true
			if (this.data.todoData.isDone && !this.data.isSee) { // 如果不显示已完成项，且此项已完成，则不显示此项
				isShow = false
			} else if (this.data.selectCategory != -1) { // 如果筛选了类别，且当前事项类别与筛选类别不一致，则不显示此项
				if (this.data.selectCategory != this.data.todoData.categoryId) {
					isShow = false
				}
			}
			
			this.setData({
				isShow: isShow
			})
		}
    },

})