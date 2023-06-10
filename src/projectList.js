import { format} from 'date-fns'
import { mainDash } from './index';


const ProjectList = (title, color) => {
    let taskList = [];
    const getList = () => taskList;
    const getTitle = () => title;
    const getColor = () => color;
    

    const addToList = (task,index) => {
        if(index >= 0){
            taskList.splice(index, 0, task);
        }else{
            taskList.push(task);
        }
    };

    const removeFromList = (task) => {
        const taskArrLocation = taskList.findIndex(element => element.getId() === task.getId());
        taskList.splice(taskArrLocation, 1);
    };

    const editProject = () => {
        mainDash.newForm("edit-project", title, color);
    };

    const deleteProject = () => {
        mainDash.newForm("delete", title);
    };

    const adjustProjectProperties = (newTitle, newColor) => {
        title = newTitle;
        color = newColor;
    };


    const clearTasks = () => {
        const taskListUl = document.querySelector("#task-list");
        const liRemovalList = [];

        taskListUl.childNodes.forEach(li => {
            if (li.className === "to-do-list-item" || li.className === "to-do-list-item completed-task") {
                li.style.display = "none";
                liRemovalList.push(li)
            }
        });

        liRemovalList.forEach(li => {
            taskListUl.removeChild(li);
        });
    };

    const displayTodaysTasks = () => {
        clearTasks();

        const todaysDate = format(new Date(), 'yyyy-MM-dd');

        taskList.forEach(task => {
            if (task.getDate() === todaysDate){
                task.taskToDom();
            }
        });
    };

    const displayTasks = () => {
        clearTasks();
        taskList.forEach(task => {
            task.taskToDom();
        });
    };

    const sortTasks = (order) => {
       let keepSorting = false;

        do { keepSorting = false;

            for (let i = 0; i < taskList.length - 1; i++) {
                let taskA = taskList[i]
                let taskB = taskList[i + 1]

                let result = taskA.compare(taskA, taskB, order);
                if (result) {
                    keepSorting = true;
                    let tempTask = taskList[i];
                    taskList[i] = taskList[i + 1];
                    taskList[i + 1] = tempTask;
                }

            }
        } while (keepSorting);

    }

    const projectToDom = () => {
        if(title !== "Home"){
            const projectListHeader = document.querySelector("#list-title");
            const projectListUL = document.querySelector("#project-list-container");

            const projectLi = document.createElement("li");
            projectLi.classList.add("project-list-item");

            const icon = document.createElement("span");
            icon.innerHTML = "stop";
            icon.classList.add("material-symbols-outlined");
            icon.classList.add("project-edit-icon");
            icon.style.color = color;
            icon.addEventListener("click", editProject);

            const p = document.createElement("p");
            p.innerHTML = title;
            p.addEventListener("click", () => {
                projectListHeader.innerHTML = title + " List";
                displayTasks();
            });

            const deleteIcon = document.createElement("span");
            deleteIcon.innerHTML = "close";
            deleteIcon.classList.add("material-symbols-outlined");
            deleteIcon.addEventListener("click", deleteProject);

            if (title !== "Completed") { 
                projectLi.appendChild(icon); 
            }
            
            projectLi.appendChild(p);
            projectLi.appendChild(deleteIcon);

            projectListUL.insertBefore(projectLi, document.querySelector(".add-project"));
        }
  
    };

    const toJSON = () => {
        return [title, color];
    };


    return { toJSON, getTitle, getList, addToList, displayTasks, removeFromList, getColor, projectToDom, adjustProjectProperties, sortTasks, displayTodaysTasks};
};

export {ProjectList};