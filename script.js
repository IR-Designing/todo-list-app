let user = document.getElementById("input-text");
let submit = document.getElementById("sub-btn");
let taskList = document.querySelector(".task-in");
let section = document.getElementById("section");

// Create task summary div
let taskSummary = document.createElement("div");
taskSummary.classList.add("task-summary");
taskSummary.classList.add("#select-all");
taskSummary.classList.add("#select-all-check");
taskSummary.innerHTML = `
    <button id="delete-all-btn">Delete</button>
    <div class="select-all-check">
    <input type="checkbox" id="select-all">
    <label for="select-all name="select-all" id="select-all"">Select All</label>
    </div>
    <h4 id="task-complete">0 tasks completed</h4>
    <h4 id="task-remaining">0 tasks remaining</h4>
`;
taskList.appendChild(taskSummary);

let completedCount = 0, totalCount = 0;

submit.addEventListener("click", (e) => {
    e.preventDefault();
    let userValue = user.value.trim();
    if (userValue !== "") {
        let newTask = document.createElement("div");
        newTask.classList.add("task");
        newTask.innerHTML = `
            <input type="checkbox" class="checkbox">
            <p>${userValue}</p>
            <button class="edit-btn"><i class='bx bx-edit'></i></button>
            <button class="del-btn"><i class='bx bx-trash'></i></button>`;

        taskList.prepend(newTask);
        updateTaskCount(1); // Increment task count
        user.value = "";
    } else {
        alert("Please enter a valid task.");
    }
});

// Event delegation for delete, edit, and checkbox actions
taskList.addEventListener("click", (e) => {
    const target = e.target;
    const task = target.closest(".task");

    if (target.classList.contains("del-btn") || target.closest(".del-btn")) {
        if (confirm("Are you sure you want to delete this task?")) {
            if (task.querySelector(".checkbox").checked) {
                completedCount--; // Adjust completed count if deleting a completed task
            }
            task.remove();
            updateTaskCount(-1);
        }
    } else if (target.classList.contains("edit-btn") || target.closest(".edit-btn")) {
        toggleEdit(task);
    } else if (target.classList.contains("checkbox")) {
        toggleTaskCompletion(task);
    }
});

// Function to toggle edit mode
function toggleEdit(task) {
    let taskText = task.querySelector("p");
    let button = task.querySelector(".edit-btn");

    if (taskText.contentEditable === "true") {
        taskText.contentEditable = "false";
        button.innerHTML = "<i class='bx bx-edit'></i>"; // Change back to edit icon
        taskText.style.backgroundColor = "transparent";
        taskText.style.color = "white";
    } else {
        taskText.contentEditable = "true";
        button.innerHTML = "<i class='bx bx-save'></i>"; // Change to save icon
        taskText.style.backgroundColor = "white";
        taskText.style.color = "black";
    }
}

// Function to update task counts
function updateTaskCount(change) {
    totalCount += change;
    if (totalCount < 0) totalCount = 0; // Ensure totalCount doesn't go negative
    updateCompletedTasks();
}

// Function to update completed task count
function updateCompletedTasks() {
    completedCount = document.querySelectorAll(".checkbox:checked").length;
    document.getElementById("task-complete").textContent = `${completedCount} tasks completed`;
    document.getElementById("task-remaining").textContent = `${Math.max(totalCount - completedCount, 0)} tasks remaining`;
}

// Function to mark task as completed and disable it
function toggleTaskCompletion(task) {
    let checkbox = task.querySelector(".checkbox");
    let taskText = task.querySelector("p");

    if (checkbox.checked) {
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "gray";
        checkbox.disabled = true; // Disable checkbox after marking as completed
    }

    updateCompletedTasks();
}

// Select All Checkbox Logic
document.getElementById("select-all").addEventListener("change", function () {
    let checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
    updateCompletedTasks();
});

// Delete All Selected Tasks
document.getElementById("delete-all-btn").addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all selected tasks?")) {
        let selectedTasks = document.querySelectorAll(".checkbox:checked");
        selectedTasks.forEach(checkbox => {
            checkbox.closest(".task").remove();
        });

        // Reset counts after all tasks are deleted
        totalCount -= selectedTasks.length;
        if (totalCount < 0) totalCount = 0;
        updateCompletedTasks();
    }
});