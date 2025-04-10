<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<jsp:include page = "../header.jsp"></jsp:include>
<section class="get-info">
    <div class="container">
        <div class="row">
            <div class="col-lg-8">
                <video id="video-collection" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" autoplay muted loop playsinline>
                    <source src="videos/sunflowers.mp4" type="video/mp4">
                </video>
            </div>
            <div class="col-lg-4 align-self-center">
                <div class="section-heading" style = "margin-top : 0px; margin-bottom : 20px; padding-top : 0px;">
                    <h6>Playlist</h6>
                    <h4>Our <em>Video Collection</em></h4>
                </div>
                <div class="playlist-container" style="max-height: 350px; overflow-y: auto;">
                    <div class="playlist-item d-flex align-items-center p-2 mb-2" style="background-color: #f8f9fa; border-radius: 5px; cursor: pointer;" onclick="playVideo('video/videos/sunflowers.mp4', 'Sunflowers Video')">
                        <div class="mr-3" style="min-width: 50px;">
                            <i class="fa fa-play-circle" style="font-size: 24px; color: #dc8cdb;"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">Sunflowers</h6>
                            <small class="text-muted">01:30 • Nature</small>
                        </div>
                    </div>
                    <div class="playlist-item d-flex align-items-center p-2 mb-2" style="background-color: #f8f9fa; border-radius: 5px; cursor: pointer;" onclick="playVideo('video/videos/pie.mp4', 'Autumn Baking')">
                        <div class="mr-3" style="min-width: 50px;">
                            <i class="fa fa-play-circle" style="font-size: 24px; color: #dc8cdb;"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">Autumn Baking</h6>
                            <small class="text-muted">03:45 •  Culinary Arts</small>
                        </div>
                    </div>
                    <div class="playlist-item d-flex align-items-center p-2 mb-2" style="background-color: #f8f9fa; border-radius: 5px; cursor: pointer;" onclick="playVideo('video/videos/book.mp4', 'Beach Serenity')">
                        <div class="mr-3" style="min-width: 50px;">
                            <i class="fa fa-play-circle" style="font-size: 24px; color: #dc8cdb;"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">Beach Serenity</h6>
                            <small class="text-muted">02:15 • Relaxation</small>
                        </div>
                    </div>
                    <div class="playlist-item d-flex align-items-center p-2 mb-2" style="background-color: #f8f9fa; border-radius: 5px; cursor: pointer;" onclick="playVideo('video/videos/tennis.mp4', 'Clay Court Tennis')">
                        <div class="mr-3" style="min-width: 50px;">
                            <i class="fa fa-play-circle" style="font-size: 24px; color: #dc8cdb;"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">Clay Court Tennis</h6>
                            <small class="text-muted">04:10 • Sports</small>
                        </div>
                    </div>
                    <div class="playlist-item d-flex align-items-center p-2 mb-2" style="background-color: #f8f9fa; border-radius: 5px; cursor: pointer;" onclick="playVideo('assets/videos/steak.mp4', 'Barbecue Mastery')">
                        <div class="mr-3" style="min-width: 50px;">
                            <i class="fa fa-play-circle" style="font-size: 24px; color: #dc8cdb;"></i>
                        </div>
                        <div>
                            <h6 class="mb-0">Barbecue Mastery </h6>
                            <small class="text-muted">05:30 • Cooking</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<jsp:include page = "../footer.jsp"></jsp:include>
<!-- Scripts -->
<!-- Bootstrap core JavaScript -->
<script src="../vendor/jquery/jquery.min.js"></script>
<script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

<script src="../assets/js/isotope.min.js"></script>
<script src="../assets/js/owl-carousel.js"></script>
<script src="../assets/js/lightbox.js"></script>
<script src="../assets/js/tabs.js"></script>
<script src="../assets/js/video.js"></script>
<script src="../assets/js/slick-slider.js"></script>
<script src="../assets/js/custom.js"></script>
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
</script>

</body>
</html>