import {mainDash} from './index';


const Form = (type, itemTitle, descriptionOrProjectColor, date, priority, project, id) => {

    let form = document.querySelector("#task-form");
    let title = document.querySelector("#taskName");
    let confirmButton = document.querySelector("#taskConfirm");
    let closeButton = document.querySelector("#taskClose");

    const taskDescription = document.querySelector("#taskDescription");
    const taskDueDate = document.querySelector("#taskDueDate");
    const taskPriority = document.querySelector("#taskPriority");
    const taskProject = document.querySelector("#taskProject");

    const projectColor = document.querySelector("#projectColor");

    //Changes task priority label to match selected priority
    taskPriority.addEventListener("change", () => {
        const newColor = taskPriority.value + "-background";
        document.querySelector("#priority-legend").classList.remove("low-background");
        document.querySelector("#priority-legend").classList.remove("medium-background");
        document.querySelector("#priority-legend").classList.remove("high-background");
        document.querySelector("#priority-legend").classList.add(newColor);
    });

    const openForm = () => {
        if (type === "delete" || type === "add-project") {
            form.style.display = "flex";
        } else {
            form.style.display = "grid";
        }

        if(window.innerWidth < 600){
            const newHeight = document.querySelector("#dashboard").offsetHeight + document.querySelector("#side-nav").offsetHeight;
            document.querySelector(":root").style.setProperty("--browserHeight", newHeight + "px");

        }else{
            document.querySelector(":root").style.setProperty("--browserHeight", document.querySelector("#dashboard").offsetHeight + "px");

        }

        closeButton.addEventListener("click", closeForm);
    };

    const closeForm = () => {
        form.style.display = "none";
        resetValues();
        mainDash.closeForm();
    };

    const resetValues = () => {
        if (type !== "delete") {
            title.value = taskDescription.value = taskDueDate.value = "";
            taskPriority.value = "low";
            taskProject.value = "Home";
            projectColor.value = '#a9a9a9';
        }

        document.getElementById("task-list").classList.remove("edit-form-bg");
        document.querySelector(":root").style.setProperty("--browserHeight", "100vh");
        document.querySelector("#priority-legend").classList.add("low-background");

        confirmButton.removeEventListener("click", createTask);
        confirmButton.removeEventListener("click", editTask);
        confirmButton.removeEventListener("click", createProject);
        confirmButton.removeEventListener("click", editProject);
        confirmButton.removeEventListener("click", deleteTask);
        confirmButton.removeEventListener("click", deleteProject);

    };

    const createTask = () => {
        if (title.value !== "" && !!taskDueDate.value){
            mainDash.addTask(title.value, taskDescription.value, taskDueDate.value, taskPriority.value, taskProject.value);
            closeForm();
        }
    };

    const editTask = () => {
        if (title.value !== "" && !!taskDueDate.value) {
            mainDash.editTask(title.value, taskDescription.value, taskDueDate.value, taskPriority.value, taskProject.value, id);
            closeForm();
        }
    };

    const deleteTask = () => {
        mainDash.removeTask(id);
        closeForm();
    };

    const createProject = () => {
        if (title.value !== "") {
            mainDash.addProject(title.value, projectColor.value);
            closeForm();  
        }
    };

    const editProject = () => {
        if (title.value !== "") {
            mainDash.editProject(title.value, projectColor.value, itemTitle);
            closeForm();
        }
    };

    const deleteProject = () => {
        mainDash.removeProject(title);
        closeForm();
    };

    switch (type) {
        case "add-task":

            //Sets project selection to whichever project the user is currently in.
            const projectCurrentlyListed = document.querySelector("#list-title").innerHTML.slice(0,-5);
            document.querySelector("#defaultOption").selected = 'selected';
            document.querySelectorAll('option').forEach(option => {
                if (option.value === projectCurrentlyListed) {
                    option.selected = 'selected';
                }
            });
            
            document.getElementById("task-list").classList.add("edit-form-bg");

            confirmButton.value = "Add Task";
            confirmButton.addEventListener("click", createTask);

            window.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && taskDescription !== document.activeElement) {
                    createTask();
                }
            });

            break;

        case "edit-task":
            title.value = itemTitle;
            taskDescription.value = descriptionOrProjectColor;
            taskDueDate.value = date;
            taskPriority.value = priority;
            taskProject.value = project;

            document.getElementById("task-list").classList.add("edit-form-bg");

            confirmButton.value = "Confirm";
            confirmButton.addEventListener("click", editTask);

            window.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && taskDescription !== document.activeElement) {
                    editTask();
                }
            });

            break;

        case "add-project":
            form = document.querySelector("#project-form");
            title = document.querySelector("#projectName");
            confirmButton = document.querySelector("#projectConfirm");
            closeButton = document.querySelector("#projectClose");

            confirmButton.value = "Add";
            confirmButton.addEventListener("click", createProject);

            window.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    createProject();
                }
            });

            break;

        case "edit-project":
            form = document.querySelector("#project-form");
            title = document.querySelector("#projectName");
            title.value = itemTitle;
            projectColor.value = descriptionOrProjectColor;
            confirmButton = document.querySelector("#projectConfirm");
            closeButton = document.querySelector("#projectClose");

            confirmButton.value = "Edit";
            confirmButton.addEventListener("click", editProject);

            window.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    editProject();
                }
            });

            break;

        case "delete":
            form = document.querySelector("#delete-form");
            confirmButton = document.querySelector("#deleteYes");
            closeButton = document.querySelector("#deleteNo");

            document.getElementById("task-list").classList.add("edit-form-bg");


            if(id > 0){
                confirmButton.addEventListener("click", deleteTask, { once: true });  
                
                window.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        deleteTask();
                    } else if (e.key === "Delete" || e.key === "Backspace") {
                        closeForm();
                    }
                });
            }else{
                title = itemTitle;
                confirmButton.addEventListener("click", deleteProject, { once: true });

                window.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        deleteProject();
                    } else if (e.key === "Delete" || e.key === "Backspace"){
                        closeForm();
                    }
                });
            }

            break;

        default:
            document.querySelector("#task-form");
    };

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape"){
            closeForm();
        }
    });

    return { openForm, closeForm };
};


export {Form};