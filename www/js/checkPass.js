function validarSenha(){
    var senha1 = document.getElementById("pass");
    var senha2 = document.getElementById("pass-2");

    var s1 = senha1.value;
    var s2 = senha2.value;

    if (s1 == s2){
        alert("Dados Cadastrados");
        return true;
    } else{
        alert("senhas não batem");
        return false;
    }    
}
@