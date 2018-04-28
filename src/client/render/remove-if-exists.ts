export function removeIfExists(id: string) {
    const e = document.getElementById(id);
    if (e) {
        e.parentElement.removeChild(e);
    }
}