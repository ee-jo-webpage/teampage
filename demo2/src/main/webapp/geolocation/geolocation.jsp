<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>GEO Location</title>

    <jsp:include page="../common/header.jsp"/>
    <link rel="stylesheet" href="./css/custom.css">
</head>
<body class="geolocation-page">
    <!-- 헤더 -->
    <jsp:include page="../common/header.jsp"/>
    <!-- 섹션 1: 현재 날씨 정보 -->
    <section id="weather-widget">
        <h2>현재 날씨</h2>
        <!-- 행정 주소 출력 -->
        <div id="location-info"></div>
        <!-- 현재 기온/습도/아이콘 -->
        <div id="current-weather"></div>
        <!-- 시간별 예보 -->
        <div id="hourly-weather"></div>

    </section>

    <!-- 섹션 2: 지도 및 장소 검색 -->
    <section id="map-section">
        <h2>장소 검색</h2>
        <div id="searchBox">
            <!-- 검색창과 버튼 (HTML 에서 버튼 클릭 시 JS 함수 호출) -->
            <input type="text" id="search" placeholder="장소 검색"/>
            <button onclick="searchPlace()">검색</button>
            <!-- 전역 함수 필요 -->
            <button onclick="clearMarkers()">초기화</button>
            <!-- 전역 함수 필요 -->
        </div>
        <div id="map"></div>
        <!-- Kakao 지도 표시 영역 -->
        <ul id="placesList" style="list-style: none; padding: 0"></ul>
        <!-- 검색 결과 리스트 -->
        <div id="pagination"></div>
        <!-- 페이지네이션 -->
    </section>

    <!-- 섹션 3: 옷차림 추천 -->
    <section id="recommendation">
        <h2>오늘의 옷차림 추천</h2>
        <div class="clothing-guide" id="clothing-guide-box">
        </div>

    </section>

    <!-- 스크립트 -->
    <script src="./js/kakao-map.js"></script>
    <script src="./js/weather-widget.js"></script>
</body>
</html>