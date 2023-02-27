import { User } from "./user.js";
import { sendNotification, formatDate, getItemTypeLevel } from "../utils/functions.js";
//========================================

class Note {
   /* ================= REFRESH ================= */
   static refreshNotesContainer() {
      const el = document.getElementsByClassName('show-notes')[0];
      el.style.display = "none";
      el.innerHTML = "";

      $('#loader_notes').removeClass('d-none').addClass('d-block');

      Note.getNotes().then(result => {
         if (result.notes.length == 0) return $('#loader_notes').removeClass('d-block').addClass('d-none');
         if (result?.success) {
            let c = 0;
            for (let note of result.notes) {
               const { id, uid, type, text, title, date } = note;
               const buttonNote = createNoteButtonElement(id, uid, type, title);
               const modalNote = createNoteModalElement(id, uid, text, title, type, date);

               el.appendChild(buttonNote);
               el.appendChild(modalNote);

               const buttons = document.querySelectorAll(`#note_${id}_${uid} button[type="button"]`);
               if (buttons[1]) buttons[1].addEventListener("click", () => Note.deleteNote(id, uid));
               if (buttons[2] && getItemTypeLevel(type) != -1) buttons[2].addEventListener("click", () => Note.completedNote(id, uid));

               c++;
               if (c == result.notes.length) {
                  el.style.display = "flex";
                  $('#loader_notes').removeClass('d-block').addClass('d-none');
               }
            }
            if (result.notes.length > 4) el.classList.add("justify-content-center");
            else el.classList.remove("justify-content-center");
         }
      });
   }

   /* ================= ADD ================= */
   static addNote(noteData) {
      const userStats = User.getUserDetails();
      if (!userStats) return;

      noteData.uid = userStats.id;
      axios.post(`http://localhost:3000/notes/note/add`, noteData).then((response) => {
         if (response.data.success) Note.refreshNotesContainer();
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= DELETE ================= */
   static deleteNote(id, uid) {
      const userStats = User.getUserDetails();
      if (!userStats) return;
      if (userStats.id != uid) return;

      axios.post(`http://localhost:3000/notes/note/delete`, { id: id, uid: uid }).then((response) => {
         if (response.data.success) Note.refreshNotesContainer();
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= UPDATE ================= */
   static completedNote(id, uid) {
      const userStats = User.getUserDetails();
      if (!userStats) return;
      if (userStats.id != uid) return;

      const notePayload = {
         id: id,
         uid: uid,
         type: "completed",
         typeLevel: -1
      }
      axios.post(`http://localhost:3000/notes/note/completed`, notePayload).then((response) => {
         if (response.data.success) Note.refreshNotesContainer();
         sendNotification(response.data.message, (response.data.success) ? ('success') : ('error'), 7);
      }).catch(() => { });
   }

   /* ================= GET ================= */
   static getNotes() {
      const userStats = User.getUserDetails();
      if (!userStats) return;

      return new Promise((res, rej) => {
         axios.get(`http://localhost:3000/notes/note/get/all/${userStats.id}`).then((response) => {
            if (response.data.success) res(response.data);
         }).catch(() => { });
      })
   }

}
export { Note };
//========================================
function createNoteButtonElement(id, uid, type, title) {
   const button = document.createElement("button");
   button.classList.add("btn", "btn-outline-light", "position-relative", "border", "border-2", "my-3", "mx-4", "d-grid", "shadow", "rounded", "notes");

   let badgeType = null;
   if (type == "normal") button.classList.add("border-secondary"), badgeType = ['bg-secondary', 'Info:', '#info-fill'];
   else if (type == "informative") button.classList.add("border-primary"), badgeType = ['bg-primary', 'Info:', '#info-fill'];
   else if (type == "important") button.classList.add("border-warning"), badgeType = ['bg-warning', 'Warning:', '#exclamation-triangle-fill'];
   else if (type == "urgent") button.classList.add("border-danger"), badgeType = ['bg-danger', 'Info:', '#exclamation-triangle-fill'];
   else if (type == "completed") button.classList.add("border-success"), badgeType = ['bg-success', 'Success:', '#check-circle-fill'];

   button.setAttribute("data-bs-toggle", `modal`);
   button.setAttribute("data-bs-target", `#note_${id}_${uid}`);

   const img = document.createElement("img");
   img.classList.add("m-auto");
   img.alt = "add_note";
   img.width = 110;
   img.height = 110;
   img.src = "frontend/images/note.png";

   const span = document.createElement("span");
   span.classList.add("title");
   span.innerText = title;

   if (badgeType != null) {
      const badge = document.createElement("span");
      badge.classList.add("position-absolute", "top-0", "start-100", "translate-middle", "p-1", "border", "border-light", "badge", "rounded-circle", badgeType[0]);
      badge.innerHTML = `<svg class="bi flex-shrink-0" width="15" height="15" role="img" aria-label="${badgeType[1]}"><use xlink:href="${badgeType[2]}"/></svg><span class="visually-hidden">unread messages</span>`;
      button.appendChild(badge);
   }
   button.appendChild(img);
   button.appendChild(span);

   return button;
}
//---------------------------------------
function createNoteModalElement(id, uid, text, title, type, date) {
   const modal = document.createElement("div");
   const getVariantText = (type) => {
      let color = "text-secondary";
      if (type == "informative") color = "text-primary";
      else if (type == "important") color = "text-warning";
      else if (type == "urgent") color = "text-danger";
      else if (type == "completed") color = "text-success";
      return color;
   }

   const elementText = `<div class="modal fade" id="note_${id}_${uid}" tabindex="-1" aria-labelledby="modal_${id}_${uid}_label" aria-hidden="true">
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
            <div class="modal-body fs-6">${text.replaceAll("\n", "<br>")}</div>
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