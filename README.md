Smart Image
======================
スマートフォン向け画像を拡大・縮小させてドラッグできるjQueryプラグイン  

デモ
------
<a href="http://dev.creatorish.com/demo/smart-image/" target="_blank">http://dev.creatorish.com/demo/smart-image/</a>

使い方
------

### HTML ###

幅・高さを指定した要素に拡大縮小ドラッグさせたい要素を記述します。  
GoogleMapsみたいな感じです。

    <div style="width: 100%; height: 300px;">
        <img id="smart-image" src="test.jpg" alt="テストイメージ" />
    </div>

拡大縮小をマルチタッチで行うときはheadタグ内にviewport設定をお忘れなく。

     <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no,target-densitydpi=device-dpi">

シャッフルさせたい要素に以下のように記述します。

    var shuffle = $(".test").shuffleText();
    shuffle.start();

### JS ###

    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="jquery.smartimage.js"></script>
    <script type="text/javascript">
        $(function() {
            $("#smart-image").SmartImage(options);
        });
    </script>

オプション
------

SmartImageの第一引数にオブジェクトでオプションを渡せます。

    $("#smart-image").SmartImage({
        maxScale: 3,
        zoom: true,
        fill: false,
        fade: 750,
        easeTime: 500,
        zoomStep: 0.1,
        moveStep: 10,
        interval: 100,
        zoomInController: null,
        zoomOutController: null,
        moveUpController: null,
        moveDownController: null,
        moveLeftController: null,
        moveRightController: null,
        complete: function() {}
    });

+    maxScale: 3 : ズームの最大値
+    zoom: true : ズームさせるかどうかのフラグです。iOSではマルチタッチで拡大縮小ができますが、falseにするとマルチタッチでの拡大縮小をさせません。
+    fill: false : 画像を親要素を満たすように表示するかどうかのフラグです。デフォルトはfalseで、親要素に全体が収まるように表示されます。
+    fade: 750 : 画像の読み込みが完了したときにフェードで表示される時間です。
+    easeTime: 500 : 画像をフリック気味にドラッグして離したときの惰性アニメーションの時間です。
+    zoomStep: 0.1 : zoomControllerを使ってズームするときのステップ数です。大きくすると早く拡大縮小します。
+    moveStep: 10 : moveControllerを使って移動するときのステップ数です。大きくすると早く移動します。
+    interval: 100 : controllerをロングタップしているときにどのくらいの時間で拡大縮小移動させるかどうかの数値です。大きくすると遅くなります。
+    zoomInController: null : ズームインさせるボタンにする要素を指定します。jQueryのセレクタと同じように”.zoomin”などを渡します。
+    zoomOutController: null : ズームアウトさせるボタンにする要素を指定します
+    moveUpController: null : 上へ移動させるボタンを指定します
+    moveDownController: null : 下へ移動させるボタンを指定します
+    moveLeftController: null : 左へ移動させるボタンを指定します
+    moveRightController: null : 右へ移動させるボタンを指定します
+    complete: function() {} : 画像の読み込みが完了し、SmartImageの準備が完了した時点で行う処理です。

ライセンス
--------
[MIT]: http://www.opensource.org/licenses/mit-license.php
Copyright &copy; 2012 creatorish.com
Distributed under the [MIT License][mit].

作者
--------
creatorish yuu  
Weblog: <http://creatorish.com>  
Facebook: <http://facebook.com/creatorish>  
Twitter: <http://twitter.jp/creatorish>