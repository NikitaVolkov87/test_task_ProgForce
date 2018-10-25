function log(item) {
  console.log(item);
}

let handler = function() {
  checkInput('email');
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
      let email = document.getElementById(`reg-form__user-${item}_input`);
      let emailLiveCheck = email.getAttribute('liveCheck');
      if ( emailLiveCheck === 'false' ) {
        email.addEventListener("input", handler);
        email.setAttribute('liveCheck', 'true');
      }
      if ( value === '' ) {
        showInputError(item, 'Обязательное поле');
      } else if ( !( value.indexOf('@') != -1 && value.indexOf('.') != -1 ) || value.indexOf('.') + 1 === value.length ) {
        showInputError(item, 'Неверный email');
      } else {
        hideInputError(item);
      }
  }
}

function checkForm() {
  // Проверить всю форму при клике на кнопку Save
  let items = ['name', 'surname', 'email', 'phone', 'birthday'];
  items.forEach( item => checkInput(item) );
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
