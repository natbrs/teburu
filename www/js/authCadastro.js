function cadastro(){ 

  const auth = firebase.auth()
  const database = firebase.database()

  var email = document.getElementById('email').value;
  var senha = document.getElementById('pass').value;
  var nome = document.getElementById('nick').value;


  if (validate_email(email) == false){
    alert('Email inválido')
    return
  }

  if (validate_password(senha) == false){
    alert('Senha inválida')
    return
  }

  firebase
      .auth()
      .createUserWithEmailAndPassword(email, senha)
      .then(function(){ 

      var user = auth.currentUser
      var database_ref = database.ref()

      var user_data = {
      email : email,
      nome : nome,
      coin : coin,
      dima : dima,
      bio : bio,
      profile_user : profile_user,
      last_login : Date.now()
    }

    database_ref.child('users/' + user.uid).set(user_data)

    alert('Cadastrado com sucesso! :D ')

    }).catch(function(error){
      var error_code = error.code
      var error_message = error.message

        alert("Email já em uso D':");
    });
}

function validate_email(email) {
  expression = /^[^@]+@\w+(.\w+)+\w$/
  if (expression.test(email) == true) {
    return true
  } else {
    return false
  }
}

function validate_password(senha) {
  if (senha < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}