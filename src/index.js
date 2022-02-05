import "./style.css";
import {createForm, createToDo, projects_dom, timeFiltering} from "./to_do_dom";
import {format, compareDesc, add} from "date-fns";


const formLogic = (() => {
     //Creating and displaying the form
     const form = () => {
        const form= createForm.displayForm();
        const sumbitFormDetails=document.querySelector(".submit");
        sumbitFormDetails.addEventListener("click", (e) => {

            if(form.titleInput.value===""){
                
                createForm.promptUserForTitle(form.titleInput);
            }
            else {
                
                toDoLogic.displayToDo(e); 
                createForm.removeForm(form.div);
            }
            toggleForm(e);

        });

        const cancelForm = document.querySelector(".cancelForm");
        cancelForm.addEventListener("click", (e) => {
            createForm.removeForm(form.div);
            toggleForm(e);
        });
    };

    const toggleForm = (e) =>{
        const addToDoBtn = document.querySelector(".addToDo");
        if(e.target.classList[1]==="time" || e.target.classList.value==="addToDo"){
            addToDoBtn.disabled=true;
        }
        else if(e.target.classList[1]==="project"){
            addToDoBtn.disabled = false;
        }
        else if(e.target.classList.value==="submit"){
            addToDoBtn.disabled=false;
        }
        else if(e.target.classList.value==="cancelForm"){
            addToDoBtn.disabled= false;
        }
    };
    
     //Showing up the form
     const createNewToDo=document.querySelector(".addToDo");
     createNewToDo.addEventListener("click", (e) => {
         toggleForm(e);
         form(e);
     });
    
    return {
        toggleForm,
    };
})();


const toDoLogic = (() => {

     //Factory function for creating todo objects
     const toDo= (title, description, dueDate, priority, complete=false) => {
        return {
            title, 
            description,
            dueDate,
            priority,
            complete,
        };
   
       };
   
    
       
       //Running the factory funtion and returning the latest todo 
       const addDetails = () => {
           const title=document.querySelector(".title");
           const description=document.querySelector(".description");

           const dueDate=document.querySelector(".dueDate");
           let formattedDate=format(new Date(dueDate.value), "dd-MM-yyyy");
           const priority= document.querySelector(".priority");
           manageProjects.returnCurrentProject().push(toDo(title.value, description.value, new Date(dueDate.value), priority.value));
           
           //Updating the projects object after adding a To-Do in the current project.
           manageProjects.updateProject();

           return manageProjects.returnCurrentProject()[manageProjects.returnCurrentProject().length-1];
       };
   
    
    let values={};


   
   //Adding values to the todo elements as well as adding event listeners
    const displayToDo = (e, to_Do, dataKey) => {

        //Saving To-Do details in a temporary object if different project is clicked.
        if([...e.target.classList].includes("project")){
            values= to_Do;
        } //Doing the above if a new toDo is created through the form.
        else{
            values=Object.assign({}, addDetails());
        }
        
        const toDo= createToDo.createToDo(values.complete, values.title, format(new Date(values.dueDate), "dd-MM-yyyy"), values.priority, values.description);
        
        //Setting the data-key value of a to do if a new project is clicked.
        if([...e.target.classList].includes("project")){
            toDo.setAttribute("data-key", dataKey);
        }//Setting the data-key value if a new project is created thrugh the form.
        else {
            toDo.setAttribute("data-key", manageProjects.returnCurrentProject().length-1);
        }

        const content = document.querySelector(".toDoContainer");
        content.appendChild(toDo);

        //Resetting the temp object.
        values={};

        addListeners(toDo);


    };

    const deleteToDo = (e) => {

        //Getting a reference to the To-Do to be deleted.
        const toDoWrapper= e.target.parentNode.parentNode.parentNode;
        
        //Changing the data-key attribute of all the To-Dos after the one being deleted in order to keep them in sync with the array.
        for(let i= +toDoWrapper.getAttribute("data-key")+1; i<manageProjects.returnCurrentProject().length; i++){
            const nextToDo = document.querySelector(`.toDoWrapper[data-key="${i}"]`);
            nextToDo.setAttribute("data-key", i-1);
        }
 
        //Deleting To-Do from the array.
        manageProjects.returnCurrentProject().splice(+toDoWrapper.getAttribute("data-key"), 1);
        toDoWrapper.remove();
    };
    
    const toggleDescription = (e) => {

        const description = manageProjects.returnCurrentProject()[e.target.parentNode.parentNode.getAttribute("data-key")].description;
        if(description!==""){
            
            if(e.target.parentNode.parentNode.children.length===1){
               
                createToDo.showDescription(e,  description);
    
            }
            else {
                createToDo.removeDescription(e);
            }
           

        }
       
    };

    const checkingCompletion = (e) => {

        const title = document.querySelector(".toDoTitle");
        if(e.target.checked===true){
            title.setAttribute("style", "text-decoration:line-through;");

        }
        else {
            title.setAttribute("style", "text-decoration:none;");
        }
     
    };

    const addListeners = (toDo) => {
        const completion = toDo.querySelector(".toDoCompleted");
        completion.addEventListener("change", checkingCompletion);
        
        const showDescription = toDo.querySelector(".toDoTitle");
        showDescription.addEventListener("click", toggleDescription);

        const removeToDo = toDo.querySelector(".deleteToDo");
        removeToDo.addEventListener("click", deleteToDo);



        toDo.addEventListener("change", manageProjects.updateProject);
    };


    return {
        displayToDo,
        addListeners,
    };

})();


