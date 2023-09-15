import { Odpoved } from "./odpoved";

export interface Otazka {
    text: string;
    odpovede: Odpoved[]; 
}