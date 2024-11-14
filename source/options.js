// eslint-disable-next-line import/no-unassigned-import
import "webext-base-css";
import "./options.css";
import optionsStorage from "./options-storage.js";

const trollList = document.getElementById("trollList");
const threadTitle = document.getElementById("threadTitle");
const messageContent = document.getElementById("messageContent");

async function init() {
	await optionsStorage.syncForm("#options-form");
}

init();
