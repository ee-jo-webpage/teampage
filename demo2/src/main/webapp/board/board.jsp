<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>게시판</title>

  <jsp:include page="../common/head.jsp"/>
  <!-- 부트스트랩 기본 스타일 적용 -->
  <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
  <!-- 사용자 정의 스타일 적용 -->
  <link href="./css/custom.css" rel="stylesheet" />
</head>

<!-- board-section -->
<body class="bg-white p-4">
  <jsp:include page="../common/header.jsp"/>
  <section id="board-section">
    <div class="container">
      <h2 class="mb-4">게시판</h2>

      <!-- 글쓰기 버튼 (클릭 시 글쓰기 모달 호출) -->
      <div class="mb-3 text-end">
        <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createModal">
          글쓰기
        </button>
        <!-- data-bs-toggle="modal": 모달 기능 활성화 속성 -->
        <!-- data-bs-target="#createModal": id값으로 모달 매핑 -->
      </div>

      <!-- 글쓰기 모달
          .fade: 페이드 애니메이션 적용
          .modal-dialog: 모달크기, 정렬 (기본 중앙)
          data-bs-dismiss="modal": 클릭시 현재 모달 종료
          tabindex="-1": 모달 바깥으로 포커스 이동 차단
          aria-hidden="true": 모달이 처음에 보이지 않도록 지정
      -->
      <div
              class="modal fade"
              id="createModal"
              tabindex="-1"
              aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <form id="create-post-form">
              <!-- 글쓰기 폼 -->
              <div class="modal-header">
                <h5 class="modal-title">게시글 작성</h5>
                <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <!-- 제목 입력 -->
                <div class="mb-3">
                  <label for="create-title" class="form-label">제목</label>
                  <input
                          type="text"
                          class="form-control"
                          id="create-title"
                          required />
                </div>
                <!-- 작성자 입력 -->
                <div class="mb-3">
                  <label for="create-author" class="form-label">작성자</label>
                  <input
                          type="text"
                          class="form-control"
                          id="create-author"
                          required />
                </div>
                <!-- 내용 입력 -->
                <div class="mb-3">
                  <label for="create-content" class="form-label">내용</label>
                  <textarea
                          class="form-control"
                          id="create-content"
                          rows="4"
                          required></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">저장</button>
                <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 수정 모달 -->
      <div class="modal fade" id="postModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <form id="update-post-form">
              <!-- 수정 폼 -->
              <div class="modal-header">
                <h5 class="modal-title">게시글 수정</h5>
                <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <input type="hidden" id="post-id" />
                <!-- 수정 시 게시글 ID 보관 -->
                <div class="mb-3">
                  <label for="title" class="form-label">제목</label>
                  <input
                          type="text"
                          class="form-control"
                          id="title"
                          required />
                </div>
                <div class="mb-3">
                  <label for="author" class="form-label">작성자</label>
                  <input
                          type="text"
                          class="form-control"
                          id="author"
                          readonly />
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">내용</label>
                  <textarea
                          class="form-control"
                          id="content"
                          rows="4"
                          required></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">저장</button>
                <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 상세보기 모달 -->
      <div
              class="modal fade"
              id="detailModal"
              tabindex="-1"
              aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">게시글 상세</h5>
              <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <p><strong>제목:</strong> <span id="detail-title"></span></p>
              <p><strong>작성자:</strong> <span id="detail-author"></span></p>
              <p><strong>내용:</strong></p>
              <p id="detail-content"></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 게시글 테이블 -->
      <table
              class="table table-sm align-middle table-hover table-striped table-borderless">
        <thead>
        <tr class="table-primary">
          <!-- 부트스트랩 테이블 헤더 강조 -->
          <th class="text-center w-5">글번호</th>
          <th class="text-start w-75">제목</th>
          <th class="text-center w-20">작성자</th>
          <th class="text-center">관리</th>
        </tr>
        </thead>
        <tbody id="post-list"></tbody>
        <!-- 게시글 목록이 동적으로 들어가는 tbody -->
      </table>

      <!-- 페이지네이션 (부트스트랩 nav + ul 구조) -->
      <nav>
        <ul id="pagination" class="pagination justify-content-center"></ul>
      </nav>
    </div>
  </section>

  <!-- 부트스트랩 JS 기능 포함 (모달, 토글 등) -->
  <script src="../vendor/bootstrap/js/bootstrap.min.js"></script>
  <!-- 사용자 정의 기능 포함 (게시글 목록, 수정, 삭제 등 처리) -->
  <script src="./js/custom.js"></script>
</body>
</html>
