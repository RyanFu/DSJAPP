/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <UIKit/UIKit.h>

#import "AppDelegate.h"

int main(int argc, char * argv[]) {
  @autoreleasepool {
    @try {
      // The custom AppDelegate class must have the name "AppDelegate".
      return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
    }
    @catch (NSException *exception) {
      NSLog(@"%@", exception);
    }
    
  }
}
