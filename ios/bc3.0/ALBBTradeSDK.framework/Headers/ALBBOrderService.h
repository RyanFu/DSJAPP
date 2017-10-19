//
//  ALBBOrderService.h
//  ALBBTradeSDK
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/3/4.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ALBBTradeService.h"
#import "ALBBTradeOrderItem.h"

NS_ASSUME_NONNULL_BEGIN

/** 订单服务 */
@protocol ALBBOrderService <ALBBTradeService>

/**
 打开下单页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param orderItems                  订单请求参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)            showOrder:(UIViewController *)parentController
                   isNeedPush:(BOOL)isNeedPush
            webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                   orderItems:(NSArray<ALBBTradeOrderItem *> *)orderItems
  tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
   tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 以淘客方式打开下单页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param orderItem                   订单请求参数
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)        showTaoKeOrder:(UIViewController *)parentController
                    isNeedPush:(BOOL)isNeedPush
             webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                     orderItem:(ALBBTradeOrderItem *)orderItem
                   taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
   tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
    tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 打开带sku选择页的下单页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆ID
 @param params                      扩展参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)    showOrderWithSku:(UIViewController *)parentController
                  isNeedPush:(BOOL)isNeedPush
           webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                      itemId:(NSString *)itemId
                      params:(nullable NSDictionary *)params
 tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
  tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 以淘客方式打开带sku选择页的下单页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆ID
 @param params                      扩展参数
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showTaoKeOrderWithSku:(UIViewController *)parentController
                   isNeedPush:(BOOL)isNeedPush
            webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                       itemId:(NSString *)itemId
                       params:(nullable NSDictionary *)params
                  taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
  tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
   tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;
@end

NS_ASSUME_NONNULL_END
