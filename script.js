const inputBox = document.getElementById("input-box");
const listContain = document.getElementById("list-container");
const datewise = document.getElementById("due-date") ; 
let tasks = [];

function init() {
    loadTasksFromLocalStorage(); 
    renderTasks(); //tasks will get displayed on initial load... .. 
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}
init();

function createTask() {
  if (inputBox.value === '') {
      alert("You must write something.");
  } else {
      const currentDate = new Date();
      const selectedDate = new Date(datewise.value);
      
      if (selectedDate < currentDate) {
          alert("Due date cannot be older than the current date.");
          return;
      }
      
      let task = {
          text: inputBox.value,
          dueDate: datewise.value,
          category: document.getElementById("category-select").value,
          completed: false,
      };

      tasks.push(task);
    
      renderTasks();
      savedata();
  }
  inputBox.value = "";
}

function renderTasks() {
    listContain.innerHTML = "";
    tasks.forEach((task, index) => {
      let li = document.createElement("li");
      li.textContent = task.text;
      li.setAttribute("data-task-id", index);
  
      let date1 = document.createElement("date1");
      date1.textContent = task.dueDate;
  
      let categorySpan = document.createElement("span");
      categorySpan.textContent = task.category;
  
      let edit = document.createElement("span"); // Creating the edit icon element
      edit.textContent = "📝"; 
      
      let span = document.createElement("span");
      span.innerHTML = "\u00d7";
  
      li.appendChild(date1);
      li.appendChild(categorySpan);
      li.appendChild(edit);
      li.appendChild(span);
  
      if (task.completed) {
        li.classList.add("checked");
      }
  
      span.addEventListener("click", createDeleteHandler(index)); 
      
      edit.addEventListener("click", function (event) {
        event.stopPropagation();
        editTask(index);
      });
  
      li.addEventListener("click", function () {
        toggleTaskCompletion(index);
        savedata();
      });
  
      listContain.appendChild(li);
    });
}

function createDeleteHandler(index) {
  return function (event) {
      const taskId = parseInt(event.target.parentElement.getAttribute("data-task-id"));
      tasks.parentElement.remove(taskId);
      savedata();
      renderTasks();
  };
}

  listContain.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const index = Array.from(listContain.children).indexOf(e.target);
      toggleTaskCompletion(index);
      savedata();
    }
    else if (e.target.tagName === "SPAN") {
      const li = e.target.parentElement;
      const taskId = parseInt(li.getAttribute("data-task-id"));
      tasks.splice(taskId, 1);
      savedata();
      renderTasks();  
    }
    sortTasksByDate() ; 

},false) ; 



function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText !== "") {
    tasks[index].text = newText;
    renderTasks();
    savedata();
  }
}


//Saving data in local storage

function savedata() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save the tasks array
}

//Sorting 

  function sortTasksByDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    renderTasks();
  }
  

//Search
  const searchBox = document.getElementById("search-box");

  function filterTasks(searchQuery) {
    const taskItems = document.querySelectorAll("li");
    taskItems.forEach(item => {
      const taskText = item.textContent.toLowerCase(); 
      if (taskText.includes(searchQuery.toLowerCase())) {
        item.style.display = "block"; // Show matching tasks
      } else {
        item.style.display = "none";  // Hide non-matching tasks
      }
    });
  }
  
  searchBox.addEventListener("input", function() {
    filterTasks(searchBox.value);
  });
 
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    
    savedata();
    renderTasks();
  }
  