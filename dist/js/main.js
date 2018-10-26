// Переменные
const formItems = ['name', 'surname', 'email', 'phone', 'birthday'];
let usersDB = [];
let state = {
  winnerId: null,
  inputError: false,
  formDirty: false
};


const emailHandler = function() {
  // Дополнительное событие на input
  checkInput('email');
}

const phoneHandler = function() {
  // Дополнительное событие на input
  checkInput('phone');
}

const birthdayHandler = function() {
  // Дополнительное событие на input
  checkInput('birthday');
}


function checkInput(item) {
  // Проверяем конкретный Input формы
  state.formDirty = true;
  const value = getDOMInputValue(item);
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
}

function showInputError(item, messageText) {
  // Показать ошибку на Input'e
  const obj = getDOMObjects(item);
  obj.message.textContent = messageText;
  obj.message.classList.remove('hide');
  obj.target.classList.add('input-error');
  obj.button.classList.add('button-disabled');
  obj.button.setAttribute('disabled', '');
  state.inputError = true;
}

function hideInputError(item) {
  // Убрать ошибку на Input'e
  const obj = getDOMObjects(item);
  obj.message.classList.add('hide');
  obj.target.classList.remove('input-error');
  obj.button.classList.remove('button-disabled')
  obj.button.removeAttribute('disabled');
  state.inputError = false;
}

function getDOMObjects(item) {
  // Находим текущие эл-ты в DOM'e
  if (item) {
    const message = document.getElementById(`reg-form__user-${item}_message`);
    const target = document.getElementById(`reg-form__user-${item}_input`);
    const button = document.getElementById('form__button');
    return {message, target, button};
  } else {
    return document.getElementById('winner__user-name');
  }
}

function getDOMInputValue(item) {
  // Получить нужный input эл-нт формы
  return document.getElementById(`reg-form__user-${item}_input`).value;
}

function saveToUsersDB(userId) {
  // Сохранить изменения данных user'a
  if ( userId ) {
    usersDB[userId-1] = {
      id: userId,
      name: capitalizeFirstLetter(getDOMInputValue(formItems[0])),
      surname: capitalizeFirstLetter(getDOMInputValue(formItems[1])),
      email: getDOMInputValue(formItems[2]),
      phone: getDOMInputValue(formItems[3]),
      birthday: getDOMInputValue(formItems[4]),
    };
  } else {
    let userObj = {
      id: usersDB.length + 1,
      name: capitalizeFirstLetter(getDOMInputValue(formItems[0])),
      surname: capitalizeFirstLetter(getDOMInputValue(formItems[1])),
      email: getDOMInputValue(formItems[2]),
      phone: getDOMInputValue(formItems[3]),
      birthday: getDOMInputValue(formItems[4]),
    };
    usersDB.push(userObj);
  }
}

function saveUserButtonClick(userId) {
  // Клик на кнопку Save под формой
  checkForm();
  if ( state.formDirty && !state.inputError ) {
    saveToUsersDB(userId);
    renderView('result-table');
    renderView('reg-form');
    if ( state.winnerId === userId ) {
      getDOMObjects().firstChild.textContent = usersDB[userId-1].name + ' ' + usersDB[userId-1].surname;
    }
  } else if (userId) {
    renderView('reg-form');
  }
  return false;
}

