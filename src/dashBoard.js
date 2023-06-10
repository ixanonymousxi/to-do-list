import { ProjectList } from './projectList';
import { Task } from './task';
import { Form } from './form';




const DashBoard = () => {

    let taskList = [];
    let projectList = [ProjectList("Home", "#a9a9a9")];
    let taskId = 1;
    let openForms = [];


    const addProject = (projectTitle, projectColor) => {

        const newProjectList = ProjectList(projectTitle, projectColor);

        if(projectTitle === "Completed"){
            projectList.splice(1, 0, newProjectList);
        }else{
            projectList.push(newProjectList);
            addToProjectListOptions(projectTitle);
            displayTasksOnDash(projectList[projectList.length - 1]);
        }
        
        displayProjectsOnDash();

        setStorage();
        
    };

    const editProject = (newTitle, newColor, projectOldName) => {
        const oldProjectLocation = projectList.findIndex(project => project.getTitle() === projectOldName);
        const oldProject = projectList[oldProjectLocation];

        oldProject.adjustProjectProperties(newTitle, newColor);
        oldProject.getList().forEach(task => {
            task.adjustProject(newTitle,newColor);
        });

        displayProjectsOnDash();
        displayTasksOnDash(oldProject);

        removeFromProjectListOptions(projectOldName);
        addToProjectListOptions(newTitle);

        setStorage()

    };

    const removeProject = (projectTitle) => {
        const projectArrLocation = projectList.findIndex(element => element.getTitle() === projectTitle);
        const tasksInProject = projectList[projectArrLocation].getList();
        const tasksToRemove = [];

        tasksInProject.forEach(task => {
            tasksToRemove.push(task);
        });

        tasksToRemove.forEach(task => {
            removeTask(task.getId());
        });

        projectList.splice(projectArrLocation, 1);
        removeFromProjectListOptions(projectTitle);

        displayProjectsOnDash();
        displayTasksOnDash(projectList[0]);

        setStorage()
    };

    const addToProjectListOptions = (projectTitle) => {
        const projectInputList = document.querySelector("#taskProject");

        const newOption = document.createElement("option");
        newOption.value = projectTitle;
        newOption.innerHTML = projectTitle;

        projectInputList.appendChild(newOption);

    }

    const removeFromProjectListOptions = (projectTitle) => {
        const projectInputList = document.querySelector("#taskProject");

        projectInputList.childNodes.forEach(option => {
            if (option.value === projectTitle){
                projectInputList.removeChild(option);
            }
        });

    }
    

    const addTask = (title, taskDescription, taskDueDate, taskPriority, taskProject) => {
        const taskProjectLocation = projectList.findIndex(project => project.getTitle() === taskProject);
        const projectColor = projectList[taskProjectLocation].getColor();
        const dashboardListTitle = document.querySelector('#list-title').innerHTML;

        const newTask = Task(title, taskDescription, taskDueDate, taskPriority, taskProject, projectColor, taskId);
        taskId++;

        taskList.push(newTask);
        addTaskToProject(newTask);
        
        if (dashboardListTitle === "To do List") {
            displayTasksOnDash(projectList[0]);
        } else {
            displayTasksOnDash(projectList[taskProjectLocation]);
        }

        setStorage();
    };


    const removeTask = (taskId) => {
        const taskArrLocation = taskList.findIndex(element => element.getId() === taskId);

        const taskProjectLocation = projectList.findIndex(project => project.getTitle() === taskList[taskArrLocation].getProject());

        //Checks if task was completed and removes from completed list if so.
        projectList.forEach(project => {
            if (project.getTitle() === "Completed" && project.getList().includes(taskList[taskArrLocation])) {
                removeFromCompleteList(taskId, "delete");
            }
        });

        removeTaskFromProject(taskList[taskArrLocation]);
        taskList.splice(taskArrLocation, 1);

        const dashboardListTitle = document.querySelector('#list-title').innerHTML;

        if (dashboardListTitle === "To do List"){
            displayTasksOnDash(projectList[0]);
        }else{
            displayTasksOnDash(projectList[taskProjectLocation]);
        }

        setStorage();
        
    };

    const editTask = (newTitle, newDescription, newDueDate, newPriority, newProject, taskId) => {
        const taskArrLocation = taskList.findIndex(element => element.getId() === taskId);

        const taskOldProjectLocation = projectList.findIndex(project => project.getTitle() === taskList[taskArrLocation].getProject());
        const taskOldProject = projectList[taskOldProjectLocation];
        const taskIndexInProjectList = taskOldProject.getList().findIndex(task => task.getId() === taskId);

        const taskNewProjectLocation = projectList.findIndex(project => project.getTitle() === newProject);
        const dashboardListTitle = document.querySelector('#list-title').innerHTML;

        const projectColor = projectList[taskNewProjectLocation].getColor();

        removeTaskFromProject(taskList[taskArrLocation]);
        taskList[taskArrLocation].adjustTaskProperties(newTitle, newDescription, newDueDate, newPriority, newProject, projectColor);
        addTaskToProject(taskList[taskArrLocation], taskIndexInProjectList);

        if (dashboardListTitle === "To do List") {
            displayTasksOnDash(projectList[0]);
        } else {
            displayTasksOnDash(projectList[taskNewProjectLocation]);
        }

        setStorage();

    };

    const addToCompleteList = (taskId) => {
        const completedListExist = projectList.filter(project => project.getTitle() === "Completed");
        const taskArrLocation = taskList.findIndex(element => element.getId() === taskId);

        if (completedListExist.length === 0) {
            addProject("Completed");
        }

        projectList.forEach(project => {
            if (project.getTitle() === "Completed") {
                taskList[taskArrLocation].setCompletion();
                project.addToList(taskList[taskArrLocation]);
            }

            /*
            if (project.getTitle() === taskList[taskArrLocation].getProject()){
                removeTaskFromProject(taskList[taskArrLocation]);
                window.setTimeout(()=>{displayTasksOnDash(project);}, 500);
            }
            */
        });


        setStorage();
    };

    const removeFromCompleteList = (taskId, remove) => {
        const taskArrLocation = taskList.findIndex(element => element.getId() === taskId);
        const dashboardListTitle = document.querySelector('#list-title').innerHTML;

        projectList.forEach(project => {
            if (project.getTitle() === "Completed") {
                taskList[taskArrLocation].setCompletion();
                project.removeFromList(taskList[taskArrLocation]);
                if (dashboardListTitle === "Completed List"){
                    displayTasksOnDash(project);
                }  
            }
        });

        /*
        if(remove !== "delete"){
            addTaskToProject(taskList[taskArrLocation]);
        }
        */
        
        

        setStorage();
        
    };

    const addTaskToProject = (task, index) => {
        projectList.forEach(project => {
            if (task.getProject() === project.getTitle() || project.getTitle() === "Home") {
                project.addToList(task,index);
            }
        });
    };

    const removeTaskFromProject = (task) => {
        projectList.forEach(project => {
            if (task.getProject() === project.getTitle() || project.getTitle() === "Home") {
                project.removeFromList(task);
            }
        });
    };

    const todaysDateButton = () => {
        const dashboardListTitle = document.querySelector('#list-title').innerHTML;
        const projectTitle = dashboardListTitle === "To do List" ? "Home" : dashboardListTitle.slice(0, -5);
        const taskProjectLocation = projectList.findIndex(project => project.getTitle() === projectTitle);
        const currentProject = projectList[taskProjectLocation];

        currentProject.displayTodaysTasks();

    };

    const sortList = () => {
        const sortInput = document.querySelector("#sortInput");
        const sortStyle = sortInput.value;
        let projectListHeader;
        
        if(document.querySelector("#list-title").innerHTML === "To do List"){
            projectListHeader = "Home";
        }else{
            projectListHeader = document.querySelector("#list-title").innerHTML.slice(0,-5);
        }

        const projectArrLocation = projectList.findIndex(project => project.getTitle() === projectListHeader);

        projectList[projectArrLocation].sortTasks(sortStyle);
        displayTasksOnDash(projectList[projectArrLocation]);
        
        sortInput.childNodes[1].selected = true;
    };

    const displayTasksOnDash = (project) => {
        const projectListHeader = document.querySelector("#list-title");

        if (project.getTitle() === "Home"){
            projectListHeader.innerHTML = "To do List";
        }else{
            projectListHeader.innerHTML = project.getTitle() + " List";
        }
        
        project.displayTasks();
    };

    
    const clearListDisplay = () => {
        const projectListUl = document.querySelector("#project-list-container");
        const liRemovalList = [];

        projectListUl.childNodes.forEach(li => {
            if (li.className === "project-list-item") {
                li.style.display = "none";
                liRemovalList.push(li)
            }
        });

        liRemovalList.forEach(li => {
            projectListUl.removeChild(li);
        });

    }

    const displayProjectsOnDash = () => {

        clearListDisplay();

        projectList.forEach(project => {
            project.projectToDom();            
        });

        if(projectList.length >= 21){
            document.querySelector(".add-project").style.display = "none";
        }else{
            document.querySelector(".add-project").style.display = "flex";
        }
    
    };

    const toggleProjectList = () => {
        const projectList = document.querySelector("#project-list-container");

        if (window.getComputedStyle(projectList, null).display === "none") {
            projectList.style.display = "flex";
            window.setTimeout(() => {
                projectList.style.opacity = "1";
                projectList.style.maxHeight = "600px";
                if (window.innerWidth < 600) {
                    projectList.style.padding = "10px 0";
                } else {
                    projectList.style.padding = "0 0 0 20px";
                }
            }, 100);
        } else {
            projectList.style.opacity = "0";
            projectList.style.padding = "0";
            projectList.style.maxHeight = "0";
            window.setTimeout(() => {
                projectList.style.display = "none";
            }, 100);
        }
    };

    const newForm = (type, title, description, date, priority, project, id) => {
        if(openForms.length > 0){
            openForms[0].closeForm();
        }

        const newForm = Form(type, title, description, date, priority, project, id);
        newForm.openForm();

        openForms.push(newForm);
    };

    const closeForm = () => {
        openForms.pop();
    };


    const storageAvailable = (type) => {
        let storage;
        try {
            storage = window[type];
            const x = "__storage_test__";
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return (
                e instanceof DOMException &&
                // everything except Firefox
                (e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === "QuotaExceededError" ||
                    // Firefox
                    e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
                // acknowledge QuotaExceededError only if there's something already stored
                storage &&
                storage.length !== 0
            );
        }
    }


    const setStorage = () => {
        projectList.forEach((project, i) => {
            const objectName = project + " " + i;
            localStorage.setItem(objectName, JSON.stringify(project));
        });

        localStorage.setItem("projectList", JSON.stringify(projectList));

        taskList.forEach((task, i) => {
            const objectName = task + " " + i;
            localStorage.setItem(objectName, JSON.stringify(task));
        });

        localStorage.setItem("taskList", JSON.stringify(taskList));

        localStorage.setItem("taskId", taskId);

    }

    const getStorage = () => {
        projectList = [];

        const JSONProjectList = JSON.parse(localStorage.getItem("projectList"));
        const JSONTaskList = JSON.parse(localStorage.getItem("taskList"));

        JSONProjectList.forEach(project => {
            addProject(project[0], project[1]);
        });

        JSONTaskList.forEach(task => {
            addTask(task[0], task[1], task[2], task[3], task[4], task[5], task[6]);
        });

        taskId = localStorage.getItem("taskId");

        displayProjectsOnDash();
    }

    if (storageAvailable("localStorage")) {

        if (localStorage.getItem("taskList") || localStorage.getItem("projectList")) {
            getStorage();
        } else {
            setStorage();
        }

    } else {
        // Too bad, no localStorage for us
    }

    document.querySelector(".home-li-item").addEventListener("click", () => {
        projectList[0].displayTasks();

        const projectListHeader = document.querySelector("#list-title");
        projectListHeader.innerHTML = "To do List";
    });

    document.querySelector(".add-project").addEventListener("click", () => { newForm("add-project") });

    document.querySelectorAll(".add-task").forEach(ele => ele.addEventListener("click", () => { newForm("add-task") }));

    document.querySelector(".today-li-item").addEventListener("click", todaysDateButton);

    document.querySelector("#sort-container").addEventListener("change", sortList);

    document.querySelectorAll(".project-list-toggle").forEach(ele => ele.addEventListener("click", toggleProjectList));
    

    return { addTask, addProject, removeTask, editTask, addToCompleteList, removeFromCompleteList, removeProject, editProject, newForm, closeForm };
}

export {DashBoard};