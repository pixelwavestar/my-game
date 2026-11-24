package com.kiclash.z;
import android.app.Activity;
import android.content.Context;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
public class MainActivity extends Activity {
  WebView w;
  volatile String host = null;
  volatile long seen = 0;
  WifiManager.MulticastLock lock;
  class Bridge {
    @JavascriptInterface public String host() {
      return (host != null && System.currentTimeMillis() - seen < 5000) ? host : null;
    }
  }
  @Override protected void onCreate(Bundle b) {
    super.onCreate(b);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    try {
      WifiManager wm = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      lock = wm.createMulticastLock("kcz"); lock.acquire();
    } catch (Exception e) {}
    new Thread(() -> {
      try {
        DatagramSocket s = new DatagramSocket(null);
        s.setReuseAddress(true); s.bind(new InetSocketAddress(41234));
        byte[] buf = new byte[64];
        while (true) {
          DatagramPacket p = new DatagramPacket(buf, buf.length);
          s.receive(p);
          String m = new String(p.getData(), 0, p.getLength());
          if (m.startsWith("KCZ|")) { host = p.getAddress().getHostAddress() + ":" + m.substring(4).trim(); seen = System.currentTimeMillis(); }
        }
      } catch (Exception e) {}
    }).start();
    w = new WebView(this);
    WebSettings s = w.getSettings();
    s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true);
    s.setMediaPlaybackRequiresUserGesture(false); s.setAllowFileAccess(true);
    w.addJavascriptInterface(new Bridge(), "KCZ");
    w.setWebChromeClient(new WebChromeClient()); w.setWebViewClient(new WebViewClient());
    w.setBackgroundColor(0xFF0B0D1A);
    setContentView(w);
    w.loadUrl("file:///android_asset/index.html");
    hide();
  }
  void hide() {
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
  }
  @Override public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) hide(); }
}
