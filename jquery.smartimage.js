/*****************************************************************
 *
 * jQuery Smart Image
 * スマートフォン向けの画像拡大プラグイン
 * 
 * Required: jQuery(http://jquery.com/)
 * License: MIT
 * Update: 2012/10/01
 * Version: 0.2.0
 * Author: yuu.creatorish
 * URL: http://creatorish.com
 * PluginURL: http://creatorish.com/lab/4887
 *
 *
*******************************************************************/
jQuery.easing.quart = function (x, t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
};
jQuery.fn.SmartImage = function(option) {
	var target = this;
	var options = {
		minScale: NaN,
		maxScale: 3,
		zoom: true,
		autoResize: true,
		autoMinScale: true,
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
	};
	
	jQuery.extend(options,option);
	
	var functions = {
		zoom: function(z,easing,callback) {
			scale = endScale = z;
			move(tx,ty,easing,callback);
		},
		move: function(x,y,easing,callback) {
			move(tx+x,ty+y,easing,callback);
		},
		moveTo: function(x,y,easing,callback) {
			moveTo(x,y,easing,callback);
		},
		destroy: function() {
			removeEvent();
		}
	};
	
	var tx = 0;
	var ty = 0;
	var scale = 1;
	var minScale = 1;
	var endScale = 1;
	var containerWidth = 0;
	var containerHeight = 0;
	var timer = null;
	var hasTouch = (window.ontouchstart === null) ? true: false;
	var hasTransform3d = (navigator.userAgent.search(/iPhone|iPad/) !== -1);
	var isAndroid = (navigator.userAgent.search(/Android/) !== -1);
	var isMultiTouch = false;
	var touchData = {
		sx:0,
		sy:0,
		dx: 0,
		dy: 0,
		count:0,
		distance: 0,
		isMove: false,
		isGesture: false,
		time: 0
	};
	
	target.parent().css({
		overflow: "hidden",
		position: "relative"
	});
	target.css({
		display: "inline-block",
		opacity: 0,
		position: "absolute",
		webkitTouchCallout: "none",
		webkitTransform: "translate(-50%,-50%) " + getTranslate(0,0) + " scale(0,0)"
	});
	function getTranslate(x,y) {
		if (hasTransform3d) {
			return "translate3d("+x+"px,"+y+"px,0)";
		}
		return "translate("+x+"px,"+y+"px)";
	}
	
	function init() {
		containerWidth = target.parent().width();
		containerHeight = target.parent().height();
		width = target.width();
		height = target.height();
		
		addEvent();
		if (hasTouch) {
			target.css({
				position: "absolute",
				top: "50%",
				left: "50%"
			});
			resizeImage();
		}
		target.animate({
			opacity: 1
		},options.fade,"quart",function() {
			options.complete(this,functions);
		});
		
		setControllers();
	}
	function setControllers() {
		if (options.zoomInController) {
			jQuery(options.zoomInController).bind("touchstart",zoomInStartHandler);
			jQuery(options.zoomInController).bind("touchend",controllEndHandler);
		}
		if (options.zoomOutController) {
			jQuery(options.zoomOutController).bind("touchstart",zoomOutStartHandler);
			jQuery(options.zoomOutController).bind("touchend",controllEndHandler);
		}
		if (options.moveLeftController) {
			jQuery(options.moveLeftController).bind("touchstart",moveLeftStartHandler);
			jQuery(options.moveLeftController).bind("touchend",controllEndHandler);
		}
		if (options.moveRightController) {
			jQuery(options.moveRightController).bind("touchstart",moveRightStartHandler);
			jQuery(options.moveRightController).bind("touchend",controllEndHandler);
		}
		if (options.moveUpController) {
			jQuery(options.moveUpController).bind("touchstart",moveUpStartHandler);
			jQuery(options.moveUpController).bind("touchend",controllEndHandler);
		}
		if (options.moveDownController) {
			jQuery(options.moveDownController).bind("touchstart",moveDownStartHandler);
			jQuery(options.moveDownController).bind("touchend",controllEndHandler);
		}
	}
	function controllEndHandler(e) {
		window.clearInterval(timer);
		e.preventDefault();
	}
	function zoomInStartHandler(e) {
		
		timer = window.setInterval(function() {
			scale = endScale = scale + options.zoomStep;
			moveTo(tx,ty,options.interval);
		},options.interval);
		
		e.preventDefault();
	}
	function zoomOutStartHandler(e) {
		timer = window.setInterval(function() {
			scale = endScale = scale- options.zoomStep;
			moveTo(tx,ty,options.interval);
		},options.interval);
		e.preventDefault();
	}
	function moveLeftStartHandler(e) {
		timer = window.setInterval(function() {
			moveTo(tx+options.moveStep,ty,options.interval);
		},options.interval);
		e.preventDefault();
	}
	function moveRightStartHandler(e) {
		timer = window.setInterval(function() {
			moveTo(tx-options.moveStep,ty,options.interval);
		},options.interval);
		e.preventDefault();
	}
	function moveUpStartHandler(e) {
		timer = window.setInterval(function() {
			moveTo(tx,ty+options.moveStep,options.interval);
		},options.interval);
		e.preventDefault();
	}
	function moveDownStartHandler(e) {
		timer = window.setInterval(function() {
			moveTo(tx,ty-options.moveStep,options.interval);
		},options.interval);
		e.preventDefault();
	}
	function addEvent() {
		jQuery(window).on("resize",resizeHandler);
		target.bind("touchstart",startHandler);
		target.bind("touchmove",moveHandler);
		target.bind("touchend",endHandler);
		if (options.zoom && hasTouch) {
			if (!isAndroid) {
				target.on("gesturestart",gestureStartHandler);
				target.on("gesturechange",gestureChangeHandler);
				target.on("gestureend",gestureEndHandler);
			}
		}
	}
	function removeEvent() {
		jQuery(window).off("resize",resizeHandler);
		target.unbind("touchstart",startHandler);
		target.unbind("touchmove",moveHandler);
		target.unbind("touchend",endHandler);
		if (!isAndroid) {
			target.off("gesturestart",gestureStartHandler);
			target.off("gesturechange",gestureChangeHandler);
			target.off("gestureend",gestureEndHandler);
		}
	}
	function resizeImage() {
		containerWidth = target.parent().width();
		containerHeight = target.parent().height();
		
		var size = getResizeData(width,height);
		
		scale = endScale = size.scale;
		if (options.autoMinScale) {
			options.minScale = size.scale;
		}
		moveTo(tx,ty);
	}
	function getResizeData(wid,hei) {
		var data = {
			width: wid,
			height: hei,
			scale: 1
		};
		var scale = 1;
		if (options.fill) {
			if ((data.width/containerWidth) < (data.height/containerHeight)) {
				if (data.width > containerWidth) {
					scale = containerWidth / data.width;
					data.width = containerWidth;
					data.height = data.height * scale;
				}
				if (data.height < containerHeight) {
					scale = containerHeight / data.height;
					data.height = containerHeight;
					data.width = data.width * scale;
				}
			} else {
				if (data.height > containerHeight) {
					scale = containerHeight / data.height;
					data.height = containerHeight;
					data.width = data.width * scale;
				}
			}
		} else {
			if (data.width > containerWidth) {
				scale = containerWidth / data.width;
				data.width = containerWidth;
				data.height = data.height * scale;
				data = getResizeData(data.width,data.height);
			}
			if (data.height > containerHeight) {
				scale =  containerHeight / data.height;
				data.height = containerHeight;
				data.width = data.width * scale;
				data = getResizeData(data.width,data.height);
			}
		}
		
		data.scale = data.width/width;
		return data;
	}
	
	function startHandler(e) {
		//タッチ位置の座標を取得
		var touch = e.originalEvent.touches[0];
		
		touchData.sx = touch.clientX;
		touchData.sy = touch.clientY;
		touchData.isMove = false;
		target.stop();
		
		if (isAndroid) {
			isMultiTouch = false;
		}
		
		e.preventDefault();
	}
	function moveHandler(e) {
		touchData.count = e.originalEvent.touches.length;
		var touchEvent = e.originalEvent;
		var touch = touchEvent.touches[0];
		//タッチ中で、ジェスチャー（指２本以上）でなければムーブ処理
		if (touchData.count === 1 && !touchData.isGesture) {
			touchData.isMove = true;
			var x = touch.clientX;
			var y = touch.clientY;
			
			touchData.time = (new Date()).getTime();
			
			touchData.dx = (touchData.sx - x);
			touchData.dy = (touchData.sy - y);
			
			move(touch.clientX,touch.clientY);
		} else if (touchData.count === 2 && isAndroid) {
			var distance = Math.floor(getTouchDistance(touch.clientX,touch.clientY,touchEvent.touches[1].clientX,touchEvent.touches[1].clientY));
			
			
			if (!isMultiTouch) {
				isMultiTouch = true;
				touchDistance = distance;
			}
			var dist = distance / touchDistance;

			var s = scale * (1 + (dist - 1) / 2);
			endScale = s;
			
			move(touchData.sx,touchData.sy);
		}
		e.preventDefault();
	}
	function getTouchDistance(ax,ay,bx,by) {
		var x = ax - bx;
		var y = ay - by;
		return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	}
	function endHandler(e) {
		if (touchData.count === 1) {
			var interval = (new Date()).getTime() - touchData.time;
			if (interval < 250 && touchData.count === 1 && touchData.isMove) {
				var it = (250 - interval) / 100;
				var mx = tx - touchData.dx * (1.0 + it) * 3;
				var my = ty - touchData.dy * (1.0 + it) * 3;
				
				
				moveTo(mx,my,options.easeTime);
			}
		}
		if (isMultiTouch) {
			scale = endScale;
			isMultiTouch = false;
		}
		
		touchData.isMove = false;
		touchData.isGesture = false;
		e.preventDefault();
	}
	function gestureStartHandler(e) {
		e.preventDefault();
	}
	function gestureChangeHandler(e) {
		touchData.isGesture = true;
		var s = scale * (1 + (e.originalEvent.scale - 1) / 2);
		endScale = s;
		move(touchData.sx,touchData.sy);
		e.preventDefault();
	}
	function gestureEndHandler(e) {
		scale = endScale;
		e.preventDefault();
	}
	function wheelHandler(e) {
		e.preventDefault();
	}
	function resizeHandler(e) {
		resizeImage();
		e.preventDefault();
	}
	function move(x,y,easing,callback) {
		//タッチスタート位置を現在地にする
		var mx = x - touchData.sx;
		var my = y - touchData.sy;
		touchData.sx = x;
		touchData.sy = y;
		moveTo(tx + mx,ty + my, easing, callback);
	}
	function moveTo(x,y,easing,callback) {
		if (endScale < options.minScale) {
			endScale = options.minScale;
		} else if (endScale > options.maxScale) {
			endScale = options.maxScale;
		}
		if (scale < options.minScale) {
			scale = options.minScale;
		} else if (scale > options.maxScale) {
			scale = options.maxScale;
		}
		var wid = width * endScale;
		var hei = height * endScale;
		var xOut = (wid-containerWidth) / 2;
		var yOut = (hei-containerHeight) / 2;
		
		if (hei <= containerHeight) {
			y =0;
		} else if (y < -yOut) {
			y = -yOut;
		} else if (y > yOut) {
			y = yOut;
		}
		if (wid <= containerWidth) {
			x = 0;
		} else if (x < -xOut) {
			x = -xOut;
		} else if (x > xOut) {
			x = xOut;
		}
		if (easing) {
			target.animate({
				tx: x,
				ty: y,
				z: endScale
			},
			{
				duration: easing,
				easing: "quart",
				step: stepHandler,
				complete: callback
			});
		} else {
			target.css("webkitTransform","translate(-50%,-50%) " + getTranslate(x,y) + " scale(" + endScale + "," + endScale + ")");
			
			tx = x;
			ty = y;
			
			target.animate({
				tx: tx,
				ty: ty,
				z: endScale
			},{duration:0,complete:callback});
		}
	}
	
	function stepHandler(t) {
		if (this.tx !== undefined && this.ty !== undefined && this.z !== undefined) {
			target.css("webkitTransform","translate(-50%,-50%) " + getTranslate(this.tx,this.ty) + " scale(" + this.z + "," + this.z + ")");
			tx = this.tx;
			ty = this.ty;
		}
	}
	
	function error(message) {
		if (window.console) {
			window.console.error(message);
		} else {
			alert(message);
		}
	}
	jQuery(window).load(init);
	return functions;
}