
var chatInputContainer = document.querySelector('.im-chat-input.clear_fix.im-chat-input_classic._im_chat_input_parent'),
	chatInputField = chatInputContainer.querySelector('.im_editable.im-chat-input--text._im_text'),
	chatButtonsContainer = chatInputContainer.querySelector('.im_chat-input--buttons'),
	boxLayerOpngBtn = document.querySelector('.ms_item.ms_item_photo._type_photo'),
	boxLayerBg = document.getElementById('box_layer_bg'),
	boxLayerWrapper = document.getElementById('box_layer_wrap'),
	body = document.querySelector('body');


// chrome.runtime.sendMessage({action: "Clear storage"});
console.log(localStorage);

let p = new Promise((resolve, reject) => {
	chrome.runtime.sendMessage({action: "test"}, response => {resolve(response)});
});
p.then(result => console.log(result));

preparation();

var offeredPicsSelector = document.createElement('div'),
	selectorWrapper = document.createElement('div'),
	swiperLeft = document.createElement('div'),
	swiperRight = document.createElement('div'),
	closingButton = document.createElement('div'),
	sendingButton = document.createElement('img');

selectorWrapper.classList.add('selector-wrapper');	
selectorWrapper.style.opacity = 0;

offeredPicsSelector.classList.add('offered-pics-selector');

closingButton.classList.add('closing-button');

closingButton.addEventListener('click', setClosingAction);

swiperLeft.classList.add('swiper');
swiperRight.classList.add('swiper');
swiperLeft.classList.add('swiper-left');
swiperRight.classList.add('swiper-right');

swiperLeft.addEventListener('click', setOnSwipeLeftAction);
swiperRight.addEventListener('click', setOnSwipeRightAction);

sendingButton.classList.add('sending-button');
sendingButton.src = "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%23828A99%22%20d%3D%22M20.7%2019.3l-3.1-3.1c.9-1.2%201.4-2.6%201.4-4.2%200-3.9-3.1-7-7-7s-7%203.1-7%207%203.1%207%207%207c1.6%200%203-.5%204.2-1.4l3.1%203.1c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1%200-1.4zm-13.7-7.3c0-2.8%202.2-5%205-5s5%202.2%205%205-2.2%205-5%205-5-2.2-5-5z%22%2F%3E%3C%2Fsvg%3E"

chatInputContainer.appendChild(selectorWrapper);
selectorWrapper.appendChild(offeredPicsSelector);
selectorWrapper.appendChild(closingButton);

let emojiBtn = chatButtonsContainer.querySelector('.emoji_smile._emoji_btn');
emojiBtn.style.padding = "6px 10px 6px 3px";

chatInputField.style.paddingRight = "105px"; // увеличиваем отступ поля ввода на размер нашей кнопки

chatButtonsContainer.insertBefore(sendingButton, chatButtonsContainer.firstElementChild);

sendingButton.addEventListener('click', () => {
	sendingButton.style.animationName = "spin";
	setTimeout(() => sendingButton.style.animationName = "none", 750);
	renderSelector();
});

chatInputField.addEventListener('input', () => {
	if (selectorWrapper.style.display != "none") {
		setClosingAction();
	}
	setTimeout(clearSelector, 300);
});

function preparation() {
	boxLayerOpngBtn.addEventListener('mousedown', () => {
		if (!(boxLayerWrapper.style.opacity === 0)) {

			var boxLayerShowObs = new MutationObserver(() => {

				boxLayerShowObs.disconnect();

				albumOpngBtn = boxLayerWrapper.querySelector('div[id *= "_000"].photo_row.photos_album._photos_album');

				albumOpngBtn.addEventListener('mousedown', () => {

					let boxLayer = document.getElementById('box_layer'),
						picsContainerShowObs = new MutationObserver(() => {
							picsContainerShowObs.disconnect();
							setTimeout(runFormOpngBtnRendering, 1000);
						}); 
					picsContainerShowObs.observe(boxLayer, {childList: true})
				});
			});
			boxLayerShowObs.observe(boxLayerWrapper, {childList: true});
		}
	});
}

