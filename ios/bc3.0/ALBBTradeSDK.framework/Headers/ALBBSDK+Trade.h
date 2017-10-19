//
//  TaeSDK+ALBBTrade.h
//  ALBBTradeSDK
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 15/2/28.
//  Copyright (c) 2015年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <ALBBSDK/ALBBSDK.h>

#import "ALBBItemService.h"
#import "ALBBOrderService.h"
#import "ALBBCartService.h"
#import "ALBBPromotionService.h"

NS_ASSUME_NONNULL_BEGIN

@interface ALBBSDK (Trade_Deprecated) <ALBBCartService, ALBBItemService, ALBBOrderService, ALBBPromotionService>
/**
 此方法不建议使用，请使用 showItemDetailByOpenId
 打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆ID
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)        showItemDetail:(UIViewController *)parentController
                    isNeedPush:(BOOL)isNeedPush
             webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                        itemId:(NSString *)itemId
                      itemType:(NSInteger)itemType
                        params:(nullable NSDictionary *)params
   tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
    tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;


/**
 此方法不建议使用，请使用 showItemDetailByOpenId
 以淘客方式打开商品详情页面.
 @param parentController            当前view controller. 若isNeedPush为YES, 需传入当前UINavigationController.
 @param isNeedPush                  若为NO, 则在当前view controller上present新页面; 否则在传入的UINavigationController上push新页面.
 @param webViewUISettings           可以自定义的webview配置项
 @param itemId                      商品混淆ID
 @param itemType                    商品类型: 1代表淘宝, 2代表天猫.
 @param params                      商品详情页请求附加参数
 @param taoKeParams                 淘客参数
 @param tradeProcessSuccessCallback 交易流程成功完成订单支付的回调
 @param tradeProcessFailedCallback  交易流程未完成的回调
 */
- (void)showTaoKeItemDetail:(UIViewController *)parentController
                 isNeedPush:(BOOL)isNeedPush
          webViewUISettings:(nullable TaeWebViewUISettings *)webViewUISettings
                     itemId:(NSString *)itemId
                   itemType:(NSInteger)itemType
                     params:(nullable NSDictionary *)params
                taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams
tradeProcessSuccessCallback:(nullable void (^)(ALBBTradeResult * __nullable result))onSuccess
 tradeProcessFailedCallback:(nullable void (^)(NSError * __nullable error))onFailure;

/**
 检查是否可以跳转到手机淘宝的detail, 如果可以, 直接跳转.
 @param itemId                      商品真实id
 @param params                      额外参数
 @param taoKeParams                 淘客参数
 @return 是否跳转到手机淘宝
 */
- (BOOL)checkJumpTBDetail:(NSString *)itemId params:(NSDictionary *)params taoKeParams:(nullable ALBBTradeTaokeParams *)taoKeParams;
@end
NS_ASSUME_NONNULL_END

#pragma mark -

NS_ASSUME_NONNULL_BEGIN
@interface ALBBSDK(TaoKe)
/**
 设置淘客参数
 @param taoKeParams                 淘客参数
 */
- (void)setTaoKeParams:(ALBBTradeTaokeParams *)params;
@end

@interface ALBBSDK(TradeOption)
/** 是否检测WebView支付. 如果安装了支付宝且检测支付, 使用支付宝应用完成支付; 否则, 使用WebView完成支付. 默认YES. */
@property (assign, nonatomic) BOOL detectWebViewPayment;
@end
NS_ASSUME_NONNULL_END
