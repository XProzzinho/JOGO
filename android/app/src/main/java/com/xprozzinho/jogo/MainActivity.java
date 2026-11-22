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
import android.app.UiModeManager;
import android.content.res.Configuration;
import android.view.InputDevice;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.inputmethod.InputMethodManager;

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
            /* é TV (Fire Stick / Android TV)? */
            @JavascriptInterface
            public boolean ehTv() { return ehTelevisao(); }
            @JavascriptInterface
            public void digitando(boolean on) { digitando = on; }
            /* abre o teclado da TV/celular no campo de texto que está com foco */
            @JavascriptInterface
            public void teclado() { runOnUiThread(() -> { try { web.requestFocus(); InputMethodManager im = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE); im.showSoftInput(web, InputMethodManager.SHOW_IMPLICIT); } catch (Throwable e) {} }); }
        }, "AndroidTela");
        setContentView(web);
        telaCheia();
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }

    private boolean ehTelevisao() {
        try { if ("firetv".equals(BuildConfig.FLAVOR)) return true; } catch (Throwable e) {}
        try { UiModeManager u = (UiModeManager) getSystemService(UI_MODE_SERVICE); if (u != null && u.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION) return true; } catch (Throwable e) {}
        return getPackageManager().hasSystemFeature("amazon.hardware.fire_tv") || getPackageManager().hasSystemFeature(PackageManager.FEATURE_LEANBACK);
    }

    /* ===== CONTROLE (joystick, Fire TV Remote, controle Bluetooth) → jogo ===== */
    private static String nomeTecla(int k) {
        switch (k) {
            case KeyEvent.KEYCODE_DPAD_UP: return "cima";
            case KeyEvent.KEYCODE_DPAD_DOWN: return "baixo";
            case KeyEvent.KEYCODE_DPAD_LEFT: return "esq";
            case KeyEvent.KEYCODE_DPAD_RIGHT: return "dir";
            case KeyEvent.KEYCODE_DPAD_CENTER: case KeyEvent.KEYCODE_ENTER: case KeyEvent.KEYCODE_NUMPAD_ENTER: return "ok";
            case KeyEvent.KEYCODE_BUTTON_A: return "A";
            case KeyEvent.KEYCODE_BUTTON_B: return "B";
            case KeyEvent.KEYCODE_BUTTON_X: return "X";
            case KeyEvent.KEYCODE_BUTTON_Y: return "Y";
            case KeyEvent.KEYCODE_BUTTON_L1: return "LB";
            case KeyEvent.KEYCODE_BUTTON_R1: return "RB";
            case KeyEvent.KEYCODE_BUTTON_L2: return "LT";
            case KeyEvent.KEYCODE_BUTTON_R2: return "RT";
            case KeyEvent.KEYCODE_BUTTON_THUMBL: return "L3";
            case KeyEvent.KEYCODE_BUTTON_THUMBR: return "R3";
            case KeyEvent.KEYCODE_BUTTON_START: return "start";
            case KeyEvent.KEYCODE_BUTTON_SELECT: return "select";
            case KeyEvent.KEYCODE_MENU: return "menu";
            case KeyEvent.KEYCODE_BACK: return "voltar";
            case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE: return "play";
            case KeyEvent.KEYCODE_MEDIA_REWIND: return "volta";
            case KeyEvent.KEYCODE_MEDIA_FAST_FORWARD: return "avanca";
            default: return null;
        }
    }

    private boolean digitando = false;

    @Override
    public boolean dispatchKeyEvent(KeyEvent e) {
        String n = nomeTecla(e.getKeyCode());
        // com o teclado aberto num campo de texto, deixa o teclado funcionar normal (menos o voltar)
        if (n == null || (digitando && !n.equals("voltar") && e.getKeyCode() != KeyEvent.KEYCODE_BUTTON_START)) return super.dispatchKeyEvent(e);
        if (e.getAction() == KeyEvent.ACTION_DOWN && e.getRepeatCount() > 0 && !n.equals("cima") && !n.equals("baixo") && !n.equals("esq") && !n.equals("dir")) return true;
        if (e.getAction() == KeyEvent.ACTION_DOWN || e.getAction() == KeyEvent.ACTION_UP) {
            boolean d = e.getAction() == KeyEvent.ACTION_DOWN;
            web.evaluateJavascript("window.tvTecla&&tvTecla('" + n + "'," + d + "," + (e.getRepeatCount() > 0) + ")", r -> {});
        }
        return true;
    }

    private static float eixo(MotionEvent e, int a) { float v = e.getAxisValue(a); return Math.abs(v) < 0.15f ? 0 : v; }

    @Override
    public boolean dispatchGenericMotionEvent(MotionEvent e) {
        if ((e.getSource() & InputDevice.SOURCE_JOYSTICK) == InputDevice.SOURCE_JOYSTICK && e.getAction() == MotionEvent.ACTION_MOVE) {
            float lt = Math.max(eixo(e, MotionEvent.AXIS_LTRIGGER), eixo(e, MotionEvent.AXIS_BRAKE));
            float rt = Math.max(eixo(e, MotionEvent.AXIS_RTRIGGER), eixo(e, MotionEvent.AXIS_GAS));
            String js = "window.tvEixo&&tvEixo(" + eixo(e, MotionEvent.AXIS_X) + "," + eixo(e, MotionEvent.AXIS_Y) + "," + eixo(e, MotionEvent.AXIS_Z) + "," + eixo(e, MotionEvent.AXIS_RZ) + "," + lt + "," + rt + "," + e.getAxisValue(MotionEvent.AXIS_HAT_X) + "," + e.getAxisValue(MotionEvent.AXIS_HAT_Y) + ")";
            web.evaluateJavascript(js, r -> {});
            return true;
        }
        return super.dispatchGenericMotionEvent(e);
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
