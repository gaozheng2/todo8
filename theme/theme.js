// 主题常量

class Theme {
	constructor() {	}

	// 设置主题
	setTheme(name, isTry = false) { // isTry:是否预览主题，不保存
		if (!name) { // 如果参数为空，则设置当前主题
			name = wx.getStorageSync('theme')['name']
		}
		var themeData = Theme.data[name]
		if (!themeData) { // 如果没有主题参数则设为默认
			name = 'default'
			themeData = Theme.data['default']
		}
		// 设置导航条
		wx.setNavigationBarColor({
			frontColor: themeData.window.navigationBarTextStyle,
			backgroundColor: themeData.window.navigationBarBackgroundColor,
		})
		// 设置tabBar
		wx.setTabBarStyle({
			color: themeData.tabBar.color,
			selectedColor: themeData.tabBar.selectedColor,
			backgroundColor: themeData.tabBar.backgroundColor,
			borderStyle: themeData.tabBar.borderStyle
		})
		wx.setTabBarItem({
			index: 0,
			text: '临时',
			iconPath: 'imgs/toolbar/' + themeData.turl + '/temp.png',
			selectedIconPath: 'imgs/toolbar/' + themeData.turl + '/temp@select.png'
		})
		wx.setTabBarItem({
			index: 1,
			text: '今日',
			iconPath: 'imgs/toolbar/' + themeData.turl + '/today.png',
			selectedIconPath: 'imgs/toolbar/' + themeData.turl + '/today@select.png'
		})
		wx.setTabBarItem({
			index: 2,
			text: '规划',
			iconPath: 'imgs/toolbar/' + themeData.turl + '/plan.png',
			selectedIconPath: 'imgs/toolbar/' + themeData.turl + '/plan@select.png'
		})
		if (!isTry) { // 如果不是预览，则写入缓存
			wx.setStorageSync('theme', themeData)
		}
	}

	// 设置导航栏颜色
	setNavBar(name) {
		if (!name) { // 如果参数为空，则设置当前主题
			name = wx.getStorageSync('theme')['name']
		}
		var themeData = Theme.data[name]
		if (!themeData) { // 如果没有主题参数则设为默认
			name = 'default'
			themeData = Theme.data['default']
		}
		// 设置导航条
		wx.setNavigationBarColor({
			frontColor: themeData.window.navigationBarTextStyle,
			backgroundColor: themeData.window.navigationBarBackgroundColor,
		})
	}
}

Theme.data = { // 主题参数
	"default": {
		"name": "default", // 主题css名称
		"title": "经典76", // 主题显示名称
		"iurl": "default", // 主题图标路径
		"iurl2": "default", // 主题需替换的图标路径
		"turl": "default", // 主题tab图标路径
		"curl": "default", // 主题类别图标路径
		"window": {
			"backgroundTextStyle": "light", // 背景文字样式
			"backgroundColor": "#1B3643", // 背景颜色
			"navigationBarBackgroundColor": "#1B3643", // 导航栏背景颜色
			"navigationBarTextStyle": "#ffffff" // 导航栏文字颜色
		},
		"tabBar": {
			"borderStyle": "white", // 菜单栏边框样式
			"backgroundColor": "#1B3643", // 菜单栏背景颜色
			"color": "#FFFFFF", // 菜单栏文字颜色
			"selectedColor": "#FDCB01" // 菜单栏当前页文字颜色
		}
	},

	"mercy": {
		"name": "mercy", 
		"title": "粉红天使", 
		"iurl": "mercy", 
		"iurl2": "mercy", 
		"turl": "mercy", 
		"curl": "mercy", 
		"window": {
			"backgroundTextStyle": "dark",
			"backgroundColor": "#FFF7F1",
			"navigationBarBackgroundColor": "#FFF7F1",
			"navigationBarTextStyle": "#000000"
		},
		"tabBar": {
			"borderStyle": "white",
			"backgroundColor": "#FFF7F1",
			"color": "#FAB0C1",
			"selectedColor": "#F56A91"
		}
	},

	"genji": {
		"name": "genji", 
		"title": "清凉源氏", 
		"iurl": "default",
		"iurl2": "genji", 
		"turl": "genji",
		"curl": "default", 
		"window": {
			"backgroundTextStyle": "light",
			"backgroundColor": "#54A7A6",
			"navigationBarBackgroundColor": "#54A7A6",
			"navigationBarTextStyle": "#ffffff"
		},
		"tabBar": {
			"borderStyle": "white",
			"backgroundColor": "#54A7A6",
			"color": "#80BDBC",
			"selectedColor": "#FFFFFF"
		}
	},

	"windowmaker": {
		"name": "windowmaker", 
		"title": "魅惑百合",
		"iurl": "default",
		"iurl2": "default", 
		"turl": "windowmaker",
		"curl": "default",
		"window": {
			"backgroundTextStyle": "light",
			"backgroundColor": "#5F4D87",
			"navigationBarBackgroundColor": "#5F4D87",
			"navigationBarTextStyle": "#ffffff"
		},
		"tabBar": {
			"borderStyle": "white",
			"backgroundColor": "#5F4D87",
			"color": "#9785AD",
			"selectedColor": "#FFFFFF"
		}
	}
}

module.exports = { Theme }