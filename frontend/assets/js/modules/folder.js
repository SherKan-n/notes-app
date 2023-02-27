import { User } from "./user.js";
import { Note } from "./note.js";
import { sendNotification, formatDate, getItemTypeLevel } from "../utils/functions.js";
//========================================

class Folder {
   /* ================= REFRESH ================= */
   static refreshFoldersContainer() {
      const el = document.getElementsByClassName('show-folders')[0];
      el.style.display = "none";
      el.innerHTML = "";

      $('#loader_folders').removeClass('d-none').addClass('d-block');

      Folder.getFolders().then(async result => {
         if (result.folders.length == 0) return $('#loader_folders').removeClass('d-block').addClass('d-none');
         if (result?.success) {
            let c = 0;
            for (let folder of result.folders) {
               const { id, uid, type, title, date } = folder;
               const buttonFolder = createFolderButtonElement(id, uid, type, title);
               const modalFolder = await createFolderModalElement(id, uid, title, type, date);

               el.appendChild(buttonFolder);
               el.appendChild(modalFolder);

               const buttons = document.querySelectorAll(`#folder_${id}_${uid} button[type="button"]`);
               if (buttons[1]) buttons[1].addEventListener("click", () => Folder.deleteFolder(id, uid));
               if (buttons[2] && getItemTypeLevel(type) != -1) buttons[2].addEventListener("click", () => Folder.completedFolder(id, uid));

               const notes = await Folder.getFolderNotes(id);
               notes.forEach(note => {
                  document.getElementById(`modal_collapse1_${note.id}_${uid}`).addEventListener('click', () => {
                     $(`#modal_collapse2_${note.id}_${uid}`).collapse('toggle');
                     $(`#modal_collapse1_${note.id}_${uid}`).toggleClass('active');
                     $(`#modal_collapse1_${note.id}_${uid}`).toggleClass('bg-black');
                  });
               });
               document.getElementById(`formFolderNote_${id}_${uid}`).addEventListener('submit', (e) => Folder.addNote(e, id, uid));

               c++;
               if (c == result.folders.length) {
                  el.style.display = "flex";
                  $('#loader_folders').removeClass('d-block').addClass('d-none');
               }
            }
            if (result.folders.length > 4) el.classList.add("justify-content-center");
            else el.classList.remove("justify-content-center");
         }
      });
   }

