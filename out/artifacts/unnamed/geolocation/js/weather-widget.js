const API_KEY = "16776f0c191c6722a1bcbc251fa9e8ad"; // OpenWeather API Key

const clothingData = [
    { range: "28℃ 이상", tip: "민소매, 반팔, 린넨으로 시원하게!", items: "민소매, 반팔, 반바지, 린넨 원단", icon: "./images/sleeveless.png" },
    { range: "23℃ ~ 27℃", tip: "반팔 입기 딱 좋은 날씨!", items: "반팔, 얇은 셔츠, 면바지 등", icon: "./images/tshirt.png" },
    { range: "20℃ ~ 22℃", tip: "반팔은 이제 그만! 긴 옷 입기", items: "얇은 가디건, 긴팔티, 블라우스, 청바지 등", icon: "./images/shirts.png" },
    { range: "17℃ ~ 19℃", tip: "일교차 대비 외투 챙기기", items: "가디건, 니트, 맨투맨, 청바지 등", icon: "./images/cardigan.png" },
    { range: "12℃ ~ 16℃", tip: "감기 조심! 외투 필수", items: "얇은 자켓, 간절기 야상, 가디건 등", icon: "./images/jacket.png" },
    { range: "10℃ ~ 11℃", tip: "겹겹이 레이어드 하기", items: "트렌치코트, 바람막이, 니트 등", icon: "./images/trench.png" },
    { range: "6℃ ~ 9℃", tip: "스타킹보다 레깅스!", items: "가죽자켓, 코트, 히트텍 내복 등", icon: "./images/leather.png" },
    { range: "5℃ 이하", tip: "최대한 따뜻하게 입기!", items: "패딩, 누빔, 장갑, 목도리 등", icon: "./images/padding.png" }
];

// 날씨 위젯 초기화 함수
// async: fetch 사용 시 비동기 요청을 기다렸다가 결과를 받기 위해 사용
async function initWeatherWidget(lat, lon) {
    getAddress(lat, lon); // 좌표를 주소로 변환해서 표시 (비동기지만 await 없음)

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json(); // JSON으로 변환 (비동기)

    renderCurrentWeather(data.list[0]); // 현재 날씨 표시
    renderHourlyWeather(data.list.slice(0, 6)); // 6시간치 예보 표시
}

// 좌표를 주소로 변환 (카카오 geocoder 사용)
function getAddress(lat, lon) {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lon, lat, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const address = result[0].address;
            const locationStr = `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
            document.getElementById("location-info").textContent = locationStr;
        }
    });
}

// 현재 날씨 표시
function renderCurrentWeather(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timeStr = `업데이트: ${hours}시 ${minutes}분`;

    const html = `
      <div class="current-weather-box">
        <div class="weather-text">
          <p>현재 기온: ${temp}℃</p>
          <p>습도: ${humidity}%</p>
          <p class="updated-time">${timeStr}</p>
        </div>
        <div class="weather-icon">
          <img src="${iconUrl}" alt="날씨 아이콘" />
        </div>
      </div>
    `;
    document.getElementById("current-weather").innerHTML = html;

    getClothingRecommendation(temp); // 옷차림 추천
}


// 시간별 날씨 정보 표시
function renderHourlyWeather(list) {
    const container = document.getElementById("hourly-weather");
    container.innerHTML = "";

    list.forEach((item) => {
        const dt = new Date(item.dt_txt);
        const hour = dt.getHours();
        const icon = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const block = document.createElement("div");
        block.style.display = "inline-block";
        block.style.marginRight = "10px";
        block.innerHTML = `
      <strong>${hour}시</strong><br />
      <img src="${iconUrl}" width="50"/><br />
      ${item.main.temp}℃ / ${item.main.humidity}%
    `;
        container.appendChild(block);
    });
}

// 옷차림 추천 출력
function getClothingRecommendation(temp) {
    let data;
    if (temp >= 28) data = clothingData[0];
    else if (temp >= 23) data = clothingData[1];
    else if (temp >= 20) data = clothingData[2];
    else if (temp >= 17) data = clothingData[3];
    else if (temp >= 12) data = clothingData[4];
    else if (temp >= 10) data = clothingData[5];
    else if (temp >= 6) data = clothingData[6];
    else data = clothingData[7];

    const html = `
    <div class="temp-range">${data.range}</div>
    <div class="clothing-content">
      <div class="icon"><img src="${data.icon}" style="width: 48px;" alt="icon"/></div>
      <div class="description">
        <p class="tip">${data.tip}</p>
        <p class="items">${data.items}</p>
      </div>
    </div>
  `;

    document.getElementById("clothing-guide-box").innerHTML = html;
}

// 전역에서 호출 가능하게 등록
// HTML이나 다른 JS에서 사용할 수 있도록 window에 붙임
window.initWeatherWidget = initWeatherWidget;
