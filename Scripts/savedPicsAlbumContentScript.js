var picsContainer = document.getElementById('photos_container_photos'),
	picsContainerWrapper = document.querySelector('.photos_container_grid');
console.log("debug");

if (picsContainer) {
	localStorage.clear();

	for (let i = 0; i < picsContainer.children.length; i++) {
		renderOpeningButton(picsContainer.children[i]);
	}
	var config = {childList: true},
		picsContainerObserver = new MutationObserver( function () {
			CntnrChildren = picsContainer.children;
			for (let i = CntnrChildren.length-1; CntnrChildren[i].lastElementChild.tagName == "A"; i--)
				renderOpeningButton(picsContainer.children[i]);
		});
		picsContainerObserver.observe(picsContainer, config);
} else
	alert("Ошибка прогрузки пользовательского интерфейса. Пожалуйста, перезагрузите страницу.")


function renderOpeningButton(element) {
	var formOpeningButton = document.createElement('div');

	formOpeningButton.classList.add('form-opening-button')

	element.appendChild(formOpeningButton);

	formOpeningButton.addEventListener('click', function() {
		var urlStr = element.style.backgroundImage,
			url = "";

		for (let i = 5; i < urlStr.length-2; i++)
			url += urlStr[i];

		if (picsContainerWrapper.querySelector('.key-words-setup-form')) {
			let form = picsContainerWrapper.querySelector('.key-words-setup-form');
			form.style.opacity = 0;
			setTimeout(() => 
				form.remove(), 
			300);
		}

		var keyWordsSetupForm = renderForm(url),
			i = childIndex(picsContainer.children, element.dataset.id);

		picsContainerWrapper.appendChild(keyWordsSetupForm);

		keyWordsSetupForm.style.top = (Math.floor(i / 4)*132 + 140) + "px";
		if ((i+1) % 4 == 0)
			keyWordsSetupForm.style.left = ((i % 4 - 1)*190 - 30) + "px";
		else
			keyWordsSetupForm.style.left = ((i % 4 + 1)*190 + 17) + "px";
		keyWordsSetupForm.style.opacity = 1;
	});

	setOnHoverListener(element);
}


function setOnHoverListener(element) {
	var formOpeningButton = element.querySelector('.form-opening-button');
	element.addEventListener('mouseover', function() {
		formOpeningButton.style.opacity = "0.7";
	});
	element.addEventListener('mouseout', function() {
		formOpeningButton.style.opacity = "0";
	});
}

