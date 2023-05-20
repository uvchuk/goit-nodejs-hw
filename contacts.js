const path = require("path");
const fs = require("fs").promises;
const {v4: uuidv4} = require("uuid");

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
	const data = await fs
		.readFile(contactsPath)
		.then(response => JSON.parse(response.toString()))
		.catch(err => console.log(err.message));

	return data;
}

async function getContactById(contactId) {
	const data = await listContacts();

	const matchedContact = data.find(contact => contact.id === contactId);
	if (!matchedContact) return console.error(`Contact with id: "${contactId}" was not found!`);

	return console.table(matchedContact);
}

async function addContact(name, email, phone) {
	const data = await listContacts();

	const matchedName = data.find(contact => contact.name === name);
	if (matchedName) return console.error(`Contact with name: "${name}" is exist!`);

	const newContact = {id: uuidv4(), name, email, phone};
	await fs
		.writeFile(contactsPath, JSON.stringify([...data, newContact]))
		.then(console.log(`Contact with name: "${name}" was succesfully created!`))
		.catch(err => console.log(err.message));
	return;
}

async function removeContact(contactId) {
	const data = await listContacts();

	const matchedContact = data.find(contact => contact.id === contactId);
	if (!matchedContact) return console.error(`Contact with id: "${contactId}" was not found!`);

	const modifiedContacts = data.filter(contact => contact.id !== contactId);
	await fs
		.writeFile(contactsPath, JSON.stringify(modifiedContacts))
		.then(console.log(`Contact with id: "${contactId}" was succesfully removed!`))
		.catch(err => console.log(err.message));
	return;
}

module.exports = {listContacts, getContactById, removeContact, addContact};
