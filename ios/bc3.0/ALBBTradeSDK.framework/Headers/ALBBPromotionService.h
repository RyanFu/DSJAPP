//
//  ALBBPromotionService.h
//  ALBBTradeSDK
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/3/4.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ALBBTradeService.h"

NS_ASSUME_NONNULL_BEGIN

/** 促销服务 */
@protocol ALBBPromotionService <ALBBTradeService>
/**
 打开优惠券页面
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param param                       参数. type为shop时, param为卖家nick; type为auction时, param为商品的混淆ID.
 @param type                        类型. 取值为shop或auction.
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)        showPromotions:(UIViewController *)parentController
                    isNeedPush:(BOOL)isNeedPush
             webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                         param:(NSString *)param
                          type:(NSString *)type
   tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
    tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;


/**
 打开电子凭证页面
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param orderId                     订单ID
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)    showETicketDetail:(UIViewController *)parentController
                   isNeedPush:(BOOL)isNeedPush
            webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                      orderId:(NSString *)orderId
  tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
   tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;
@end

NS_ASSUME_NONNULL_END
