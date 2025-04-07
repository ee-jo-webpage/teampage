// Kakao 지도 API Key (보안을 위해 백엔드 환경에 저장하는 것이 권장됨)
const KAKAO_APP_KEY = "96f3e8f770d25b1cc9ab77b0f5204dc6";

// 전역 변수 정의
let map; // Kakao Map 객체: 지도를 표현하고 조작하는 핵심 객체
let geocoder; // Kakao Geocoder: 좌표 ↔ 주소 변환에 사용되는 객체
let ps; // Kakao Places: 장소 검색 객체
let markers = []; // 지도에 표시된 마커들을 저장하는 배열
let typeControl; // 지도/스카이뷰 전환 버튼 컨트롤
let zoomControl; // 줌 인/아웃 버튼 컨트롤

// Kakao Maps SDK를 동적으로 로드한 후 실행될 콜백 등록
loadKakaoMapSdk(() => {
    // Kakao Maps 내부 리소스가 모두 준비되면 실행됨
    kakao.maps.load(() => {
        // 1. 지도를 렌더링할 container 지정
        const container = document.getElementById("map");

        // 2. 지도 초기 옵션 설정
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978), // 기본 위치: 서울
            level: 3, // 확대 수준 (작을수록 확대)
        };

        // 3. 지도 객체 생성
        map = new kakao.maps.Map(container, options);

        // 4. 지도 관련 서비스 객체 생성
        geocoder = new kakao.maps.services.Geocoder(); // 좌표 → 주소 변환용
        ps = new kakao.maps.services.Places(); // 장소 검색 서비스

        // 5. 지도 상단 컨트롤 추가
        typeControl = new kakao.maps.MapTypeControl(); // 일반/스카이뷰 전환 버튼
        zoomControl = new kakao.maps.ZoomControl(); // 줌 인/아웃 버튼
        // 지도 객체에 버튼 추가
        map.addControl(typeControl, kakao.maps.ControlPosition.TOPRIGHT);
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 6. 현재 위치 탐색 → 지도 중심 이동
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    moveTo(lat, lng); // 현재 위치로 지도 이동 + 날씨 위젯 표시
                },
                () => {
                    moveTo(37.5665, 126.978); // 실패 시 서울로 fallback
                }
            );
        }

        // 7. 지도 클릭 시 해당 위치로 이동 + 날씨 위젯 갱신
        kakao.maps.event.addListener(map, "click", function (mouseEvent) {
            // sdk 에서 제공하는 메서드
            // 3번째 콜백 함수를 정의하면 mouseEvent 객체를 sdk 가 생성후 전달
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            moveTo(lat, lng);
        });

        // 8. HTML 내 onclick에서 사용할 수 있도록 전역 함수 등록
        window.searchPlace = searchPlace;
        window.clearMarkers = clearMarkers;
    });
});

// Kakao Maps SDK를 비동기 로딩하는 함수
function loadKakaoMapSdk(callback) {
    if (window.kakao && window.kakao.maps) {
        callback(); // 이미 로딩되어 있으면 바로 실행
        return;
    }

    // script 태그 생성 후 삽입
    const script = document.createElement("script");
    script.onload = () => kakao.maps.load(callback); // SDK 로드 완료 후 콜백 실행
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);
}

// 장소 키워드로 검색하는 함수
function searchPlace() {
    const keyword = document.getElementById("search").value;

    if (!keyword.trim()) {
        alert("검색어를 입력하세요.");
        return;
    }

    // 장소 검색 요청 (최대 5개만 응답 받음)
    /*
    .keywordSearch(keyword, callback, options)
    인자	    타입	                                   설명
    keyword	  string	                                 검색어 (예: "강남역 카페")
    callback	function(data, status, pagination)	     검색 완료 후 실행될 콜백 함수
    options	  object (선택)	검색 옵션 객체             (검색 범위, 결과 수 등 지정 가능)
   */
    ps.keywordSearch(
        keyword,
        function (data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                displayPlaces(data); // 결과 리스트 출력
                displayPagination(pagination); // 페이지네이션 생성
            } else {
                alert("검색 결과가 없습니다.");
            }
        },
        { size: 5 } // 한 페이지당 최대 5개만 표시
    );
}

// 검색 결과 마커 및 리스트를 화면에 표시
function displayPlaces(places) {
    const listEl = document.getElementById("placesList");
    listEl.innerHTML = ""; // 기존 리스트 초기화
    clearMarkers(); // 기존 마커 제거

    const bounds = new kakao.maps.LatLngBounds(); // 지도 확대 범위 계산용

    places.forEach((place) => {
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);
        const name = place.place_name;
        const position = new kakao.maps.LatLng(lat, lng);

        // 마커 생성 및 지도에 표시
        const marker = new kakao.maps.Marker({ position });
        marker.setMap(map);
        markers.push(marker); // 마커 배열에 추가

        // 리스트 항목 생성
        const li = document.createElement("li");
        li.textContent = `${name} (${place.address_name})`;
        li.style.padding = "8px 0";
        li.style.cursor = "pointer";
        li.style.borderBottom = "1px solid #ddd";

        // 마커나 리스트 클릭 시 해당 위치로 이동 + 날씨 위젯 업데이트
        const move = () => {
            map.setCenter(position);
            initWeatherWidget(lat, lng); // 선택된 위치로 날씨 업데이트
        };

        li.onclick = move;
        kakao.maps.event.addListener(marker, "click", move);

        listEl.appendChild(li);
        bounds.extend(position); // 범위 확장
    });

    map.setBounds(bounds); // 지도 범위 자동 조정
}

// 검색 결과의 페이지네이션 버튼 생성
function displayPagination(pagination) {
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";

    for (let i = 1; i <= pagination.last; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === pagination.current) {
            btn.disabled = true;
        }

        btn.onclick = () => pagination.gotoPage(i); // 해당 페이지로 이동
        paginationEl.appendChild(btn);
    }
}

// 지도 위에 표시된 모든 마커 제거
function clearMarkers() {
    markers.forEach((m) => m.setMap(null));
    markers = [];
}

// 지도 이동 + 단일 마커 표시 + 날씨 위젯 업데이트
function moveTo(lat, lng) {
    const position = new kakao.maps.LatLng(lat, lng);

    map.setCenter(position); // 지도 중심 이동
    clearMarkers(); // 기존 마커 제거

    const marker = new kakao.maps.Marker({ position });
    marker.setMap(map);
    markers.push(marker);

    initWeatherWidget(lat, lng); // 날씨 위젯 갱신
}
