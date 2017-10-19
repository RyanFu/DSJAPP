//
//  ALBBTradeTaokeParams.h
//  TAESDK
//
//  Created by 友和(lai.zhoul@alibaba-inc.com) on 14-9-15.
//  Copyright (c) 2014年 alibaba. All rights reserved.
//

#import <Foundation/Foundation.h>

/** 淘客参数 */
@interface ALBBTradeTaokeParams : NSObject
/** */
@property (nonatomic, copy, nullable) NSString *pid;
/** */
@property (nonatomic, copy, nullable) NSString *unionId;
/** */
@property (nonatomic, copy, nullable) NSString *subPid;
@end

typedef ALBBTradeTaokeParams TaeTaokeParams __attribute__((deprecated("use ALBBTradeTaokeParams instead.")));
