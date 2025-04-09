// 게시글 데이터 초기화 (샘플 30개 생성)
// id: 게시글 번호, title: 제목, content: 내용, author: 작성자
let posts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `게시글 제목 ${i + 1}`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
    author: `작성자${(i % 5) + 1}`,
}));

const postsPerPage = 10; // 한 페이지에 표시할 게시글 수
let currentPage = 1; // 현재 페이지 번호

// 게시글 목록 테이블을 렌더링하는 함수
// 현재 페이지에 해당하는 게시글을 ID 기준으로 정렬하여 화면에 표시
function renderPosts() {
    const tbody = document.getElementById("post-list");
    tbody.innerHTML = ""; // 이전 게시글 목록 초기화

    // 게시글 ID 내림차순 정렬 → 최신 글이 위로 오도록 정렬
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);

    // 현재 페이지 범위에 해당하는 게시글만 추출
    const start = (currentPage - 1) * postsPerPage;
    const currentPosts = sortedPosts.slice(start, start + postsPerPage);

    // 게시글을 행으로 구성하여 테이블에 추가
    currentPosts.forEach((post) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td class="text-center">${post.id}</td>
      <td class="text-start text-primary" style="cursor:pointer" onclick="showDetail(${post.id})">${post.title}</td>
      <td class="text-center">${post.author}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-secondary me-1" onclick='handleEdit(${post.id})'>수정</button>
        <button class="btn btn-sm btn-outline-danger" onclick="handleDelete(${post.id})">삭제</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

// 페이지네이션 렌더링 함수
// 총 페이지 수에 따라 '이전', 페이지 번호, '다음' 버튼을 생성하여 화면에 표시
function renderPagination() {
    const pageCount = Math.ceil(posts.length / postsPerPage); // 전체 페이지 수 계산
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = ""; // 기존 버튼 제거

    // 페이지네이션 버튼 생성 함수
    const createPageItem = (label, disabled, onClick) => {
        const li = document.createElement("li");
        li.className = `page-item ${disabled ? "disabled" : ""}`;
        li.innerHTML = `<a class="page-link" href="#">${label}</a>`;
        if (!disabled) li.addEventListener("click", onClick);
        return li;
    };

    // '이전' 버튼 생성
    paginationEl.appendChild(
        createPageItem("이전", currentPage === 1, (e) => {
            e.preventDefault();
            currentPage--;
            update();
        })
    );

    // 페이지 번호 버튼 생성 (1 ~ 총 페이지 수)
    for (let i = 1; i <= pageCount; i++) {
        const li = createPageItem(i, false, (e) => {
            e.preventDefault();
            currentPage = i;
            update();
        });
        if (currentPage === i) li.classList.add("active"); // 현재 페이지 강조
        paginationEl.appendChild(li);
    }

    // '다음' 버튼 생성
    paginationEl.appendChild(
        createPageItem("다음", currentPage === pageCount, (e) => {
            e.preventDefault();
            currentPage++;
            update();
        })
    );
}

// 게시글 목록과 페이지네이션을 함께 렌더링하는 함수
function update() {
    renderPosts();
    renderPagination();
}

// 게시글 수정 버튼 클릭 시 호출되는 함수
// posts 배열에서 해당 ID의 게시글 정보를 찾아 수정 모달에 채워넣기
function handleEdit(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    document.getElementById("post-id").value = post.id;
    document.getElementById("title").value = post.title;
    document.getElementById("author").value = post.author;
    document.getElementById("content").value = post.content;

    const modal = new bootstrap.Modal(document.getElementById("postModal"));
    modal.show();
}

// 게시글 삭제 처리 함수
// 삭제 확인 후 posts 배열에서 제거하고 목록 갱신
function handleDelete(id) {
    if (confirm("정말 삭제하시겠습니까?")) {
        const index = posts.findIndex((p) => p.id === id);
        if (index !== -1) {
            posts.splice(index, 1);
            update();
        }
    }
}

// 게시글 제목 클릭 시 상세보기 모달에 데이터 표시하는 함수
function showDetail(id) {
    const post = posts.find((p) => p.id === id);
    console.log(post);

    if (!post) return;

    document.getElementById("detail-title").textContent = post.title;
    document.getElementById("detail-author").textContent = post.author;
    document.getElementById("detail-content").textContent = post.content;

    const modal = new bootstrap.Modal(document.getElementById("detailModal"));
    modal.show();
}

// 글쓰기 모달 form 처리
// 새로운 게시글을 posts 배열에 추가 후 목록 갱신
const createForm = document.getElementById("create-post-form");
createForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("create-title").value;
    const author = document.getElementById("create-author").value;
    const content = document.getElementById("create-content").value;

    // 새로운 ID는 기존 최대 ID보다 1 크게 설정
    const newId = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
    posts.push({ id: newId, title, author, content });

    // 입력 폼 초기화 및 모달 닫기
    e.target.reset();
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("createModal")
    );
    modal.hide();
    update();
});

// 수정 모달 form 처리
// 해당 ID 게시글의 내용을 수정하고 목록 갱신
const editForm = document.getElementById("update-post-form");
editForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = parseInt(document.getElementById("post-id").value);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const content = document.getElementById("content").value;

    const post = posts.find((p) => p.id === id);
    if (post) {
        post.title = title;
        post.author = author;
        post.content = content;
    }

    editForm.reset();
    const modal = bootstrap.Modal.getInstance(
        document.getElementById("postModal")
    );
    modal.hide();
    update();
});

// 페이지 로딩 시 초기 데이터 렌더링
document.addEventListener("DOMContentLoaded", update);
