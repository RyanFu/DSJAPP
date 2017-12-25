
#import <Foundation/Foundation.h>

@interface UpdateDataLoader : NSObject

@property (nonatomic, strong) NSDictionary* versionInfo;
+ (UpdateDataLoader *) sharedInstance;



//创建bundle路径
-(void)createPath;
//获取版本信息
-(void)getAppVersion;

-(void)writeAppVersionInfoWithDictiony:(NSDictionary*)info;

-(NSString*)iOSFileBundlePath;

@end
