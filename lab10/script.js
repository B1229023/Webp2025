// 使用 Flickr API 取得最新 10 張照片的資料（包含 id）
var imglist_Url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=ca370d51a054836007519a00ff4ce59e&per_page=10&format=json&nojsoncallback=1';

function getimg() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imglist_Url, true);
  xhr.send();

  xhr.onload = function() {
    // 解析 API 回傳的 JSON 資料
    var data = JSON.parse(this.responseText);
    console.log(data); // 可以檢查回傳資料
    add_new_img(data.photos.photo); // 傳遞給 add_new_img 函數，這裡是照片的 id 和其他資訊
  };
}

// 生成並展示照片
function add_new_img(photoList) {
  var gal = document.getElementById("gallery");
  gal.innerHTML = ""; // 清空之前的圖片（如果有的話）

  // 遍歷每張照片，使用其 ID 去獲取圖片的 URL
  photoList.forEach(function(item) {
    // 根據照片的 id、secret 和 server 來構建圖片的 URL
    var img_Url = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca370d51a054836007519a00ff4ce59e&photo_id=${item.id}&format=json&nojsoncallback=1`;

    // 使用 XMLHttpRequest 去獲取圖片的尺寸資訊
    var xhr = new XMLHttpRequest();
    xhr.open('GET', img_Url, true);
    xhr.send();

    xhr.onload = function() {
      var sizeData = JSON.parse(this.responseText);
      console.log(sizeData); // 可以檢查回傳的尺寸資料

      // 找到 "Small" 尺寸的圖片 URL
      var imgUrl = sizeData.sizes.size.find(size => size.label === 'Small').source;
      
      // 創建 <img> 標籤
      var img = document.createElement("img");
      img.setAttribute("src", imgUrl); // 設定圖片來源
      img.setAttribute("alt", item.title); // 設定圖片 alt 屬性（以防圖片無法顯示）

      // 將圖片加入到畫廊中
      gal.appendChild(img);
    };
  });
}

// 頁面載入時自動載入圖片
window.onload = function() {
  getimg(); // 觸發圖片獲取
};