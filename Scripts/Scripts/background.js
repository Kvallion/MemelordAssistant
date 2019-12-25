chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "Add new key word") 
    	addNewKeyWord(request);
    else if (request.action == "Add new ID")
    	setId(request);
    else if (request.action == "Give info about the img")
    	sendResponse(giveInfo(request));
    else if (request.action == "Give urls accrd. to key word")
    	sendResponse(giveUrls(request));
    else if (request.action == "Update urls")
    	updateUrls(request);
    else if (request.action == "Delete ID")
    	localStorage.removeItem(request.id);
    else if (request.action == "Update url data")
    	updateUrlData(request);
    else if (request.action == "test")
    	sendResponse(chrome.extension.getBackgroundPage().localStorage);
    else if (request.action == "Clear storage")
    	localStorage.clear();
  });

function addNewKeyWord(request) {
	let keyWord = request.newKeyWord;
	let keyUrl = request.currentKeyUrl;
	let url = request.currentUrl;
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
}

function setId(request) {
	if (request.newId != "") {
		if(localStorage.getItem(request.currentKeyUrl)) {
			let thisUrlData = JSON.parse(localStorage.getItem(request.currentKeyUrl));

			if (thisUrlData.id != "") 
				localStorage.removeItem(thisUrlData.id);

			localStorage.setItem(request.newId, request.currentUrl);

			thisUrlData.id = request.newId;
			localStorage.removeItem(request.currentKeyUrl);
			localStorage.setItem(request.currentKeyUrl, JSON.stringify(thisUrlData));
		} else {
			localStorage.setItem(request.currentKeyUrl, JSON.stringify({"keyWords" : [], "id" : request.newId}));
			localStorage.setItem(request.newId, request.currentUrl);
		}
	}
}

function giveInfo(request) {
	if (localStorage.getItem(request.key)) {
		var respond = JSON.parse(localStorage.getItem(request.key));
		respond.isIn = true
		if (respond.keyWords.length != 0)
			respond.keyWordsIsIn = true;
		else
			respond.keyWordsIsIn = false;
		if (respond.id)
			respond.idIsIn = true
		else
			respond.idIsIn = false
	} else {
		var respond = {isIn: false, keyWordsIsIn: false, idIsIn: false};
	}
	return respond;
}

function giveUrls(request) {
	if (localStorage.getItem(request.keyWord))
		return localStorage.getItem(request.keyWord)[0] == "["? JSON.parse(localStorage.getItem(request.keyWord)) : [localStorage.getItem(request.keyWord)];; 
	return false
}

function updateUrls(request) {
	localStorage.removeItem(request.keyWord);
	if (request.newUrls.length != 0)
		localStorage.setItem(request.keyWord, JSON.stringify(request.newUrls));
}

function updateUrlData(request) {
	if (localStorage.getItem(request.key)) {
		localStorage.removeItem(request.key);
		localStorage.setItem(request.key, JSON.stringify(request.newData));
	}
}