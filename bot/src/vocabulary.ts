import { Role } from "discord.js"

export const VOC_VerificationSuccessful = "Úspěšně jste se ověřil/a."
export const VOC_ActionSuccessful = "Akce byla provedena."
export const VOC_RequestSended = "Žádost byla odeslána."

export const VOC_VerificationCodeSended = (email: string) => `Verifikační kod byl zaslán na email: **${email}**.`
export const VOC_RoleAdded = (role: Role | string) => `Role ${role} byla **přidána**.`
export const VOC_RoleRemoved = (role: Role) => `Role ${role} byla **odebrána**.`
export const VOC_EveryRequest = (sender: any, room: any, text: string) => `Uživatel ${sender} zažádal v ${room} o everyone. Důvod žádost: \n\n${text}`
export const VOC_QuoteRequest = (sender: any, text: string) => `Uživatel ${sender} zažádal o citát.\n\n${text}`
