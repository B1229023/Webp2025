var container = document.getElementById('container');
var wrongCount = 0; // 新增變數來追蹤錯誤次數

function getRandomChars(min, max) {
  let chars = "abcdefghijklmnopqrstuvwxyz";
  let length = Math.floor(Math.random() * (max - min + 1)) + min;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

window.onload = function () {
  container.textContent = getRandomChars(0, 2);
};

window.addEventListener("keyup", function (e) {
  console.log(e.key);
  if (container.textContent.length > 0 && container.textContent[0] === e.key) {
    container.textContent = container.textContent.substring(1);
    wrongCount = 0; // 正確輸入就重設錯誤次數
  } else {
    wrongCount++; // 錯誤次數加一
  }

  add_new_chars();

  if (wrongCount >= 3) {
    for (let i = 0; i < 6; i++) {
      container.textContent += getRandomChars(1, 3);
    }
    wrongCount = 0; // 重設錯誤次數
  }
});

function add_new_chars() {
  let newchar = getRandomChars(1, 3);
  container.textContent += newchar;
}