function log(item) {
  console.log(item);
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
  }
}

function checkForm() {
  // Проверить всю форму при клике на кнопку Save
  checkInput('name');
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
