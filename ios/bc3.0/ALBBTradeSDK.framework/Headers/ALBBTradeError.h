//
//  ALBBTradeError.h
//  ALBBTrade
//
//  Created by liqing on 16/1/14.
//  Copyright © 2016年 Alibaba. All rights reserved.
//

#ifndef ALBBTradeError_h
#define ALBBTradeError_h

#import <Foundation/Foundation.h>

/** 交易错误码 */
typedef NS_ENUM (NSUInteger, ALBBTradeError) {
    /** 交易链路失败 */
    ALBBTradeErrorProcessFailed = 3001,
    /** 交易链路中用户取消了操作 */
    ALBBTradeErrorCancelled     = 3002,
    /** 交易链路中发生支付但是支付失败 */
    ALBBTradeErrorPaymentFailed = 3003,
    /** itemId无效 */
    ALBBTradeErrorInvalidItemID = 3004,
    /** page url为空 */
    ALBBTradeErrorNullPageURL   = 3005,
    /** shopId无效 */
    ALBBTradeErrorInvalidShopID = 3006,
};

extern NSString * const ALBBTradeErrorDomain;

#endif /* ALBBTradeError_h */
