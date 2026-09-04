// Constantes
const CLAVE_USUARIOS = "phuertohogar_usuarios";

function buscarUsuarioLocal(){
    try{
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (error){
        console.log("datos corruptos en el storage " + error);
        return [];
    }
}

function buscarUsuarioTemporal(){
    try{
        return JSON.parse(sessionStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (error){
        console.log("datos corruptos en el session " + error);
        return [];
    }
}




document.addEventListener("DOMContentLoaded",() => {

    const hayDatosSession = localStorage.getItem('session') ?? sessionStorage.getItem('session');
    
    if(!hayDatosSession){
        location.href = "login.html";
        return;
    }

    const sesion = JSON.parse(hayDatosSession);

    console.log(sesion);
    
});