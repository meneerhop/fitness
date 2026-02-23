
export function spring(element){
  element.animate([
    { transform: "scale(.95)" },
    { transform: "scale(1.02)" },
    { transform: "scale(1)" }
  ], { duration: 300, easing: "ease-out" });
}
