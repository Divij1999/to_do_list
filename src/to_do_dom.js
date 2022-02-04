const createForm =(() => {


    const displayForm= () => {

        const form = document.createElement("div");
        const headerForCancel = document.createElement("div");
        headerForCancel.setAttribute("style", "display: flex; justify-content: flex-end; align-items: center; padding:10px;");
        const cancelForm = document.createElement("button");
        cancelForm.innerText = "X";
        cancelForm.classList.add("cancelForm");
        headerForCancel.appendChild(cancelForm);

        const top = document.createElement("div");
        const titleWrapper = document.createElement("div");
        titleWrapper.setAttribute("style", "display: flex;");
        const titleName = document.createElement("div");
        titleName.setAttribute("style", "align-self: center;");
        titleName.innerText = "Title: ";
        const titleInput = document.createElement("input");
        titleInput.setAttribute("maxlength", "30");

        titleWrapper.appendChild(titleName);
        titleWrapper.appendChild(titleInput);
        
        const priorityName = document.createElement("div");
        priorityName.setAttribute("style", "align-self: center;");
        priorityName.innerText = "Priority: ";
        const priorityList = document.createElement("select");
        const low=document.createElement("option");
        low.innerText= "Low";
        low.setAttribute("value", "Low");
        
        const medium=document.createElement("option");
        medium.innerText= "Medium";
        medium.setAttribute("value", "Medium");

        const high=document.createElement("option");
        high.innerText= "High";
        high.setAttribute("value", "High");

        priorityList.appendChild(low);
        priorityList.appendChild(medium);
        priorityList.appendChild(high);

        const priorityWrapper = document.createElement("div");
        priorityWrapper.setAttribute("style", "display:flex;");
        priorityWrapper.appendChild(priorityName);
        priorityWrapper.appendChild(priorityList);

        const dueDateName = document.createElement("div");
        dueDateName.innerText = "Due Date: ";
        dueDateName.setAttribute("style", "align-self: center;");
        const dueDate = document.createElement("input");
        dueDate.setAttribute("type", "date");

        const dueDateWrapper = document.createElement("div");
        dueDateWrapper.setAttribute("style", "display:flex;");
        dueDateWrapper.appendChild(dueDateName);
        dueDateWrapper.appendChild(dueDate);

        const bottom = document.createElement("div");
        const description = document.createElement("textarea");
        description.setAttribute("placeholder", "Enter description");
        const submitInfo= document.createElement("button");
        submitInfo.innerText = "Create";

    
        form.classList.add("form");
        top.classList.add("formTop");
        titleInput.classList.add("title");
        dueDate.classList.add("dueDate");
        description.classList.add("description");
        bottom.classList.add("formBottom");
        priorityList.classList.add("priority");
        submitInfo.classList.add("submit");

    
        top.appendChild(titleWrapper);
        top.appendChild(dueDateWrapper);
        top.appendChild(priorityWrapper);
       
        bottom.appendChild(description);
        bottom.appendChild(submitInfo);
    
        form.appendChild(headerForCancel);
        form.appendChild(top);
        form.appendChild(bottom);
    
        const div=document.createElement("div");
        div.classList.add("backgroundFade");
        
        div.appendChild(form);
        const body = document.querySelector("body");
        const content = document.querySelector(".content");
        body.insertBefore(div, content);
        return {
            div,
            titleInput,
        };
    };

    const promptUserForTitle = (title) => {
    
        title.setAttribute("placeholder", "Please enter title name");
        title.setAttribute("style", "border: 2px solid red;");
        
    };

    const removeForm = (div) => {
        
        div.remove();

    };

    return {
        displayForm,
        removeForm,
        promptUserForTitle,
    };
})();

const createToDo = (() => {
   
    const createToDo = (complete, toDoTitle, toDoDueDate, toDoPriority) => {

        const toDo = document.createElement("div");
        const completed = document.createElement("input");
        completed.setAttribute("type", "checkbox");
        const title = document.createElement("div");
        const dueDate = document.createElement("div");
        const priority = document.createElement("div");
        const options = document.createElement("div");
        const deleteToDo = document.createElement("button");
        deleteToDo.innerText="Delete";

        toDo.classList.add("toDo");
        if(toDoPriority==="High"){
            toDo.classList.add("high");
        }
        else if(toDoPriority==="Medium"){
            toDo.classList.add("medium");
        }
        else {
            toDo.classList.add("low");
        }

        completed.classList.add("toDoCompleted");
        title.classList.add("toDoTitle");
        dueDate.classList.add("toDoDueDate");
        priority.classList.add("toDoPriority");
        options.classList.add("toDoOptions");
        deleteToDo.classList.add("deleteToDo");
    
       
        options.appendChild(deleteToDo);
    
        toDo.appendChild(completed);
        toDo.appendChild(title);
        toDo.appendChild(dueDate);
        toDo.appendChild(priority);
        toDo.appendChild(options);

        completed.checked=complete;
        title.innerText=toDoTitle;
        dueDate.innerText=`Due Date: ${toDoDueDate}`;
        priority.innerText=`Priority: ${toDoPriority}`;

        const toDoWrapper = document.createElement("div");
        toDoWrapper.classList.add("toDoWrapper");
        toDoWrapper.appendChild(toDo);

        return toDoWrapper;
    };

    const showDescription = (e, descriptionText) => {
        
        const description = document.createElement("div");
        description.innerText= descriptionText;
        description.classList.add("toDoDesc");
        e.target.parentNode.parentNode.insertBefore(description, e.target.parentNode.nextSibling);

    };

    const removeDescription = (e) => {

        e.target.parentNode.parentNode.children[1].remove();
    };

    return {
        createToDo,
        showDescription,
        removeDescription,
    };

})();


