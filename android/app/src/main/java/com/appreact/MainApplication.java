package com.appreact;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cn.reactnative.modules.wx.WeChatPackage;
import cn.reactnative.modules.weibo.WeiboPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.taobaobaichuanapi.BaiChuanPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.imagepicker.ImagePickerPackage;
import cn.reactnative.httpcache.HttpCachePackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new WeChatPackage(),
            new WeiboPackage(),
            new WebViewBridgePackage(),
            new VectorIconsPackage(),
            new BaiChuanPackage(),
            new RNSpinkitPackage(),
            new ReactNativePushNotificationPackage(),
            new ImagePickerPackage(),
            new HttpCachePackage(),
            new ReactNativeContacts()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
  }
}
