let base_url = window.location.origin + '/' + window.location.pathname.split ('/') [1] + '/';
var thirdPrizeList = [];
var secondPrizeList = [];
var firstPrizeList = [];
var numberList = [];
var confetti;

// outline preparation
$(function(){
    var width = window.innerWidth;
    if(width < 992){
        $("#divMain")
            .css("color", "white")
            .html("Phiên bản hiện tại không hỗ trợ trên thiết bị của bạn. </br> Vui lòng sử dụng thiết bị có kích cỡ màn hình lớn hơn (PC/Laptop).");
    }

    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });

    $("#divLuckyDrawContainer, #divLuckyDrawContainer > .tab-content, #divLuckyDrawContainer > .tab-content > #ThirdPrize").addClass("px-0");

    $("#btnStart").click(function () {
        $("#divStartContainer, #pDes").fadeOut(3000);
        setMachineData(1, "Third", 100);
        setTimeout(function () {
            $("body").css("background-image", "url('images/lc-background.png')")
            $("#btnPlay, #sgcSlogan").removeClass("d-none");
            $("#h3Title").html('Lần quay thứ <span id="spnOrder">1</span>');
            $("#pDes").html('<span id="spnDes">Co.opmart Huỳnh Tấn Phát</span>').removeClass("mt-5 mb-4").fadeIn();
            $("#divDrawContainer").removeClass("d-none");
        }, 2000)
    });

    // confetti
    const confetti = document.getElementById('confetti');
    const confettiCtx = confetti.getContext('2d');
    let container, confettiElements = [], clickPosition;
    rand = (min, max) => Math.random() * (max - min) + min;
    const confettiParams = {
        // number of confetti per "explosion"
        number: 70,
        // min and max size for each rectangle
        size: { x: [5, 20], y: [10, 18] },
        // power of explosion
        initSpeed: 25,
        // defines how fast particles go down after blast-off
        gravity: 0.65,
        // how wide is explosion
        drag: 0.08,
        // how slow particles are falling
        terminalVelocity: 6,
        // how fast particles are rotating around themselves
        flipSpeed: 0.017,
    };
    const colors = [
        { front : '#c32aa3', back: '#4c5fd7' },
        { front : '#7232bd', back: '#f46f30' },
        { front : '#ffdc7d', back: '#fde5bf' },
        { front : '#dfec97', back: '#c39485' },
        { front : '#7b5be9', back: '#ff7084' },
        { front : '#f47e50', back: '#6fbc76' },
        { front : '#ffcc00', back: '#0089c0' },
    ];

    setupCanvas();
    updateConfetti();

    confetti.addEventListener('click', addConfetti);
    window.addEventListener('resize', () => {
        setupCanvas();
        hideConfetti();
    });

    function Conf() {
        this.randomModifier = rand(-1, 1);
        this.colorPair = colors[Math.floor(rand(0, colors.length))];
        this.dimensions = {
            x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
            y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
        };
        this.position = {
            x: clickPosition[0],
            y: clickPosition[1]
        };
        this.rotation = rand(0, 2 * Math.PI);
        this.scale = { x: 1, y: 1 };
        this.velocity = {
            x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.4,
            y: rand(-confettiParams.initSpeed, confettiParams.initSpeed)
        };
        this.flipSpeed = rand(0.2, 1.5) * confettiParams.flipSpeed;

        if (this.position.y <= container.h) {
            this.velocity.y = -Math.abs(this.velocity.y);
        }

        this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;

        this.update = function () {
            this.velocity.x *= 0.98;
            this.position.x += this.velocity.x;

            this.velocity.y += (this.randomModifier * confettiParams.drag);
            this.velocity.y += confettiParams.gravity;
            this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
            this.position.y += this.velocity.y;

            this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
            this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
        }
    }

    function updateConfetti () {
        confettiCtx.clearRect(0, 0, container.w, container.h);

        confettiElements.forEach((c) => {
            c.update();
            confettiCtx.translate(c.position.x, c.position.y);
            confettiCtx.rotate(c.rotation);
            const width = (c.dimensions.x * c.scale.x);
            const height = (c.dimensions.y * c.scale.y);
            confettiCtx.fillStyle = c.color;
            confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
            confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
        });

        confettiElements.forEach((c, idx) => {
            if (c.position.y > container.h ||
                c.position.x < -0.5 * container.x ||
                c.position.x > 1.5 * container.x) {
                confettiElements.splice(idx, 1)
            }
        });
        window.requestAnimationFrame(updateConfetti);
    }

    function setupCanvas() {
        container = {
            w: confetti.clientWidth,
            h: confetti.clientHeight
        };
        confetti.width = container.w;
        confetti.height = container.h;
    }

    function addConfetti(e) {
        const canvasBox = confetti.getBoundingClientRect();
        if (e) {
            clickPosition = [
                e.clientX - canvasBox.left,
                e.clientY - canvasBox.top
            ];
        } else {
            clickPosition = [
                canvasBox.width * Math.random(),
                canvasBox.height * Math.random()
            ];
        }
        for (let i = 0; i < confettiParams.number; i++) {
            confettiElements.push(new Conf())
        }
    }

    function hideConfetti() {
        confettiElements = [];
        window.cancelAnimationFrame(updateConfetti)
    }

    confettiLoop();
    function confettiLoop() {
        addConfetti();
        setTimeout(confettiLoop, 800 + Math.random() * 1800);
    }

    $("#confetti").hide();

    function afterModalTransition(e) {
        e.setAttribute("style", "display: none !important;");
        $("#btnClose").click();
    }
    $('#divConfettiModal').on('hide.bs.modal', function (e) {
        setTimeout( () => afterModalTransition(this), 200);
    });

    playAudioAfter9sec();
});