const manageProjects = (() => {

    //Object to store all other projects. Projects contain their respective To-Do's.
    let projects={
        "Default": [],
    };
    let currentProject=projects.Default;
    let nameOfCurrentProject= "Default";

    //Getting the name of project entered by user and inserting it in projects object.
    const createProjects = (startUp = false, name) => {
        
        let projectName;
        if(startUp){
            projectName = name;
        }
        else {
            projectName = document.querySelector(".projectNameInput").value.replaceAll(" ", "_");
            projects[projectName] = [];

        }
        const project= document.querySelector(`.${projectName}`);
        project.addEventListener("click", (e) => {

            setCurrentProject(e); 
            removePreviousToDos(e); 
            showCurrentToDos(e);
            formLogic.toggleForm(e);
        });
        console.log("ran");
       
        const deleteProject = document.querySelector(`button.${projectName}`);
        deleteProject.addEventListener("click", (e) => {

            removeProject(e);

            //Chcking if the user is looking at the same project or another one. If they are similar only then to-dos will be removed.
            if(e.target.classList[0]===nameOfCurrentProject)
                removePreviousToDos(e);
        });

       
    };

    //Changing the current object in use.
    const setCurrentProject = (e) => {
       
        const previouslyActiveProject = document.querySelector(`.${nameOfCurrentProject}`);
        previouslyActiveProject.classList.remove("currentProject");
    
        nameOfCurrentProject= e.target.classList[0];
        currentProject = projects[nameOfCurrentProject];
       
        const currentlyActiveProject = document.querySelector(`.${nameOfCurrentProject}`);
        currentlyActiveProject.classList.add("currentProject");

    };

    const removePreviousToDos = () => {

        const content = document.querySelector(".toDoContainer");

        for(let i=0; i<content.children.length;) {
            content.children[i].remove();
        }
    };

    const showCurrentToDos = (e) => {
      
        const content = document.querySelector(".toDoContainer");
        let dataKey=0;
        currentProject.forEach(toDo => {

            toDoLogic.displayToDo(e, toDo, dataKey);
            ++dataKey;

        } );
       
    };

 
    //Updating the projects object after every To-Do is added.
    const updateProject = () => {

        projects[nameOfCurrentProject] = currentProject;
        const storeJSON = JSON.stringify(projects);
        localStorage.setItem("toDoJSON", storeJSON);
        const storedJSON = localStorage.getItem("toDoJSON");
            let temp = JSON.parse(storedJSON);
            console.table(temp);
    };

    const removeProject = (e) => {
        e.target.parentNode.remove();
        delete projects[e.target.classList[0]];
        currentProject=projects.Default;
        
    };

    //This fuction runs when the website is first loaded.
    const loadData = () => {
        if(Storage.length!== "0"){
            const storedJSON = localStorage.getItem("toDoJSON");
            let temp = JSON.parse(storedJSON);
            //Changing the due dates to Date objects.
            for(let project in temp){
                temp[project].forEach(toDo => {
                    toDo.dueDate = new Date(toDo.dueDate);
                })
            }
            projects = Object.assign({}, temp);
            for(let project in projects) {
                if(projects.hasOwnProperty(project)){
                    if(project!== "Default"){
                        projects_dom.showProjectName(true, project.replace("_", " "));
                        createProjects(true, project);

                    }
                  
                }
                

            }

        }
    };

    
    const returnCurrentProject = () => {
        return currentProject;
    };
    //Setting up an event to load toDos upon loading the website for the first time.
    window.onload = () => loadData();
    const createNewProject = document.querySelector(".createNewProject");
    createNewProject.addEventListener("click", (e) => {
        
        createNewProject.disabled= true;
        projects_dom.getProjectName(e);
        const submitProjectName = document.querySelector(".submitProjectName");

        submitProjectName.addEventListener("click", (e) =>{ 
            
            const projectInput = document.querySelector(".projectNameInput");
            if(!projects.hasOwnProperty(projectInput.value)){
                projects_dom.showProjectName(); 
                createProjects();
                projects_dom.removeInputDiv(e);
            }
            else {
                projects_dom.promptUserForSimilarName(projectInput);
            }
            createNewProject.disabled = false;
        });
    
    });

    const defaultP = document.querySelector(".Default");
    defaultP.addEventListener("click", (e) => {

        setCurrentProject(e); 
        removePreviousToDos(e); 
        showCurrentToDos(e);
        formLogic.toggleForm(e);
    });

    const returnProjectForFiltering = (i) => {

        const size =  Object.keys(projects).length;
        const projectName = Object.keys(projects)[i];
        const project = Object.values(projects)[i];
        return {

            size,
            project,
            projectName,
        };
    };

 
    return {
        returnCurrentProject,
        updateProject,
        removePreviousToDos,
        returnProjectForFiltering,
        
    };

})();