function renderForm(url) {
	var keyUrl = url.slice(url.lastIndexOf("/")+1, -4);

	var keyWordsSetupForm = document.createElement('form'); //form

	keyWordsSetupForm.classList.add('key-words-setup-form');

	var formClosingButton = document.createElement('div');	//closing button

	formClosingButton.classList.add('form-closing-button');

	formClosingButton.addEventListener('click', function() {
		keyWordsSetupForm.style.opacity = 0;
		setTimeout(function() {
			keyWordsSetupForm.remove();
		}, 300);
	});
	keyWordsSetupForm.appendChild(formClosingButton);

	var label1 = createLabel(	//label 1
			"key-word-input",
			"Введите новое ключевое слово",
			'prompt',
			'popup p',
			"В чате по введенному вами ключевому слову будут отображаться нужные сохраненные картинки"
		),
		prompt1 = label1.querySelector('.prompt');

	prompt1.addEventListener('click', function() {
		prompt1.lastElementChild.style.display = "block";
		prompt1.lastElementChild.style.opacity = 1;
	})

	prompt1.addEventListener('mouseout', function() {
		prompt1.lastElementChild.style.opacity = 0;
		setTimeout(function() {prompt1.lastElementChild.style.display = "none";}, 100);
	})

	keyWordsSetupForm.appendChild(label1);

	var keyWordInput = document.createElement('input'); // input 1

	keyWordInput.classList.add('input');
	keyWordInput.classList.add('key-word-input');
	keyWordInput.type = "text";
	keyWordInput.id = "key-word-input";
	keyWordInput.placeholder = "Например, \"Здарова\"";
	keyWordsSetupForm.appendChild(keyWordInput);

	var submitBtn1 = createFormButton( //submit btn 1
		'btn key-word-submit',
		"Добавить ключевое слово",
	);

	submitBtn1.addEventListener('click', () => {
		let keyWord = keyWordInput.value.toLowerCase();

		if (keyWord != "") {
			if (localStorage.getItem(keyUrl)) {
				let thisUrlData = JSON.parse(localStorage.getItem(keyUrl));
				if (thisUrlData.keyWords.indexOf(keyWord) == -1) {
					thisUrlData.keyWords.push(keyWord);

					localStorage.removeItem(keyUrl);
					localStorage.setItem(keyUrl, JSON.stringify(thisUrlData));
				}
			} else
				localStorage.setItem(keyUrl, JSON.stringify({"keyWords": [keyWord], id: ""}));

			if (localStorage.getItem(keyWord)) {
				let keyWordsUrls = JSON.parse(localStorage.getItem(keyWord));
				if (keyWordsUrls.indexOf(url) == -1) {
					keyWordsUrls.push(url);

					localStorage.removeItem(keyWord);
					localStorage.setItem(keyWord, JSON.stringify(keyWordsUrls));
				}
			} else
				localStorage.setItem(keyWord, JSON.stringify([url]));
		}	
		keyWordInput.value = "";
	});

	keyWordsSetupForm.appendChild(submitBtn1);

	var showInfoBtn1 = createFormButton( //showinfo btn 1
		'btn show-info',
		"Показать тукущие ключевые слова",
		"popup",
		"Вы еще не добавили ни одного ключевого слова"
	)

	showInfoBtn1.addEventListener('click', function() {
		let popup = showInfoBtn1.querySelector('.popup');

		if(localStorage.getItem(keyUrl)) {
			if (popup.firstElementChild.textContent === "Вы еще не добавили ни одного ключевого слова" &&
				JSON.parse(localStorage.getItem(keyUrl)).keyWords.length != 0) {
				popup.firstElementChild.remove();
			}
			let keyWords = JSON.parse(localStorage.getItem(keyUrl)).keyWords,
				renderedKeyWords = [];
				
			for (let i = 0; i < popup.childElementCount; i++) {
				renderedKeyWords.push(popup.children[i].textContent);
			}
			for (let i = 0; i < keyWords.length; i++) {
				if (renderedKeyWords.indexOf(keyWords[i]) == -1) {
					let p = document.createElement('p'),
						inlineClosingBtn = document.createElement('span');

					inlineClosingBtn.classList.add('inline-closing-btn');
					inlineClosingBtn.classList.add('icon-cross');

					inlineClosingBtn.addEventListener('click', evt => {
						let keyWordsUrls = JSON.parse(localStorage.getItem(p.textContent));

						keyWordsUrls.splice(keyWordsUrls.indexOf(url), 1);

						localStorage.removeItem(p.textContent);
						localStorage.setItem(p.textContent, JSON.stringify(keyWordsUrls));

						let thisUrlData = JSON.parse(localStorage.getItem(keyUrl));

						thisUrlData.keyWords.splice(thisUrlData.keyWords.indexOf(p.textContent), 1);

						localStorage.removeItem(keyUrl);
						localStorage.setItem(keyUrl, JSON.stringify(thisUrlData));

						if (popup.childElementCount == 1) {
							p.classList.add('title');
							p.textContent = "Вы еще не добавили ни одного ключевого слова";
						} else
							p.remove();

						evt.stopPropagation();
					});
					p.textContent = keyWords[i];

					p.appendChild(inlineClosingBtn);

					popup.appendChild(p);
				}
			}
		}

		showInfoBtn1.lastElementChild.style.display = "block";
		showInfoBtn1.lastElementChild.style.opacity = 1;
	})

	showInfoBtn1.lastElementChild.addEventListener('mouseleave', function() {
		showInfoBtn1.lastElementChild.style.opacity = 0;
		setTimeout(function() {showInfoBtn1.lastElementChild.style.display = "none";}, 100);
	})

	keyWordsSetupForm.appendChild(showInfoBtn1);

	var label2 = createLabel( //label 2
			"id-phrase-input",
			"Введите id фразу",
			'prompt',
			'popup p',
			"То же самое, что и ключевое слово, но для одной каритки можно указать только один id"
		),
		prompt2 = label2.querySelector('.prompt');

	prompt2.addEventListener('click', function() {
		prompt2.lastElementChild.style.display = "block";
		prompt2.lastElementChild.style.opacity = 1;
	})

	prompt2.addEventListener('mouseout', function() {
		prompt2.lastElementChild.style.opacity = 0;
		setTimeout(function() {prompt2.lastElementChild.style.display = "none";}, 100);
	})
	
	keyWordsSetupForm.appendChild(label2);

	var idPhraseInput = document.createElement('textarea'); // input 2

	idPhraseInput.classList.add('input');
	idPhraseInput.classList.add('id-phrase-input');
	idPhraseInput.id = "id-phrase-input";
	idPhraseInput.cols = 30;
	idPhraseInput.rows = 2;
	idPhraseInput.placeholder = "Например, \"несквик с пивом\"";
	keyWordsSetupForm.appendChild(idPhraseInput);

	var submitBtn2 = createFormButton( // submit btn 2
		"btn id-phrase-submit",
		"Изменить id"
	);

	submitBtn2.addEventListener('click', () => {
		let id = idPhraseInput.value;

		if(localStorage.getItem(keyUrl)) {
			let thisUrlData = JSON.parse(localStorage.getItem(keyUrl));

			localStorage.removeItem(thisUrlData.id);
			localStorage.setItem(id, url);

			thisUrlData.id = id;
			localStorage.removeItem(keyUrl);
			localStorage.setItem(keyUrl, JSON.stringify(thisUrlData));

		} else {
			localStorage.setItem(keyUrl, JSON.stringify({"keyWords" : [], "id" : id}));

			localStorage.setItem(id, url);
		}
		idPhraseInput.value = "";
	});

	keyWordsSetupForm.appendChild(submitBtn2);

	var showInfoBtn2 = createFormButton( //show info btn 2
		"btn show-info",
		"Показать текущий id",
		"popup",
		"Вы еще не добавили id"
	);

	showInfoBtn2.addEventListener('click', () => {
		let popup = showInfoBtn2.querySelector('.popup');

		if (localStorage.getItem(keyUrl)){
			if (popup.firstElementChild.textContent != JSON.parse(localStorage.getItem(keyUrl)).id
				&& JSON.parse(localStorage.getItem(keyUrl)).id) {

				popup.lastElementChild.remove();
				let p = document.createElement('p'),
					inlineClosingBtn = document.createElement('span');

				inlineClosingBtn.classList.add('inline-closing-btn');
				inlineClosingBtn.classList.add('icon-cross');

				inlineClosingBtn.addEventListener('click', evt => {
					p.classList.add('title');
					p.textContent = "Вы еще не добавили id";

					let thisUrlData = JSON.parse(localStorage.getItem(keyUrl));

					localStorage.removeItem(thisUrlData.id);

					thisUrlData.id = "";
					localStorage.removeItem(keyUrl);
					localStorage.setItem(keyUrl, JSON.stringify(thisUrlData));

					evt.stopPropagation();
				});
				p.textContent = JSON.parse(localStorage.getItem(keyUrl)).id;

				p.appendChild(inlineClosingBtn);

				popup.appendChild(p);
			}
		}
		popup.style.display = "block";
		popup.style.opacity = 1;
	});

	showInfoBtn2.lastElementChild.addEventListener('mouseleave', function() {
		showInfoBtn2.lastElementChild.style.opacity = 0;
		setTimeout(function() {showInfoBtn2.lastElementChild.style.display = "none";}, 100);
	});

	keyWordsSetupForm.appendChild(showInfoBtn2);

	return keyWordsSetupForm;
}

