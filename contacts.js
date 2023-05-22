const path = require("path");
const fs = require("fs").promises;
const {v4: uuidv4} = require("uuid");

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
	try {
		const data = await fs.readFile(contactsPath);
		return JSON.parse(data.toString());
	} catch (err) {
		err => console.error(err.message);
	}
}

async function getContactById(contactId) {
	try {
		const data = await listContacts();

		const matchedContact = data.find(contact => contact.id === contactId);
		if (!matchedContact) return console.error(`Contact with id: "${contactId}" was not found!`);

		return console.table(matchedContact);
	} catch (err) {
		err => console.error(err.message);
	}
}

async function addContact(name, email, phone) {
	try {
		const data = await listContacts();

		const matchedName = data.find(contact => contact.name === name);
		if (matchedName) return console.error(`Contact with name: "${name}" is exist!`);

		const newContact = {id: uuidv4(), name, email, phone};
		await fs.writeFile(contactsPath, JSON.stringify([...data, newContact]));

		return console.log(`Contact with name: "${name}" was succesfully created!`);
	} catch (err) {
		err => console.error(err.message);
	}
}

async function removeContact(contactId) {
	try {
		const data = await listContacts();

		const matchedContact = data.find(contact => contact.id === contactId);
		if (!matchedContact) return console.error(`Contact with id: "${contactId}" was not found!`);

		const modifiedContacts = data.filter(contact => contact.id !== contactId);
		await fs.writeFile(contactsPath, JSON.stringify(modifiedContacts));

		return console.log(`Contact with id: "${contactId}" was succesfully removed!`);
	} catch (err) {
		err => console.error(err.message);
	}
}

module.exports = {listContacts, getContactById, removeContact, addContact};
