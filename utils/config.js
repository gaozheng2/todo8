// 全局常量

class Config {
    constructor() {}
}

// 静态属性，不需要实例化
Config.restUrl = 'https://www.xxxspace.com.cn/todo8/public/api/v1/' //服务器访问地址

Config.errMsg = { // 错误提示信息
	9999: '网络连接错误',
	1000: '服务器错误'
}

Config.repeatArr = [ // 重复类型数组
	['每天'],
	['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
	['1日', '10日', '15日', '20日', '30日', '最后一天']
]

Config.month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

Config.week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Config.icon = [ // 图标文件名称
	"airplane",
	"baby",
	"bag",
	"basketball",
	"battery",
	"beer",
	"bottle",
	"bread",
	"brush",
	"car",
	"card",
	"carrot",
	"cat",
    "clock",
    "coctail",
    "design",
    "dice",
    "doctor",
    "dog",
    "english",
    "food",
    "game",
    "gift",
    "guitar",
    "guru",
    "heart",
    "home",
    "knight",
    "life",
    "mac",
    "map",
    "math",
    "mic",
    "money",
    "movie",
    "music",
    "palm",
    "photo",
    "physics",
    "pig",
    "poker",
	"shopping",
	"sport",
	"student",
	"tea",
	"tv",
	"wallet",
    "wine"
]

Config.pageInfo = { // 页面设置默认参数
    temp: {
        isSee: false, // 默认是否可见已完成事项
        defaultCategory: 10, // 默认分类
        selectCategory: -1 // 选择的分类
    },
    today: {
        isSee: true,
        defaultCategory: 1,
        selectCategory: -1
    },
    plan: {
        isSee: true,
        defaultCategory: 1,
        selectCategory: -1
    }
}

Config.category = [{ // 默认类别数据
    "id": 1,
    "name": "健身",
    "icon": "sport"
}, {
    "id": 2,
    "name": "学习",
    "icon": "student"
}, {
    "id": 3,
    "name": "工作",
    "icon": "mac"
}, {
    "id": 4,
    "name": "生活",
    "icon": "coctail"
}, {
    "id": 5,
    "name": "兴趣",
    "icon": "game"
}, {
    "id": 6,
    "name": "英语",
    "icon": "english"
}, {
    "id": 7,
    "name": "数学",
    "icon": "math"
}, {
    "id": 8,
    "name": "语文",
    "icon": "brush"
}, {
    "id": 9,
    "name": "艺术",
    "icon": "guitar"
}, {
    "id": 10,
    "name": "购物",
    "icon": "shopping"
}]

Config.tempData = [{ // 临时Todo数据
			type: 'temp',
			isDone: false,
            isDelay: false,
            categoryId: 1,
            title: "点击右下角+，添加项目",
            remark: "",
			planTime: "2018-03-07",
			endTime: "2018-06-07",
            repeat: "1"
        },
        {
			type: 'date',
			isDone: false,
            isDelay: true,
            categoryId: 2,
            title: "点击右边方框，标记已完成",
            remark: "",
			planTime: "2018-06-07",
			endTime: "2018-06-11",
			repeat: "11"
        },
        {
			type: 'memory',
			isDone: false,
            isDelay: false,
            categoryId: 3,
            title: "从右向左滑动可以删除",
            remark: "",
			planTime: "2018-06-07",
			endTime: "2018-06-13",
			memory: "4",
            repeat: ""
        },
        {
			type: 'repeat',
			isDone: false,
            isDelay: false,
            categoryId: 4,
            title: "点击右上图标显示已完成项目",
            remark: "",
			planTime: "2018-06-07",
			endTime: "2018-06-07",
            repeat: "17"
        },
        {
			type: 'plan',
			isDone: false,
            isDelay: false,
            categoryId: 5,
            title: "点击项目进入编辑界面",
            remark: "",
			planTime: "2018-06-27",
			endTime: "2018-06-30",
            repeat: "113"
        },
        {
			type: 'temp',
			isDone: false,
            isDelay: true,
            categoryId: 6,
            title: "点击左侧图标筛选类别",
            remark: "",
			planTime: "2018-11-17",
			endTime: "2018-12-07",
            repeat: "101"
        },
		{
			type: 'temp',
			isDone: false,
			isDelay: false,
			categoryId: 7,
			title: "点击上方头像进入设置",
			remark: "",
			planTime: "",
			endTime: "",
			repeat: "132"
		}
    ],

    module.exports = {
        Config
    }