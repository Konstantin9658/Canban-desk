const body = document.querySelector('.board-app');

const sectionAddTask   = body.querySelector('.add-task');
const taskName         = sectionAddTask.querySelector('#add-task');
const btnAddNewTask    = sectionAddTask.querySelector('.add-task__button');

const sectionTaskboard = body.querySelector('.taskboard');
const emptyBoxes       = sectionTaskboard.querySelectorAll('.task--empty');
const taskBoardsGroups = sectionTaskboard.querySelectorAll('.taskboard__group');
const backlogBox       = sectionTaskboard.querySelector('.taskboard__group--backlog');
const backlogList      = backlogBox.querySelector('.taskboard__list');
const emptyBoxBacklog  = backlogList.querySelector('.task--empty');

const basketBox        = sectionTaskboard.querySelector('.taskboard__group--basket');
const trashList        = basketBox.querySelector('.taskboard__list--trash');
const btnClearBasket   = basketBox.querySelector('.button--clear');

btnClearBasket.disabled = true;

const isEnterEvent = evt => evt.key === 'Enter' || evt.key === '13';

const changeNameTask = (evt, input, taskName) => {
  evt.target.parentElement.classList.add('task--active');
  input.focus();
  input.value = taskName.textContent;
}

const getNextElement = (cursorPosition, currentElement) => {
  const currentElementCoord  = currentElement.getBoundingClientRect();
  const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
  const nextElement          = (cursorPosition < currentElementCenter) ? currentElement : currentElement.nextElementSibling;
  
  return nextElement;
}

const clearBasket = () => {
  const trashItem     = trashList.querySelectorAll('.task--basket');
  const emptyBoxTrash = trashList.querySelector('.task--empty-trash');

  trashItem.forEach(item => item.remove());
  
  emptyBoxTrash.style.display = '';
  btnClearBasket.disabled = true;
}

const handlerClear = () => clearBasket();

const createNewTask = () => {
  const newTaskItem       = document.createElement('div');
  const newTaskBody       = document.createElement('div');
  const newTaskName       = document.createElement('p');
  const newBtnEditTask    = document.createElement('button');
  const newInputTaskField = document.createElement('input');

  const handlerChangedName = (evt) => changeNameTask(evt, newInputTaskField, newTaskName);

  newTaskItem.className       = 'taskboard__item task task--backlog';
  newTaskItem.draggable       =  true;
  newTaskBody.className       = 'task__body';
  newTaskName.className       = 'task__view';
  newBtnEditTask.className    = 'task__edit';
  newInputTaskField.className = 'task__input';

  newInputTaskField.setAttribute('type', 'text');
  newBtnEditTask   .setAttribute('type', 'button');
  newBtnEditTask   .setAttribute('aria-label', 'Изменить');

  newTaskName.textContent = taskName.value;

  backlogList.appendChild(newTaskItem);
  newTaskItem.appendChild(newTaskBody);
  newTaskBody.appendChild(newTaskName);
  newTaskBody.appendChild(newInputTaskField);
  newTaskItem.appendChild(newBtnEditTask);  

  newBtnEditTask.addEventListener('click', handlerChangedName);
  newTaskItem.addEventListener('keydown', (evt) => {
    if (isEnterEvent(evt)) {
      evt.target.parentElement.parentElement.classList.remove('task--active');
      newTaskName.textContent = evt.target.value;
    }
  })

  for (let taskColumn of taskBoardsGroups) {
    taskColumn.addEventListener('dragstart', (evt) => {
      evt.target.classList.remove(`${newTaskItem.classList[2]}`);
      evt.target.classList.add('task--dragged');
    })
    
    taskColumn.addEventListener('dragend', (evt) => {
      const classModify = taskColumn.classList[1].split('--')[1];
      evt.target.classList.remove('task--dragged');
      evt.target.classList.add(`task--${classModify}`);

      if (trashList.children.length >= 2) {
        btnClearBasket.disabled = false;
      } else {
        btnClearBasket.disabled = true;
      }
    });

    taskColumn.addEventListener('dragover', (evt) => {
      evt.preventDefault();

      emptyBoxes.forEach(item => item.parentElement.children.length === 1 ? item.style.display = '' : item.style.display = 'none');
  
      const activeElement  = sectionTaskboard.querySelector('.task--dragged');
      const currentElement = evt.target;
      const isMoveable     = activeElement !== currentElement && currentElement.classList.contains('task');
      const nextElement    = getNextElement(evt.clientY, currentElement);

      if (!isMoveable) {
        return;
      }

      if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
        return;
      }

      currentElement.parentElement.insertBefore(activeElement, nextElement);
    })
  }  
}

const validateInput = (input) => {
  const validityInput = input.validity;

  if (validityInput.valueMissing) {
    input.setCustomValidity('Введите название задачи!');
  } else {
    input.setCustomValidity('');
    createNewTask();
    emptyBoxBacklog.style.display = 'none';
    input.value = '';
  }

  input.reportValidity();
}

const addNewTask = (evt) => {
  evt.preventDefault();
  validateInput(taskName);
}

btnAddNewTask.addEventListener('click', addNewTask);
emptyBoxBacklog.addEventListener('click', () => taskName.focus());
btnClearBasket.addEventListener('click', handlerClear)
