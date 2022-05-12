setCookie = (name, value, days) =>{
  let expires = '';
  const prefix = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = prefix+name + '=' + (value || '')  + expires + ';';
}

getCookie = (name) => {
  const cookies = document.cookie.split(';');
  const prefix = '';

  for (const cookie of cookies) {
    if (cookie.includes(prefix+name + '=')) {
      return cookie.split('=')[1];
    }
  }

  return null;
}
