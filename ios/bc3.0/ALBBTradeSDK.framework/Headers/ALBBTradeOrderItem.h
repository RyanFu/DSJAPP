//
//  ALBBTradeOrderItem.h
//  taesdk
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 14-8-13.
//  Copyright (c) 2014年 com.taobao. All rights reserved.
//

#import <Foundation/Foundation.h>

/** 订单 */
@interface ALBBTradeOrderItem : NSObject
/** 商品混淆ID */
@property (nonatomic, copy, nullable) NSString *itemId;
/** 库存ID */
@property (nonatomic, copy, nullable) NSString *skuId;
/** 数量 */
@property (nonatomic, copy, nullable) NSNumber *quantity;
@end

typedef ALBBTradeOrderItem TaeOrderItem __attribute__((deprecated("use ALBBTradeOrderItem instead.")));
