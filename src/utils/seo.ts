export const setPageTitle = (pageName: string) => {
  document.title = `SFOACC | ${pageName}`;

  // Set constant description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement("meta");
    metaDescription.setAttribute("name", "description");
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute(
    "content",
    "A Chuch Management Platform for St. Francis of Assisi Catholic Church"
  );
};