// data preparation
$(function(){
    // first prize
    var orderSuper = {
        159:"Co.opmart Huỳnh Tấn Phát",
        161:"Co.opmart Xa Lộ Hà Nội",
        196:"Co.opmart Quang Trung",
        570:"Co.opmart Thắng Lợi",
        305:"Co.opXtra Sư Vạn Hạnh",
        301:"Co.opXtra Linh Trung",
        306:"Co.opXtra Phạm Văn Đồng",
        304:"Co.opXtra Tân Phong",
        130:"Co.opmart Rạch Miễu",
        133:"Co.opmart Nhiêu Lộc",
        134:"Co.opmart Tuy Lý Vương",
        135:"Co.opmart Hùng Vương",
        136:"Co.opmart Bình Tân",
        141:"Co.opmart Nguyễn Ảnh Thủ",
        151:"Co.opmart Cống Quỳnh",
        152:"Co.opmart Hóc Môn",
        153:"Co.opmart Hậu Giang",
        154:"Co.opmart Phú Thọ",
        155:"Co.opmart Nguyễn Đình Chiểu",
        157:"Co.opmart Phú Lâm",
        158:"Co.opmart Phan Văn Hớn",
        160:"Co.opmart Nguyễn Kiệm",
        162:"Co.opmart Phan Văn Trị",
        175:"Co.opmart Củ Chi",
        178:"Co.opmart Hòa Bình",
        180:"Co.opmart Cần Giờ",
        186:"Co.opmart Bình Triệu",
        505:"Co.opmart Lý Thường Kiệt",
        506:"Co.opmart Văn Thánh",
        508:"Co.opmart Nguyễn Bình",
        509:"Co.opmart Vĩnh Lộc B",
        510:"Co.opmart Đỗ Văn Dậy",
        511:"Co.opmart Hiệp Thành",
        524:"Co.opmart Đồng Văn Cống",
        530:"Co.opmart Chu Văn An",
        541:"Co.opmart Saigon Homes",
        548:"Co.opmart Crescent mall",
        549:"Co.opmart Hoàng Văn Thụ",
        556:"Co.opmart Tô Ký",
        559:"Co.opmart Âu Cơ",
        561:"Co.opmart Cao Thắng",
        565:"Co.opmart Tam Bình",
    }
    var supermarkets = [
        159, 161, 196,
        570, 305, 301, 306, 304, 130, 133,
        134, 135, 136, 141, 151, 152, 153, 154, 155, 157,
        158, 160, 162, 175, 178, 180, 186, 505, 506, 508,
        509, 510, 511, 524, 530, 541, 548, 549, 556, 559,
        561, 565
    ]

    var indexedStore = 0 // index of started store
    var specifiedStores = [159, 161, 196, 570, 305] // store with 2 rotations

    var store = 159
    var storeName = "Huỳnh Tấn Phát"
    var winList = [];
    var lotteList = [];
    $("#ballMachine").lotteryMachine({
        containerRadius: 150,
        waitInterval: 800,
        playSound: false,
        callback: function(data){
            //On finish running lottery numbers, do something
            firstPrizeList.push([store, data]);
            winList.push(data);
            var order = parseInt($("#hidOrder1").val());
            $("#spnLuckyOrder").text(order);
            $("#divLuckyDrawListDetail").append("<p>"+order+". <span>"+data+"</span></p>");
            if(lotteList.length > 0){
                play(lotteList.pop());
                $("#hidOrder1").val(order+1);
            }
            else{
                if(winList.length > 1) $("#pConfetti").html("<span>Mã KH: "+winList[0]+"</span> <span> và "+winList[1]+"</span> <br> <span>KH nhận giải tại <br> Co.opmart "+storeName+"</span>");
                else $("#pConfetti").html("<span>Mã KH: "+winList[0]+"</span> <br> <span>KH nhận giải tại <br> Co.opmart "+storeName+"</span>");
                showConfettiPopup(3000);
                indexedStore += 1;
                winList = [];
            }
        }
    });

    // run lucky draw machine
    $("#btnPlay").click(function() {
        // if(indexedStore > 0){
        //     store = parseInt(supermarkets[indexedStore]);
        //     storeName = orderSuper[supermarkets[indexedStore]]
        //     $("#spnOrder").text(indexedStore+1);
        //     $("#spnDes").text(storeName);
        //     $("#hidOrder1").val(1);
        //     $("#spnLuckyOrder").text("0");
        //     $("#divLuckyDrawListDetail").html("");
        // }
        // else{
        //     $("#hidOrder1").val(1);
        // }

        $("#hidOrder1").val(1);

        var count = 1 // number of rotations
        if($.inArray(store, specifiedStores) >= 0){count = 2;}

        $(this).prop("disabled", true);

        if(indexedStore == 41){
            $(this).addClass("d-none");
            $("#hidFirstPrizeData1").val(1);
        }

        var customer_list;
        $.get(base_url+"data/customer_supermarket.csv", function(csv) {
            customer_list = $.csv.toArrays(csv, {
                onParseValue: $.csv.hooks.castToScalar
            });

            customer_list = customer_list.filter(function (cust) {
                return cust[0] == store
            })

            // random number for each distance
            var orderedNumberList = [];
            var randomList = getOrderedList(customer_list, 1, count);
            randomList.forEach(function (number) {
                orderedNumberList.push(zfill(customer_list[number][1], 7));
            });
            lotteList = orderedNumberList;
            play(lotteList.pop());
        });
    });

    // close confetti
    $("#btnClose").click(function () {
        if(indexedStore <= 41){
            store = parseInt(supermarkets[indexedStore]);
            storeName = orderSuper[supermarkets[indexedStore]]
            $("#spnOrder").text(indexedStore+1);
            $("#spnDes").text(storeName);
            $("#spnLuckyOrder").text("0");
            $("#divLuckyDrawListDetail").html("");
        }

        $("#confetti").css("display", "none");
        $("#divConfettiModal").css("z-index", 1);
        clearTimeout(confetti);
        var exportStt = $("#hidFirstPrizeData1").val();
        if(exportStt == 1){
            firstPrizeList.forEach(function (phone) {
                $("#mqFirstPrize").append('<span>'+phone+'</span><br/>');
            });
            secondPrizeList.forEach(function (phone) {
                $("#mqSecondPrize").append('<span>'+phone+'</span><br/>');
            });
            thirdPrizeList.forEach(function (phone) {
                $("#mqThirdPrize").append('<span>'+phone+'</span><br/>');
            });

            setTimeout(function () {
                $("#divMain").fadeOut();
                $("#divConfetti").removeClass("d-none");
            }, 1000);

            setTimeout(function () {
                $("#divExportModal").css("z-index", 9999).modal();
            }, 3000);
        }
        $("#btnPlay").prop("disabled", false);
    });

    // export list
    $("#btnPrize1").click(function () {
        exportList(firstPrizeList, "firstPrizeList");
    });
});