function runFormOpngBtnRendering() {
	var certainContainer = document.querySelector('div[id ^= "photos_choose_wrap"][id $= "_000"]');
	var picsContainer = certainContainer.querySelector('.photos_choose_rows');

	for (let i = 0; i < picsContainer.children.length; i++) {
		renderOpeningButton(picsContainer.children[i]);
	}
	var config = {childList: true},
		picsContainerObserver = new MutationObserver( function () {
			CntnrChildren = picsContainer.children;
			for (let i = CntnrChildren.length-2; CntnrChildren[i].lastElementChild.className != "form-opening-button" &&
				!('key-words-setup-form' == CntnrChildren[i].classList[0]); i--)
				renderOpeningButton(picsContainer.children[i]);
		});
		picsContainerObserver.observe(picsContainer, config);
}

function renderOpeningButton(element) {
	var formOpeningButton = document.createElement('div');

	formOpeningButton.classList.add('form-opening-button')

	formOpeningButton.addEventListener('click', evt => {
		evt.stopPropagation();
		evt.preventDefault();

		let existingForm = document.querySelector('.key-words-setup-form');
		if (existingForm) {
			existingForm.remove();
		}

		var urlStr = element.querySelector('.photo_row_img').style.backgroundImage,
			url = "";

		for (let i = 5; i < urlStr.length-2; i++)
			url += urlStr[i];

		var certainContainer = document.querySelector('div[id ^= "photos_choose_wrap"][id $= "_000"]');
		var picsContainer = certainContainer.querySelector('.photos_choose_rows');
		var keyWordsSetupForm = renderForm(url),
			i = childIndex(picsContainer.children, element.id);
	
		picsContainer.appendChild(keyWordsSetupForm);

		keyWordsSetupForm.style.top = (Math.floor(i / 4)*101 + 76) + "px"; // ряд * высота_фото + отступ_контейнера 
		keyWordsSetupForm.style.left = ((i % 4 + 1)*148 + 23) + "px"; // колонна * ширина_фото + отступ_контейнера

		let boxLayerWrap = document.getElementById("box_layer_wrap");
		boxLayerWrapper.addEventListener('click', evt => {
			evt.stopPropagation();
			let closingButton = document.querySelector('.form-closing-button');
			if (closingButton)
				closingButton.click();
		});

		showForm(keyWordsSetupForm);

		keyWordsSetupForm.querySelector('.key-word-input').focus();
	});

	formOpeningButton.addEventListener('mouseover', evt => {
		formOpeningButton.style.opacity = "0.9";
		evt.stopPropagation();
	});
	formOpeningButton.addEventListener('mouseout', evt => {
		formOpeningButton.style.opacity = '0.6';
		evt.stopPropagation();
	});

	element.appendChild(formOpeningButton);

	setOnHoverListener(element);
}

function setOnHoverListener(element) {
	var formOpeningButton = element.querySelector('.form-opening-button');
	element.addEventListener('mouseover', function() {
		formOpeningButton.style.opacity = "0.6";
	});
	element.addEventListener('mouseout', function() {
		formOpeningButton.style.opacity = "0";
	});
}

