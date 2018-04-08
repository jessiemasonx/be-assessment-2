// maakt een functie zodat je dat document.blabla niet hoeft te typen
function select(element) {
	return document.querySelector(element);
}

select("#infoknop > img").addEventListener("click", function () {
	select("#popup").classList.toggle("visible");
});

select("#ok").addEventListener("click", function () {
	select("#popup").classList.toggle("visible");
});
