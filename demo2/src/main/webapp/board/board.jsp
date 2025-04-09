<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>Board</title>

    <!-- 공통 헤더 include -->
    <jsp:include page="../common/head.jsp"/>

    <!-- 사용자 정의 스타일 적용 -->
    <link href="./css/custom.css" rel="stylesheet"/>
</head>

<body>

    <jsp:include page="../common/header.jsp"/>

    <div id="board-section">
        <section class="boxed defaultbox boxed_shadow">

            <h1>DOS Board</h1>

            <!-- 글쓰기 버튼 -->
            <div class="btn-wrapper">
                <div id="openCreateModal" class="btn-div">[ 글쓰기 ]</div>
            </div>
            <!-- 게시판 -->
            <div class="boxed defaultbox">
                <table class="boxed defaultbox boxed_shadow">
                    <thead>
                    <tr>
                        <th style="width: 15%; text-align: center;"><strong>글번호</strong></th>
                        <th style="width: 50%; text-align: center;"><strong>제목</strong></th>
                        <th style="width: 15%; text-align: center;"><strong>작성자</strong></th>
                        <th style="width: 20%; text-align: center;"><strong>관리</strong></th>
                    </tr>
                    </thead>
                    <tbody id="post-list"></tbody>
                </table>
            </div>

            <div class="pagination-wrapper" id="pagination"></div>

            <!-- 글쓰기 모달 -->
            <div class="modal-overlay" id="createModal">
                <div class="modal-box">
                    <form id="create-post-form">
                        <h3><strong>글쓰기</strong></h3>
                        <label for="create-title">제목</label><input id="create-title" placeholder="제목" required/>
                        <label for="create-author">작성자</label><input id="create-author" placeholder="작성자" required/>
                        <label for="create-content">내용</label><textarea
                            id="create-content"
                            rows="4"
                            placeholder="내용"
                            required></textarea>
                        <div class="modal-footer">
                            <div id="submitCreateForm" class="btn-div">[ 저장 ]</div>
                            <div id="closeCreateModal" class="btn-div">[ 취소 ]</div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- 수정 모달 -->
            <div class="modal-overlay" id="editModal">
                <div class="modal-box">
                    <form id="edit-post-form">
                        <h3>게시글 수정</h3>
                        <input type="hidden" id="edit-id"/>
                        <label for="edit-title">제목</label><input id="edit-title" placeholder="제목" required/>
                        <label for="edit-author">작성자</label><input id="edit-author" placeholder="작성자" readonly/>
                        <label for="edit-content">내용</label><textarea
                            id="edit-content"
                            rows="4"
                            placeholder="내용"
                            required></textarea>
                        <div class="modal-footer">
                            <div id="submitEditForm" class="btn-div">[ 수정 ]</div>
                            <div id="closeEditModal" class="btn-div">[ 취소 ]</div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- 삭제 확인 모달 -->
            <div class="modal-overlay" id="deleteModal">
                <div class="modal-box">
                    <h3>정말 삭제하시겠습니까?</h3>
                    <div class="modal-footer">
                        <div id="confirmDelete" class="btn-div">[ 삭제 ]</div>
                        <div id="cancelDelete" class="btn-div">[ 취소 ]</div>
                    </div>
                </div>
            </div>

            <!-- 상세보기 모달 -->
            <div class="modal-overlay" id="detailModal">
                <div class="modal-box">
                    <h3>게시글 상세보기</h3>
                    <div class="modal-body">
                        <div style="margin-bottom: 10px">
                            <strong>제목:</strong> <span id="detail-title"></span>
                        </div>
                        <div style="margin-bottom: 10px">
                            <strong>작성자:</strong> <span id="detail-author"></span>
                        </div>
                        <div style="margin-bottom: 10px"><strong>내용</strong></div>
                        <div
                                id="detail-content"
                                style="white-space: pre-wrap;
                                       border: 1px solid #ff0;
                                       padding: 8px;">
                        </div>
                    </div>
                    <div class="modal-footer" style="margin-top: 20px; display: flex; justify-content: flex-end">
                        <div id="closeDetailModal" class="btn-div">[ 닫기 ]</div>
                    </div>
                </div>
            </div>

        </section>
    </div>

    <!-- 사용자 정의 기능 포함 (게시글 목록, 수정, 삭제 등 처리) -->
    <script src="./js/custom.js"></script>

</body>
</html>