function renderForm(url) {
	var keyUrl = url.slice(url.lastIndexOf("/")+1, -4);


	var keyWordsSetupForm = document.createElement('form'); //form

	keyWordsSetupForm.classList.add('key-words-setup-form');

	keyWordsSetupForm.addEventListener('click', evt => {
		evt.stopPropagation();
		evt.preventDefault();
	});

	keyWordsSetupForm.addEventListener('keypress', evt => {
		if (evt.keyCode == 27) { 	//нажат escape
			evt.stopPropagation();	// не работает, спроси у Жемчуга при возможности
			keyWordsSetupForm.style.opacity = 0;
			setTimeout(() => keyWordsSetupForm.remove(), 300);
		}
	});

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

	keyWordInput.addEventListener('keypress', evt => {
		if (evt.keyCode == 13) {	// нажат enter
			evt.preventDefault();
			submitBtn1.click();
		}
	});

	keyWordsSetupForm.appendChild(keyWordInput);

	var submitBtn1 = createFormButton( //submit btn 1
		'btn key-word-submit',
		"Добавить ключевое слово",
	);

	submitBtn1.addEventListener('click', () => {
		let keyWord = keyWordInput.value.toLowerCase();
		chrome.runtime.sendMessage({action: "Add new key word", newKeyWord: keyWord, currentUrl: url, currentKeyUrl: keyUrl});
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

		popup.addEventListener('click', evt => evt.stopPropagation());

		let request = new Promise((resolve, reject) => {
			chrome.runtime.sendMessage({action: "Give info about the img", key: keyUrl}, response => {
				resolve(response);
			});
		});
		
		request.then(info => {
			if(info.isIn && info.keyWordsIsIn) {
				if (popup.firstElementChild.textContent === "Вы еще не добавили ни одного ключевого слова" &&
					info.keyWords.length != 0) {
					popup.firstElementChild.remove();
				}
				let keyWords = info.keyWords,
					renderedKeyWords = [];
					
				for (let i = 0; i < popup.childElementCount; i++) {
					renderedKeyWords.push(popup.children[i].textContent);
				}
				for (let i = 0; i < keyWords.length; i++) {
					if (renderedKeyWords.indexOf(keyWords[i]) == -1) {
						let p = document.createElement('p'),
							inlineClosingBtn = document.createElement('span'); //! не работает

						inlineClosingBtn.classList.add('inline-closing-btn');

						inlineClosingBtn.addEventListener('click', evt => {
							let request1 = new Promise((resolve, reject) => {
								chrome.runtime.sendMessage({action: "Give urls accrd. to key word", keyWord: p.textContent}, response =>{
									resolve(response);
								});
							});

							// keyWords.splice(keyWords.indexOf(p.textContent), 1);
							
							request1.then(keyWordsUrls => {
								keyWordsUrls.splice(keyWordsUrls.indexOf(url), 1);

								chrome.runtime.sendMessage({action: "Update urls", keyWord: p.textContent, newUrls: keyWordsUrls});

								let newUrlData = {keyWords: keyWordsUrls, id: info.id}

								chrome.runtime.sendMessage({action: "Update url data", key: keyUrl, newData: newUrlData});

								if (popup.childElementCount == 1) {
									p.classList.add('title');
									p.textContent = "Вы еще не добавили ни одного ключевого слова";
								} else
									p.remove();

								evt.stopPropagation();
							});
						});
						p.textContent = keyWords[i];

						p.appendChild(inlineClosingBtn);

						popup.appendChild(p);
					}
				}
			}
		});
		
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

	idPhraseInput.addEventListener("keypress", evt => {
		if (evt.keyCode == 13) { // нажат enter
			evt.preventDefault();
			submitBtn2.click();
		}
	});

	keyWordsSetupForm.appendChild(idPhraseInput);

	var submitBtn2 = createFormButton( // submit btn 2
		"btn id-phrase-submit",
		"Изменить id"
	);

	submitBtn2.addEventListener('click', () => {
		let id = idPhraseInput.value.toLowerCase();

		chrome.runtime.sendMessage({action: "Add new ID", newId: id, currentUrl: url, currentKeyUrl: keyUrl})

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

		let request = new Promise((resolve, reject) => {
			chrome.runtime.sendMessage({action: "Give info about the img", key: keyUrl}, response => {
				resolve(response);
			});
		});
		
		request.then(info => {
			if(info.isIn && info.idIsIn && info.id != popup.firstElementChild.textContent) { // если об этом url'е сделана запись И 
				popup.lastElementChild.remove();								// в ней есть id  И этот id не совпадает с загруженным
				let id = info.id;
				let p = document.createElement('p'),
					inlineClosingBtn = document.createElement('span');

				inlineClosingBtn.classList.add('inline-closing-btn');
				inlineClosingBtn.classList.add('icon-cross');

				inlineClosingBtn.addEventListener('click', evt => {
					chrome.runtime.sendMessage({action: "Delete ID", id: p.textContent});

					let newUrlData = {keyWords: info.keyWords, id: ""};

					chrome.runtime.sendMessage({action: "Update url data", key: keyUrl, newData: newUrlData});

					p.classList.add('title');
					p.textContent = "Вы еще не добавили id";

					evt.stopPropagation();
				});

				p.textContent = id;

				p.appendChild(inlineClosingBtn);

				popup.appendChild(p);
			}
		});
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

function showForm(form) {
	form.style.display = "flex";
	setTimeout(() => form.style.opacity = 1);
}

function hideForm(form) {
	form.style.opacity = 0;
	setTimeout(() => form.style.display = "none", 300)
}

function setClosingAction() {	
	selectorWrapper.style.opacity = 0;
	setTimeout(function() {
		selectorWrapper.style.display = "none";
	}, 300);
}

function setOnSwipeLeftAction() {
	let imgList = offeredPicsSelector.children
	let request = new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({action: "Give urls accrd. to key word", keyWord: chatInputField.textContent}, response => {
			resolve(response);
		});
	});
	request.then(currentKeyWord => {
		if (currentKeyWord[0] === imgList[0].src) {
			if (imgList[0].style.transitionProperty != "all")
				for (let i = 0; i < 3; i++)
					imgList[i].style.transition = "all 150ms";
			for(let i = 0; i < 3; i++) {
				imgList[i].style.transform = "translate(16px)";
				setTimeout(function() { imgList[i].style.transform = "translate(0)"; } , 150);
			}
		} else {
			var shiftLength = imgList[0].width + 32;
			for(let i = 0; i < 3; i++) {
				var currentImage = imgList[i];

				currentImage.style.transition = 'all 150ms';
				currentImage.style.transform = 'translate(' + shiftLength + 'px' + ')';
				
				setTimeout( function(i) {
					var currentImage = imgList[i];

					currentImage.number -= 1;
					currentImage.src = currentKeyWord[currentImage.number];
					currentImage.style.transition = 'width 100ms';
					currentImage.style.transform = 'translate(0)';	
				} , 150, i);
			}	
		}
	});	
}

function setOnSwipeRightAction() {
	let imgList = offeredPicsSelector.children;
	let request = new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({action: "Give urls accrd. to key word", keyWord: chatInputField.textContent}, response => {
			resolve(response);
		});
	});
	request.then(currentKeyWord => {
		if (currentKeyWord[currentKeyWord.length-1] === imgList[imgList.length-1].src) {
			if (imgList[0].style.transitionProperty != "all")
				for (let i = 0; i < 3; i++)
					imgList[i].style.transition = "all 150ms";
			for(let i = 0; i < 3; i++) {
				imgList[i].style.transform = "translate(-16px)";
				setTimeout(function() { imgList[i].style.transform = "translate(0)"; } , 150);
			}
		} else {
			var shiftLength = imgList[0].width + 32;
			for(let i = 0; i < 3; i++) {
				var currentImage = imgList[i];

				currentImage.style.transition = 'all 150ms';
				currentImage.style.transform = 'translate(' + -shiftLength + 'px' + ')';
				
				setTimeout( function(i) {
					var currentImage = imgList[i];

					currentImage.number += 1;
					currentImage.src = currentKeyWord[currentImage.number];
					currentImage.style.transition = 'width 100ms';
					currentImage.style.transform = 'translate(0)';	
				} , 150, i);
			}
		}
	});	
}

function renderSelector() {
	let request = new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({action:"Give urls accrd. to key word", keyWord: chatInputField.textContent.toLowerCase()}, response => {
			resolve(response);
		});
	});
	request.then(urlList => {
		if (urlList) {
			selectorWrapper.style.display = "block";
			setTimeout(() => selectorWrapper.style.opacity = 1);
			if (offeredPicsSelector.children.length == 0) {
				if (typeof urlList != typeof [])
					urlList = [urlList]
				// var value = localStorage.getItem(chatInputField.textContent),
				// 	urlList = value[0] == "[" ? JSON.parse(value) : [value];

				if (urlList.length > 3) {
					selectorWrapper.appendChild(swiperLeft); //добаляем свайперы, если они нужны
					selectorWrapper.appendChild(swiperRight);
				} else if (selectorWrapper.childElementCount > 2) {
					swiperLeft.remove();	// иначе убираем их, если они уже были добваленны
					swiperRight.remove();
				}

				for (let i = 0;i < urlList.length && i < 3; i++) {
					var newOption = document.createElement('img');

					newOption.classList.add('found-option');
					newOption.src = urlList[i];
					newOption.number = i;

					prepareToAttachment(newOption);
				
					offeredPicsSelector.appendChild(newOption);	
				}
			}
		}	
	});
	
}

