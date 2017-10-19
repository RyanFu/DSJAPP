//
//  ALBBTradePage.h
//  ALBBTrade
//
//  Created by zhoulai on 15/10/28.
//  Copyright © 2015年 Alibaba. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 页面 */
@interface ALBBTradePage : NSObject
/** 地址 */
@property (nonatomic, copy) NSString *url;
/** 短连接名 */
@property (nonatomic, copy) NSString *target;
/** 参数 */
@property (nonatomic, copy) NSDictionary *params;

/**
 创建URL指定页面
 @param url     地址
 @return URL指定页面
 */
+ (instancetype)page:(NSString *)url;

/**
 创建短连接URL指定页面
 @param target  url的短连接名，SDK会自动映射
 @param params  自定义参数
 @return 短连接URL指定页面
 */
+ (instancetype)page:(NSString *)target params:(nullable NSDictionary *)params;

/**
 创建商品真实ID对应的详情页面
 @param itemId   商品真实ID或者混淆(open)ID
 @param params   自定义参数
 @return 详情页面
 */
+ (instancetype)itemDetailPage:(NSString *)itemId params:(nullable NSDictionary *)params;

/**
 创建优惠券页面
 @param param   参数. type为shop时, param为卖家nick; type为auction时, param为商品的混淆ID.
 @param type    类型. 取值为shop或auction.
 @return 优惠券页面
 */
+ (instancetype)promotionsPage:(NSString *)param type:(NSString *)type;

/**
 创建我的购物车页面
 @return 我的购物车页面
 */
+ (instancetype)myCartsPage;

/**
 创建我的订单列表页面
 @param status      订单状态. 0为全部订单; 1为待付款订单; 2为待发货订单; 3为待收货订单; 4为待评价订单.
 @param isAllOrder  是否显示全部订单. 传YES时, 显示全部订单; 传NO时, 显示ISV的订单.
 @return 我的订单列表页面
 */
+ (instancetype)myOrdersPage:(NSInteger)status isAllOrder:(BOOL)isAllOrder;

/**
 创建我的卡券包页面
 @return 我的卡券包页面
 */
+ (instancetype)myCardCouponsPage;

/**
 *  创建店铺页面
 *
 *  @param shopId 店铺ID
 *  @param params 自定义参数
 *
 *  @return 店铺页面
 */
+ (instancetype)shopPage:(nonnull NSString *)shopId params:(nullable NSDictionary *)params;

@end

NS_ASSUME_NONNULL_END

typedef ALBBTradePage ALBBPage __attribute__((deprecated("use ALBBTradePage instead.")));
