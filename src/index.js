import "./style.css";
import {createForm, createToDo, projects_dom, timeFiltering} from "./to_do_dom";
import {format, compareDesc, add} from "date-fns";


const formLogic = (() => {
     //Creating and displaying the form
     const form = () => {
        const form= createForm.displayForm();
        const sumbitFormDetails=document.querySelector(".submit");
        sumbitFormDetails.addEventListener("click", (e) => {

            toDoLogic.displayToDo(e); 
            createForm.removeForm(form);
        });
    };
    
     //Showing up the form
     const createNewToDo=document.querySelector(".addToDo");
     createNewToDo.addEventListener("click", form);

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
           console.log(new Date(dueDate.value));
           const priority= document.querySelector(".priority");
           console.log(manageProjects.returnCurrentProject());
           manageProjects.returnCurrentProject().push(toDo(title.value, description.value, new Date(dueDate.value), priority.value));
           
           //Updating the projects object after adding a To-Do in the current project.
           manageProjects.updateProject();

           return manageProjects.returnCurrentProject()[manageProjects.returnCurrentProject().length-1];
       };
   
       const checkingCompletion = (e) => {
           console.log(e);
        
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

        addListeners(manageProjects.returnCurrentProject().length-1, toDo);


    };

    const deleteToDo = (e) => {

        //Getting a reference to the To-Do to be deleted.
        const toDo= e.target.parentNode.parentNode;
        console.log(manageProjects.returnCurrentProject());
        
        //Changing the data-key attribute of all the To-Dos after the one being deleted in order to keep them in sync with the array.
        for(let i= +toDo.getAttribute("data-key")+1; i<manageProjects.returnCurrentProject().length; i++){
            const nextToDo = document.querySelector(`.toDo[data-key="${i}"]`);
            nextToDo.setAttribute("data-key", i-1);
        }
 
        //Deleting To-Do from the array.
        manageProjects.returnCurrentProject().splice(+toDo.getAttribute("data-key"), 1);
        console.log(manageProjects.returnCurrentProject());

        toDo.remove();
    };


    const addListeners = (index, toDo) => {
        const completion = toDo.querySelector(".toDoCompleted");
        completion.addEventListener("change", checkingCompletion);
        
        const showDescription = toDo.querySelector(".toDoTitle");
        showDescription.addEventListener("click", (e) => {

            createToDo.showDescription(e, manageProjects.returnCurrentProject()[index].description);
        });

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
    const createProjects = (e) => {
        
        const projectName = document.querySelector(".projectNameInput").value.replaceAll(" ", "_");
        const project= document.querySelector(`.${projectName}`);
        project.addEventListener("click", (e) => {

            setCurrentProject(e); 
            removePreviousToDos(e); 
            showCurrentToDos(e);
        });

        projects[projectName] = [];
       
        const deleteProject = document.querySelector(".removeProject");
        deleteProject.addEventListener("click", (e) => {

            removeProject(e);
            removePreviousToDos(e);
        });
        console.log(projects);

       
    };

    //Changing the current object in use.
    const setCurrentProject = (e) => {

        nameOfCurrentProject= e.target.classList[0];
        currentProject = projects[nameOfCurrentProject];
        console.log(currentProject);
        console.log(nameOfCurrentProject);

    };

    const removePreviousToDos = () => {

        const content = document.querySelector(".toDoContainer");
        console.log(content.children);
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
        console.log(projects);
        console.log(nameOfCurrentProject);
        console.log(currentProject);

    };

    const removeProject = (e) => {
        e.target.parentNode.remove();
        delete projects[e.target.parentNode.classList[0]];
        currentProject=projects.Default;
        console.log(projects);
    };

    const returnCurrentProject = () => {

        return currentProject;
    };

    
    const createNewProject = document.querySelector(".createNewProject");
    createNewProject.addEventListener("click", (e) => {

        projects_dom.getProjectName(e);
        const submitProjectName = document.querySelector(".submitProjectName");

        submitProjectName.addEventListener("click", (e) =>{ 
            
            const checkIfEmpty = document.querySelector(".projectNameInput");
            if(checkIfEmpty.value!==""){
                projects_dom.showProjectName(e); 
                createProjects(e);
                projects_dom.removeInputDiv(e);
            }
        
        });
    
    });

    const defaultP = document.querySelector(".Default");
    defaultP.addEventListener("click", (e) => {

        setCurrentProject(e); 
        removePreviousToDos(e); 
        showCurrentToDos(e);
    });

    const returnProject = (i) => {

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
        returnProject,
        
    };

})();

//Logic for filtering to-dos based on a time period
const filteringLogic = (() => {

    
    const filterThreeDays = () => {
        const requiredDate = add(new Date(), {
            days: 3,
        });

        const today = new Date();
        manageProjects.removePreviousToDos();
       
       
        for(let i=0; i<manageProjects.returnProject().size; i++) {

            let toDo = manageProjects.returnProject(i).project;
            toDo.forEach( toDo => {
                   

                if(compareDesc(today, toDo.dueDate)===1 && compareDesc(toDo.dueDate, requiredDate)===1){
                    timeFiltering.displayFilteredToDos(manageProjects.returnProject(i).projectName, toDo.title, format(new Date(toDo.dueDate), "dd-MM-yyyy"));
                }

            });
        }

    };
    
    const filterSevenDays = () => {
        const requiredDate = add(new Date(), {
            days: 7,
        });

        const today = new Date();
        manageProjects.removePreviousToDos();
       
        
        for(let i=0; i<manageProjects.returnProject().size; i++) {

            let toDo = manageProjects.returnProject(i).project;
            toDo.forEach( toDo => {
                   

                if(compareDesc(today, toDo.dueDate)===1 && compareDesc(toDo.dueDate, requiredDate)===1){
                    timeFiltering.displayFilteredToDos(manageProjects.returnProject(i).projectName, toDo.title, format(new Date(toDo.dueDate), "dd-MM-yyyy"));
                }

            });
        }
       

    };
    const threeDays = document.querySelector(".nextThreeDays");
    threeDays.addEventListener("click", filterThreeDays);

    const sevenDays = document.querySelector(".nextSevenDays");
    sevenDays.addEventListener("click", filterSevenDays);



})();

