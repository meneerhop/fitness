
export function applyPageTransition(element){
  element.style.opacity = 0;
  element.style.transform = "translateY(10px)";
  setTimeout(()=>{
    element.style.transition = "all .4s cubic-bezier(.34,1.56,.64,1)";
    element.style.opacity = 1;
    element.style.transform = "translateY(0px)";
  },50);
}

export function buttonPressEffect(button){
  button.addEventListener("mousedown", ()=>{
    button.style.transform = "scale(.95)";
  });
  button.addEventListener("mouseup", ()=>{
    button.style.transform = "scale(1)";
  });
}
