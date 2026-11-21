package com.xprozzinho.jogo;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import androidx.webkit.WebViewAssetLoader;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.JavascriptInterface;
import android.content.pm.ActivityInfo;
import android.app.GameManager;
import android.os.Build;

public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setDatabaseEnabled(true);
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder().addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) { return loader.shouldInterceptRequest(r.getUrl()); }
        });
        web.setWebChromeClient(new WebChromeClient()); /* deixa o confirm/prompt do 📡 aparecer */
        web.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void retrato(final boolean on) { runOnUiThread(() -> setRequestedOrientation(on ? ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT : ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE)); }
            /* modo jogo do celular: 0 sem suporte, 1 padrão, 2 desempenho, 3 economia de bateria, 4 personalizado */
            @JavascriptInterface
            public int modoJogo() { return lerModoJogo(); }
        }, "AndroidTela");
        setContentView(web);
        telaCheia();
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    private void telaCheia() {
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) telaCheia(); }

    @Override
    protected void onPause() { super.onPause(); web.onPause(); }

    private int lerModoJogo() {
        try { if (Build.VERSION.SDK_INT >= 31) { GameManager g = (GameManager) getSystemService(GAME_SERVICE); if (g != null) return g.getGameMode(); } } catch (Throwable e) {}
        return 0;
    }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); final int m = lerModoJogo(); web.evaluateJavascript("window.modoJogoMuda&&modoJogoMuda(" + m + ")", null); }
}
