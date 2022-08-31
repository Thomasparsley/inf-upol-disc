export interface TextFile {
    channelID: string
    messages: TextFileMessage[]

}

export interface TextFileMessage {
    id: string
    content: string[]
    components?: {
        dropdowns?: {
            id: string
            flag: string
            placeholder: string
            min: number
            max: number
            options: string[]
        }[]
        buttons?: {
            id: string
            label: string
            style: string
        }[]
    }
}