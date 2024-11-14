import optionsStorage from "./options-storage.js";

console.log("Content script loaded for", chrome.runtime.getManifest().name);

async function pruneTheMorons() {
	console.log("Pruning...");
	const options = await optionsStorage.getAll();

	let isMoron = false;
	const morons = options.trollList.split(",");

	console.log("Troll List: " + morons);

	const linkreg =
		'<a class="link-text" data-bind="attr: { href: url }, text: title, click: function.*a>';
	// get all the thread containers
	const threadHeadContAll = document.getElementsByClassName(
		"thread-header row thread-underline",
	);

	console.log("Thread Head Containers: " + threadHeadContAll.length);

	const moronTitle = options.threadTitle.toString();
	const moronContent = options.messageContent.toString();
	const moronThreadLink =
		'<a href="https://ntforum.net/">' + moronTitle + "</a>";

	console.log("Moron Title: " + moronTitle);
	console.log("Moron Content: " + moronContent);
	console.log("Moron Thread Link: " + moronThreadLink);

	for (let n = 0; n < threadHeadContAll.length; n++) {
		let divcontent = threadHeadContAll[n].innerHTML;

		console.log("Thread Head Container: " + n);

		for (let i = 0; i < morons.length; i++) {
			console.log("Moron?: " + morons[i]);
			if (divcontent.includes(morons[i])) {
				isMoron = true;
			}
		}

		if (isMoron) {
			console.log("There is a moron to deal with");

			// find and replace link text and url
			let origlink = divcontent.match(linkreg);
			console.log(origlink);
			divcontent = divcontent.replace(origlink, moronThreadLink);

			threadHeadContAll[n].innerHTML = divcontent;
			isMoron = false;
		}
	}
}

async function replaceThePostText() {
	console.log("Replacing...");
	const options = await optionsStorage.getAll();
	const morons = options.trollList.split(",");
	const moronContent = options.messageContent.toString();

	console.log("Troll List: " + morons);

	// Post contents
	const postAuthAll = document.getElementsByClassName("post-author");
	let postAuthor = postAuthAll[0].innerHTML;
	let isMoron = false;
	for (let i = 0; i < morons.length; i++) {
		if (
			postAuthor.includes(">" + morons[i] + "<") ||
			postAuthor.includes("mailto:" + morons[i])
		) {
			console.log("Moron found: " + morons[i]);
			isMoron = true;
		}
	}
	const postMsgAll = document.getElementsByClassName("post-message");
	if (isMoron) {
		postMsgAll[0].innerHTML = moronContent;
	}
}

function logSomething() {
	console.log("hello " + document.readyState);

	var threadHeadContAll = document.getElementsByClassName(
		"thread-header row thread-underline",
	);

	console.log("THC: " + threadHeadContAll.length);

	if (threadHeadContAll.length == 0) {
		setTimeout(logSomething, 100);
	} else {
		pruneTheMorons();
	}
}

// 100ms after the page loads call the function logSomething
setTimeout(logSomething, 100);

// On click of the thread title, replace the post text if the author is a moron
document.addEventListener("click", function (e) {
	if (e?.target?.className == "link-text") {
		// call the async function replaceThePostText
		replaceThePostText();
	} else {
		console.log("Not a link-text");
		console.log(e?.target);
	}
});
