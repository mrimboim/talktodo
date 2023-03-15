var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill color-gray date-box")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    // taskTestCorrect = taskText.charAt(0).toUpperCase() + taskText.slice(1)
    .text(taskText);
  var drag_drop = $("<img src = ./assets/images/drag_drop.png>")
    .addClass("drag-image")
  
  var trash_icon = $("<span>")
    .addClass("oi oi-trash trash-can")

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP, drag_drop, trash_icon);

  // check due date
  auditTask(taskLi);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      done: [],
    };
  }

  // loop over object properties
  $.each(tasks, function (list, arr) {
    // then loop over sub-array
    arr.forEach(function (task) {
      if (task.text == "") {
        RemvoeTaskbyName("");
      } else {
        createTask(task.text, task.date, list);
      }
    });
  });
};

var artyom = new Artyom();
var clickedVoice = 0;
// Needed user interaction at least once in the website to make
// it work automatically without user interaction later... thanks google .i.
document.getElementById("btn_to_Allow").addEventListener(
  "click",
  function () {
    var currentState = document.getElementById("btn_to_Allow")
    console.log("Before: ", currentState)
    currentState.classList.remove("btn_to_Allow")
    currentState.classList.add("new_btn")
    console.log("After:", currentState)
    if(clickedVoice%2 == 0){
      artyom.say("Welcome to To do!");
      clickedVoice++;
      console.log("@@@@@@@@@",clickedVoice)
    }
    else{
      artyom.simulateInstruction("shut yourself down");
      clickedVoice++;
      console.log("@@@@@@@@@", clickedVoice)
      
    }
    artyom.on(["Repeat after me *"], true).then((i, wildcard) => {
      artyom.say("You've said : " + wildcard);
    });

    // or add some commandsDemostrations in the normal way
    artyom.addCommands([
      {
        indexes: ["New task *", "Add task *", "Add a task *"],
        smart: true,
        action: (i, wildcard) => {
          taskText = wildcard.toLowerCase().trim().split("for", 1)[0];
          taskDate = wildcard.trim().split("for", 2)[1];
          taskDate = taskDate.trim();
          console.log(wildcard);
          console.log(taskText);
          console.log(taskDate);

          console.log(wildcard);
          console.log(taskText);
          console.log(taskDate);
          AddTaskbyName(taskText.trim(), taskDate);
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: [
          "Modifiy date of *",
          "Change date of *",
          "Change date for *",
          "Change the date of *",
          "modified date of *",
        ],
        smart: true,
        action: (i, wildcard) => {
          taskText = wildcard.toLowerCase().trim().split("to", 1)[0];
          taskDate = wildcard.trim().split("to", 2)[1];
          taskDate = taskDate.trim();
          console.log(wildcard);
          console.log(taskText);
          console.log(taskDate);

          console.log(wildcard);
          console.log(taskText);
          console.log(taskDate);
          changeTasksDateByName(taskText.trim(), taskDate);
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: [
          "Modifiy text of *",
          "Change description of *",
          "Change text for *",
          "Change the description of *",
          "Change text of *",
        ],
        smart: true,
        action: (i, wildcard) => {
          taskText = wildcard.toLowerCase().trim().split("to", 1)[0];
          taskNewText = wildcard.trim().split("to", 2)[1];
          taskNewText = taskNewText.trim();
          console.log(wildcard);
          console.log(taskText);
          console.log(taskNewText);

          changeTasksTextByName(taskText.trim(), taskNewText);
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: ["Move task *"],
        smart: true,
        action: (i, wildcard) => {
          taskText = wildcard.toLowerCase().trim().split("to", 1)[0];
          taskNewCategory = wildcard.trim().split("to", 2)[1];
          taskNewCategory = taskNewCategory.trim().toLowerCase();
          console.log(wildcard);
          console.log(taskText);
          console.log(taskNewCategory);
          if (
            taskNewCategory.includes("progress") ||
            taskNewCategory.includes("progressing")
          ) {
            MoveTaskbyName(taskText.trim(), "inProgress");
            artyom.say("Done");
          } else if (
            taskNewCategory.includes("done") ||
            taskNewCategory.includes("dunn")
          ) {
            MoveTaskbyName(taskText.trim(), "done");
            artyom.say("Done");
          } else {
          }
        },
      },
      {
        indexes: ["Delete task *", "Remove task *"],
        smart: true,
        action: (i, wildcard) => {
          taskText = wildcard.toLowerCase().trim();
          console.log(taskText);
          RemvoeTaskbyName(taskText);
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: ["All urgent tasks", "What are my urgent tasks", "Urgent tasks"],
        action: (i, wildcard) => {
          tasksDue(true)
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: ["All soon tasks", "What are my soon tasks", "soon tasks", "which tasks need to be done soon","which tasks are soon but not urgent"],
        action: (i, wildcard) => {
          tasksDue(false)
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      {
        indexes: ["all tasks", "what are all my tasks","what are my tasks"],
        action: (i, wildcard) => {
          allTasks();
          artyom.say("Done");

          // artyom.fatality();
        },
      },
      // The smart commands support regular expressions
      {
        indexes: ["shut yourself down"],
        action: (i, wildcard) => {
          artyom.say("Have a good day");
          artyom.fatality().then(() => {
            console.log("Artyom succesfully stopped");
          });
        },
      },
    ]);

    // Start the commands !
    artyom
      .initialize({
        lang: "en-GB", // GreatBritain english
        continuous: true, // Listen forever
        soundex: true, // Use the soundex algorithm to increase accuracy
        debug: false, // Show messages in the console
        executionKeyword: "please",
        listen: true, // Start to listen commands !

        // If providen, you can only trigger a command if you say its name
        // e.g to trigger Good Morning, you need to say "Jarvis Good Morning"
        // name: "Jarvis",
      })
      .then(() => {
        console.log("Artyom has been succesfully initialized");
      })
      .catch((err) => {
        console.error("Artyom couldn't be initialized: ", err);
      });
  },
  false
);


var changeTasksTextByName = function (taskOrgText, taskNewText) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      done: [],
    };
  }

  console.log("TASKS BEFORE STAERTING @@@", tasks);
  list_counter = 0;
  task_counter = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    task_counter = 0;
    arr.forEach(function (task) {
      console.log("Task coutner", task_counter);
      console.log("This is the TASK:", task);
      if (task.text == taskOrgText) {
        console.log("THE INDICIES IS ?");
        console.log(list, task_counter);
        tasks[list][task_counter].text = taskNewText;
        saveTasks();
        // location.reload();
        $("body").load("index.html");
        return;
      }
      task_counter++;
    });
    list_counter++;
  });
};

var tasksDue = function (urgent) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    artyom.say("No such tasks");
  }
  task_count = 0;
  list_counter = 0;
  task_counter = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    arr.forEach(function (task) {

      var time = moment(task.date, "L").set("hour", 17);
      
      // apply new class if task is near/over due date
      if (moment().isAfter(time) && urgent) {
        artyom.say("Task " + task.text + " urgent on " + task.date )
        task_count++
      } else if (Math.abs(moment().diff(time, "days")) <= 2 && !urgent) {
        artyom.say("Task " + task.text + " soon on " + task.date)
        task_count++
      }

      task_counter++;
    });
    list_counter++;
  });

  if(task_count == 0){
    artyom.say("No such tasks");
  }
};
var allTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    artyom.say("No such tasks");
  }
  task_count = 0;
  list_counter = 0;
  task_counter = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    artyom.say("The following tasks are in " + list);
    arr.forEach(function (task) {

      
      // apply new class if task is near/over due da
        if(task.text == "" || task.text == " "){

        }else{
        artyom.say("Task " + task.text + "on " + task.date )
        }
       
      task_counter++;
    });
    list_counter++;
  });
};
var changeTasksDateByName = function (taskOrgText, taskNewDate) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      done: [],
    };
  }

  console.log("TASKS BEFORE STAERTING @@@", tasks);
  list_counter = 0;
  task_counter = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    task_counter = 0;
    arr.forEach(function (task) {
      console.log("Task coutner", task_counter);
      console.log("This is the TASK:", task);
      if (task.text == taskOrgText) {
        console.log("THE INDICIES IS ?");
        console.log(list, task_counter);
        tasks[list][task_counter].date = taskNewDate; // make sure to figure out a way to parse date from voice to correct format with slashes( you can use dictionary for each of the months and days and stuff) (you can even say add a day to add it)

        saveTasks();
        // location.reload();
        $("body").load("index.html");
        return;
      }
      task_counter++;
    });
    list_counter++;
  });
};
var AddTaskbyName = function (taskNewText, taskNewDate) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      done: [],
    };
  }

  tasks["toDo"].push({ text: taskNewText, date: taskNewDate });
  saveTasks();
  // location.reload();
  $("body").load("index.html");
  return;
};
var RemvoeTaskbyName = function (taskOrgText) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      
      done: [],
    };
  }

  console.log("TASKS BEFORE STAERTING @@@", tasks);
  list_counter = 0;
  task_counter = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    task_counter = 0;
    arr.forEach(function (task) {
      console.log("Task coutner", task_counter);
      console.log("This is the TASK:", task);
      if (task.text == taskOrgText) {
        console.log("THE INDICIES IS ?");
        console.log(list, task_counter);
        tasks[list].splice(task_counter, 1); // make sure to figure out a way to parse date from voice to correct format with slashes( you can use dictionary for each of the months and days and stuff) (you can even say add a day to add it)

        saveTasks();
        // location.reload();
        $("body").load("index.html");
        return;
      }
      task_counter++;
    });
    list_counter++;
  });
};
var MoveTaskbyName = function (taskOrgText, whereTo) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      done: [],
    };
  }

  console.log("TASKS BEFORE STAERTING @@@", tasks);
  list_counter = 0;
  task_counter = 0;
  temp_task = 0;
  $.each(tasks, function (list, arr) {
    console.log("list counter", list_counter);
    // then loop over sub-array
    console.log("This is the LIST:", list);
    task_counter = 0;
    arr.forEach(function (task) {
      console.log("Task coutner", task_counter);
      console.log("This is the TASK:", task);
      if (task.text == taskOrgText) {
        console.log("THE INDICIES IS ?");
        console.log(list, task_counter);
        temp_task = task;
        tasks[list].splice(task_counter, 1); // make sure to figure out a way to parse date from voice to correct format with slashes( you can use dictionary for each of the months and days and stuff) (you can even say add a day to add it)
        tasks[whereTo].push(temp_task);
        saveTasks();
        // location.reload();
        $("body").load("index.html");
        return;
      }
      task_counter++;
    });
    list_counter++;
  });
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var auditTask = function (taskEl) {
  // get date from task element
  var date = $(taskEl).find("span").text().trim();

  // convert to moment object at 5:00pm
  var time = moment(date, "L").set("hour", 17);

  // remove any old classes from element
  $(taskEl).removeClass("list-group-item-warning list-group-item-danger");

  // apply new class if task is near/over due date
  if (moment().isAfter(time)) {
    $(taskEl).addClass("list-group-item-danger");
  } else if (Math.abs(moment().diff(time, "days")) <= 2) {
    $(taskEl).addClass("list-group-item-warning");
  }
};

