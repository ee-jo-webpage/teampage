let posts = [];
const names = ["성민", "민지", "승준", "현우", "소희"];
let filteredPosts = null;
const postsPerPage = 10;
let currentPage = 1;
let deleteTargetId = null;

// =========================
// 데이터 불러오기
// =========================
async function loadPosts() {
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await res.json();
        posts = data.map(p => ({
            id: p.id,
            title: p.title,
            content: p.body,
            author: names[p.userId % names.length]
        }));
    } catch (err) {
        console.log("로딩 실패", err);
        alert("게시글을 불러오는 데 실패했습니다.");
    }
}

// =========================
// 공통 유틸 함수
// =========================
function toggleModal(id, show = true) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = show ? "flex" : "none";
}

function getPostById(id) {
    return posts.find(p => p.id === id);
}

function getFormData(formId) {
    const form = document.getElementById(formId);
    const data = {};
    Array.from(form.elements).forEach(el => {
        if (el.id && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
            data[el.id.replace(/^(create|edit)-/, "")] = el.value.trim();
        }
    });
    return data;
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

// =========================
// 게시글 렌더링
// =========================
function renderPosts() {
    const tbody = document.getElementById("post-list");
    tbody.innerHTML = "";

    const source = filteredPosts !== null ? filteredPosts : posts;
    const sorted = [...source].sort((a, b) => b.id - a.id);
    const current = sorted.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    if (current.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">검색 결과가 없습니다.</td></tr>`;
    } else {
        current.forEach(post => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${post.id}</td>
                <td style="cursor:pointer; text-decoration: underline;" onclick="showDetailModal(${post.id})">${post.title}</td>
                <td>${post.author}</td>
                <td>
                    <div class="btn-div" onclick="openEditModal(${post.id})">[ 수정 ]</div>
                    <div class="btn-div" onclick="openDeleteModal(${post.id})">[ 삭제 ]</div>
                </td>`;
            tbody.appendChild(tr);
        });
    }

    renderPagination();
}

function renderPagination() {
    const source = filteredPosts !== null ? filteredPosts : posts;
    const pageCount = Math.ceil(source.length / postsPerPage);
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    if (pageCount === 0) return;

    const createPageButton = (label, onClick) => {
        const btn = document.createElement("div");
        btn.className = "btn-div";
        btn.textContent = label;
        btn.onclick = onClick;
        return btn;
    };

    container.appendChild(createPageButton("[ 이전 ]", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    }));

    for (let i = 1; i <= pageCount; i++) {
        container.appendChild(createPageButton(`[ ${i} ]`, () => {
            currentPage = i;
            renderPosts();
        }));
    }

    container.appendChild(createPageButton("[ 다음 ]", () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderPosts();
        }
    }));
}

// =========================
// 상세 모달
// =========================
function showDetailModal(id) {
    const post = getPostById(id);
    if (!post) return;

    document.getElementById("detail-title").textContent = post.title;
    document.getElementById("detail-author").textContent = post.author;
    document.getElementById("detail-content").textContent = post.content;

    toggleModal("detailModal", true);
}
document.getElementById("closeDetailModal").onclick = () => toggleModal("detailModal", false);

// =========================
// 글쓰기
// =========================
document.getElementById("openCreateModal").onclick = () => toggleModal("createModal", true);
document.getElementById("closeCreateModal").onclick = () => toggleModal("createModal", false);

document.getElementById("submitCreateForm").onclick = () => {
    const form = document.getElementById("create-post-form");
    if (!form.reportValidity()) return;

    const { title, author, content } = getFormData("create-post-form");
    const newId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1;

    posts.unshift({ id: newId, title, author, content });

    clearForm("create-post-form");
    toggleModal("createModal", false);
    filteredPosts = null; // 새 글 작성 시 검색 상태 초기화
    renderPosts();
};

// =========================
// 수정
// =========================
function openEditModal(id) {
    const post = getPostById(id);
    if (!post) return;

    document.getElementById("edit-id").value = post.id;
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-author").value = post.author;
    document.getElementById("edit-content").value = post.content;

    toggleModal("editModal", true);
}
document.getElementById("closeEditModal").onclick = () => toggleModal("editModal", false);

document.getElementById("submitEditForm").onclick = () => {
    const id = parseInt(document.getElementById("edit-id").value, 10);
    const { title, content } = getFormData("edit-post-form");
    const post = getPostById(id);
    if (post) {
        post.title = title;
        post.content = content;
    }
    toggleModal("editModal", false);
    renderPosts();
};

// =========================
// 삭제
// =========================
function openDeleteModal(id) {
    deleteTargetId = id;
    toggleModal("deleteModal", true);
}
document.getElementById("cancelDelete").onclick = () => toggleModal("deleteModal", false);

document.getElementById("confirmDelete").onclick = () => {
    if (deleteTargetId !== null) {
        posts = posts.filter(p => p.id !== deleteTargetId);
        deleteTargetId = null;
        toggleModal("deleteModal", false);
        filteredPosts = null; // 삭제 후 전체 목록 기준 렌더링
        renderPosts();
    }
};

// =========================
// 검색
// =========================
function filterPosts(keyword) {
    const lower = keyword.trim().toLowerCase();
    if (!lower) return posts;

    return posts.filter(p =>
        p.title.toLowerCase().includes(lower) ||
        p.author.toLowerCase().includes(lower) ||
        p.content.toLowerCase().includes(lower)
    );
}

document.getElementById("search-button").onclick = () => {
    const keyword = document.getElementById("search-input").value.trim();

    filteredPosts = keyword === "" ? null : filterPosts(keyword);
    currentPage = 1;
    renderPosts();
};

// =========================
// 초기 실행
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    await loadPosts();
    renderPosts();
});
