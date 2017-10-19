//
//  ALBBTradeResult.h
//  taesdk
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 14-8-13.
//  Copyright (c) 2014年 com.taobao. All rights reserved.
//

#import <Foundation/Foundation.h>

/** 交易结果 */
@interface ALBBTradeResult : NSObject
/** 支付成功订单 */
@property (nonatomic, copy, nullable, readonly) NSArray *paySuccessOrders;
/** 支付失败订单 */
@property (nonatomic, copy, nullable, readonly) NSArray *payFailedOrders;
@end

typedef ALBBTradeResult TaeTradeProcessResult __attribute__((deprecated("use ALBBTradeResult instead.")));