function createLabel(labelId, labelText, promptClass, popupClasses, popupText) {
	var label = document.createElement('label'),
		prompt = document.createElement('div'),
		popupPrompt = document.createElement('div');

	popupPrompt.className = popupClasses;
	popupPrompt.textContent = popupText;

	prompt.classList.add(promptClass);
	prompt.textContent = "?"
	prompt.appendChild(popupPrompt);

	// label.htmlFor = labelId;
	label.textContent = labelText;
	label.appendChild(prompt);

	return label;
}

function createFormButton(btnClasses, btnText, popupClasses, popupText) {
	var button = document.createElement('div');

	button.className = btnClasses;

	button.textContent = btnText;

	if (popupClasses && popupText){
		var popup = document.createElement('div'),
			p = document.createElement('p');
		popup.className = popupClasses;
		p.textContent = popupText;
		p.className = "title";
		popup.appendChild(p);
		button.appendChild(popup);
	}
	return button;
}

function childIndex(collection, id) {
	for (let i = 0; i < collection.length; i++)
		if (collection[i].dataset.id === id)
			return i;
	return null;
}

function translateToLatin(str) {
	var newStr = "";

	for (let i = 0; i < str.length; i++)
		newStr += String.fromCharCode(str[i].charCodeAt()-975);

	return newStr;
}

function translateToCirilic(str) {
	var newStr = "";

	for (let i = 0; i < newStr.length; i++) 
		newStr += String.fromCharCode(str[i].charCodeAt()+975);

	return newStr;
}