function exportList(prizeData, prizeName) {
    var fileName = prizeName+".csv";
    var table = prizeData;

    if ("download" in document.createElement("a")) {
        var link = $("<a target='_blank' href='data:text/csv;charset=utf-8,%EF%BB%BF"
            + encodeURI(table.join("\n")) + "' download='" + fileName + "'></a>");
        link.appendTo("body");
        link[0].click();
        setTimeout(function () {
            link.remove();
        }, 50);
        return;
    }

    var txt = $("<textarea cols='65536'></textarea>").get(0);
    txt.innerHTML = table.join("\n");
    var frame = $("<iframe src='text/csv;charset=utf-8' style='display:none'></iframe>").appendTo("body").get(0);
    frame.contentWindow.document.open("text/csv;charset=utf-8", "replace");
    frame.contentWindow.document.write(txt.value);
    frame.contentWindow.document.close();
    frame.contentWindow.document.execCommand("SaveAs", true, fileName);
    setTimeout(function () {
        $(frame).remove();
        $(txt).remove();
    }, 50);
}

function showConfettiPopup(time=1000) {
    confetti = setTimeout(function () {
        if($("#confetti").css("display") == "none") $("#confetti").show();
        $("#divConfettiModal").css("z-index", 9999).modal();
    }, time);
}

