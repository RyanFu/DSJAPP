//
//  ALBBItemService.h
//  ALBBTradeSDK
//  电商接口 商品详情service
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/3/4.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ALBBTradeService.h"

NS_ASSUME_NONNULL_BEGIN

/** 商品服务 */
@protocol ALBBItemService <ALBBTradeService>
/**
 打开指定地址网页, 自动实现淘宝安全免登.
 @param parentController    当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush          若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param openUrl             页面的url或者url变量
 @param webViewUISettings   可以自定义的webview配置项
 */
- (void)showPage:(UIViewController *)parentController
      isNeedPush:(BOOL)isNeedPush
         openUrl:(NSString *)openUrl;

/**
 打开指定地址网页, 自动实现淘宝安全免登.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param pageUrl                     页面的url或者url变量
 @param webViewUISettings           可以自定义的webview配置项
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)            showPage:(UIViewController *)parentController
                  isNeedPush:(BOOL)isNeedPush
                     pageUrl:(NSString *)pageUrl
           webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
 tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
  tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 通过商品真实ID打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品真实ID(ItemID)
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showItemDetailByItemId:(UIViewController *)parentController
                    isNeedPush:(BOOL)isNeedPush
             webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                        itemId:(NSNumber *)itemId
                      itemType:(NSInteger)itemType
                        params:(nullable NSDictionary *)params
   tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
    tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 通过商品混淆ID打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆Id(OpenID)
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showItemDetailByOpenId:(UIViewController *)parentController
                    isNeedPush:(BOOL)isNeedPush
             webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                        itemId:(NSString *)itemId
                      itemType:(NSInteger)itemType
                        params:(nullable NSDictionary *)params
   tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
    tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 通过商品真实ID以淘客方式打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品真实ID(ItemID)
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showTaoKeItemDetailByItemId:(UIViewController *)parentController
                         isNeedPush:(BOOL)isNeedPush
                  webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                             itemId:(NSNumber *)itemId
                           itemType:(NSInteger)itemType
                             params:(nullable NSDictionary *)params
                        taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
        tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
         tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 通过商品混淆ID以淘客方式打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆Id(OpenID)
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showTaoKeItemDetailByOpenId:(UIViewController *)parentController
                         isNeedPush:(BOOL)isNeedPush
                  webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                             itemId:(NSString *)itemId
                           itemType:(NSInteger)itemType
                             params:(nullable NSDictionary *)params
                        taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
        tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
         tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;
@end

NS_ASSUME_NONNULL_END
