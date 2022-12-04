/**
 * Act as a centralized place for data.
 */
const store = {

    // Create a task in the local storage
    createTask(title, desc) {

        const id = new Date().getTime();
        const task = { id, title, desc, completed: false };

        const tasks = this.getTasks();

        // Save newly created tasks
        tasks.push(task);
        this.setTasks(tasks);

        return task;
    },

    // Search for a task and mark it as completed
    setTaskCompletion(taskId, state) {

        const tasks = this.getTasks();

        let selectedTask;

        tasks.map((task) => {

            if (task.id === parseInt(taskId)) {

                task.completed = state;
                selectedTask = task;
            }

            return task;
        });

        // Save newly updated task
        this.setTasks(tasks);

        return selectedTask;
    },

    // Update an existing task using the task id
    updateTask(task) {

        const { id, title, desc } = task;
        const tasks = this.getTasks();

        // Get the specific task to be updated
        tasks.map((task) => {

            if (task.id === parseInt(id)) {
                task.title = title;
                task.desc = desc;
            }

            return task;
        });

        // Save newly updated task
        this.setTasks(tasks);

        return task;
    },

    // Delete task from local storage
    deleteTask(taskId) {

        const tasks = this.getTasks();
        const newTasks = tasks.filter((task) => task.id !== parseInt(taskId));
        this.setTasks(newTasks);
    },

    // Get active tasks
    getActiveTasks() {

        const tasks = this.getTasks();
        return tasks.filter((task) => !task.completed);
    },

    // Get completed tasks
    getCompletedTasks() {

        const tasks = this.getTasks();
        return tasks.filter((task) => task.completed);
    },

    // Get tasks count for each type
    getTasksCount() {

        const tasks = this.getTasks();

        return {
            tasks: tasks.length,
            active: this.getActiveTasks().length,
            completed: tasks.length - this.getActiveTasks().length
        }
    },

    // Get quotes state
    getQuoteState() {
        return JSON.parse(window.localStorage.getItem("quotes"));
    },

    // Set quotes state
    setQuoteState(state) {
        window.localStorage.setItem("quotes", state);
    },

    // Get quotes state
    getThemeState() {
        return JSON.parse(window.localStorage.getItem("dark"));
    },

    // Set quotes state
    setThemeState(state) {
        window.localStorage.setItem("dark", state);
    },

    // Complete remove all tasks
    resetAll() {
        window.localStorage.removeItem("tasks");
    },

    // Get all tasks
    getTasks() {

        // Get tasks array or create a new one
        return JSON.parse(window.localStorage.getItem("tasks")) || [];
    },

    // Replace tasks array in local storage
    setTasks(tasks) {
        window.localStorage.setItem("tasks", JSON.stringify(tasks));
    }
};

/**
 * Helpers to manipulate the DOM and update the UI.
 */
const ui = {

    stats: () => {
        return {
            tasksCount: document.getElementById("totalCount"),
            activeCount: document.getElementById("activeCount"),
            completedCount: document.getElementById("completedCount")
        }
    },

    // Inject an active task card into the UI
    createActiveTask(task, container = "#activeTasks") {

        const { id, title, desc } = task;
        const wrapper = document.querySelector(container);

        wrapper.innerHTML += `
             <div class="card" data-id=${id}>
                 <div class="card-body">
                    <div class="card-title">${title}</div>
                    <div class="card-content">${desc}</div>
                </div>
    
                <div class="card-action">
                    <button class="icon-button green" onclick="completeTaskHandler(event)"><i class="red" data-feather="check-circle"></i></button>
                    <button class="icon-button" onclick="editTaskHandler(event)"><i data-feather="edit"></i></button>
                    <button class="icon-button red" onclick="deleteTaskHandler(event)"><i data-feather="trash"></i></button>
                </div>
            </div>`;

        // Show Feather icons
        feather.replace();
    },

    // Inject a completed task card into the UI
    createCompletedTask(task, container = "#completedTasks") {

        const { id, title, desc } = task;
        const wrapper = document.querySelector(container);

        // Means we at home page and there isn't completed list
        if (!wrapper) return;

        wrapper.innerHTML += `
             <div class="card" data-id=${id}>
                 <div class="card-body">
                    <div class="card-title">${title}</div>
                    <div class="card-content">${desc}</div>
                </div>
    
                <div class="card-action">
                    <button class="icon-button green" onclick="incompleteTaskHandler(event)"><i class="red" data-feather="x-circle"></i></button>
                    <button class="icon-button red" onclick="deleteTaskHandler(event)"><i data-feather="trash"></i></button>
                </div>
            </div>`;

        // Show Feather icons
        feather.replace();
    },

    // Remove task card from the UI
    removeTask(taskId) {

        // Get card with the given task id
        const card = document.querySelector(`[data-id="${taskId}"]`);
        card.classList.add("remove");

        setTimeout(() => card.remove(), 500);
    },

    // Render the stat numbers on the UI
    renderStatsUI(counts) {

        const { tasks, active, completed } = counts;

        this.stats().tasksCount.innerText = tasks;
        this.stats().activeCount.innerText = active;
        this.stats().completedCount.innerText = completed;
    }
}

/**
 * Handle all dialog operations.
 */
