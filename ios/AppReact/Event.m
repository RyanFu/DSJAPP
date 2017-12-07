#import "Event.h"

@implementation Event

RCT_EXPORT_MODULE(Event);

RCT_EXPORT_METHOD(a){
  
}
+ (id)allocWithZone:(NSZone *)zone {
  static Event *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"mLink"];
}

-(void) mLink:(NSDictionary*)noteId
{
    [self sendEventWithName:@"mLink"
                       body:@{
                              @"result": noteId,
                              }];
}
@end
