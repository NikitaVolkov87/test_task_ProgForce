function log(item) {
  console.log(item);
}



const formItems = ['name', 'surname', 'email', 'phone', 'birthday'];
let usersDB = [];



let emailHandler = function() {
  // Дополнительное событие на input
  checkInput('email');
}

let phoneHandler = function() {
  // Дополнительное событие на input
  checkInput('phone');
}

let birthdayHandler = function() {
  // Дополнительное событие на input
  checkInput('birthday');
}

function checkInput(item) {
  // Проверяем конкретный Input формы
  let value = document.getElementById(`reg-form__user-${item}_input`).value;
  switch(item) {
    case 'name':
    case 'surname':
      if ( value.indexOf(' ') != -1 ) {
        showInputError(item, 'Пробелы не допускаются');
      } else if ( value === '' ) {
        showInputError(item, 'Обязательное поле');
      } else {
        hideInputError(item);
      }
      break;
    case 'email':
      if ( event.target.getAttribute('liveCheck') === 'false' ) {
        event.target.addEventListener("input", emailHandler);
        event.target.setAttribute('liveCheck', 'true');
      }
      if ( value === '' ) {
        showInputError(item, 'Обязательное поле');
      } else if ( !( value.indexOf('@') != -1 && value.indexOf('.') != -1 ) || value.indexOf('.') + 1 === value.length ) {
        showInputError(item, 'Неверный email');
      } else {
        hideInputError(item);
      }
      break;
    case 'phone':
      if ( event.target.value === '+380' && document.activeElement !== event.target ) {
        event.target.value = '';
        hideInputError(item);
      } else if ( event.target.value === '' && document.activeElement === event.target ) {
        event.target.value = '+380';
        hideInputError(item);
      } else if ( !(/^\d+$/.test(value.slice(1))) ) {
        showInputError(item, 'Допускаются только цифры');
      } else if ( value.length !== 13 ) {
        if ( value.length > 4 ) {
          showInputError(item, 'Неверный номер телефона');
          if ( event.target.getAttribute('liveCheck') === 'false' ) {
            event.target.addEventListener("input", phoneHandler);
            event.target.setAttribute('liveCheck', 'true');
          }
        }
      } else {
        hideInputError(item);
        if ( event.target.getAttribute('liveCheck') === 'true' ) {
          event.target.removeEventListener("input", phoneHandler);
          event.target.setAttribute('liveCheck', 'false');
        }
      }
      break;
    case 'birthday':
      if ( value === '' ) {
        event.target.value = 'дд/мм/гггг';
        event.target.select();
        hideInputError(item);
      } else if ( value === 'дд/мм/гггг' ) {
        event.target.value = '';
        hideInputError(item);
      } else if ( !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(value) ) {
        showInputError(item, 'Дата введена неправильно');
        if ( event.target.getAttribute('liveCheck') === 'false' ) {
          event.target.addEventListener("input", birthdayHandler);
          event.target.setAttribute('liveCheck', 'true');
        }
      } else {
        hideInputError(item);
        if ( event.target.getAttribute('liveCheck') === 'true' ) {
          event.target.removeEventListener("input", birthdayHandler);
          event.target.setAttribute('liveCheck', 'false');
        }
      }
      break;
  }
}

function checkForm() {
  // Проверить всю форму при клике на кнопку Save
  formItems.slice(0, 3).forEach( item => checkInput(item) );
  return false;
}

function showInputError(item, messageText) {
  // Показать ошибку на Input'e
  let obj = getDOMObjects(item);
  obj.message.textContent = messageText;
  obj.message.classList.remove('hide');
  obj.target.classList.add('input-error');
  obj.button.classList.add('button-disabled');
  obj.button.setAttribute('disabled', '');
}

function hideInputError(item) {
  // Убрать ошибку на Input'e
  let obj = getDOMObjects(item);
  obj.message.classList.add('hide');
  obj.target.classList.remove('input-error');
  obj.button.classList.remove('button-disabled')
  obj.button.removeAttribute('disabled');
}

function getDOMObjects(item) {
  // Находим текущие эл-ты в DOM'e форме
  let message = document.getElementById(`reg-form__user-${item}_message`);
  let target = document.getElementById(`reg-form__user-${item}_input`);
  let button = document.getElementById('form__button');
  return {message, target, button};
}

function getInputItem(item) {
  return document.getElementById(`reg-form__user-${item}_input`);
}

function saveToUsersDB() {
  let userObj = {
    id: usersDB.length+1,
    name: getInputItem(formItems[0]).value,
    surname: getInputItem(formItems[1]).value,
    email: getInputItem(formItems[2]).value,
    phone: getInputItem(formItems[3]).value,
    birthday: getInputItem(formItems[4]).value,
  };
  usersDB.push(userObj);
  return false;
}

function saveUserButtonClick() {
  saveToUsersDB();
  renderView('result-table');
  return false;
}

function renderView(view) {
  const target = document.getElementById(`${view}__section`);
  switch(view) {
    case 'result-table':
      let table = '';
      usersDB.forEach( item => {
        table += `
          <div class="row result-table__row result-table__row_table-item">
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick('id')">${item.name}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick('id')">${item.surname}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick('id')">${item.email}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick('id')">${item.phone}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick('id')">${item.birthday}</p>
            </div>
          </div>
        `
      });
      target.innerHTML = `
        <div class="container result-table__container">
          <div class="row result-table__row result-table__row_table-title">
            <div class="col result-table__col result-table__col_table-title">
              <p class="result-table__title">Name</p>
            </div>
            <div class="col result-table__col result-table__col_table-title">
              <p class="result-table__title">Surname</p>
            </div>
            <div class="col result-table__col result-table__col_table-title">
              <p class="result-table__title">Email</p>
            </div>
            <div class="col result-table__col result-table__col_table-title">
              <p class="result-table__title">Phone</p>
            </div>
            <div class="col result-table__col result-table__col_table-title">
              <p class="result-table__title">Birthday</p>
            </div>
          </div>
          ${table}
        </div>
      `
      break;
  }
}


usersDB = [{
  id: 1,
  name: 'Andrey',
  surname: 'Evgenich',
  email: 'andru@gmail.com',
  phone: '+380951234567',
  birthday: '12/12/2009',
},
{
  id: 2,
  name: 'Oleg',
  surname: 'Batkovich',
  email: 'oleg@gmail.com',
  phone: '+380951234567',
  birthday: '02/02/2012',
}];