const dialog = {

    addDialog: {},

    // Show popup dialog for adding and editing tasks
    showDialog(taskData) {

        // Change how the dialog look based on the function, it's either an add or an update
        if (taskData) {

            // Change dialog title and input values
            this.addDialog.modalTitle.innerText = "Update Task";
            this.addDialog.title.value = taskData.title;
            this.addDialog.desc.value = taskData.desc;
        }

        // Display the dialog
        this.addDialog.modal.style.display = "block";
        return this.addDialog;
    },

    // Create a hidden dialog on the DOM and save references for later use
    createDialog() {

        const dialogDiv = document.createElement("div");
        dialogDiv.setAttribute("id", "addDialog");
        dialogDiv.setAttribute("class", "dialog-wrapper");

        dialogDiv.innerHTML += `
            <div class="dialog">
                <div class="dialog-header">
                    <span id="modalTitle">New Task</span>
                    <button id="dialogClose" class="icon-button"><i data-feather="x"></i></button>
                </div>
        
                <div class="dialog-content">
                    <form>
                        <label class="input">Title<input id="dialogTitle" autocomplete="off" type="text" maxlength="15"></label>
                        <label class="input">Description<input id="dialogDesc" autocomplete="off" type="text" maxlength="30"></label>
                    </form>
                </div>
        
                <div class="dialog-action">
                    <button id="dialogSubmit" class="button">Confirm</button>
                </div>
            </div>`

        // Add div to the body
        document.body.appendChild(dialogDiv);

        // Save dialog references for later use
        this.addDialog = {
            modal: document.querySelector("#addDialog"),
            modalTitle: document.querySelector("#modalTitle"),
            close: document.querySelector("#dialogClose"),
            submit: document.querySelector("#dialogSubmit"),
            title: document.querySelector("#dialogTitle"),
            desc: document.querySelector("#dialogDesc")
        };

        // Attach click listeners
        this.addDialog.close.onclick = this.close;
    },

    // Close the dialog and clear inputs
    close() {

        // Close the dialog
        const { modal, title, desc } = dialog.addDialog;
        modal.style.display = "none";

        // Clear the inputs
        title.value = "";
        desc.value = "";
    }
}

/**
 * New task button click handler.
 */
const addTaskHandler = () => {

    // Open dialog
    const addDialog = dialog.showDialog();

    // Save task button click handler
    addDialog.submit.onclick = () => {

        // Create task in the store
        const task = store.createTask(addDialog.title.value, addDialog.desc.value);

        // Render the task on the UI
        ui.createActiveTask(task);

        // Close the dialog
        dialog.close();

        // Update the stats
        updateStats();
    };
}

/**
 * Mark task as completed button click handler.
 */
function completeTaskHandler(event) {

    // Get clicked task and the task id
    const taskCard = event.target.closest(".card");
    const taskId = taskCard.getAttribute("data-id");

    // Update the task in the local storage
    const task = store.setTaskCompletion(taskId, true);

    // Remove the task from active list
    ui.removeTask(taskId);

    // Render the task on the completed tasks list
    ui.createCompletedTask(task);

    // Update the stats
    updateStats();
}

/**
 * Mark task as not completed button click handler.
 */
function incompleteTaskHandler() {

    // Get clicked task and the task id
    const taskCard = event.target.closest(".card");
    const taskId = taskCard.getAttribute("data-id");

    // Update the task in the local storage
    const task = store.setTaskCompletion(taskId, false);

    // Remove the task from completed list
    ui.removeTask(taskId);

    // Render the task on the completed tasks list
    ui.createActiveTask(task);

    // Update the stats
    updateStats();
}

/**
 * Edit task button click handler
 */
const editTaskHandler = (event) => {

    // Get clicked task and the task id
    const taskCard = event.target.closest(".card");
    const taskId = taskCard.getAttribute("data-id");

    // Get current values
    const taskParent = taskCard.querySelectorAll(".card-body div");
    const taskData = {
        title: taskParent[0].innerText,
        desc: taskParent[1].innerText
    };

    // Show dialog with current task values
    const editDialog = dialog.showDialog(taskData);

    // Save task button click handler
    editDialog.submit.onclick = () => {

        // Get new task values
        const newTaskData = {
            id: taskId,
            title: editDialog.title.value,
            desc: editDialog.desc.value
        };

        // Update the task in local storage
        const task = store.updateTask(newTaskData);

        // Render the task on the UI
        taskParent[0].innerText = task.title;
        taskParent[1].innerText = task.desc;

        // Close the dialog
        dialog.close();
    };
}

/**
 * Task delete button handler.
 */
function deleteTaskHandler(event) {

    // Get clicked task
    const taskCard = event.target.closest(".card");

    // Delete task from the store by task id
    const taskId = taskCard.getAttribute("data-id");
    store.deleteTask(taskId);

    // Remove the task from the UI
    ui.removeTask(taskId);

    // Update the stats
    updateStats();
}

/**
 * Update the sidebar statistics on any change.
 */
function updateStats() {

    // Get all tasks counts
    const counts = store.getTasksCount();

    // Update the UI with the new stats
    ui.renderStatsUI(counts);
}

/**
 * Responsible for loading all active tasks for the first time.
 */
function loadActiveTasks() {

    // Get all active tasks
    const activeTasks = store.getActiveTasks();

    // Check if not empty
    if (!activeTasks) return;

    // Render all the tasks on the UI
    activeTasks.forEach((task) => ui.createActiveTask(task));
}

/**
 * Responsible for loading all completed tasks for the first time.
 */
function loadCompletedTasks() {

    // Get all completed tasks
    const completedTasks = store.getCompletedTasks();

    // Check if not empty
    if (!completedTasks) return;

    // Render all the tasks on the UI
    completedTasks.forEach((task) => ui.createCompletedTask(task));
}

/**
 * Switch the theme to dark mode based on the value.
 */
function changeTheme(isDark) {

    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

/**
 * Main entry point and where we initialize the page.
 */
(function () {

    // Change the site theme based on local storage
    changeTheme(store.getThemeState());

    // Load Father icons
    feather.replace();
})();
