import OptionsSync from "webext-options-sync";

const optionsStorage = new OptionsSync({
	defaults: {
		trollList: "moron@example.com,richard move",
		threadTitle: "Blah blah blah!",
		messageContent: "Nothing I have to say is remotely worth reading",
	},
	migrations: [OptionsSync.migrations.removeUnused],
	logging: true,
});

export default optionsStorage;
