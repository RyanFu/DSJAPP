//
//  ALBBTradeService.h
//  ALBBTradeSDK
//  电商接口基础service
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/3/4.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <ALBBSDK/TaeWebViewUISettings.h>
#import "ALBBTradePage.h"
#import "ALBBTradeResult.h"
#import "ALBBTradeTaokeParams.h"

NS_ASSUME_NONNULL_BEGIN

/** 回调定义 */
typedef void (^tradeProcessSuccessCallback)(ALBBTradeResult * __nullable result);
typedef void (^tradeProcessFailedCallback)(NSError * __nullable error);

/** 交易服务 */
@protocol ALBBTradeService <NSObject>
/**
 使用百川SDK的webview打开page，可以实现淘宝账号免登以及电商交易支付流程
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param page                        页面请求
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程中发生支付的成功回调
 @param tradeProcessFailedCallback  交易流程中退出或者调用发生错误的回调
 */
- (void)                show:(UIViewController *)parentController
                  isNeedPush:(BOOL)isNeedPush
           webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                        page:(ALBBTradePage *)page
                 taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
 tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
  tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;
@end

NS_ASSUME_NONNULL_END