function prepareToAttachment(element) {
	element.addEventListener('click', function() {
		setClosingAction();
		openAttachmentPopup(element);
	});
}

function openAttachmentPopup(element) {
	var obs = new MutationObserver(() => {

		obs.disconnect();
		boxLayerBg.style.opacity = 0;
		boxLayerWrapper.style.opacity = 0;

		var albumOpngBtn = boxLayerWrapper.querySelector('div[id *= "_000"].photo_row.photos_album._photos_album');

		var picsCntnrRenderObs = new MutationObserver(() => {
			picsCntnrRenderObs.disconnect();

			setTimeout(() => {
				var certainContainer = document.querySelector('div[id ^= "photos_choose_wrap"][id $= "_000"]');
				var picsContainer = certainContainer.querySelector('.photos_choose_rows');

				var scrollObs = new MutationObserver(() => {
					boxLayerWrapper.scrollTo(0, boxLayerWrapper.scrollHeight);
					if (!attachImg(element)) { //если картинак прикрепилась, то завершает работу
						scrollObs.disconnect();

						boxLayerBg.style.opacity = 0.7;
						boxLayerWrapper.style.opacity = 1;
					}
				});
				scrollObs.observe(picsContainer, {childList: true});

				boxLayerWrapper.scrollTo(0, boxLayerWrapper.scrollHeight); // триггер для scrollObs
			}, 300);
		});
		picsCntnrRenderObs.observe(document.getElementById('box_layer'), {childList: true}); 

		albumOpngBtn.firstElementChild.click();
	});
	obs.observe(boxLayerWrapper, {childList: true});

	boxLayerOpngBtn.click();
	let chatSideBar = document.querySelector('.chat_onl_inner');
	chatSideBar.style.backgroundColor = "#dae1e8";
	let chatDecorativeGradient = chatSideBar.querySelector('.chat_cont_sh_bottom');
	chatDecorativeGradient.style.background = "linear-gradient(180deg, rgba(216,223,230,0), #d8dfe6 80%)";
}



