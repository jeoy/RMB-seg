$(function () {

    // if ( !$("#path").val() ){
    // 	disabled ="enabled"
    // }
    var record = "";
    var count = 0;

    var fileName = "";
    var oX, oY;
    var rectangle;
    var listCount;
    var scale;
    var isStart = true
    var canvasW,
        canvasH,
        startX,
        startY,
        moveX,
        moveY,
        endX,
        endY,
        distanceX,
        distanceY,
        lastX,
        lastY;

    var canvasDate = {};
    var recordIn = '';
    var isResize = false;
    var cat = '';

    var output = '';

    var nameArr,
        resultArr;
    // $("#store").animate({scrollTop:$("#store")[0].scrollHeight - $("#store").height()},1000) ;
    // $("#preview").attr("src","img/logoGray.png");
    var tool = 'pen'
    // $('#toolsBar').on("click", "option", function () {
    //     isStart = true
    //     tool = $(this).val()
    // })
    var resultArrWrap = []

    if (window.localStorage.SEGRESULT) {
        $('#resultDiv textarea').val(window.localStorage.SEGRESULT)
        $("#resultArea").animate({
            scrollTop: $("#resultArea")[0].scrollHeight - $("#resultArea").height()
        }, 1000)

        resultArrWrap = JSON.parse(window.localStorage.SEGRESULT)
    }
    var pointSize = 3;
    var pointColor = '#000'
    $('#pointSize').on('input propertychange',function(){
        pointSize = parseInt($('#pointSize').val());
    });

    $('#pointColor').on('input propertychange',function(){
        pointColor = $('#pointColor').val();
    });
    $('#clearResult').click(function () {
        var msg = "这样做会清除所有结果,不可恢复\n\n请确认！";
        if (confirm(msg) == true) {
            $('#resultArea').val('')
            resultArrWrap = []
            window.localStorage.SEGRESULT = ''
        } else {
            return false;
        }

    })
    // output
    $('#submit').click(function () {
        if (penPath.length % 5 !== 0) {
            alert('标记点个数不是5的倍数');
            return;
        }
        console.log(penPath);
        resultArr = [];
        result = JSON.parse(JSON.stringify(penPath));
        result.forEach(item => {
            item[0] -= 200;
            item[1] -= 140
        })
        if (resultArr.length) {
            resultArr.push(result);
        } else {
            resultArr = JSON.parse(JSON.stringify(result));
        }
        var resultArrTemp = JSON.parse(JSON.stringify(resultArr))
        let jsonObj = {}
        jsonObj = {
            fileName,
            count: (resultArrTemp.length - resultArrTemp.length % 5) / 5,
            mark_pt: resultArrTemp
        }
        resultArrWrap.push(jsonObj);
        window.localStorage.SEGRESULT = JSON.stringify(resultArrWrap)
        $('#resultDiv textarea').val(window.localStorage.SEGRESULT)
        $("#nextImg").click();

        $("#resultArea").animate({
            scrollTop: $("#resultArea")[0].scrollHeight - $("#resultArea").height()
        }, 1000)
        return

        // $("#toolsBar option:checked").remove()
        // $('#toolsBar option')[1].selected = false
        // $('#toolsBar option')[0].selected = true
    })

    $("#genFileList").click(function () {
        if ($("#fileListInput").val()) {
            var fileArr = $("#fileListInput").val().split("\n");
            var selectDom = $("<select multiple></select>");

            $("#fileListInput").slideUp(1000);
            for (var i = 0; i < fileArr.length; i++) {
                if (fileArr[i]) {
                    var newOption = $("<option>" + fileArr[i] + "</option>");
                    newOption.appendTo(selectDom);
                    if (!canvasDate[fileArr[i]]) {
                        canvasDate[fileArr[i]] = []
                    }
                    // recordIn[fileArr[i]] = []
                }

            }
            $("#fileList").append(selectDom);
            $("#fileList select").slideDown(1000, function () {

                $("#fileList").trigger("change");
                $("#fileList option:eq(0)").click();
                $("#fileList option:eq(0)")[0].selected = "selected";
                // fileName =  $("#fileList option:eq(0)").val();
                // recordIn = fileName + " " + 0

                // $("#mark").val(recordIn);
                // count = 0;
                // $("#preview").attr("src","data/"+ fileName);
            });
            $(this).slideUp(1000);
            $("#nextImg").attr("disabled", false);
            $("#preImg").attr("disabled", false);
        } else {
            alert("按下方按钮导入文件")
        }

    });

    $("#nextImg").click(function () {
        var currOption,
            slecetScrollTop;

        currOption = $("#fileList option:selected");

        if (currOption.val() == $("#fileList option:last").val()) {

        } else {
            currOption.next().click();
            currOption[0].selected = "";
            currOption.next()[0].selected = "selected";
        }
        if (listCount == 8) {
            slecetScrollTop = $("#fileList select").scrollTop() + 40;
            $("#fileList select").animate({
                scrollTop: slecetScrollTop
            }, 200);
        } else {
            listCount++;
        }

        // currOption.val()
    });
    $("#preImg").click(function () {
        var currOption;
        currOption = $("#fileList option:selected");

        if (currOption.val() == $("#fileList option:first").val()) {

        } else {
            currOption.prev().click();
            currOption[0].selected = "";
            currOption.prev()[0].selected = "selected";
        }

        if (listCount == 1) {
            slecetScrollTop = $("#fileList select").scrollTop() - 40;
            $("#fileList select").animate({
                scrollTop: slecetScrollTop
            }, 200);
        } else {
            listCount--;
        }

    });

    $('#mask').hide()
    $('#mask2').hide()
    var canvasDom = $("#myCanvas");
    var oGC = canvasDom[0].getContext("2d");
    oGC.lineWidth = 3;
    var oriWidth,
        oriHeight;
    // oGC.strokeStyle = 'rgba(14,255,7,1)';

    $("#preview").on('load', function () {
        oriWidth = getNaturalWidth(this)
        oriHeight = getNaturalHeight(this)
        canvasDom[0].width = oriWidth
        canvasDom[0].height = oriHeight
        oGC.lineWidth = 1;
        console.log('改变canvas大小')
        penPath = []
        $('#mask').css({
            width: oriWidth,
            height: oriHeight
        })
        //  $('#mask').show()
        $('#mask2').css({
            width: oriWidth,
            height: oriHeight
        })
        // $('#mask')[0].height = oriHeight
        rect(oGC, 1, 1, oriWidth - 2, oriHeight - 2);
        let screenWidth = document.body.clientWidth
        let screenHeight = document.body.clientHeight

        let adaptW = screenWidth - 200
        let adaptH = screenHeight - 140
        let tmpH = oriHeight * adaptW / oriWidth
        let tmpW = oriWidth * adaptH / oriHeight
        if (tmpH < adaptH) {
            adaptH = tmpH
            adaptW = adaptW
        } else {
            adaptW = tmpW
            adaptH = adaptH
        }
        scale = adaptW / oriWidth
        console.log('img load')
        // this.style = 'width:' + adaptW + 'px; height:' + adaptH + 'px;'
        // canvasDom[0].width = adaptW
        // 	canvasDom[0].height = adaptH

        // oGC.strokeStyle = 'rgba(14,255,7,1)';
        // for(let i = 0; i < canvasDate[fileName].length; i++ ){
        // 	canvasDate[fileName][i][7] = scale
        // }

        // oGC.clearRect(2,2, 3000,2500)

        //这里给 canvas 设置宽高会导致图形拉伸
        // [0].style = 'width:' + canvasW + 'px; height:' + canvasH + 'px;'

    })

    function saveFile(data, fileName) {
        var saveLink = document.createElement('a');
        saveLink.href = data;
        saveLink.download = fileName;
        saveLink.click();
        $('#mask2').hide()
    }
    var time4dblclick;
    var penPath = []
    var isDrag = false
    $("#undo").click(function () {
        if (typeof penPath[penPath.length - 1] === 'object') {
            var popVa = penPath[penPath.length - 1].pop()

            if (penPath[penPath.length - 1].length <= 1) {
                isStart = true
                if (penPath.length !== 1) {
                    penPath.pop()
                } else {
                    penPath = []
                }
            }

            //一次撤销曲线。。
            if (penPath.length && penPath[penPath.length - 1].length && penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1].length) {
                if (popVa[0] === penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1][penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1].length - 1][0]) {
                    penPath[penPath.length - 1].pop()
                }
            }

        } else if (typeof penPath[penPath.length - 1] === 'string') {
            var popVa = penPath.pop()
            $('#' + popVa).remove()
        }

        // if (popVa[0] === -1){
        // 	penPath.pop()
        // }
        // while(!popVa) {
        // 	penPath.pop()
        // 	popVa = penPath[penPath.length-1].pop()
        // }

        oGC.clearRect(2, 2, oriWidth - 3, oriHeight - 3)
        updateCanvas()
        // if(penPath.length >= 1){

        // }
    })
    var isConnectPoint = true
    var isConnectPoint2 = false
    function updateCanvas() {
        penPath.forEach(center => {
            circle(oGC, center[0], center[1], pointSize);
        })

    }

    function updateCanvasNew(newoGC) {
        for (var i = 0; i < penPath.length; i++) {
            for (var j = 0; j < penPath[i].length; j++) {
                if (typeof penPath[i][j][0] === 'number') {
                    isConnectPoint = true
                    if (penPath[i][j + 1]) {
                        line(newoGC, penPath[i][j][0], penPath[i][j][1], penPath[i][j + 1][0], penPath[i][j + 1][1])
                    }
                } else {
                    let curveArr = penPath[i][j]
                    if (penPath[i][j - 1]) {
                        if (isConnectPoint) {
                            if (curveArr[0]) {
                                line(newoGC, penPath[i][j - 1][0], penPath[i][j - 1][1], curveArr[0][0], curveArr[0][1])
                                console.log('draw connect point')
                                isConnectPoint = false
                            }
                        }
                    }
                    for (let k = 0; k < curveArr.length - 1; k++) {
                        if (curveArr[k + 1]) {
                            line(newoGC, curveArr[k][0], curveArr[k][1], curveArr[k + 1][0], curveArr[k + 1][1])

                        }
                    }

                }
            }

        }

    }

    dragStartFromNewGraph = true
    canvasDom.mousemove(function (e) {
        moveY = e.pageY
        moveX = e.pageX
        // var markX = ((+(e.pageX ) - 200) ).toFixed(0)
        // var markY = ((+(e.pageY ) - 140) ).toFixed(0)
        $('.mousePosition').html("X Position:" + (moveX - 200) + "<br>   Y Position:" + (moveY - 140));

        // $('.mousePosition').html($("fileList").height());
    }).click(function (e) {
        time4dblclick = setTimeout(function () {
            switch (tool) {
            case 'pen':
                oGC.clearRect(2, 2, oriWidth - 3, oriHeight - 3)

                // circle(oGC, e.pageX, e.pageY, 20 );
                // return
                // if (isStart && dragStartFromNewGraph) {
                //     console.log('isStart')
                //     firstPointX = e.pageX
                //     firstPointY = e.pageY
                //     line(oGC, firstPointX - 1, firstPointY - 1, firstPointX, firstPointY)
                //     penPath.push([])
                //     dragStartFromNewGraph = false
                // }
                // isStart = false
                startX = e.pageX
                startY = e.pageY
                console.log('into click')

                if (!penPath) {
                    penPath = []
                }

                // if (typeof penPath[penPath.length - 1] === 'string') {
                //     penPath.push([])
                // }

                penPath.push([startX, startY])

                updateCanvas(penPath)

                console.log(penPath)

                lastX = startX
                lastY = startY
                break;
            default:

            }
        }, 1);

    }).bind("contextmenu", function () {
        return false;
    }).mousedown(function (e) {
        var e = e || window.event
        //  alert("e"+e.button);
        if (e.button == "2") {
            if (typeof penPath[penPath.length - 1][0][0] === 'number') {
                line(oGC, penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1][0], penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1][1], penPath[penPath.length - 1][0][0], penPath[penPath.length - 1][0][1])
                penPath[penPath.length - 1].push([penPath[penPath.length - 1][0][0], penPath[penPath.length - 1][0][1]])
            } else {
                line(oGC, penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1][0], penPath[penPath.length - 1][penPath[penPath.length - 1].length - 1][1], penPath[penPath.length - 1][0][0][0], penPath[penPath.length - 1][0][0][1])
                //  penPath[penPath.length-1].push([penPath[penPath.length-1][0][0][0], penPath[penPath.length-1][0][0][1]])
                penPath[penPath.length - 1].push([penPath[penPath.length - 1][0][0], penPath[penPath.length - 1][0][1]])

            }
            //  penPath.push([-1,-1])
            lastX = -1
            lastY = -1
            isStart = true
            dragStart = false
            dragStartFromNewGraph = true
            e.preventDefault()
            event.returnvalue = false;
            return false
        } else if (e.button == "0") {
            //  console.log('mouseDown')
            dragStart = true
            isConnectPoint = true
            dragging = true
        }
        //  preventDefault()
    }).mouseup(function (e) {
        // console.log('mouseUp')
        isConnectPoint = false
        // isConnectPoint2 = true
        dragging = false
    })

    // 	.dblclick(function(e){
    // 		// clearTimeout(time4dblclick);
    // 		line(oGC, lastX, lastY, firstPointX, firstPointY)
    // 		penPath.push([firstPointX,firstPointY])
    // 		penPath.push([-1,-1])
    // 		lastX = -1
    // 		lastY = -1
    // 		isStart = true
    // });
    var dragging = false

    $("#category").on("click", "option", function () {
        tool = 'paintPot'
        // $("#toolsBar option:checked").remove()
        // $('#toolsBar option')[0].selected = false
        // $('#toolsBar option')[1].selected = true
    })
    $('#searchBox').keyup(function () {
        let val = $(this).val()
        if (val) {
            for (var i = 0; i < categoryArr.length; i++) {
                let index = categoryArr[i][0].indexOf(val)
                if (index === -1) {
                    $("#category option:eq(" + i + ")").hide()
                } else {
                    $("#category option:eq(" + i + ")").show()
                }
            }
        } else {
            for (var i = 0; i < categoryArr.length; i++) {
                $("#category option:eq(" + i + ")").show()
            }
        }
    })
    $("#fileList").on("click", "option", function () {
        tool = 'pen'
        // $('#toolsBar option')[2].selected = false
        // $('#toolsBar option')[1].selected = false
        // $('#toolsBar option')[0].selected = true
        lastX = -1
        lastY = -1
        isStart = true
        canvasInd = 0
        console.log('onchange')
        $('.newCanvas').remove()
        // $("option").click(function(){
        record = '';
        recordIn = '';
        if ($('#auto').prop('checked')) {
            start = true;
        } else {
            start = false;
        }
        if (!listCount) {
            listCount = $("#fileList option").index($(this));
        }

        fileName = $(this).val();
        // //初始化列表框
        // recordIn = fileName + " " + 0
        //
        // if (canvasDate[fileName].length) {
        // 	for ( i = 0; i< canvasDate[fileName].length; i++){
        // 		record += canvasDate[fileName][i][6] + ' '
        // 		record += (+canvasDate[fileName][i][0]).toFixed(0)  + ' '
        // 		record += (+canvasDate[fileName][i][1]).toFixed(0)  + ' '
        // 		record += (+canvasDate[fileName][i][4]).toFixed(0)  + ' '
        // 		record += (+canvasDate[fileName][i][5]).toFixed(0)  + ' '
        //
        // 	}
        // 	recordIn = fileName + " " + canvasDate[fileName].length + " "+ record;
        // }
        //
        // $("#mark").val(recordIn);

        count = 0;
        $("#preview").attr("src", "data/" + fileName);

        // });
    });

    $('#upload').change(function () {

        if ($('#auto').prop('checked')) {
            start = true;
        } else {
            start = false;
        }
        fileName = $('#upload')[0].files[0].name + "  ";

        count = 0;

        $("#preview").attr("src", "data/" + fileName);
    });

    function getNaturalWidth(img) {
        var image = new Image()
        image.src = img.src
        var naturalWidth = image.width
        return naturalWidth
    }

    function getNaturalHeight(img) {
        var image = new Image()
        image.src = img.src
        var naturalHeight = image.height
        return naturalHeight
    }

    // fortest
    // $("#fileListInput").val('BG2.jpg\nBG1.jpg');
    //
    // $("#genFileList").click();
    // $('#addNewDots').click();

    $("#file").on("change", function () {
        // console.log(files)
        var files = $(this)[0].files
        if (files.length) {
            var file = files[0];
            var reader = new FileReader();
            if (/text\/\w+/.test(file.type)) {
                reader.onload = function () {
                    var regExName = /\w+\.\w+/gm
                    nameArr = this.result.match(regExName)
                    resultArr = this.result.split('\n')

                    $("#fileListInput").val(nameArr.join('\n'));

                    $("#genFileList").click();
                }
                reader.readAsText(file);
            } else if (/image\/\w+/.test(file.type)) {
                reader.onload = function () {
                    $('<img src="' + this.result + '"/>').appendTo('body');
                }
                reader.readAsDataURL(file);
            }
        }
    });

    $("#ConfigFile").on("change", function () {
        //gen categoryArr from ConfigFile
        var files = $(this)[0].files
        if (files.length) {
            var file = files[0];
            var reader = new FileReader();
            if (/text\/\w+/.test(file.type)) {
                reader.onload = function () {
                    resultArr = this.result.trim().split('\n')
                    for (var i = 0; i < resultArr.length; i++) {
                        categoryArr[i] = resultArr[i].split(' ')
                    }

                    if (categoryArr.length) {
                        for (var i = 0; i < categoryArr.length; i++) {
                            var newCateDom = $('<option value="' + categoryArr[i][0] + '">' + categoryArr[i][0] + '</option>')
                            newCateDom.css('background-color', categoryArr[i][1])
                            $(".category").append(newCateDom);
                            $(".category :last-child").attr('selected', 'selected').siblings().attr('selected', false)
                        }
                    }

                }
                reader.readAsText(file);
            }

        }

    });

    $("#color").val('#' + Math.floor(Math.random() * 16777215).toString(16))

    function getRGB(hex) {
        var rgb = [0, 0, 0];
        if (/#(..)(..)(..)/g.test(hex)) {
            rgb = [parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16), 255];
        };
        return rgb;
    }
    //从 localstorage 初始化 categoryw

    var categoryArr = [];

    $("#delCate").click(function () {
        let delVal = $(".category option:checked").val()
        categoryArr.remove(delVal)
        var preCurrChecked = $(".category option:checked").next().length ? $(".category option:checked").next() : $(".category option:checked").prev()

        $(".category option:checked").remove()
        if (preCurrChecked.length) {
            preCurrChecked[0].selected = 'selected'

        }
        // window.localStorage["data"] = JSON.stringify(categoryArr)

    })

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        var temp = []
        for (var i = 0; i < this.length; i++) {
            temp.push(this[i][0])
        }
        var index = temp.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    function line(context, x1, y1, x2, y2) {
        context.beginPath();
        context.lineWidth = 3;
        context.moveTo(x1 - 200, y1 - 140);
        context.lineTo(x2 - 200, y2 - 140);
        context.closePath();
        context.stroke();
    }

    function circle(context, x, y, a) { // x,y是坐标;a是半径
        var r = 0.09; // ①注意：此处r可以写死，不过不同情况下写死的值不同
        context.beginPath();
        x -= 200;
        y -= 140;
        context.fillStyle =  pointColor;
        context.moveTo(x + a, y);
        for (var i = 0; i < 2 * Math.PI; i += r) {
            context.lineTo(x + a * Math.cos(i), y + a * Math.sin(i));
        }
        context.closePath();
        context.fill();
    }

    function rect(context, x, y, x2, y2) { // x,y是坐标;a是半径
        context.beginPath();
        context.rect(x, y, x2, y2)
        context.closePath();
        context.stroke();
    }

    function EllipseOne(context, x, y, a, b) {
        var step = (a > b) ? 1 / a : 1 / b;
        context.beginPath();
        context.moveTo(x + a, y);
        for (var i = 0; i < 2 * Math.PI; i += step) {
            context.lineTo(x + a * Math.cos(i), y + b * Math.sin(i));
        }
        context.closePath();
        context.stroke();
    }

    var seedStack = []
    // rect(oGC,1,1,300,150);
    var canvasInd = 0;

    function scanLine(x, y, rgba, compareColor, newCanvas) {
        seedStack.push([x - 200, y - 140])
        canvasInd++
        var newCanvas = $('<canvas id="newCanvas' + canvasInd + '" class = "newCanvas">');

        newCanvas[0].width = oriWidth
        newCanvas[0].height = oriHeight

        penPath.push('newCanvas' + canvasInd)

        $("body").append(newCanvas)
        var newOGC = $('#newCanvas' + canvasInd + '')[0].getContext("2d")
        rect(newOGC, 1, 1, oriWidth - 2, oriHeight - 2);

        updateCanvasNew(newOGC)
        isStart = true
        //step 2
        var currenSeed;
        var xLeft,
            xRight;

        while (seedStack.length) {
            if (seedStack.length > 10000) {
                $('#mask').hide()
                console.log('栈溢出')
                return
            }
            currenSeed = seedStack.pop()
            var targetColor = newOGC.getImageData(currenSeed[0], currenSeed[1], 1, 1).data
            // if (rgba[0]==targetColor[0]) {
            //   $('#status').show()
            //   return
            // }
            if (currenSeed[0] != currenSeed[0]) {
                xLeft = currenSeed[0]
                xRight = currenSeed[0] - 1
            } else {
                // isFill = false

                xLeft = currenSeed[0]
                xRight = currenSeed[0]
            }
            //find xleft
            i = 1
            targetColor = newOGC.getImageData(currenSeed[0] - i, currenSeed[1], 1, 1).data
            while (targetColor[3] < 10) {
                fillColor(currenSeed[0] - i, currenSeed[1], rgba, newCanvas)
                xLeft = currenSeed[0] - i
                i++
                targetColor = newOGC.getImageData(currenSeed[0] - i, currenSeed[1], 1, 1).data
            }

            //find xRight
            i = 0
            targetColor = newOGC.getImageData(currenSeed[0] + i, currenSeed[1], 1, 1).data
            while (targetColor[3] < 10) {
                fillColor(currenSeed[0] + i, currenSeed[1], rgba, newCanvas)
                xRight = currenSeed[0] + i
                i++
                targetColor = newOGC.getImageData(currenSeed[0] + i, currenSeed[1], 1, 1).data
            }
            // console.log(xLeft,xRight)

            //find y+1's seed
            candidateSeed = 0
            for (var i = xLeft; i <= xRight; i++) {
                targetColor = newOGC.getImageData(i, currenSeed[1] + 1, 1, 1).data
                if (targetColor[3] < 10 && (rgba[0] != targetColor[0] || rgba[1] != targetColor[1] || rgba[2] != targetColor[2])) {
                    candidateSeed = i
                } else {
                    targetColor = newOGC.getImageData(i - 1, currenSeed[1] + 1, 1, 1).data
                    if (targetColor[3] < 10 && (rgba[0] != targetColor[0] || rgba[1] != targetColor[1] || rgba[2] != targetColor[2])) {
                        seedStack.push([i - 1, currenSeed[1] + 1])
                    }
                }
            }
            if (candidateSeed) {
                seedStack.push([candidateSeed, currenSeed[1] + 1])
                // console.log(candidateSeed,currenSeed[1]+1)
            }

            //find y-1's seed
            candidateSeed = 0
            for (var i = xLeft; i <= xRight; i++) {
                targetColor = newOGC.getImageData(i, currenSeed[1] - 1, 1, 1).data
                if (targetColor[3] < 10 && (rgba[0] != targetColor[0] || rgba[1] != targetColor[1] || rgba[2] != targetColor[2])) {
                    candidateSeed = i
                } else {
                    targetColor = newOGC.getImageData(i - 1, currenSeed[1] - 1, 1, 1).data
                    if (targetColor[3] < 10 && (rgba[0] != targetColor[0] || rgba[1] != targetColor[1] || rgba[2] != targetColor[2])) {
                        seedStack.push([i - 1, currenSeed[1] - 1])
                        // console.log(i - 1,currenSeed[1]-1)
                    }
                }
            }
            if (candidateSeed) {
                seedStack.push([candidateSeed, currenSeed[1] - 1])
                // console.log(candidateSeed,currenSeed[1]-1)
            }

        }

        $('#mask').hide()
    }

    function fillColor(x, y, rgba) {
        var newOGC = $('#newCanvas' + canvasInd + '')[0].getContext("2d")
        var imgData = newOGC.createImageData(1, 1);
        imgData.data[0] = rgba[0];
        imgData.data[1] = rgba[1];
        imgData.data[2] = rgba[2];
        imgData.data[3] = rgba[3];
        newOGC.putImageData(imgData, x, y);

    }

});
