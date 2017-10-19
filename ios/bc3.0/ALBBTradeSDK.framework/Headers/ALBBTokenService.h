//
//  ALBBTokenService.h
//  ALBBTrade
//
//  Created by liqing on 16/2/29.
//  Copyright © 2016年 Alibaba. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/** 打点令牌服务 */
@protocol ALBBTokenService <NSObject>
/** 
 获取令牌
 @param json        由JSON格式键值对构成的令牌唯一标识.
 @param callback    令牌获取回调. 成功时token非空; 失败时error非空.
 */
- (void)fetchTokenWithJSON:(NSString *)json
                  callback:(void (^)(NSString *__nullable token, NSError *__nullable error))callback;
@end

NS_ASSUME_NONNULL_END
