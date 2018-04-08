// maakt een functie zodat je dat document.blabla niet hoeft te typen
function select(element) {
	return document.querySelector(element);
}

select("#hamburger").addEventListener("click", function () {
	select("#nav").classList.toggle("visible");
});
