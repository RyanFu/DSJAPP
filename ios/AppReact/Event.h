#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "RCTEventEmitter.h"

@interface Event : RCTEventEmitter<RCTBridgeModule>

-(void) mLink:(NSDictionary*)noteId;

@end