// enable draggable/sortable feature on list-group elements
$(".card .list-group").sortable({
  // enable dragging across lists
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function (event, ui) {
    $(this).addClass("dropover");
    $(".bottom-trash").addClass("bottom-trash-drag");
  },
  deactivate: function (event, ui) {
    $(this).removeClass("dropover");
    $(".bottom-trash").removeClass("bottom-trash-drag");
  },
  over: function (event) {
    $(event.target).addClass("dropover-active");
  },
  out: function (event) {
    $(event.target).removeClass("dropover-active");
  },
  update: function () {
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this)
      .children()
      .each(function () {
        // save values in temp array
        tempArr.push({
          text: $(this).find("p").text().trim(),
          date: $(this).find("span").text().trim(),
        });
      });

    // trim down list's ID to match object property
    var arrName = $(this).attr("id").replace("list-", "");
    console.log(arrName)

    // update array on tasks object and save
    tasks[arrName] = tempArr;

    saveTasks();
  },
});

$(".list-group").on("click", ".trash-can", function() {
  var taskElem = $(this).parent();

  // get status type and position in the list
  var status = taskElem.closest(".list-group").attr("id").replace("list-", "");
  var index = taskElem.closest(".list-group-item").index();

  // update tasks object
  delete tasks[status][index]
  tasks[status].length -= 1

  // update local storage
  saveTasks()

  // remove from DOM
  $(this).parent().remove()
  //console.log(tasks)
})

