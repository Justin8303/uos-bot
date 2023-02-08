

export function addPadding(name: string, paddingLen: number, leftAligned: boolean = false) {
    let i;
    let padding = "";
    let len = name.length

    if (!leftAligned) {
        for (i = 0; i < Math.ceil(((paddingLen * 2) - len) / 2); i++)
            padding += " ";

        return "⁣" + padding + name + padding + padding + "⁣";
    }

    for (i = 0; i < Math.ceil((paddingLen * 3) - len); i++)
        padding += " ";
    return name + padding + "⁣"
}