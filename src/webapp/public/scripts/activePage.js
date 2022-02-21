const link = window.location.pathname;

let element;
if( link == '/') {
    element = document.getElementById('home');
} else if ( link == '/auth/login' ){
    element = document.getElementById('login');
} else if ( link == '/auth/register' ){
    element = document.getElementById('register');
} else if ( link == '/tools/profile' ){
    element = document.getElementById('profile');
} else if ( link == '/tools/machines' ){
    element = document.getElementById('machines');
} else if ( link == '/tools/users' ){
    element = document.getElementById('users');
} else if ( link == '/tools/createUser' ){
    element = document.getElementById('createuser');
} else if ( link == '/tools/createMachine' ){
    element = document.getElementById('createmachine');
} else if ( link == '/tools/updateUser' ){
    element = document.getElementById('updateuser');
} else if ( link == '/tools/updateMachine' ){
    element = document.getElementById('updatemachine');
} else if ( link == '/tools/realTime' ){
    element = document.getElementById('realtime');
} else if ( link == '/tools/record' ){
    element = document.getElementById('record');
}

element.classList.add('active-link');
