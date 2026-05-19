const names=[
    "Luna",
    "Nova",
    "Aurora",
    "Stella",
    "Celeste",
    "Seraphina",
    "Isla",
    "Aria",
    "Violet",
];
export const generateAnonymousName=()=>{
    return names[Math.floor(Math.random()*names.length)];
}