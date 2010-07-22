YUI.add("scrollview-base",function(B){var G=B.ClassNameManager.getClassName,P="scrollview",O={vertical:G(P,"vert"),horizontal:G(P,"horiz")},C="scrollStart",D="scrollChange",S="scrollEnd",I="flick",A=I,H="ui",K="scrollY",L="scrollX",E="bounce",N="x",M="y",Q="boundingBox",J="contentBox",F=B.Transition.useNative;B.Node.DOM_EVENTS.DOMSubtreeModified=true;function R(){R.superclass.constructor.apply(this,arguments);}B.ScrollView=B.extend(R,B.Widget,{initializer:function(){this._createEvents();},_createEvents:function(){this.publish(C);this.publish(D);this.publish(S);this.publish(I);},_uiSizeCB:function(){},_transitionEnded:function(){this.fire(S);},bindUI:function(){var T=this.get(J),U=this.get(A);this.get(Q).on("gesturemovestart",B.bind(this._onGestureMoveStart,this));T.on("transitionend",B.bind(this._transitionEnded,this),false);if(F){T.on("DOMSubtreeModified",B.bind(this._uiDimensionsChange,this));}if(U){T.on("flick",B.bind(this._flick,this),U);}this.after({"scrollYChange":this._afterScrollYChange,"scrollXChange":this._afterScrollXChange,"heightChange":this._afterHeightChange,"widthChange":this._afterWidthChange,"renderedChange":function(){B.later(0,this,"_uiDimensionsChange");}});},syncUI:function(){this.scrollTo(this.get(L),this.get(K));},scrollTo:function(U,a,W,Z){var T=this.get(J),V=U*-1,Y=a*-1,X;W=W||0;Z=Z||R.EASING;if(U!==this.get(L)){this.set(L,U,{src:H});}if(a!==this.get(K)){this.set(K,a,{src:H});}X={easing:Z,duration:W/1000};if(F){X.transform="translate("+V+"px,"+Y+"px)";}else{X.left=V+"px";X.top=Y+"px";}T.transition(X);},_onGestureMoveStart:function(T){this._killTimer();var U=this.get(Q);this._moveEvt=U.on("gesturemove",B.bind(this._onGestureMove,this));this._moveEndEvt=U.on("gesturemoveend",B.bind(this._onGestureMoveEnd,this));this._moveStartY=T.clientY+this.get(K);this._moveStartX=T.clientX+this.get(L);this._moveStartTime=(new Date()).getTime();this._moveStartClientY=T.clientY;this._moveStartClientX=T.clientX;this._isDragging=false;this._snapToEdge=false;},_onGestureMove:function(T){this._isDragging=true;this._moveEndClientY=T.clientY;this._moveEndClientX=T.clientX;this._lastMoved=(new Date()).getTime();if(this._scrollsVertical){this.set(K,-(T.clientY-this._moveStartY));}if(this._scrollsHorizontal){this.set(L,-(T.clientX-this._moveStartX));}},_onGestureMoveEnd:function(Y){var a=this._minScrollY,W=this._maxScrollY,T=this._minScrollX,X=this._maxScrollX,V=this._scrollsVertical?this._moveStartClientY:this._moveStartClientX,U=this._scrollsVertical?this._moveEndClientY:this._moveEndClientX,Z=V-U;this._moveEvt.detach();this._moveEndEvt.detach();this._scrolledHalfway=false;this._snapToEdge=false;this._isDragging=false;if(this._scrollsHorizontal&&Math.abs(Z)>(this.get("width")/2)){this._scrolledHalfway=true;this._scrolledForward=Z>0;}if(this._scrollsVertical&&Math.abs(Z)>(this.get("height")/2)){this._scrolledHalfway=true;this._scrolledForward=Z>0;}if(this._scrollsVertical&&this.get(K)<a){this._snapToEdge=true;this.set(K,a);}if(this._scrollsHorizontal&&this.get(L)<T){this._snapToEdge=true;this.set(L,T);}if(this.get(K)>W){this._snapToEdge=true;this.set(K,W);}if(this.get(L)>X){this._snapToEdge=true;this.set(L,X);}if(this._snapToEdge){return;}if(+(new Date())-this._moveStartTime>100){this.fire(S,{staleScroll:true});return;}},_afterScrollYChange:function(T){if(T.src!==H){this._uiScrollY(T.newVal,T.duration,T.easing);}},_uiScrollY:function(U,T,V){T=T||this._snapToEdge?400:0;V=V||this._snapToEdge?R.SNAP_EASING:null;this.scrollTo(this.get(L),U,T,V);},_afterScrollXChange:function(T){if(T.src!==H){this._uiScrollX(T.newVal,T.duration,T.easing);}},_uiScrollX:function(U,T,V){T=T||this._snapToEdge?400:0;V=V||this._snapToEdge?R.SNAP_EASING:null;this.scrollTo(U,this.get(K),T,V);},_afterHeightChange:function(){this._uiDimensionsChange();},_afterWidthChange:function(){this._uiDimensionsChange();},_uiDimensionsChange:function(){var X=this.get(Q),T=this.get("height"),W=this.get("width"),V=X.get("scrollHeight"),U=X.get("scrollWidth");if(T&&V>T){this._scrollsVertical=true;this._maxScrollY=V-T;this._minScrollY=0;this._scrollHeight=V;X.addClass(R.CLASS_NAMES.vertical);}if(W&&U>W){this._scrollsHorizontal=true;this._maxScrollX=U-W;this._minScrollX=0;this._scrollWidth=U;X.addClass(R.CLASS_NAMES.horizontal);}},_flick:function(U){var T=U.flick;this._currentVelocity=T.velocity*T.direction;this._flicking=true;this._flickFrame();this.fire(I);},_flickFrame:function(){var X=this.get(K),V=this._maxScrollY,Z=this._minScrollY,Y=this.get(L),W=this._maxScrollX,T=this._minScrollX,U=R.FRAME_STEP;this._currentVelocity=(this._currentVelocity*this.get("deceleration"));if(this._scrollsVertical){X=this.get(K)-(this._currentVelocity*U);}if(this._scrollsHorizontal){Y=this.get(L)-(this._currentVelocity*U);}if(Math.abs(this._currentVelocity).toFixed(4)<=0.015){this._flicking=false;this._killTimer(!(this._exceededYBoundary||this._exceededXBoundary));if(this._scrollsVertical){if(X<Z){this._snapToEdge=true;this.set(K,Z);}else{if(X>V){this._snapToEdge=true;this.set(K,V);}}}if(this._scrollsHorizontal){if(Y<T){this._snapToEdge=true;this.set(L,T);}else{if(Y>W){this._snapToEdge=true;this.set(L,W);}}}return;}if(this._scrollsVertical&&(X<Z||X>V)){this._exceededYBoundary=true;this._currentVelocity*=this.get(E);}if(this._scrollsHorizontal&&(Y<T||Y>W)){this._exceededXBoundary=true;this._currentVelocity*=this.get(E);}if(this._scrollsVertical){this.set(K,X);}if(this._scrollsHorizontal){this.set(L,Y);}this._flickTimer=B.later(R.FRAME_STEP,this,"_flickFrame");},_killTimer:function(T){if(this._flickTimer){this._flickTimer.cancel();}if(T){this.fire(S);}},_setScroll:function(Z,Y){var V=this.get(E),U=R.BOUNCE_RANGE,X=(Y==N)?this._maxScrollX:this._maxScrollY,W=V?-U:0,T=V?X+U:X;if(!V||!this._isDragging){if(Z<W){Z=W;}else{if(Z>T){Z=T;}}}return Z;},_setScrollX:function(T){return this._setScroll(T,N);},_setScrollY:function(T){return this._setScroll(T,M);}},{NAME:"scrollview",ATTRS:{scrollY:{value:0,setter:"_setScrollY"},scrollX:{value:0,setter:"_setScrollX"},deceleration:{value:0.98},bounce:{value:0.7},flick:{value:{minDistance:10,minVelocity:0}}},CLASS_NAMES:O,UI_SRC:H,BOUNCE_RANGE:150,FRAME_STEP:10,EASING:"cubic-bezier(0, 0.1, 0, 1.0)",SNAP_EASING:"ease-out"});
},"@VERSION@",{skinnable:true,requires:["widget","event-gestures","transition"]});