//Managing the project's display, getting project names and setting their classes according to their names
const projects_dom = (() => {

    const div = document.createElement("div");
    div.setAttribute("style", "display: flex; width: 90%; align-items: center; justify-content: space-between;");
    const projectHeading = document.createElement("div");
    projectHeading.innerText = "Projects";
    projectHeading.classList.add("projectHeading");
    const createNewProject = document.createElement("button");
    createNewProject.innerText = "+";
    createNewProject.classList.add("createNewProject");

    const defaultProject = document.createElement("div");
    defaultProject.innerText = "> Default";
    defaultProject.classList.value = "Default currentProject project";

    div.appendChild(projectHeading);
    div.appendChild(createNewProject);

    const projectsTab = document.querySelector(".projectTab");
    projectsTab.appendChild(div);
    projectsTab.appendChild(defaultProject);

    
    const getProjectName = (e) => {

        const projectNameInput = document.createElement("input");
        projectNameInput.classList.add("projectNameInput");
        projectNameInput.setAttribute("maxlength", "10");
        projectNameInput.required = true;

        const submitProjectName = document.createElement("button");
        submitProjectName.innerText = "OK";
        submitProjectName.classList.add("submitProjectName");

        const inputDiv = document.createElement("form");
        inputDiv.setAttribute("onsubmit", "return false");
        inputDiv.classList.add("inputDiv");

        inputDiv.appendChild(projectNameInput);
        inputDiv.appendChild(submitProjectName);

        projectsTab.insertBefore(inputDiv, defaultProject);
        
      
    };

    const promptUserForSimilarName = (projectInput) => {

        projectInput.value = "Project name already exists";
        projectInput.setAttribute("style", "border: 1px solid red;");
    };

    const showProjectName = () =>{
        
        const projectWrapper = document.createElement("div");
        projectWrapper.classList.add("projectWrapper");
        const newProjectCreated = document.createElement("div");
        const projectName = document.querySelector(".projectNameInput").value;
        newProjectCreated.innerText = `> ${projectName}`;
        newProjectCreated.classList.value = `${projectName.replaceAll(" ", "_")} project`;
       
        const removeProject = document.createElement("button");
        removeProject.innerText= "X";
        removeProject.classList.value = `${projectName.replaceAll(" ", "_")} removeProject`;
        
        projectWrapper.appendChild(newProjectCreated);
        projectWrapper.appendChild(removeProject);
        projectsTab.appendChild(projectWrapper);
    };

    const removeInputDiv = (e) => {
        
        //The inputDiv.
        e.target.parentNode.remove();
    };

    return {
        createNewProject, 
        getProjectName,
        showProjectName,
        removeInputDiv,
        promptUserForSimilarName,
    };

})();


const timeFiltering = (() => {

    const heading = document.createElement("div");
    heading.innerText = "Filter";
    heading.classList.add("filterHeading");

    const nextThreeDays = document.createElement("div");
    nextThreeDays.innerText = "Next 3 days";
    nextThreeDays.classList.value = "nextThreeDays time";

    const nextSevenDays = document.createElement("div");
    nextSevenDays.innerText = "Next 7 days";
    nextSevenDays.classList.value = "nextSevenDays time";

    const timeFiltering = document.querySelector(".timeFilter");
    
    timeFiltering.appendChild(heading);
    timeFiltering.appendChild(nextThreeDays);
    timeFiltering.appendChild(nextSevenDays);


   
   

    const displayFilteredToDos = (name, title, dueDate) => {

        const toDo = document.createElement("div");
        toDo.classList.add("filteredToDo");
        const projectName = document.createElement("div");
        projectName.innerText = `Project Name: ${name}`;
        const toDoTitle= document.createElement("div");
        toDoTitle.innerText = `Title: ${title}`;
        const toDoDueDate = document.createElement("div");
        toDoDueDate.innerText = `DueDate: ${dueDate}`;
       
        toDo.appendChild(projectName);
        toDo.appendChild(toDoTitle);
        toDo.appendChild(toDoDueDate);

        const toDoTab= document.querySelector(".toDoContainer");
        toDoTab.appendChild(toDo);


    };
    return {

        displayFilteredToDos,
    };
})();


export {
    createForm, 
    createToDo, 
    projects_dom, 
    timeFiltering
};