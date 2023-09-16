import { Otazka } from "./otazka";

export interface Test {
    id: number;
    nazov: string;
    otazky: Otazka[];
}