// convert text field into a jquery date picker
$("#modalDueDate").datepicker({
  // force user to select a future date
  minDate: 1,
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-save").click(function () {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate,
    });

    saveTasks();
  }
});

// task text was clicked
$(".list-group").on("click", "p", function() {
  // get current text of p element
  var text = $(this)
    .text()
    .trim();

  // replace p element with a new textarea
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);
  // auto focus new element
  textInput.trigger("focus");

});

// editable field was un-focused
$(".list-group").on("blur", "textarea", function () {
  // get current value of textarea
  var text = $(this).val();
  console.log(this)

  // get status type and position in the list
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();
  console.log(tasks)

  if (tasks[status].length == 1) {
    index = 0
  }

  // update task in array and re-save to localstorage
  console.log("HERE MF:", status, "OTHER::", index);
  tasks[status][index].text = text.trim();
  saveTasks();

  console.log("here")
  // recreate p element
  var taskP = $("<p>").addClass("m-1").text(text);

  // replace textarea with new content
  $(this).replaceWith(taskP);
  $(this).blur();
});

// due date was clicked
$(".list-group").on("click", ".date-box", function () {
  // get current text
  var date = $(this).text().trim();

  // create new input element
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  $(this).replaceWith(dateInput);

  // enable jquery ui date picker
  dateInput.datepicker({
    minDate: 1,
    onClose: function () {
      // when calendar is closed, force a "change" event
      $(this).trigger("change");
    },
  });

  // automatically bring up the calendar
  dateInput.trigger("focus");

  $(".drag-image").hide()
  $(".trash-can").hide()
});

// value of due date was changed
$(".list-group").on("change", "input[type='text']", function () {
  var date = $(this).val();

  $(".trash-can").show()
  $(".drag-image").show()

  // get status type and position in the list
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  var index = $(this).closest(".list-group-item").index();

  console.log(tasks)
  
  if (tasks[status].length == 1) {
    index = 0
  }

  // update task in array and re-save to localstorage
  console.log("TYPEOF DATE:", typeof date, "infor:", date);
  tasks[status][index].date = date;
  saveTasks();

  // recreate span and insert in place of input element
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill color-gray date-box")
    .text(date);
  $(this).replaceWith(taskSpan);
  auditTask($(taskSpan).closest(".list-group-item"));
});

// remove all tasks
$("#remove-tasks").on("click", function () {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  console.log(tasks);
  saveTasks();
});

// load tasks for the first time
loadTasks();

// audit task due dates every 30 minutes
setInterval(function () {
  $(".card .list-group-item").each(function () {
    auditTask($(this));
  });
}, 13);
