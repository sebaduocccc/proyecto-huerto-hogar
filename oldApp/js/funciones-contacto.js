function validateForm() {
  const nombre = document.forms["myForm"]["nombre"].value.trim();
  const correo = document.forms["myForm"]["correo"].value.trim();
  const mensaje = document.forms["myForm"]["mensaje"].value.trim();

  if (nombre === "") {
    alert("El nombre debe estar relleno");
    return false;
  }

  if (!validateNombre(nombre)) {
    return false;
  }

  if (correo === "") {
    alert("El correo debe estar relleno");
    return false;
  }

  if (!validateEmail(correo)) {
    return false;
  }

  if (mensaje === "") {
    alert("El mensaje debe estar relleno");
    return false;
  }

  return true;
}

function validateEmail(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!regex.test(correo)) {
    alert("El correo no es válido");
    return false;
  }

  return true;
}

function validateNombre(nombre) {
  const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s-]+$/;

  if (!regex.test(nombre)) {
    alert("El nombre no es válido");
    return false;
  }

  return true;
}