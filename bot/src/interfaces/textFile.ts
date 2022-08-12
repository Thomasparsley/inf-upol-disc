export interface TextFile {
    channelID: number;
    messages: TextFileMessage[];

}

export interface TextFileMessage {
    id: number;
    content: string[];
    components?: {
        dropdowns?: {
            id: string;
            flag: string;
            placeholder: string;
            min: number;
            max: number;
            options: string[];
        }[]
        buttons?: {
            id: string;
            label: string;
            style: string;
        }[]
    };
}