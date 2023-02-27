import { Note } from "./note.js";
import { Folder } from "./folder.js";
import { delayReload, sendNotification } from "../utils/functions.js";
//========================================

class User {
   /* ================= REGISTRATION ================= */
   static openRegister() {
      document.getElementsByClassName('register-container')[0].style.display = 'flex';
      User.closeLogin();
   }
   //--------------------------------
   static closeRegister() {
      document.getElementsByClassName('register-container')[0].style.display = 'none';
   }
   //--------------------------------
   static registerUser(userData) {
      axios.post(`notes/user/register`, userData).then((response) => {
         if (response.data.success) {
            const data = {
               ...userData,
               duration: Date.now() + 6000000
            }
            delete data.password;

            User.closeRegister();
            localStorage.setItem("loginDetails", JSON.stringify(data));
            delayReload(0.5);
         }
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'));
      }).catch((err) => console.error(err));
   }

   /* ================= LOGIN ================= */
   static openLogin() {
      document.getElementsByClassName('login-container')[0].style.display = 'flex';
      User.closeRegister();
   }
   //--------------------------------
   static closeLogin() {
      document.getElementsByClassName('login-container')[0].style.display = 'none';
   }
   //--------------------------------
   static loginUser(userData) {
      axios.post(`notes/user/login`, userData).then((response) => {
         if (response.data.success) {
            const data = {
               ...response.data.userStats,
               duration: Date.now() + 6000000
            }
            User.closeLogin();
            localStorage.setItem("loginDetails", JSON.stringify(data));
            delayReload(0.5);
         }
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'));
      }).catch(() => { });
   }
   //--------------------------------
   static isUserLogged() {
      const storage = localStorage.getItem('loginDetails');
      if (!storage) return false;

      const userData = JSON.parse(storage);
      if (userData.duration < Date.now()) {
         localStorage.clear();
         return false;
      }

      const divProfile = document.getElementById('profile');
      divProfile.innerHTML = '';
      divProfile.style.fontSize = "15px";

      const img = document.createElement('img');

      if (userData.avatar.match(/avatar[0|1]/gmi)) img.src = `frontend/images/${userData.avatar}`;
      else img.src = "frontend/images/uploads/avatars/notes-icon.png";
      img.alt = "profile_img";

      const a = document.createElement('a');
      a.classList.add('nav-title', 'pe-none');
      a.href = "javascript:void(0);";
      a.innerHTML = `${img.outerHTML} ${userData.name}'s notes`;

      divProfile.append(a);

      Note.refreshNotesContainer();
      Folder.refreshFoldersContainer();

      return true;
   }
   //--------------------------------
   static checkUserLogged() {
      const storage = localStorage.getItem('loginDetails');
      if (!storage) return delayReload(0.5);

      const userData = JSON.parse(storage);
      if (userData.duration < Date.now()) {
         localStorage.clear();
         return delayReload(0.5);
      }
   }
   //--------------------------------
   static logoutUser() {
      sendNotification("You have successfully logged out!", 'success');
      localStorage.clear();
      delayReload(0.5);
   }

   /* ================= USER DETAILS ================= */
   static getUserDetails() {
      const storage = localStorage.getItem('loginDetails');
      if (!storage) return;

      return JSON.parse(storage);
   }

}
export { User };
//========================================