//Logic for filtering to-dos based on a time period
const filteringLogic = (() => {

    
    const filterThreeDays = () => {

        const disableAddToDoBtn = document.querySelector(".addToDo");
        disableAddToDoBtn.disabled = true;
        const requiredDate = add(new Date(), {
            days: 3,
        });

        const today = new Date();
        manageProjects.removePreviousToDos();
       
       
        for(let i=0; i<manageProjects.returnProjectForFiltering().size; i++) {

            let toDo = manageProjects.returnProjectForFiltering(i).project;
            toDo.forEach( toDo => {
                   

                if(compareDesc(today, toDo.dueDate)===1 && compareDesc(toDo.dueDate, requiredDate)===1){
                    timeFiltering.displayFilteredToDos(manageProjects.returnProjectForFiltering(i).projectName.replace("_", " "), toDo.title, format(new Date(toDo.dueDate), "dd-MM-yyyy"));
                }

            });
        }

    };
    
    const filterSevenDays = () => {

        const disableAddToDoBtn = document.querySelector(".addToDo");
        disableAddToDoBtn.disabled = true;
        const requiredDate = add(new Date(), {
            days: 7,
        });

        const today = new Date();
        manageProjects.removePreviousToDos();
       
        
        for(let i=0; i<manageProjects.returnProjectForFiltering().size; i++) {

            let toDo = manageProjects.returnProjectForFiltering(i).project;
            toDo.forEach( toDo => {
                   

                if(compareDesc(today, toDo.dueDate)===1 && compareDesc(toDo.dueDate, requiredDate)===1){
                    timeFiltering.displayFilteredToDos(manageProjects.returnProjectForFiltering(i).projectName, toDo.title, format(new Date(toDo.dueDate), "dd-MM-yyyy"));
                }

            });
        }
       

    };
    const threeDays = document.querySelector(".nextThreeDays");
    threeDays.addEventListener("click", (e) =>{ 
        filterThreeDays(e);
        formLogic.toggleForm(e);
    });

    const sevenDays = document.querySelector(".nextSevenDays");
    sevenDays.addEventListener("click", (e) => {
        filterSevenDays(e);
        formLogic.toggleForm(e);
    });



})();

