"use strict";
let menuElements = document.querySelectorAll(".main-menu-wrap");
for (let i = 0; i < menuElements.length; i++) {
	menuElements[i].addEventListener('click', () => {
		if (menuElements[i].classList[menuElements.length - 1] == 'active')
			menuElements[i].classList.remove('active');
		else
			menuElements[i].classList.add('active');
	});
}