package com.duoshouji.appreact;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
//import cn.reactnative.modules.weibo.WeiboPackage;
import cn.reactnative.modules.wx.WeChatPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.react.rnspinkit.RNSpinkitPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
//import com.react.taobaobaichuanapi.BaiChuanPackage;
//import com.alibaba.baichuan.android.trade.AlibcTradeSDK;
//import com.alibaba.baichuan.android.trade.callback.AlibcTradeInitCallback;
//import com.alibaba.baichuan.android.trade.model.AlibcTaokeParams;
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import android.util.Log;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
//            new WeiboPackage(),
                    new WeChatPackage(),
                    new RNSpinkitPackage(),
                    new ReactNativeContacts(),
//                    new BaiChuanPackage(),
//                    new ReactNativePushNotificationPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);

//        AlibcTradeSDK.asyncInit(this, new AlibcTradeInitCallback() {
//            @Override
//            public void onSuccess() {
//                //初始化成功，设置相关的全局配置参数
//                AlibcTradeSDK.setForceH5(false);
//                AlibcTaokeParams alibcTaokeParams = new AlibcTaokeParams(
//                        "pid", "", ""
//                );
//                AlibcTradeSDK.setTaokeParams(alibcTaokeParams);
//            }
//
//            @Override
//            public void onFailure(int code, String msg) {
//
//                //初始化失败，可以根据code和msg判断失败原因，详情参见错误说明
//                Log.e("", "onFailure: 初始化百川SDK失败\n原因:" + msg + "(" + code + ")");
//            }
//        });
    }
}
