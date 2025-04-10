<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:100,200,300,400,500,600,700,800,900" rel="stylesheet">


    <title>Chart</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">


    <!-- Additional CSS Files -->
    <link rel="stylesheet" href="assets/css/fontawesome.css">
    <link rel="stylesheet" href="assets/css/templatemo-eduwell-style.css">
    <link rel="stylesheet" href="assets/css/owl.css">
    <link rel="stylesheet" href="assets/css/lightbox.css">
    <!--

    TemplateMo 573 EduWell

    https://templatemo.com/tm-573-eduwell

    -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
</head>

<body>

<jsp:include page = "header.jsp"></jsp:include>


<section class="page-heading">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <div class="header-text">
                    <h4>Fine Dust Status by Seoul District</h4>
                    <h1>서울시 자치구 별 미세먼지 현황</h1>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="our-team" style = "margin-bottom : 40px;">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 offset-lg-1">
                <div class="naccs">
                    <div class="tabs">
                        <div class="row">
                            <div class="col-lg-12">
                                <div id ="legend-container" class = "legend-div"></div>
                                <canvas id="microdustChart" style="width: 100%; max-width: 1200px; margin-bottom : 40px;"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<jsp:include page = "footer.jsp"></jsp:include>

<!-- Scripts -->
<!-- Bootstrap core JavaScript -->
<script src="vendor/jquery/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

<script src="assets/js/isotope.min.js"></script>
<script src="assets/js/owl-carousel.js"></script>
<script src="assets/js/lightbox.js"></script>
<script src="assets/js/tabs.js"></script>
<script src="assets/js/video.js"></script>
<script src="assets/js/slick-slider.js"></script>
<!--<script src="assets/js/custom.js"></script>-->
<script>
    //according to loftblog tut
    $('.nav li:first').addClass('active');

    var showSection = function showSection(section, isAnimate) {
        var
            direction = section.replace(/#/, ''),
            reqSection = $('.section').filter('[data-section="' + direction + '"]'),
            reqSectionPos = reqSection.offset().top - 0;

        if (isAnimate) {
            $('body, html').animate({
                    scrollTop: reqSectionPos },
                800);
        } else {
            $('body, html').scrollTop(reqSectionPos);
        }

    };

    var checkSection = function checkSection() {
        $('.section').each(function () {
            var
                $this = $(this),
                topEdge = $this.offset().top - 80,
                bottomEdge = topEdge + $this.height(),
                wScroll = $(window).scrollTop();
            if (topEdge < wScroll && bottomEdge > wScroll) {
                var
                    currentId = $this.data('section'),
                    reqLink = $('a').filter('[href*=\\#' + currentId + ']');
                reqLink.closest('li').addClass('active').
                siblings().removeClass('active');
            }
        });
    };

    $('.main-menu, .responsive-menu, .scroll-to-section').on('click', 'a', function (e) {
        e.preventDefault();
        showSection($(this).attr('href'), true);
    });

    $(window).scroll(function () {
        checkSection();
    });


    function playVideo(videoSrc, videoTitle){
        const videoElement = document.getElementById("video-collection");
        videoElement.querySelector('source').src = videoSrc;
        videoElement.load();
        videoElement.play();

        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach(item => {
            if(item.textContent.includes(videoTitle)) {
                item.style.backgroundColor = '#e9ecef';
                item.style.borderLeft = '3px solid #3a0088';
            } else {
                item.style.backgroundColor = '#f8f9fa';
                item.style.borderLeft = 'none';
            }
        });

    }

    $(document).ready(() => {
        //1. API에서 데이터 가져오기
        console.log("AJAX 시작");
        const fetchData = () => {
            $.ajax({
                url: "http://openAPI.seoul.go.kr:8088/45494162646d6a313938624d624655/json/RealtimeCityAir/1/25/",
                // /1/25 -> 1번 인덱스부터 25번 인덱스 => 서울시 모든 자치구 25개
                type: "GET",
                dataType: "json",
                success: (response) => {
                    console.log(response);
                    processData(response);
                },
                error: (error) => {
                    console.log("데이터를 불러오는 도중 오류가 발생했습니다 : ", error);
                },
            });
        };

        //2. 데이터 처리하기
        const processData = (apiResopnse) => {
            const data = apiResopnse.RealtimeCityAir.row.map((item) => ({
                gu_name: item.MSRSTE_NM, //구이름
                measured_date: item.MSRDT, //측정일시
                measured_dust: item.PM10, //미세먼지 수치 -> PM10은 미세먼지, PM25는 초미세먼지
                measured_ultrafinedust: item.PM25,
            }));

            drawChart(data);
        };

        //3. 차트 그리기
        const drawChart = (data) => {
            console.log(data);

            const gu_name = data.map((item) => item.gu_name);
            const measured_dust = data.map((item) => item.measured_dust);

            const airQualityLevels = [
                { level: '좋음', color: '#3E7FE8', range: '0-30' },
                { level: '보통', color: '#0B8D34', range: '31-80' },
                { level: '나쁨', color: '#FBB505', range: '81-150' },
                { level: '매우 나쁨', color: '#E13030', range: '151 이상' }
            ]

            function getColorByAirQuality(value){
                if(value <= 30) return '#3E7FE8'
                else if(value > 30 && value <= 80) return '#0B8D34'
                else if (value <= 150) return '#FBB505'
                else return '#E13030';
            }

            const backgroundColors = data.map((item) => getColorByAirQuality(item.measured_dust));

            const measured_ultrafinedust =  data.map((item) => item.measured_ultrafinedust);
            const myChart = new Chart("microdustChart", {
                type: "bar",
                data: {
                    labels: gu_name,
                    datasets: [
                        {
                            label : '미세먼지',
                            data: measured_dust,
                            backgroundColor: backgroundColors,
                            maxBarThickness: 30
                        }
                    ],
                },
                options: {
                    responseive : false,
                    legend: {
                        display: false,

                    },
                    plugins: {
                        title: {
                            display: true,
                            text: "서울시 자치구별 미세먼지 현황",
                            font: {
                                size: 18,
                            },
                        },
                    },

                },plugins : [{
                    id : 'htmlLegend',
                    afterDraw(chart, args, options){
                        const legendContainer = document.getElementById(options.containerID);

                        if(!legendContainer){
                            const container = document.createElement('div');
                            container.id = options.containerID;
                            container.style.display = 'flex';
                            container.style.flexWrap = 'wrap';
                            container.style.justifyContent = 'center';
                            container.style.margin = '10px 0';
                            chart.canvas.parentNode.appendChild(container);

                            //범례 추가
                            airQualityLevels.forEach(item => {
                                const legendItem = document.createElement('div');
                                legendItem.style.display = 'flex';
                                legendItem.style.alignItems = 'center';
                                legendItem.style.margin = '0 10px';

                                const colorBox = document.createElement('span');
                                colorBox.style.width = '20px';
                                colorBox.style.height =  '20px';
                                colorBox.style.backgroundColor = item.color;
                                colorBox.style.display = 'inline-block';
                                colorBox.style.marginRight = '5px';

                                console.log(item.level)
                                console.log(item.range)

                                const text = document.createElement('span')
                                <%--text.textContent = `${item.level} ( ${item.range} μg/m³)`;--%>
                                text.textContent = item.level + "(" + item.range + " μg/m³)";

                                legendItem.appendChild(colorBox);
                                legendItem.appendChild(text);
                                container.appendChild(legendItem);
                            })
                        }
                    }
                }]
            });
        };


        fetchData();




    });
</script>

</body>
</html>