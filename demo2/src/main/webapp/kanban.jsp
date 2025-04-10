<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:include page="/header.jsp"></jsp:include>

<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<!-- FullCalendar JS -->
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<link rel="stylesheet" href="/assets/css/kanban.css">
<style>
	/*
	body {
		background-color: white;
	}
	*/
	.fc .fc-daygrid-day {
		background-color: white !important;
	}

	.fc .fc-day-today {
		background-color: #ffe29d !important;
	}
</style>
<body>

<section id="kanban-section">
	<!--태그 필터 -->
	<div class="filter">
		<label for="tagFilter"></label>
		<select id="tagFilter">
			<option value="all">전체</option>
		</select>
	</div>


	<!-- 뷰 전환 버튼 -->
	<div class="view-toggle">
		<button id="kanbanViewBtn">칸반 보기</button>
		<button id="calendarViewBtn">캘린더 보기</button>
	</div>


	<!-- 캘린더 영역 -->
	<div id="calendarView" style="display: none;">
		<div id="calendar"></div>
	</div>

	<!-- 칸반 뷰 -->
	<div id="kanbanView">
		<!-- 칸반 -->
		<div class="board">
			<div class="column" data-status="todo">
				<div class="column-header">
					<h2>할 일</h2>
					<button class="add-task-btn">+</button>
				</div>
				<div class="task-list"></div>
			</div>
			<div class="column" data-status="in-progress">
				<div class="column-header">
					<h2>진행 중</h2>
					<button class="add-task-btn">+</button>
				</div>
				<div class="task-list"></div>
			</div>
			<div class="column" data-status="done">
				<div class="column-header">
					<h2>완료</h2>
					<button class="add-task-btn">+</button>
				</div>
				<div class="task-list"></div>
			</div>
		</div>
	</div>

	<!-- 모달 팝업 창 -->
	<div class="modal" id="taskModal">
		<div class="modal-content">
			<input type="text" id="taskTitle" placeholder="제목"/>
			<textarea id="taskDescription" rows="3" placeholder="설명"></textarea>
			<input type="date" id="startDate" placeholder="시작일" autocomplete="off">
			<input type="date" id="endDate" placeholder="마감일" autocomplete="off">


			<input type="text" id="taskTag" placeholder="태그 (쉼표로 구분)"/>
			<div class="tag-suggestions" id="tagSuggestions"></div>
			<div class="modal-buttons">
				<button id="deleteTask">삭제</button>
				<button id="saveTask">저장</button>
				<button id="closeModal">닫기</button>
			</div>
		</div>
	</div>

</section>
<script src="/assets/js/kanban.js"></script>

</body>
<jsp:include page = "/footer.jsp"></jsp:include>