import { Otazka } from "./otazka";

export interface Test {
    nazov: string;
    otazky: Otazka[]; // Pole s otázkami v teste
}