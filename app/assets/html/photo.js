const photo = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width,target-densitydpi=high-dpi,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <script src="json2.js" type="application/javascript"></script>
    <script src="fabric.min.js" type="application/javascript"></script>
    <script src="imageFilters.js" type="application/javascript"></script>
    <script src="forHtml.js" type="application/javascript"></script>
    <title></title>
</head>
<body style="margin: 0;padding:0;border:0px solid #f00;background:#000;">
<!--<div style="overflow:hidden; height:300px;">-->
<div id="cFrame"
     style="display:-webkit-flex;display:flex;align-items:center;justify-content:center;height:400px;width:100%;">
    <canvas id="c" style="margin:0;padding:0;"></canvas>
</div>
<div>
    <image id="image-origin" style="display:none;"/>
</div>
<!--</div>-->
<script type="application/javascript">
    var maxHeight = null;
    var deviceWindow = null;
    var displaySize = null;
    var originImg = null;
    var currentImg = null;
    var intervalId = setInterval(function () {
        if (!window.postMessage) {
            return;
        }
        clearInterval(intervalId);

        window.postMessage('{"type":"bridgeReady"}');
        var imageClickable = false;
        var imgElementOrigin = document.getElementById('image-origin');
        var canvas = document.getElementById('c');
        var canvasFab = new fabric.Canvas('c', {
            isDrawingMode: false,
            renderOnAddRemove: true,
            controlsAboveOverlay: false
        });
        var canvasParent = canvas.parentElement;
        var imgFab = null;
        var scale = 1;

        var tags = {};
        var padding = 10;
        var activeTag = null;
        var tagUID = 0;
        var choseStickers = {};
        var imageFilters = {
            brightness: new fabric.Image.filters.Brightness({brightness: 0}),
            contrast: new fabric.Image.filters.Contrast({contrast: 1}),
            //pixelate: new fabric.Image.filters.Pixelate({blocksize: 4}),
            //invert: new fabric.Image.filters.Invert(),
            sepia: new fabric.Image.filters.Sepia(),
            sepia2: new fabric.Image.filters.Sepia2(),
            tint: new fabric.Image.filters.Tint({color: '#000000', opacity: 0.5}),
            //blur: new fabric.Image.filters.Convolute({matrix: [ 1/9, 1/9, 1/9,
            //    1/9, 1/9, 1/9,
            //    1/9, 1/9, 1/9 ]
            //}),
            sharpen: new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0]
            })
        };

        var getPosSet1 = function (textWidth, textHeight) {
            return {
                textPositions: [
                    {left: padding, top: -textHeight * 0.5},
                    {left: -(textWidth + padding), top: -textHeight * 0.5},
                    {left: padding, top: -textHeight * 1.5},
                    {left: -(textWidth + padding), top: -textHeight * 1.5}],
                polylines: [
                    [{x: 0, y: 0}, {x: padding, y: textHeight * 0.5}, {x: textWidth + padding, y: textHeight * 0.5}],
                    [{x: 0, y: 0}, {x: -padding, y: textHeight * 0.5}, {
                        x: -(textWidth + padding),
                        y: textHeight * 0.5
                    }],
                    [{x: 0, y: 0}, {x: padding, y: -textHeight * 0.5}, {x: textWidth + padding, y: -textHeight * 0.5}],
                    [{x: 0, y: 0}, {x: -padding, y: -textHeight * 0.5}, {
                        x: -(textWidth + padding),
                        y: -textHeight * 0.5
                    }]],
                polylinePositions: [
                    {left: 0, top: 0},
                    {left: -(textWidth + padding), top: 0},
                    {left: 0, top: -textHeight * 0.5},
                    {left: -(textWidth + padding), top: -textHeight * 0.5}]
            };
        };

        var addTagLabel = function (text, e, group, index) {
            if (!text || !e) {
                return
            }

            var textFab = new fabric.Text(text, {selectable: false, fill: "#fff", fontSize: 12 * scale, evented: true});
            var posSet = getPosSet1(textFab.getWidth(), textFab.getHeight());
            textFab.setLeft(e.offsetX + posSet.textPositions[index].left);
            textFab.setTop(e.offsetY + posSet.textPositions[index].top);

            var poly = new fabric.Polyline(posSet.polylines[index], {
                selectable: false,
                stroke: 'white',
                fill: null,
                strokeWidth: scale
            });
            poly.setLeft(e.offsetX + posSet.polylinePositions[index].left);
            poly.setTop(e.offsetY + posSet.polylinePositions[index].top);
            group.add(textFab, poly);
        };

        var applyFilters = function () {
            window.postMessage('imageFilters');
            var appliedFilters = Object.keys(imageFilters).filter(function (filterName) {
                return imageFilters[filterName].checked;
            }).map(function (filterName) {
                return imageFilters[filterName];
            });

            imgFab.filters = appliedFilters;
            imgFab.applyFilters(canvasFab.renderAll.bind(canvasFab));
            window.postMessage(JSON.stringify({type: "imageUpdated"}));
        }

        var applyBrightness = function (value) {
            var filterBrightness = imageFilters['brightness'];
            var filterTint = imageFilters['tint'];
            if (value > 0.5) {
                filterTint.checked = !(filterBrightness.checked = true);
                filterBrightness.setOptions({brightness: (value - 0.5) * 255});
            } else {
                filterBrightness.checked = !(filterTint.checked = true);
                filterTint.setOptions({opacity: (0.5 - value), color: '#000000'});
            }
            applyFilters();
        };

        var applyContrast = function (value) {
            var filterContrast = imageFilters['contrast'];
            filterContrast.setOptions({contrast: value});
            filterContrast.checked = true;
            applyFilters();
        };

        var currentRotate = 0;
        var applyRotate = function () {
            if (currentRotate === 0) {
                Rotate90();
                currentRotate = 90;
            } else if (currentRotate === 90) {
                Rotate180();
                currentRotate = 180;
            } else if (currentRotate === 180) {
                Rotate270();
                currentRotate = 270;
            } else if (currentRotate === 270) {
                Rotate0();
                currentRotate = 0;
            }
//                Rotate0()
        };

        var Rotate0 = function () {
            canvasFab.setDimensions({width: displaySize.width, height: displaySize.height}, {cssOnly: true});
            canvasFab.setDimensions({width: originImg.width, height: originImg.height}, {backstoreOnly: true});
            imgFab.set({
                angle: 0,
                top: 0
            });
            currentImg = {
                width: originImg.width,
                height: originImg.height
            };
            canvasFab.renderAll();
            window.postMessage(JSON.stringify({type: "imageUpdated"}));
        };

        var Rotate90 = function () {
            canvasFab.setDimensions({width: displaySize.height, height: displaySize.width}, {cssOnly: true});
            canvasFab.setDimensions({width: originImg.height, height: originImg.width}, {backstoreOnly: true});
            imgFab.set({
                angle: 90,
                left: originImg.height,
            });
            canvasFab.renderAll();
            currentImg = {
                width: originImg.height,
                height: originImg.width
            };
            window.postMessage(JSON.stringify({type: "imageUpdated"}));
        };

        var Rotate180 = function () {
            canvasFab.setDimensions({width: displaySize.width, height: displaySize.height}, {cssOnly: true});
            canvasFab.setDimensions({width: originImg.width, height: originImg.height}, {backstoreOnly: true});
            imgFab.set({
                angle: 180,
                left: originImg.width,
                top: originImg.height,
            });
            currentImg = {
                width: originImg.width,
                height: originImg.height
            };
            canvasFab.renderAll();
            window.postMessage(JSON.stringify({type: "imageUpdated"}));
        };

        var Rotate270 = function () {
            canvasFab.setDimensions({width: displaySize.height, height: displaySize.width}, {cssOnly: true});
            canvasFab.setDimensions({width: originImg.height, height: originImg.width}, {backstoreOnly: true});
            imgFab.set({
                angle: 270,
                top: originImg.width,
                left: 0
            });
            canvasFab.renderAll();
            currentImg = {
                width: originImg.height,
                height: originImg.width
            };
            window.postMessage(JSON.stringify({type: "imageUpdated"}));
        };

        window.document.addEventListener('message', function (e) {
            var message = e.data;
            try {
                message = JSON.parse(message);
            } catch (e) {
                window.postMessage(e.message);
                return;
            }

            if (message.type === 'beautify') {
                if (message.beautify == 'brightness') {
                    applyBrightness(message.value);
                } else if (message.beautify == 'contrast') {
                    applyContrast(message.value);
                } else if (message.beautify == 'rotate') {
                    applyRotate();
                }
            } else if (message.type === 'filter') {
                Object.keys(imageFilters).forEach(function (filterName) {
                    imageFilters[filterName].checked = false;
                });

                if (message.value != 'none') {
                    var filter = imageFilters[message.value];
                    filter.checked = !filter.checked;
                }

                applyFilters();
            } else if (message.type === 'addSticker') {
                fabric.loadSVGFromString(stickers.myStickers[message.name].uri, function (objects, options) {
                    var shape = fabric.util.groupSVGElements(objects, options);
                    shape.set({
                        left: originImg.width / 2 - 120,
                        top: originImg.height / 2 - 120,
                        angle: 0,
                        scaleX: 2,
                        scaleY: 2,
                        flipY: false
                    });
                    shape.setControlsVisibility({
                        'mtr': false,
                        'bl': false,
                        'br': false,
                        'mb': false,
                        'tl': false,
                        'tr': false,
                        'mt': false,
                        'ml': false,
                        'mr': false
                    });
                    canvasFab.add(shape);
                    choseStickers[message.name] = shape;
                    canvasFab.renderAll();
                });

                window.postMessage(JSON.stringify({type: "addedSticker"}));

            } else if (message.type === 'removeSticker') {

                canvasFab.remove(choseStickers[message.name]);
                window.postMessage(JSON.stringify({type: "removedSticker"}));

            } else if (message.type == 'continue') {

                // remove controls before export to data url.
                canvasFab.getActiveObject() && canvasFab.getActiveObject().setOptions({hasControls: false});
                window.postMessage(JSON.stringify({
                    type: "continue",
                    imageData: canvasFab.toDataURL({format: 'jpeg'}),
                    ImgSize: currentImg
                }));

            } else if (message.type == 'toSvg') {
                var svgResult = canvasFab.toSVG({suppressPreamble: true});
                window.postMessage(JSON.stringify({type: "toSvg", imageData: svgResult}));
            } else if (message.type === 'imageReady') {
                deviceWindow = message.window;
                imgElementOrigin.addEventListener('load', function () {

                    imgFab = new fabric.Image(imgElementOrigin, {
                        left: 0,
                        top: 0,
                        angle: 0,
                        opacity: 1,
                        meetOrSlice: "meet",
                        selectable: false,
                        evented: false
                    });
                    canvasFab.backgroundImage = imgFab;
                    canvasFab.renderAll();

                    canvasFab.on("mouse:up", function (data) {
                        if (!imageClickable) {
                            return
                        }

                        var target = data.target, e = data.e, position = {
                            offsetX: e.pageX - canvasParent.offsetLeft,
                            offsetY: e.pageY - canvasParent.offsetTop
                        };

                        if (target == null) {
                            window.postMessage(JSON.stringify({
                                type: "clickImage",
                                x: position.offsetX,
                                y: position.offsetY
                            }));
                        } else if(target != null
                            && target.type == 'circle'){
                            window.postMessage(JSON.stringify({
                                type: "showAddedTag",
                                id: target.__uid
                            }));

                        } else {
                            activeTag = null;
                        }
                    });

                    canvasFab.on("mouse:down", function (data) {
                        var target = data.target, e = data.e.targetTouches[0];

                        if (target != null && target.type == 'circle' ) {
                            var group = tags[target.__uid].group;
                            activeTag = {
                                tag: target,
                                group: group,
                                downPos: {offsetX: e.pageX, offsetY: e.pageY},
                                groupOriginPos: {left: group.getLeft(), top: group.getTop()}
                            };
                        } else if (target != null && target.type == 'group'){
//                            alert(JSON.stringify(data))
                        } else {
                            activeTag = null;
                        }

                    });

                    canvasFab.on("mouse:move", function (data) {
                        if (activeTag != null) {
                            var target = data.target,
                                e = data.e.targetTouches[0],
                                group = activeTag.group,
                                downPos = activeTag.downPos,
                                groupOriginPos = activeTag.groupOriginPos;
                            if (group != null) {
                                group.setLeft(groupOriginPos.left + (e.pageX - downPos.offsetX) * scale);
                                group.setTop(groupOriginPos.top + (e.pageY - downPos.offsetY) * scale);
                            }
                        }
                    });

                    window.postMessage(JSON.stringify({type: "imageUpdated"}));
                });
                if (message.data) {
                    maxHeight = message.window.height - 280 + 20;
                    displaySize = {
                        width: message.image.width,
                        height: message.image.height
                    };
                    originImg = {
                        width: message.image.width,
                        height: message.image.height
                    };
                    document.getElementById('cFrame').style.height = maxHeight + 'px';
                    if (message.image.height > maxHeight) {
                        displaySize.height = maxHeight;
                        displaySize.width = (maxHeight / message.image.height * message.image.width);
                    }

                    if (displaySize.width > message.window.width) {
                        displaySize.height = (message.window.width / displaySize.width * displaySize.height);
                        displaySize.width = message.window.width;
                    }

                    canvasFab.setDimensions(displaySize, {cssOnly: true});
                    canvasFab.setDimensions({
                        width: message.image.width,
                        height: message.image.height
                    }, {backstoreOnly: true});

                    scale = message.image.width / displaySize.width;
                    padding *= scale;

                    imgElementOrigin.src = message.data;
                    currentImg = originImg;

                    window.postMessage(JSON.stringify({canvasFab: {width: canvasFab.width, height: canvasFab.height}}));
                }

            } else if (message.type === "changeTab") {

                imageClickable = !!message.imageClickable;

            } else if (message.type === "addTag") {
                window.postMessage(JSON.stringify(message));
                var position = {offsetX: message.data.x, offsetY: message.data.y};
                var radius = 6 * scale;
                var circle = new fabric.Circle({
                    radius: radius,
                    fill: "#fff",
                    left: (position.offsetX - radius),
                    top: (position.offsetY - radius),
                    selectable: true,
                    evented: true,
                    hasControls: false,
                    __uid: message.data.index
                });
//                circle.id = ++tagUID;
                circle.id = message.data.index;

                var group = new fabric.Group(null, {subTargetCheck: true, evented: true, selectable: true}, false);

                //group.setOriginX(e.offsetX);
                //group.setOriginY(e.offsetY);

                if(message.data.name.length > 10){
                    message.data.name = message.data.name.substring(0,12) + '...';
                }
                addTagLabel((message.data.brand || '') + (message.data.name || ''), position, group, 0);
//                addTagLabel(message.data.city, position, group, 1);
                if(message.data.price)
                    addTagLabel('￥'+(message.data.price || '') , position, group, 3);
//                addTagLabel(message.data.address, position, group, 3);

                canvasFab.add(circle);
                canvasFab.add(group);

                tags[message.data.index] = {circle: circle, group: group};
                //var textFab = new fabric.Text(message.data.name, {left: message.data.position.left, top: message.data.position.top, selectable:false});
                //canvasFab.add(textFab);
            } else if (message.type === "removeTag"){
                canvasFab.remove(tags[message.data.index].circle);
                canvasFab.remove(tags[message.data.index].group);
            }

        });

    }, 500);
</script>
</body>
</html>`;

export default photo;