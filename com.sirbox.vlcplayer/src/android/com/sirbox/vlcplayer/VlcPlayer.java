package com.sirbox.vlcplayer;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import android.content.ComponentName;

import android.app.Activity;

import android.widget.Toast;

public class VlcPlayer extends CordovaPlugin {
    public static final int REQUEST_CODE = 0x0ba7c0de;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        PluginResult.Status status = PluginResult.Status.OK;
        String result = "";
        System.out.println(action);
        try {
            if (action.equals("playVideo")) {
                playVideo(args.getString(0));
            } else if (action.equals("playByVlc")) {
                playByVlc(args.getString(0));
                //scan();
            } else{
                status = PluginResult.Status.INVALID_ACTION;
            }
            callbackContext.sendPluginResult(new PluginResult(status, result));
        }catch(JSONException e){
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
        }catch(IOException e){
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.IO_EXCEPTION));
        }
        return true;
    }


    private void playVideo(String url) throws IOException {
        if (url.contains("bit.ly/") || url.contains("goo.gl/") || url.contains("tinyurl.com/") || url.contains("youtu.be/")) {
            //support for google / bitly / tinyurl / youtube shortens
            URLConnection con = new URL(url).openConnection();
            con.connect();
            InputStream is = con.getInputStream();
            //new redirected url
            url = con.getURL().toString();
            is.close();
        }

        // Create URI
        Uri uri = Uri.parse(url);

        Intent intent = null;
        // Display video player
        intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "video/*");
        this.cordova.getActivity().startActivity(intent);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        // 根据resultCode判断处理结果
//        if(resultCode==Activity.RESULT_OK){
//            String spot=intent.getStringExtra("spot");
//            context.success(spot);
//        }
    }

    public void  playByVlc(String url){
		
		Intent intent = new Intent();
		ComponentName cmp = new ComponentName("com.nmbb.vlc","com.nmbb.vlc.ui.VlcVideoActivity");
		intent.setAction(Intent.ACTION_MAIN);
		intent.addCategory(Intent.CATEGORY_LAUNCHER);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		intent.setComponent(cmp);
		// "rtmp://gxbhf.sirbox.cn:30256/live/livestream"
		intent.putExtra("videoUrl",url);
		this.cordova.startActivityForResult(this,intent,0);
    }

}
