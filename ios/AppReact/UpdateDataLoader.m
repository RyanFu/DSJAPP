
#import "UpdateDataLoader.h"
#import "DownloadTool.h"

@implementation UpdateDataLoader
+ (UpdateDataLoader *) sharedInstance
{
    static UpdateDataLoader *sharedInstance = nil;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[UpdateDataLoader alloc] init];
    });
    
    return sharedInstance;
}
//创建bundle路径
-(void)createPath{
    
    if([self getVersionPlistPath]){
        return;
    }
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES);
    NSString *path = [paths lastObject];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSString *directryPath = [path stringByAppendingPathComponent:@"IOSBundle"];
    [fileManager createDirectoryAtPath:directryPath withIntermediateDirectories:YES attributes:nil error:nil];
    NSString *filePath = [directryPath stringByAppendingPathComponent:@"Version.plist"];
    [fileManager createFileAtPath:filePath contents:nil attributes:nil];
}
//获取版本信息
-(void)getAppVersion{
    
    //从服务器上获取版本信息,与本地plist存储的版本进行比较
    //假定返回的结果集
    /*{
     bundleVersion = 2;
     downloadUrl = "www.baidu.com";
     }*/
    
    //1.获取本地plist文件的版本号 假定为2
    NSString* plistPath=[self getVersionPlistPath];
    NSMutableDictionary *data = [[NSMutableDictionary alloc] initWithContentsOfFile:plistPath];
    
    
    NSInteger localV=[data[@"bundleVersion"]integerValue];
    
    localV=2;
    
    
    //2  服务器版本 假定为3
    NSInteger serviceV=3 ;
    
    if(serviceV>localV){
        //下载bundle文件 存储在 Doucuments/IOSBundle/下
        
        NSString*url=@"https://www.baidu.com/link?url=AH4YJUtQK3tB6D6BARqSkZzQsax38iBawDvAXK1wVGVplkkmuhf7mkpc6barjlavO6ysikDjimVG7d0l8KAFvorDmM3K_T5aIES89-JdQEG&wd=&eqid=e165a7c1000050c3000000035993b22c";
        
        [[DownLoadTool defaultDownLoadTool] downLoadWithUrl:url];
        
    }else{
        
    }
}

//获取Bundle 路径
-(NSString*)iOSFileBundlePath{
    //获取沙盒路径
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString* path = [paths objectAtIndex:0];
    NSLog(@"the save version file's path is :%@",path);
    //填写文件名
    NSString* filePath = [path stringByAppendingPathComponent:@"/IOSBundle"];
    return  filePath;
}

//获取版本信息储存的文件路径
-(NSString*)getVersionPlistPath{
    
    //获取沙盒路径
    NSArray* paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString* path = [paths objectAtIndex:0];
    NSLog(@"the save version file's path is :%@",path);
    //填写文件名
    NSString* filePath = [path stringByAppendingPathComponent:@"/IOSBundle/Version.plist"];
    NSLog(@"文件路径为：%@",filePath);
    return filePath;
}

//创建或修改版本信息
-(void)writeAppVersionInfoWithDictiony:(NSDictionary*)dictionary{
    
    NSString* filePath  = [self getVersionPlistPath];
    [dictionary writeToFile:filePath atomically:YES];
}

@end
