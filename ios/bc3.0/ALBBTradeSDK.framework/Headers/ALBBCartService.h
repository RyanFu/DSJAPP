//
//  ALBBCartService.h
//  ALBBTradeSDK
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/3/4.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ALBBTradeService.h"

/** 回调定义 */
typedef void (^addCartSuccessCallback)();
typedef void (^addCartCacelledCallback)();

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM (NSUInteger, ALBBThemeType) {
    ALBBThemeTypeDaytime,   //白天
    ALBBThemeTypeEvening  //强制跳手淘
} ;

/** 购物车服务 */
@protocol ALBBCartService <ALBBTradeService>
/**
 打开购物车页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)            showCart:(UIViewController *)parentController
                  isNeedPush:(BOOL)isNeedPush
           webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
 tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
  tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 添加商品到购物车.
 @param parentController        当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush              若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings       可以自定义的webview配置项
 @param itemId                  商品混淆ID
 @param addCartSuccessCallback  成功添加到购物车的回调
 @param addCartCacelledCallback 取消添加到购物车的回调
 */
- (void)    addItem2Cart:(UIViewController *)parentController
              isNeedPush:(BOOL)isNeedPush
       webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                  itemId:(NSString *)itemId
  addCartSuccessCallback:(nullable void (^)())onSuccess
 addCartCacelledCallback:(nullable void (^)())onCancel;

/**
 添加淘客商品到购物车.
 @param parentController        当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush              若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings       可以自定义的webview配置项
 @param itemId                  商品混淆ID
 @param taoKeParams             淘客参数
 @param addCartSuccessCallback  成功添加到购物车的回调
 @param addCartCacelledCallback 取消添加到购物车的回调
 */
- (void)addTaoKeItem2Cart:(UIViewController *)parentController
               isNeedPush:(BOOL)isNeedPush
        webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                   itemId:(NSString *)itemId
              taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
   addCartSuccessCallback:(nullable void (^)())onSuccess
  addCartCacelledCallback:(nullable void (^)())onCancel;

/**
   获取 添加商品到购物车 的url
 @param itemId                  商品ID（支持混淆和非混淆）
 @param themeType               主题类型（0白天，1晚上）
 @param themeType
 */
-(NSString*)addItem2CartUrlWithItemId:(NSString *)itemId
                            themeType:(ALBBThemeType)themeType;

/**
 获取 添加淘客商品到购物车 的url
 @param itemId                  商品ID（支持混淆和非混淆）
 @param themeType               主题类型（0白天，1晚上）
 @param taoKeParams             淘客参数
 */
-(NSString*)addTaokeItem2CartUrlWithItemId:(NSString *)itemId
                                themeType:(ALBBThemeType)themeType
                               taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams;
/**
 检查是否添加购物车成功
 @param url 传入拦截到的url
 */
-(BOOL)checkIsAddItemToCartSuccess:(NSString*)url;
@end

NS_ASSUME_NONNULL_END
