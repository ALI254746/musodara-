// // lib/submitAriza.js
//rasimsiz malumot jo'natilssa
// export async function submitAriza(values) {
//   const formData = new FormData();
//   for (const key in values) {
//     formData.append(key, values[key]);
//   }

//   const response = await fetch("/api/ariza", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json", // MUHIM
//     },
//     body: JSON.stringify(values), // JSON formatda yuboramiz
//   });

//   return response;
// }
//rasim bilan jo'natilsa
// lib/submitAriza.js

export default async function submitAriza(values) {
  const formData = new FormData();

  for (const key in values) {
    formData.append(key, values[key]); // rasim ham shu yerda bo'ladi
  }

  const response = await fetch("/api/ariza", {
    method: "POST",
    body: formData, // JSON emas endi!
  });

  return response;
}
