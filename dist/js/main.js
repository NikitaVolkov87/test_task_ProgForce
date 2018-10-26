function log(item) {
  console.log(item);
}



const formItems = ['name', 'surname', 'email', 'phone', 'birthday'];
let usersDB = [];
let state = {
  currentUserId: null,
  inputError: false,
  formDirty: false
};



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
  state.formDirty = true;
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
  state.inputError = true;
}

function hideInputError(item) {
  // Убрать ошибку на Input'e
  let obj = getDOMObjects(item);
  obj.message.classList.add('hide');
  obj.target.classList.remove('input-error');
  obj.button.classList.remove('button-disabled')
  obj.button.removeAttribute('disabled');
  state.inputError = false;
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

function saveToUsersDB(userId) {
  if ( userId ) {
    usersDB[userId-1] = {
      id: userId,
      name: getInputItem(formItems[0]).value,
      surname: getInputItem(formItems[1]).value,
      email: getInputItem(formItems[2]).value,
      phone: getInputItem(formItems[3]).value,
      birthday: getInputItem(formItems[4]).value,
    };
  } else {
    let userObj = {
      id: usersDB.length+1,
      name: capitalizeFirstLetter(getInputItem(formItems[0]).value),
      surname: capitalizeFirstLetter(getInputItem(formItems[1]).value),
      email: getInputItem(formItems[2]).value,
      phone: getInputItem(formItems[3]).value,
      birthday: getInputItem(formItems[4]).value,
    };
    usersDB.push(userObj);
  }
  return false;
}

function saveUserButtonClick(userId) {
  if ( state.formDirty && getInputItem('name').value.length ) {
    checkForm();
    if (!state.inputError) {
      saveToUsersDB(userId);
      renderView('result-table');
      renderView('reg-form');
    }
  } else if (userId) {
    renderView('reg-form');
  }
  return false;
}

function renderView(view) {
  const target = document.getElementById(`${view}__section`);
  switch(view) {
    case 'reg-form':
      state.formDirty = false;
      target.innerHTML = `
        <form action="">
          <div class="container reg-form__container">
            <div class="row reg-form__row reg-form__row_form-title">
              <div class="col reg-form__col reg-form__col_form-title">
                <p class="reg-form__title" onclick="log(usersDB)">Registration form</p>
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
                <button id="form__button" onclick="return saveUserButtonClick()">Save</button>
              </div>
            </div>
          </div>
        </form>
      `;
      /*if ( userId ) {
        setInputs(userId);
      }*/
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

function itemResultTableClick(id) {
  renderView('reg-form');
  setInputs(id);
  state.currentUserId = id;
}

function setInputs(userId) {
  formItems.forEach( item => {
    const obj = getDOMObjects(item);
    obj.target.value = usersDB[userId-1][item];
  });
  document.getElementById('form__button').setAttribute('onclick', `return saveUserButtonClick(${userId})`);
}

function onFirstLoad() {
  renderView('reg-form');
  renderView('result-table');
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
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
