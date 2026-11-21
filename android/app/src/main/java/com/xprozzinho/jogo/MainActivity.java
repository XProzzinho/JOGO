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
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ComponentName;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.BatteryManager;

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
            /* bateria: "nivel,naTomada(0/1),carregando(0/1),corrente_mA" — pra saber se o Power Delivery está pausando a carga */
            @JavascriptInterface
            public String bateria() { return lerBateria(); }
            /* abre o Game Booster (onde fica o "Pausar USB Power Delivery"); devolve o que conseguiu abrir */
            @JavascriptInterface
            public String gameBooster() { return abrirGameBooster(); }
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

    private String lerBateria() {
        try {
            Intent i = registerReceiver(null, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
            int nivel = i == null ? -1 : Math.round(100f * i.getIntExtra(BatteryManager.EXTRA_LEVEL, 0) / Math.max(1, i.getIntExtra(BatteryManager.EXTRA_SCALE, 100)));
            int plug = i == null ? 0 : i.getIntExtra(BatteryManager.EXTRA_PLUGGED, 0);
            int st = i == null ? 0 : i.getIntExtra(BatteryManager.EXTRA_STATUS, 0);
            boolean carregando = st == BatteryManager.BATTERY_STATUS_CHARGING;
            long ua = 0; try { BatteryManager bm = (BatteryManager) getSystemService(BATTERY_SERVICE); ua = bm.getLongProperty(BatteryManager.BATTERY_PROPERTY_CURRENT_NOW); } catch (Throwable e) {}
            long ma = Math.abs(ua) > 20000 ? ua / 1000 : ua; // alguns celulares mandam em µA, outros em mA
            return nivel + "," + (plug != 0 ? 1 : 0) + "," + (carregando ? 1 : 0) + "," + ma;
        } catch (Throwable e) { return "-1,0,0,0"; }
    }

    private boolean tenta(Intent it) {
        try { if (it == null) return false; it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); startActivity(it); return true; } catch (Throwable e) { return false; }
    }

    private String abrirGameBooster() {
        final String[] r = { "nada" };
        String gt = "com.samsung.android.game.gametools", gh = "com.samsung.android.game.gamehome";
        // 1) tela de configurações do Game Booster (procura a atividade certa dentro do app da Samsung)
        try {
            PackageInfo pi = getPackageManager().getPackageInfo(gt, PackageManager.GET_ACTIVITIES);
            if (pi.activities != null) {
                String[] chaves = { "GameBoosterSetting", "BoosterSetting", "gamebooster.setting", "Setting" };
                for (String k : chaves) {
                    for (android.content.pm.ActivityInfo ai : pi.activities) {
                        if (ai.exported && ai.name.toLowerCase().contains(k.toLowerCase())) {
                            Intent it = new Intent(); it.setComponent(new ComponentName(gt, ai.name));
                            if (tenta(it)) return "booster";
                        }
                    }
                }
            }
        } catch (Throwable e) {}
        // 2) o próprio app do Game Booster
        if (tenta(getPackageManager().getLaunchIntentForPackage(gt))) return "booster";
        // 3) Game Launcher
        if (tenta(getPackageManager().getLaunchIntentForPackage(gh))) return "launcher";
        // 4) configurações da bateria
        if (tenta(new Intent(android.provider.Settings.ACTION_BATTERY_SAVER_SETTINGS))) return "bateria";
        return r[0];
    }

    private int lerModoJogo() {
        try { if (Build.VERSION.SDK_INT >= 31) { GameManager g = (GameManager) getSystemService(GAME_SERVICE); if (g != null) return g.getGameMode(); } } catch (Throwable e) {}
        return 0;
    }

    @Override
    protected void onResume() { super.onResume(); web.onResume(); final int m = lerModoJogo(); web.evaluateJavascript("window.modoJogoMuda&&modoJogoMuda(" + m + ")", null); }
}