function renderView(view) {
  // Изменить view
  const target = document.getElementById(`${view}__section`);
  switch(view) {
    case 'reg-form':
      state.formDirty = false;
      target.innerHTML = `
        <form action="">
          <div class="container reg-form__container">
            <div class="row reg-form__row reg-form__row_form-title">
              <div class="col reg-form__col reg-form__col_form-title">
                <p class="reg-form__title">Registration form</p>
              </div>
            </div>
            <div class="row reg-form__row reg-form__row_form-item">
              <div class="col reg-form__col reg-form__col_user-name_p">
                <p class="reg-form__input-title">Name: </p>
              </div>
              <div class="col reg-form__col reg-form__col_user-name_input">
                <p class="warning__messages hide" id="reg-form__user-name_message">Обязательное поле</p>
                <input class="reg-form__input" id="reg-form__user-name_input" type="text" oninput="checkInput('name')" onblur="checkInput('name')" onclick="event.target.select()">
              </div>
            </div>
            <div class="row reg-form__row reg-form__row_form-item">
              <div class="col reg-form__col reg-form__col_user-surname_p">
                <p class="reg-form__input-title">Surname: </p>
              </div>
              <div class="col reg-form__col reg-form__col_user-surname_input">
                <p class="warning__messages hide" id="reg-form__user-surname_message">Обязательное поле</p>
                <input class="reg-form__input" id="reg-form__user-surname_input" type="text" oninput="checkInput('surname')" onblur="checkInput('surname')" onclick="event.target.select()">
              </div>
            </div>
            <div class="row reg-form__row reg-form__row_form-item">
              <div class="col reg-form__col reg-form__col_user-email_p">
                <p class="reg-form__input-title">Email: </p>
              </div>
              <div class="col reg-form__col reg-form__col_user-email_input">
                <p class="warning__messages hide" id="reg-form__user-email_message">Обязательное поле</p>
                <input class="reg-form__input" id="reg-form__user-email_input" type="text" onblur="checkInput('email')" onclick="event.target.select()" liveCheck="false">
              </div>
            </div>
            <div class="row reg-form__row reg-form__row_form-item">
              <div class="col reg-form__col reg-form__col_user-phone_p">
                <p class="reg-form__input-title">Phone: </p>
              </div>
              <div class="col reg-form__col reg-form__col_user-phone_input">
                <p class="warning__messages hide" id="reg-form__user-phone_message">Обязательное поле</p>
                <input class="reg-form__input" id="reg-form__user-phone_input" type="text" onblur="checkInput('phone')" onclick="checkInput('phone')" liveCheck="false">
              </div>
            </div>
            <div class="row reg-form__row reg-form__row_form-item">
              <div class="col reg-form__col reg-form__col_user-birthday_p">
                <p class="reg-form__input-title">Birthday: </p>
              </div>
              <div class="col reg-form__col reg-form__col_user-birthday_input">
                <p class="warning__messages hide" id="reg-form__user-birthday_message">Обязательное поле</p>
                <input class="reg-form__input" id="reg-form__user-birthday_input" type="text" onblur="checkInput('birthday')" onclick="checkInput('birthday')" liveCheck="false">
              </div>
            </div>
          </div>
          <div class="container reg-form__container_button">
            <div class="row reg-form__row reg-form__row_form-button">
              <div class="col reg-form__col reg-form__col_form-button">
                <button id="form__clear-button" onclick="return clearFormButtonClick()">Clear</button>
                <button id="form__button" onclick="return saveUserButtonClick()">Save</button>
              </div>
            </div>
          </div>
        </form>
      `;
      break;
    case 'result-table':
      let table = '';
      usersDB.forEach( item => {
        table += `
          <div class="row result-table__row result-table__row_table-item">
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick(${item.id})">${item.name}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick(${item.id})">${item.surname}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick(${item.id})">${item.email}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick(${item.id})">${item.phone}</p>
            </div>
            <div class="col result-table__col result-table__col_table-item">
              <p class="result-table__item" onclick="itemResultTableClick(${item.id})">${item.birthday}</p>
            </div>
          </div>
        `;
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
      `;
      break;
  }
}

function itemResultTableClick(id) {
  // Клик на эл-нт в таблице всех пользователей
  renderView('reg-form');
  setInputs(id);
}

function setInputs(userId) {
  // Заполнить input'ы данными из базы пользователей
  formItems.forEach( item => {
    getDOMObjects(item).target.value = usersDB[userId-1][item];
  });
  document.getElementById('form__button').setAttribute('onclick', `return saveUserButtonClick(${userId})`);
}

function onFirstLoad() {
  // Отобразить форму и таблицу при загрузке страницы
  renderView('reg-form');
  renderView('result-table');
}

function capitalizeFirstLetter(string) {
  // Сделать первую букву заглавной
  return string[0].toUpperCase() + string.slice(1);
}

function clearFormButtonClick() {
  // Клик на кнопку Clear формы для её очистки
  renderView('reg-form');
  return false;
}

function newWinnerButtonClick() {
  // Клик на кнопку New winner
  const randomId = Math.ceil(Math.random()*usersDB.length);
  state.winnerId = randomId;
  getDOMObjects().innerHTML = `<span onclick="itemResultTableClick(${randomId})">${usersDB[randomId-1].name} ${usersDB[randomId-1].surname}</span>`;
}


// Первоначальные тестовые пользовательские данные для примера
usersDB = [
  {
    id: 1,
    name: 'Test1',
    surname: 'User1',
    email: 'mail1@mail.com',
    phone: '+380501111111',
    birthday: '01/01/2001',
  },
  {
    id: 2,
    name: 'Test2',
    surname: 'User2',
    email: 'mail2@mail.com',
    phone: '+380502222222',
    birthday: '02/02/2002',
  },
  {
    id: 3,
    name: 'Test3',
    surname: 'User3',
    email: 'mail3@mail.com',
    phone: '+380503333333',
    birthday: '03/03/2003',
  },
  {
    id: 4,
    name: 'Test4',
    surname: 'User4',
    email: 'mail4@mail.com',
    phone: '+380504444444',
    birthday: '04/04/2004',
  },
  {
    id: 5,
    name: 'Test5',
    surname: 'User5',
    email: 'mail5@mail.com',
    phone: '+380505555555',
    birthday: '05/05/2005',
  }
];
