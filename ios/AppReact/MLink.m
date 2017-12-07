#import "MLink.h"
#import "MWApi.h"
#import "Event.h"

@implementation MLink

+ (void)registerMlink
{
  Event *event = [Event allocWithZone: nil];

  [MWApi registerMLinkHandlerWithKey:@"duoshouji"
                             handler:^(NSURL * _Nonnull url, NSDictionary * _Nullable params) {
//                               NSLog(@"%@", url);
//                               NSLog(@"%@", params);
                               [event mLink: params];
                             }];
  
}
@end