function playAudioAfter9sec(){
    let audio = document.getElementById('audLuckyDraw');
    audio.muted = false;
    audio.autoplay = true;
    audio.currentTime = 9;
    audio.play();
}

// second prize
function onComplete(active) {
    var id = this.element.id;
    var machine = id.substring(0, 7);
    var number = parseInt(id.substring(7, id.length))+1;
    var phone = getMachineResult(id, active);

    if(number%50 == 0) $("#btnPlay").prop("disabled", false);

    if(machine == "control") thirdPrizeList.push(phone);
    else secondPrizeList.push(phone);

    if((machine == "control" && number == 1100) || (machine == "machine" && number == 200)){
        showConfettiPopup();
    }
}

function getMachineResult(i_jqMachine, i_iActive){
    return $("#"+i_jqMachine).find('span.option > span').eq(i_iActive + 1).text();
}

function runMachineData(tab="Second", numbers=50) {
    var order = parseInt($("#hidSecondPrizeTab").val());
    var index = order;
    var mc = "machine";
    if(tab == "Third") {
        order = parseInt($("#hidOrder3").val());
        if(order == 0) order = 1;
        index = 1;
        mc = "control";
    }
    $("#"+tab+"Prize"+index+" .optionSpan").remove();
    $("#"+tab+"Prize"+index+" .option").removeClass("d-none");
    for (var i = (numbers*(order-1)); i < (numbers*order); i++) {
        var machine = $("#"+tab+"Prize"+index+" #"+mc+i).slotMachine({
            active: i,
            delay: 80,
        });
        machine.shuffle(50, onComplete);
    }
}

function setMachineData(order, tab="Second", numbers=50) {
    numberList = [];
    var index = order;
    var machine = "machine";
    if(tab == "Third"){
        index = 1;
        machine = "control";
        $("#ThirdPrize1 > .machine > .wrap").html("");
        $("#btnPlay").text("Quay số").prop("disabled", false);
    }
    if($("#hid"+tab+"PrizeData"+index).val() == 0) {
        var customer_list;
        $.get(base_url + "data/luckydraw.csv", function (csv) {
            customer_list = $.csv.toArrays(csv, {
                onParseValue: $.csv.hooks.castToScalar
            });

            for (var i=(numbers*(order-1)); i<(numbers*order); i++) { // each column (10 phone numbers) is unique
                var prizeData = '<div class="column"><div id="'+machine+i+'" class="optionContainer">';
                prizeData += '<span class="option optionSpan"><span>'+(i+1)+'</span></span>';
                var randomList = getOrderedList(customer_list);
                randomList.forEach(function (value) {
                    prizeData += '<span class="option d-none"><span>'+value+'</span></span>';
                });
                prizeData += '</div></div>';
                $("#"+tab+"Prize"+index+" > .machine > .wrap").append(prizeData);
            }
            $("#hid"+tab+"PrizeData"+index).val(1);
        });
    }
}

function getOrderedList(customerList, isFirstPrize=0, count=10) { // return 10 unique phone numbers
    var prizeList = thirdPrizeList.concat(secondPrizeList).concat(firstPrizeList).concat(numberList);
    var randomList = [];
    var randomNumbers = [];
    while(randomList.length < count){
        var r = getRandomInt(1, (customerList.length)-1);
        var phone = zfill(customerList[r][1], 7);
        if(randomList.indexOf(phone) === -1 && prizeList.indexOf(phone) === -1){
            randomList.push(phone);
            numberList.push(phone);
            if(isFirstPrize == 1) randomNumbers.push(r);
        }
    }

    if(isFirstPrize == 0) return randomList;
    else return randomNumbers;
}

// first prize
function getRandomInt(min, max) {
    var r = new Random();
    var number = r.Next(min, max);
    return number;
}

function play(number) {
    $("#ballMachine").lotteryMachine('run', number);
}

function zfill(num, len) {return (Array(len).join("0") + num).slice(-len);}
