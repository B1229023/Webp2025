var container = document.getElementById('container');
function getRandomChars(min,max){
  let chars = "abcdefghijklmnopqrstuvwxyz";
  let length = Math.floor(Math.random()*(max-min+1))+min;
  let result = "";
  for(let i=0;i<length;i++){
    result +=chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return result;
}
window.onload=function(){
  container.textContent = getRandomChars(0,2);
};
 window.addEventListener("keyup", function(e) {
            console.log(e.key);
            if(container.textContent.length>0&&container.textContent[0]===e.key){
              container.textContent = container.textContent.substring(1);
            }
            add_new_chars();
        });
function add_new_chars(){
  let newchar = getRandomChars(1,3);
  container.textContent+=newchar;
};