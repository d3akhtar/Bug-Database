// Add event listener to accordion titles
document.querySelectorAll('.accordion-title').forEach(item => {
    item.addEventListener('click', () => {
        const accordionItem = item.parentElement;
        accordionItem.classList.toggle('active');
    });
});
