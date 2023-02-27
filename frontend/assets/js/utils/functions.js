//========================================
export function delayReload(seconds = 1) {
   setTimeout(() => window.location.reload(), seconds * 1000);
}
//========================================
export function sendNotification(text, type, seconds = 10) {
   $.notify(text, { className: type, autoHideDelay: seconds * 1000, position: 'top right', showDuration: 500, });
}
//========================================
export function formatDate(date) {
   return new Date(date).toLocaleDateString('en-GB', { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
//========================================
export function getItemTypeLevel(type) {
   let typeLevel = 0;
   if (type == "informative") typeLevel = 1;
   else if (type == "important") typeLevel = 2;
   else if (type == "urgent") typeLevel = 3;
   else if (type == "completed") typeLevel = -1;
   return typeLevel;
}
