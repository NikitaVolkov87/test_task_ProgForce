# Specification



## Действия:
- Валидация полей
- кнопка New winner
- кнопка Save (сохранить новoго или заменить существующего)
- клик на пункт в таблице для редактирования пользователя
Три view



## variables
usersDB = [{
  id: 1,
  name: 'name',
  surname: 'surname',
  email: '',
  phone: '',
  birthday: ''
}]
params = {
  winnerUserId: 1,
  editUserId: 1
}



## functions
renderView('whatView', params)
  ('winner', id),
  ('userForm', id),
  ('resultTable')
  ('all')
checkForm('field')

newWinnerButtonClick()
saveUserButtonClick(id)
itemResultTableClick(id)

saveToUsersDB({obj})
getItemFromUsersDB(id)



## action specs
Нажатие New winner:
- беру длинну usersDB
- нахожу случайное число из длинны
- renderView('winner', id)

Нажатие Save, если новый юзер (новый id):
- создаем объект из инпутов
- saveToUsersDB({obj})
- renderView('resultTable')
- renderView('userForm', id)

Нажатие на эл-нт в таблице - itemResultTableClick(id):
- renderView('userForm', id)

Нажатие Save, старый юзер (текущий id):
- создаем объект из инпутов
- saveToUsersDB({obj})
- renderView('resultTable')
- проверяем если params.editUserId === params.winnerUserId
  * если да то renderView('winner', id)
