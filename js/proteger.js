(() => {
    const CLAVE_SESSION = "phuertohogar_session";

    console.log(localStorage.getItem(CLAVE_SESSION));
    console.log(sessionStorage.getItem(CLAVE_SESSION));
    
    

    const idSesion = localStorage.getItem(CLAVE_SESSION) ?? sessionStorage.getItem(CLAVE_SESSION);

    if(!idSesion){
        location.replace("login.html");
    }
})();