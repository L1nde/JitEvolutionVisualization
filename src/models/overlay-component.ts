import { Coordinate } from ".";

export interface OverlayComponent {
    id: string,
    position: Coordinate,
    initiator?: string
}