function attachImg(element) {
	var certainContainer = document.querySelector('div[id ^= "photos_choose_wrap"][id $= "_000"]');
	var picsContainer = certainContainer.querySelector('.photos_choose_rows');
	var	pics = picsContainer.children;

	var picKeySrc = element.src.slice(element.src.indexOf('.com')+4); // часть url для сравнения

	for (let i = 0; i < pics.length-1; i++) {
		var currentPicScr = pics[i].firstElementChild.style.backgroundImage;
		var currentKeyPicScr = currentPicScr.slice(currentPicScr.indexOf('.com')+4, -2);  // часть url для сравнения

		if (picKeySrc == currentKeyPicScr) {
			pics[i].click();
			chatInputField.textContent = "";
			chatInputField.focus();
			let chatSideBar = document.querySelector('.chat_onl_inner');
			chatSideBar.style.backgroundColor = "";
			let chatDecorativeGradient = chatSideBar.querySelector('.chat_cont_sh_bottom');
			chatDecorativeGradient.style.background = "";
			return 0;
		} 
	}
	return -1;
}

function clearSelector() {
	let length = offeredPicsSelector.childElementCount;
	for (let i = 0; i < length; i++) {
		offeredPicsSelector.firstElementChild.remove();
	}
}

function childIndex(collection, id) {
	for (let i = 0; i < collection.length; i++)
		if (collection[i].id === id)
			return i;
	return null;
}