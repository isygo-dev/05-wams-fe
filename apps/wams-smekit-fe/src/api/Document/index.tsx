// import {convertToRaw} from "draft-js";
//
// const handleSave = async () => {
//   const content = convertToRaw(editorState.getCurrentContent());
//   const htmlContent = stateToHTML(content);
//
//   try {
//     const response = await fetch(`/api/documents/${documentId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ content: htmlContent }),
//     });
//   } catch (error) {
//     console.error('Erreur lors de la sauvegarde:', error);
//   }
// };
