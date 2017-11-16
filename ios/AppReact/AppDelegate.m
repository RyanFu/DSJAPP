/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

//#import "RCTPushNotificationManager.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import <AlibcTradeSDK/AlibcTradeSDK.h>
#import "../Libraries/LinkingIOS/RCTLinkingManager.h"

@implementation AppDelegate

/**
 * This method comes from UIApplicationDelegate protocol. It's a optional method of that protocol.
 * Support from IOS 3.0.
 */
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
//****************** baichuan  **********************//
  [[AlibcTradeSDK sharedInstance] asyncInitWithSuccess:^{
    
  } failure:^(NSError *error) {
    NSLog(@"Init failed: %@", error.description);
  }];
  
  // 开发阶段打开日志开关，方便排查错误信息
  //默认调试模式打开日志,release关闭,可以不调用下面的函数
  [[AlibcTradeSDK sharedInstance] setDebugLogOpen:YES];
  
  // 配置全局的淘客参数
  //如果没有阿里妈妈的淘客账号,setTaokeParams函数需要调用
  AlibcTradeTaokeParams *taokeParams = [[AlibcTradeTaokeParams alloc] init];
  taokeParams.pid = @"mm_120032403_0_0"; //mm_XXXXX为你自己申请的阿里妈妈淘客pid
  [[AlibcTradeSDK sharedInstance] setTaokeParams:taokeParams];
  
  //设置全局的app标识，在电商模块里等同于isv_code
  //没有申请过isv_code的接入方,默认不需要调用该函数
//  [[AlibcTradeSDK sharedInstance] setISVCode:@"your_isv_code"];
  
  // 设置全局配置，是否强制使用h5
  [[AlibcTradeSDK sharedInstance] setIsForceH5:YES];
//****************** baichuan  **********************//
  
  [[RCTBundleURLProvider sharedSettings] setDefaults];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"AppReact"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

//****************** Required to register for notifications   **********************

//// This callback will be made upon calling -[UIApplication registerUserNotificationSettings:]. The settings the user has granted to the application will be passed in as the second argument.
//- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
//{
//	[RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
//}
//
//// Required for the register event.
//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
//{
//	[RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
//}
//
//// Required for the notification event. You must call the completion handler after handling the remote notification.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
//fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
//{
//	[RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
//
//// Optionally implement this method over the previous to receive remote notifications. However
//// implement the application:didReceiveRemoteNotification:fetchCompletionHandler: method instead of this one whenever possible.
//// If your delegate implements both methods, the app object calls the `application:didReceiveRemoteNotification:fetchCompletionHandler:` method
//// Either this method or `application:didReceiveRemoteNotification:fetchCompletionHandler:` is required in order to receive remote notifications.
////
//// Required for the registrationError event.
//- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
//{
//	[RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
//}
//
//// Required for the notification event.
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
//{
//	[RCTPushNotificationManager didReceiveRemoteNotification:notification];
//}
//
//// Required for the localNotification event.
//- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
//{
//	[RCTPushNotificationManager didReceiveLocalNotification:notification];
//}

//****************** end for notifications   **********************

//****************** baichuan  **********************//
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation{
//  BOOL isHandled = [[AlibcTradeSDK sharedInstance] handleOpenURL:url]; // 如果百川处理过会返回YES
  BOOL isHandled = [[AlibcTradeSDK sharedInstance] application:application
                                                       openURL:url
                                             sourceApplication:sourceApplication
                                                    annotation:annotation];
  if (!isHandled) {
    // 其他处理逻辑
    return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];

  }
  return YES;

}

//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
//  BOOL isHandled = [[AlibcTradeSDK sharedInstance] handleOpenURL:url]; // 如果百川处理过会返回YES
//  if (!isHandled) {
//    // 其他处理逻辑
//  }
//  return YES;
//}
//****************** baichuan  **********************//

@end
