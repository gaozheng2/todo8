// 类别相关操作类
var base = require('base.js'); // 引用公共函数文件
import { Config } from 'config.js'; // 引用全局常量

class Category {
    constructor() {}

    // 请求类别数据，并保存在缓存中
    getCategory() {
        // 优先读取缓存中的类别数据
        var category = wx.getStorageSync('category')
        if (!category) { // 如果缓存中没有数据，则向服务器请求
			wx.setStorageSync('category', Config.category) // 如果服务器未取得数据，则使用默认类别
            var param = {
                url: 'category',
                sCallback: function(data) {
					if (data) { 
                    	wx.setStorageSync('category', data);
					}
                }
            }
            base.request(param);
        }
    }

    // 根据ID，从缓存中获取类别信息
    getCategoryByID(id) {
		var res = {}
        var categoryArr = wx.getStorageSync('category')
        categoryArr.forEach(function(value, index, array) {
            if (value['id'] == id) {
				res = {
					id: id,
					name: value['name'],
					icon: value['icon']
				}
            }
        });
		return res
    }

	// 保存类别信息，到缓存和服务器
	saveCategory(title='') {
		var app = getApp()
		wx.setStorageSync('category', app.globalData.tempCategory)
		var param = {
			url: 'category/edit',
			type: 'post',
			data: {data: app.globalData.tempCategory},
			sCallback: function (data) {
				wx.showToast({
					icon: 'success',
					title: title,
					duration: 1000
				})
			}
		}
		base.request(param);
	}
}

module.exports = {
    Category
}