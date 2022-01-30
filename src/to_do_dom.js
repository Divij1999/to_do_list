const createForm =(() => {


    const displayForm= () => {

        const form = document.createElement("div");
        const top = document.createElement("div");
        const title = document.createElement("input");
        title.setAttribute("maxlength", "35");

        const priority = document.createElement("select");
        const low=document.createElement("option");
        low.innerText= "Low";
        low.setAttribute("value", "Low");
        
        const medium=document.createElement("option");
        medium.innerText= "Medium";
        medium.setAttribute("value", "Medium");

        const high=document.createElement("option");
        high.innerText= "High";
        high.setAttribute("value", "High");

        priority.appendChild(low);
        priority.appendChild(medium);
        priority.appendChild(high);


        const dueDate = document.createElement("input");
        dueDate.setAttribute("type", "date");

        const bottom = document.createElement("div");
        const description = document.createElement("textarea");
        const submitInfo= document.createElement("button");
        submitInfo.innerText = "Create";

    
        form.classList.add("form");
        top.classList.add("formTop");
        title.classList.add("title");
        dueDate.classList.add("dueDate");
        description.classList.add("description");
        bottom.classList.add("formBottom");
        priority.classList.add("priority");
        submitInfo.classList.add("submit");

    
        top.appendChild(title);
        top.appendChild(dueDate);
        top.appendChild(priority);
       
        bottom.appendChild(description);
        bottom.appendChild(submitInfo);
    
        form.appendChild(top);
        form.appendChild(bottom);
    
        const div=document.createElement("div");
        div.classList.add("backgroundFade");
        
        div.appendChild(form);
        const body = document.querySelector("body");
        const content = document.querySelector(".content");
        body.insertBefore(div, content);
        return div;
    };

    const removeForm = (div) => {
        
        div.remove();

    };

    return {
        displayForm,
        removeForm,
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

        return toDo;
    };

    const showDescription = (e, descriptionText) => {
        
        const description = document.createElement("div");
        description.innerText= descriptionText;
        e.target.parentNode.parentNode.insertBefore(description, e.target.parentNode.nextSibling);

    };

    return {
        createToDo,
        showDescription,
    };

})();


//Managing the project's display, getting project names and setting their classes according to their names
const projects_dom = (() => {

    const div = document.createElement("div");
    div.style.display= "flex";
    const projectHeading = document.createElement("div");
    projectHeading.innerText = "Projects";
    const createNewProject = document.createElement("button");
    createNewProject.innerText = "+";
    createNewProject.classList.add("createNewProject");

    const defaultProject = document.createElement("div");
    defaultProject.innerText = "Default";
    defaultProject.classList.value = "Default project";

    div.appendChild(projectHeading);
    div.appendChild(createNewProject);

    const projectsTab = document.querySelector(".projectTab");
    projectsTab.appendChild(div);
    projectsTab.appendChild(defaultProject);

    
    const getProjectName = () => {

        const projectNameInput = document.createElement("input");
        projectNameInput.classList.add("projectNameInput");
        projectNameInput.required = true;

        const submitProjectName = document.createElement("button");
        submitProjectName.innerText = "OK";
        submitProjectName.classList.add("submitProjectName");

        const inputDiv = document.createElement("form");
        inputDiv.classList.add("inputDiv");

        inputDiv.appendChild(projectNameInput);
        inputDiv.appendChild(submitProjectName);

        div.appendChild(inputDiv);
        
      
    };

    const showProjectName = () =>{
        
        const projectWrapper = document.createElement("div");
        projectWrapper.classList.add("projectWrapper");
        const newProjectCreated = document.createElement("div");
        const projectName = document.querySelector(".projectNameInput").value;
        newProjectCreated.innerText = projectName;
        newProjectCreated.classList.value = `${projectName.replaceAll(" ", "_")} project`;
       
        const removeProject = document.createElement("button");
        removeProject.innerText= "x";
        removeProject.classList.add("removeProject");
        
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
    }

})();


const timeFiltering = (() => {

    const heading = document.createElement("div");
    heading.innerText = "Filter";

    const nextThreeDays = document.createElement("div");
    nextThreeDays.innerText = "Next 3 days";
    nextThreeDays.classList.value = "nextThreeDays time";

    const nextSevenDays = document.createElement("div");
    nextSevenDays.innerText = "Next 7 days";
    nextSevenDays.classList.value = "nextSevenDays time";


    const timeTab = document.createElement("div");
    timeTab.appendChild(heading);
    timeTab.appendChild(nextThreeDays);
    timeTab.appendChild(nextSevenDays);


    const sideBar = document.querySelector(".timeFilter");
    sideBar.appendChild(timeTab);

    const displayFilteredToDos = (name, title, dueDate) => {

        const toDo = document.createElement("div");
        toDo.setAttribute("style", "display: flex; border: 1px solid black; gap: 10px;")
        const projectName = document.createElement("div");
        projectName.innerText = name;
        const toDoTitle= document.createElement("div");
        toDoTitle.innerText = title;
        const toDoDueDate = document.createElement("div");
        toDoDueDate.innerText = dueDate;
       
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