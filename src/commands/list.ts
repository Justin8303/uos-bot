import {Command} from "../interfaces/ChatInputApplicationCommandData";
import {Hello} from "./utils/Hello";
import {AddRole} from "./administration/AddRole";
import {DelRole} from "./administration/DelRole";
import {User} from "./administration/User";
import {Info} from "./administration/Info";

export const List: Command[] = [Hello, AddRole, DelRole, User, Info];