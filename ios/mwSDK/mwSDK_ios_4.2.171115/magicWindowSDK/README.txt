重要!
mwSDK-bitcode支持bitcode,mwSDK不支持bitcode,请开发者自行取舍

SDK 4.1.0
1.新增信息流广告，提供多种形式的信息流广告原生控件，方便开发者集成到自家App的信息流中
	(1)需要在工程中链接ImageIO.framework

SDK 4.0.170606
1.修复部分iOS7-iOS8.1.0系统崩溃bug

SDK 4.0
1.魔窗位增加第三方ssp广告功能
2.优化sdk底层的整体架构
3.魔窗位交互更人性化
4.魔窗位上广告和活动提供单独的曝光接口用于统计

SDK 3.9.170410
1.修复部分iOS8系统崩溃bug

SDK 3.9.170116
1.优化iOS9以上的跳转体验，通过universal link唤起app，点击右上角mlinks.cc，universal link不会被关闭

SDK 3.9.161205
1. 更新支持iOS启用ATS(App Transport Security)
2. 更新微信SDK 1.7.5
	（1）需要在工程中链接Security.framework，CFNetwork.framework
	（2）在工程配置中的”Other Linker Flags”中加入”-Objc -all_load”
3. 在iOS8+使用WKWebView替换掉UIWebView，需要在工程中链接WebKit.framework