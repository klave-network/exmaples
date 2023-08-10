export const idCollapser = (i?: string) => {
    if (!i)
        return '000-000-000';
    const h = Array.from(i.replace(/[\W_]+/g, "").toUpperCase().padEnd(40, '0')).map(c => c.charCodeAt(0) % 10);
    return `${h[0]}${h[3]}${h[6]}-${h[10]}${h[15]}${h[20]}-${h[6]}${h[12]}${h[30]}`
}