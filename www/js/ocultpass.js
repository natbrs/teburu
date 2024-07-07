function openOcultPass(){
    let input = document.querySelector('#password'),
    img = document.querySelector('#pass');

img.addEventListener('click', showHide);

function showHide() {

    if (input.type == 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }

}
    
}
