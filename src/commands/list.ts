import {Command} from "../interfaces/ChatInputApplicationCommandData";
import {Hello} from "./utils/Hello";
import {AddRole} from "./administration/roles/AddRole";
import {DelRole} from "./administration/roles/DelRole";
import {User} from "./administration/User";
import {Info} from "./administration/Info";
import {createRoleSelector} from "./roles/CreateRoleSelector";
import {SetRoleMeta} from "./administration/roles/SetRoleMeta";
import {DelRoleMeta} from "./administration/roles/DelRoleMeta";

export const List: Command[] = [Hello, AddRole, DelRole, User, Info, createRoleSelector, SetRoleMeta, DelRoleMeta];