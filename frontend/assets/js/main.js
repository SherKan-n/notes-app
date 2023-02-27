import { User } from "./modules/user.js";
import { Note } from "./modules/note.js";
import { Folder } from "./modules/folder.js";
import { sendNotification, getItemTypeLevel } from "./utils/functions.js";
//========================================









startPage();









function startPage() {
   initializeButtons();

   if (User.isUserLogged()) {
      renderLoggedPage();
      setInterval(() => User.checkUserLogged(), 5000);
   }
   else {
      renderUnloggedPage();
      generateCountries();
   }









   window.onscroll = function () {
      const footer = document.getElementsByClassName("footer-background")[0];
      if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) footer.style.display = "block";
      else footer.style.display = "none";
   };
}







function initializeButtons() {
   //----------Open Register----------
   document.getElementById('register').addEventListener('click', User.openRegister);
   //----------Open Login----------
   document.getElementById('login').addEventListener('click', User.openLogin);
   //----------Log Out----------
   document.getElementById('logout').addEventListener('click', User.logoutUser);
   document.getElementById('logout').style.display = "none";
   //----------Submit Register Form----------
   document.getElementById("formRegister").addEventListener('submit', (e) => {
      e.preventDefault();

      let validator = [];
      const form = document.getElementById('formRegister');
      const formData = new FormData(form);

      const name = formData.get('name');
      const email = formData.get('email');
      const pwd = formData.get('password');
      const repeatPwd = formData.get('repeat_password');
      const gender = formData.get('gender');
      const country = formData.get('country');
      const acceptTerms = formData.get('checkbox');

      if ([name, email, pwd, repeatPwd, gender, country, acceptTerms].some(e => e == '' || e == ' ' || !e)) validator.push('Please check that there are no empty fields !');
      if (!name.match(/^[A-Za-z0-9]*$/gmi)) validator.push('The name must not contain special characters !');
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) validator.push('The email does not have a valid format !');
      if (pwd !== repeatPwd || pwd.length < 5) validator.push('Passwords do not match or are less than 5 characters !');

      if (validator.length > 0) {
         const errorText = validator.reduce((acc, e) => acc += `${e}\n`, '');
         sendNotification(errorText, "error");
         return;
      }

      const payload = {
         name: name,
         email: email,
         password: pwd,
         gender: gender,
         location: country,
         avatar: (gender == 'male') ? ('avatar0.png') : ('avatar1.png')
      };
      User.registerUser(payload);
   });
   //----------Submit Login Form----------
   document.getElementById("formLogin").addEventListener('submit', (e) => {
      e.preventDefault();

      let validator = [];
      const form = document.getElementById('formLogin');
      const formData = new FormData(form);

      const email = formData.get('email');
      const pwd = formData.get('password');

      if ([email, pwd].some(e => e == '' || e == ' ' || !e)) validator.push('Please check that there are no empty fields !');
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) validator.push('The email does not have a valid format !');

      if (validator.length > 0) {
         const errorText = validator.reduce((acc, e) => acc += `${e}\n`, '');
         sendNotification(errorText, "error");
         return;
      }

      const payload = {
         email: email,
         password: pwd,
      };
      User.loginUser(payload);
   });
   //----------Submit Note Form----------
   document.getElementById("formNote").addEventListener('submit', (e) => {
      e.preventDefault();

      let validator = [];
      const form = document.getElementById('formNote');
      const formData = new FormData(form);

      const title = formData.get('title');
      const type = formData.get('type');
      const text = formData.get('text');

      if ([title, type, text].some(e => e == '' || e == ' ' || !e)) validator.push('Please check that there are no empty fields !');
      if (title.length > 20) validator.push('The title cannot be longer than 20 characters !');

      if (validator.length > 0) {
         const errorText = validator.reduce((acc, e) => acc += `${e}\n`, '');
         sendNotification(errorText, "error");
         return;
      }
      form.reset();

      const payload = {
         title: title.toUpperCase(),
         type: type,
         text: text,
         typeLevel: getItemTypeLevel(type)
      };
      Note.addNote(payload);
   });
   //----------Submit Folder Form----------
   document.getElementById("formFolder").addEventListener('submit', (e) => {
      e.preventDefault();

      let validator = [];
      const form = document.getElementById('formFolder');
      const formData = new FormData(form);

      const title = formData.get('f_title');
      const type = formData.get('f_type');

      if ([title, type].some(e => e == '' || e == ' ' || !e)) validator.push('Please check that there are no empty fields !');
      if (title.length > 20) validator.push('The title cannot be longer than 20 characters !');

      if (validator.length > 0) {
         const errorText = validator.reduce((acc, e) => acc += `${e}\n`, '');
         sendNotification(errorText, "error");
         return;
      }
      form.reset();

      const payload = {
         title: title.toUpperCase(),
         type: type,
         typeLevel: getItemTypeLevel(type)
      };
      Folder.addFolder(payload);
   });
}





















function renderLoggedPage() {
   document.getElementById('register').style.display = 'none';
   document.getElementById('login').style.display = 'none';
   document.getElementById('logout').style.display = 'block';
   document.getElementsByClassName('notes-container')[0].classList.add("d-flex", "justify-content-evenly");
}

function renderUnloggedPage() {
   document.getElementById('register').style.display = 'block';
   document.getElementById('login').style.display = 'block';
   document.getElementById('logout').style.display = 'none';
   document.getElementsByClassName('notes-container')[0].classList.remove("d-flex", "justify-content-evenly");
}



















async function generateCountries() {
   const list = await axios.get("https://gist.githubusercontent.com/keeguon/2310008/raw/bdc2ce1c1e3f28f9cab5b4393c7549f38361be4e/countries.json");
   //--------------------------------
   if (!list) return;
   //--------------------------------
   if (list.status == 200) {
      const countries = eval(list.data);
      const selectCountry = document.getElementById('countries-select');
      //--------------------------------
      countries.forEach(country => {
         const option = document.createElement('option');
         option.id = country.code;
         option.innerText = country.name;
         selectCountry.appendChild(option)
      });
   }
}























