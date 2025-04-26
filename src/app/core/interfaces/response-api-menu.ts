import { Menu } from "./menu.interface";

export interface ResponseApiMenu {
  status: boolean;
  msg: string;
  value: Menu[];
}
