// 게시글 데이터 초기화
let posts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `게시글 제목 ${i + 1}`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
    author: `작성자${(i % 5) + 1}`,
}));

const postsPerPage = 10;
let currentPage = 1;
let deleteTargetId = null;

// =========================
// 공통 유틸 함수
// =========================

/** 모달 열고/닫기 */
function toggleModal(id, show = true) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = show ? "flex" : "none";
}

/** post ID로 게시글 찾기 */
function getPostById(id) {
    return posts.find(p => p.id === id);
}

/** form 안의 input/textarea 값 객체로 추출 */
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

/** 폼 입력 초기화 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
}

// =========================
// 게시글 목록 렌더링
// =========================

function renderPosts() {
    const tbody = document.getElementById("post-list");
    tbody.innerHTML = "";

    const sorted = [...posts].sort((a, b) => b.id - a.id);
    const current = sorted.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

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

// =========================
// 페이지네이션 렌더링
// =========================

function renderPagination() {
    const pageCount = Math.ceil(posts.length / postsPerPage);
    const container = document.getElementById("pagination");
    container.innerHTML = "";

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
            renderPagination();
        }
    }));

    for (let i = 1; i <= pageCount; i++) {
        container.appendChild(createPageButton(`[ ${i} ]`, () => {
            currentPage = i;
            renderPosts();
            renderPagination();
        }));
    }

    container.appendChild(createPageButton("[ 다음 ]", () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderPosts();
            renderPagination();
        }
    }));
}

// =========================
// 상세 보기 모달
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
// 글쓰기 모달
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
    renderPosts();
    renderPagination();
};

// =========================
// 수정 모달
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
// 삭제 모달
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
        renderPosts();
        renderPagination();
    }
};

// =========================
// 초기 실행
// =========================

document.addEventListener("DOMContentLoaded", () => {
    renderPosts();
    renderPagination();
});