   /* ================= ADD ================= */
   static addFolder(folderData) {
      const userStats = User.getUserDetails();
      if (!userStats) return;

      folderData.uid = userStats.id;
      axios.post(`notes/folder/add`, folderData).then((response) => {
         if (response.data.success) Folder.refreshFoldersContainer(), Note.refreshNotesContainer()
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= DELETE ================= */
   static deleteFolder(id, uid) {
      const userStats = User.getUserDetails();
      if (!userStats) return;
      if (userStats.id != uid) return;

      axios.post(`notes/folder/delete`, { id: id, uid: uid }).then((response) => {
         if (response.data.success) Folder.refreshFoldersContainer(), Note.refreshNotesContainer();
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= UPDATE ================= */
   static completedFolder(id, uid) {
      const userStats = User.getUserDetails();
      if (!userStats) return;
      if (userStats.id != uid) return;

      const folderPayload = {
         id: id,
         uid: uid,
         type: "completed",
         typeLevel: -1
      }
      axios.post(`notes/folder/completed`, folderPayload).then((response) => {
         if (response.data.success) Folder.refreshFoldersContainer(), Note.refreshNotesContainer();
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= GET ================= */
   static getFolders() {
      const userStats = User.getUserDetails();
      if (!userStats) return;

      return new Promise((res, rej) => {
         axios.get(`notes/folder/get/all/${userStats.id}`).then((response) => {
            if (response.data.success) res(response.data);
         }).catch(() => { });
      })
   }
   //--------------------------------
   static getFolderNotes(id) {
      const userStats = User.getUserDetails();
      if (!userStats) return;

      return new Promise((res, rej) => {
         axios.get(`notes/folder/get/notes/${id}/${userStats.id}`).then((response) => {
            if (response.data.success) res(response.data.notes);
         }).catch(() => { });
      })
   }

   /* ================= ADD NOTE ================= */
   static addNote(e, id, uid) {
      e.preventDefault();

      let validator = [];
      const form = document.getElementById(`formFolderNote_${id}_${uid}`);
      const formData = new FormData(form);

      const title = formData.get('fn_title');
      const text = formData.get('fn_text');
      const type = formData.get('fn_type');

      if ([title, text].some(e => e == '' || e == ' ' || !e)) validator.push('Please check that there are no empty fields !');
      if (title.length > 20) validator.push('The title cannot be longer than 20 characters !');
      if (text.length == 0) validator.push('The text content cannot be empty !');

      if (validator.length > 0) {
         const errorText = validator.reduce((acc, e) => acc += `${e}\n`, '');
         sendNotification(errorText, "error");
         return;
      }
      form.reset();

      const payload = {
         folder: id,
         title: title.toUpperCase(),
         type: type,
         text: text,
         typeLevel: getItemTypeLevel(type)
      };
      Note.addNote(payload);
      Folder.refreshFoldersContainer();
   }

}
export { Folder };
//========================================
function createFolderButtonElement(id, uid, type, title) {
   const button = document.createElement("button");
   button.classList.add("btn", "btn-outline-light", "border", "border-2", "my-3", "mx-4", "d-grid", "shadow", "rounded", "notes");

   if (type == "normal") button.classList.add("border-secondary");
   else if (type == "informative") button.classList.add("border-primary");
   else if (type == "important") button.classList.add("border-warning");
   else if (type == "urgent") button.classList.add("border-danger");
   else if (type == "completed") button.classList.add("border-success");

   button.setAttribute("data-bs-toggle", `modal`);
   button.setAttribute("data-bs-target", `#folder_${id}_${uid}`);

   const img = document.createElement("img");
   img.classList.add("m-auto");
   img.alt = "folder_note";
   img.width = 110;
   img.height = 110;
   img.src = "frontend/images/folder.png";

   const span = document.createElement("span");
   span.classList.add("title");
   span.innerText = title;

   button.appendChild(img);
   button.appendChild(span);

   return button;
}
//---------------------------------------
async function createFolderModalElement(id, uid, title, type, date) {
   const modal = document.createElement("div");
   const getVariantText = (type) => {
      let color = "text-secondary";
      if (type == "informative") color = "text-primary";
      else if (type == "important") color = "text-warning";
      else if (type == "urgent") color = "text-danger";
      else if (type == "completed") color = "text-success";
      return color;
   }
   const notes = await generateNotesInFolder(id, uid, type);

   const elementText = `<div class="modal fade" id="folder_${id}_${uid}" tabindex="-1" aria-labelledby="modal_${id}_${uid}_label" aria-hidden="true">
      <div class="modal-lg modal-dialog modal-dialog-centered modal-dialog-scrollable">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title" id="modal_${id}_${uid}_label">${title} 
                  <span class="fs-6">
                     (<span class="${getVariantText(type)} text-lowercase">${type}</span>)
                  </span>
               </h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">${notes}</div>
            <div class="my-1 mx-3 fst-italic text-end" style="font-size:13.5px;">${formatDate(date)}</div>
            <div class="modal-footer d-flex justify-content-around">
               <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
               ${(getItemTypeLevel(type) != -1) ? ('<button type="button" class="btn btn-success" data-bs-dismiss="modal">Completed</button>') : ('')}
               <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
         </div>
      </div>
   </div>`;

   modal.innerHTML = elementText;

   return modal;
}
//---------------------------------------
async function generateNotesInFolder(id, uid, type) {
   const result = await Folder.getFolderNotes(id);

   const getTextVariant = (type) => {
      let color = "text-secondary";
      if (type == "informative") color = "text-primary";
      else if (type == "important") color = "text-warning";
      else if (type == "urgent") color = "text-danger";
      else if (type == "completed") color = "text-success";
      return color;
   }

   let text = "<ul class='list-group'>";
   result.forEach(e => {
      text += `<a id="modal_collapse1_${e.id}_${uid}" class="list-group-item" href="javascript:void(0);" aria-current="true">
         <span class="fs-6 fw-bold ${getTextVariant(e.type)}">${e.title}</span>
         <div id="modal_collapse2_${e.id}_${uid}" class="bg-white text-black p-3 border border-primary rounded collapse hide" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body fs-6">${e.text.replaceAll("\n", "<br>")}</div>
         </div>
      </a>`;
   });

   text += `<hr><div class="mt-1 p-3">
      <form id="formFolderNote_${id}_${uid}">
         <label for="add_new_note" class="form-label fw-700">Add New Note</label>
         <input type="text" name="fn_title" class="form-control" placeholder="Title" id="add_new_note" aria-describedby="newNoteHelp" autocomplete="off">
         <div id="newNoteHelp" class="form-text">The note created in the folder will be of the same type as the folder.</div>
         <input class="d-none" name="fn_type" value="${type}">
         <textarea class="form-control" name="fn_text" placeholder="Text"></textarea>
         <button type="submit" class="btn btn-outline-dark w-100 mt-1 fs-6" data-bs-dismiss="modal">ADD NEW NOTE</button>
      </form>
   </div>`;

   text += "</ul>";

   return text;
}