import { Role } from "discord.js";


export const VOC_VerificationSuccessful = "Úspěšně jste se ověřil/a.";
export const VOC_ActionSuccessful = "Akce byla provedena.";
export const VOC_RequestSended = "Žádost byla odeslána.";

export const VOC_VerificationCodeSended = (email: string) => `Verifikační kod byl zaslán na email: ${email}.`;
export const VOC_RoleAdded = (role: Role | string) => `Role ${role} byla **přidána**.`;
export const VOC_RoleRemoved = (role: Role) => `Role ${role} byla **odebrána**.`;
export const VOC_EveryRequest = (sender: any, room: any, text: string) => `Uživatel ${sender} zažádal v ${room} o everyone. Důvod žádost: ${text}`;

/* Errors */
export const VOC_Unauthorized = "Nemáš oprávnění pro tento příkaz!";
export const VOC_CantEditPermission = "Bot může upravovat jen svoje zprávy!";
export const VOC_NonValidUrl = "Nepředal jsi validní URL.";

export const VOC_NonValidEmail = (email: string) => `Email není ve správném tvaru ${email}.`;
export const VOC_InvalidDomain = (email: string) => `${email} napatří do domény Univerzity Palackého. Registrace je jen pro emaily typu \`uživatel@upol.cz\`.`;
