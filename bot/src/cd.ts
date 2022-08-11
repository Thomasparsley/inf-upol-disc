/*
    export const CD_Example = {
        name: "",
        description: "",
        sub: {
            name: {
                name: "",
                description: "",
                options: [
                    {
                        name: "",
                        description: ""
                    },
                ]
            }
        },
        options: [
            {
                name: "",
                description: ""
            },
        ]
    };
*/

export const CD_Cmdreg = {
    name: "cmdreg",
    description: "Zaregistruje command, který je součástí S2A2 botu.",
    options: [
        {
            name: "cmdname",
            description: "Jméno příkazu k registraci."
        },
    ]
};

export const CD_EveryRequest = {
    name: "everyreq",
    description: "Žádost o @everyone. Prosíme popište podrobně svoji žádost. Zneužití se trestá.",
    options: [
        {
            name: "description",
            description: "Zadej popisek žádosti o everyone."
        },
    ]
};

export const CD_Host = {
    name: "host",
    description: "Po odeslání obdržíš roli @Návštěvník.",
};

export const CD_RM = {
	name: "rm",
	description: "Správa přidělování reakcí na zprávu.",
	sub: { 
        add: {
			name: "add", 
			description: "Navaž přidělování reakcí na zprávu.",
            options: [
                {
                    name: "messageid",
                    description: "ID zprávy, kterou chceš smazat."
                },
                {
                    name: "binds",
                    description: "Formát: (emote role),(emote role)"
                },
            ]
		},
        remove: {
			name: "remove",
			description: "Smaž přiřazování reakcí navázané na zprávu.",
            options: [
                {
                    name: "messageid",
                    description: "ID zprávy, kterou chceš smazat."
                },
            ]
		},
    }
};

export const CD_Register = {
    name: "registrace",
    description: "Zaregistruj se na náš discord a pokud jsi student tak obdrž roli Studnet.",
    options: [
        {
            name: "email",
            description: "Zadejte validní email."
        },
    ]
};

export const CD_Role = {
    name: "role",
    description: "Přidělí (odebere) požadovanou roli.",
    options: [
        {
            name: "role",
            description: "Napiš jméno role."
        },
    ]
};

export const CD_Validation = {
    name: "validace",
    description: "Tento příkaz slouží k validaci účtu.",
    options: [
        {
            name: "key",
            description: "Zadejte validační klíč. Pokud nemáš klíč tak použí příkaz register."
        },
    ]
};
