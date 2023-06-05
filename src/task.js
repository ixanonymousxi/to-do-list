import { format, isAfter } from 'date-fns'
import { mainDash } from './index';

const Task = (title, description, date, priority, project, color, id) => {

    const getProject = () => project;
    const getDescription = () => description;
    const getId = () => id;
    const getTitle = () => title;
    const getDate = () => date;
    const getPriority = () => priority;
    let completed = false;


    const setCompletion = () => {
        completed = !completed;
    };

    const deleteTask = () => {
        mainDash.newForm("delete", title, description, date, priority, project, id);
    };

    const editTask = () => {
        mainDash.newForm("edit-task", title, description, date, priority, project, id);
    };

    const adjustTaskProperties = (newTitle, newDescription, newDueDate, newPriority, newProject, newColor) => {
        title = newTitle;
        description = newDescription;
        date = newDueDate;
        priority = newPriority;
        project = newProject;
        color = newColor;
    };

    const adjustProject = (newProject, newColor) => {
        project = newProject;
        color = newColor;
    };

    const toggleCompleteTask = () => {
        const taskLi = document.getElementById(id);
        const checkBoxValue = taskLi.childNodes[0].checked;
        const editButton = taskLi.childNodes[4];

        if (checkBoxValue) {
            mainDash.addToCompleteList(id);
            taskLi.classList.add("completed-task");
            editButton.removeEventListener("click", editTask);
            completed = true;
        } else {
            mainDash.removeFromCompleteList(id);
            taskLi.classList.remove("completed-task");
            editButton.addEventListener("click", editTask);
            completed = false;
        }
    };

    const toggleDescription = () => {
        const taskLi = document.getElementById(id);
        const descriptionEle = taskLi.childNodes[taskLi.childNodes.length - 1];

        if (getComputedStyle(descriptionEle, null).opacity === "0") {
            descriptionEle.style.display = "block";
            window.setTimeout(() => {
                descriptionEle.style.opacity = "1";
                descriptionEle.style.padding = "10px 0";
                descriptionEle.style.maxHeight = "600px";
            }, 100);
        } else {
            descriptionEle.style.opacity = "0";
            descriptionEle.style.padding = "0";
            descriptionEle.style.maxHeight = "0";
            window.setTimeout(() => {
                descriptionEle.style.display = "none";
            }, 300);
        }

    };

    const taskToDom = () => {
        const taskListUl = document.querySelector("#task-list");

        const taskLi = document.createElement("li");
        taskLi.classList.add("to-do-list-item");
        taskLi.style.borderColor = color;
        taskLi.id = id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("click", toggleCompleteTask);


        if (completed) {
            taskLi.classList.add("completed-task");
            checkbox.checked = true;
        }

        const colorBox = document.createElement("div");
        colorBox.classList.add("priority-box");
        switch (priority) {
            case "high":
                colorBox.classList.add("high-background");
                break;

            case "medium":
                colorBox.classList.add("medium-background");
                break;

            case "low":
                colorBox.classList.add("low-background");
                break;

            default:
                colorBox.classList.add("medium-background");
        };
        colorBox.addEventListener("click", toggleDescription);

        const taskLabel = document.createElement("label");
        taskLabel.innerHTML = title;
        taskLabel.classList.add("task-label");
        taskLabel.addEventListener("click", toggleDescription);


        const year = date.slice(0, 4);
        const month = date.slice(5, 7) - 1;
        const day = date.slice(8);
        const formattedDate = format(new Date(year, month, day), 'MMM dd, yyyy');
        const dueDate = document.createElement("div");
        dueDate.innerHTML = formattedDate;
        dueDate.classList.add("date-due");
        dueDate.addEventListener("click", toggleDescription);

        const edit = document.createElement("span");
        edit.innerHTML = "edit";
        edit.classList.add("material-symbols-outlined");
        edit.addEventListener("click", editTask);

        const trash = document.createElement("span");
        trash.innerHTML = "delete";
        trash.classList.add("material-symbols-outlined");
        trash.addEventListener("click", deleteTask);

        const descriptionEle = document.createElement("div");
        descriptionEle.innerHTML = description;
        descriptionEle.classList.add("description");
        descriptionEle.addEventListener("click", toggleDescription);
        


        taskLi.appendChild(checkbox);
        taskLi.appendChild(colorBox);
        taskLi.appendChild(taskLabel);
        taskLi.appendChild(dueDate);
        taskLi.appendChild(edit);
        taskLi.appendChild(trash);
        taskLi.appendChild(descriptionEle);

        taskListUl.appendChild(taskLi);
    };

    const compare = (task1, task2, style) => {
        switch (style) {
            case "byDate":
                const task1Date = new Date(task1.getDate());
                const task2Date = new Date(task2.getDate());

                if (isAfter(task1Date, task2Date)){
                    return true;
                } else {
                    return false;
                }

                break;

            case "lowToHigh":
                if ((task1.getPriority() === "medium" && task2.getPriority() === "low") ||
                    (task1.getPriority() === "high" && task2.getPriority() === "low") ||
                    (task1.getPriority() === "high" && task2.getPriority() === "medium")) {
                        return true;
                    }else{
                        return false;
                    }

                break;

            case "highToLow":
                if ((task1.getPriority() === "medium" && task2.getPriority() === "high") ||
                    (task1.getPriority() === "low" && task2.getPriority() === "medium") ||
                    (task1.getPriority() === "low" && task2.getPriority() === "high")) {
                        return true;
                    } else {
                        return false;
                    }

                break;

            case "alpha":
                if (task1.getTitle() > task2.getTitle()) {
                        return true;
                    } else {
                        return false;
                    }

                break;

            case "reverseAlpha":
                if (task1.getTitle() < task2.getTitle()) {
                    return true;
                } else {
                    return false;
                }
                break;

        }

    }

    const toJSON = () => {
        return [title, description, date, priority, project, color, id];
    };

    return { toJSON, taskToDom, adjustTaskProperties, getProject, getId, adjustProject, compare, getPriority, getDate, getTitle, getDescription, setCompletion };

};


export {Task};