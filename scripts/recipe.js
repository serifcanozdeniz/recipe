import { ele } from "./ui.js";

export default class Recipe {
  // kurucu method
  constructor() {
    // tarif hakkında bilgiler
    this.info = {};

    // like'lanan tarifler
    this.likes = JSON.parse(localStorage.getItem("likes")) || [];

    // like listesini ekrana basar
    this.renderLikeList();
  }

  // api dan tarife bilgilerini alan method yaz

  async getRecipe(id) {
    // id sine göre tarif detayını al
    const res = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${id}`)

    // verileri işle
    const data = await res.json();

    // bilgileri class a tanımla
    this.info = data.recipe;
  }

  // tarif bilgilerini ekrana basan method yaz
  renderRecipe(recipe) {
    ele.recipe_area.innerHTML = `
        <!-- resim alanı -->
        <figure>
          <img
            src="${recipe.image_url}"
            alt=""
          />
          <h1>${recipe.title}</h1>
          <div class="like-area">
            <i id="like-btn" class="bi ${this.isRecipeLiked() ? "bi-heart-fill" : "bi-heart"}"></i>
          </div>
        </figure>
        <!-- tarif alanı -->
        <div class="ingredients">
          <ul>
            ${this.createIngredient()}
          </ul>
          <button id="add-to-cart" class="CartBtn">
            <span class="IconContainer">
              <i class="cart bi bi-cart-fill"></i>
            </span>
            <p class="text">Add to Cart</p>
          </button>
        </div>
        <!-- nasıl pişirilir ? -->
        <div class="directions">
          <h2>How to cook?</h2>
          <p>
            This recipe has been carefully prepared and tested by
            <span>${recipe.publisher}</span> You can access further details on
            their website.
          </p>
          <a href="${recipe.publisher_url}" target="_blank">Website</a>
        </div>
`;

    // gerekli olay izleyicisini izle
    document.querySelector("#like-btn").addEventListener("click", () => this.controlLike());

  }

  // her bir malzeme bilgisi için liste elemanı oluşturur
  createIngredient() {
    return this.info.ingredients.map((i) => `
        <li>
            <i class="bi bi-check-circle"></i>
            <p>${i}</p>
        </li>
        `).join(" ");
  }

  // eleman like'lanmışsa like'ı kaldır yoksa like'la
  controlLike() {
    // like'lanan elemanın ihtiyacımız olan bilgilerini al
    const newItem = {
      id: this.info.recipe_id,
      img: this.info.image_url,
      title: this.info.title,
    };

    if (this.isRecipeLiked()) {
      // diziden kaldır
      this.likes = this.likes.filter((i) => i.id !== newItem.id);
    } else {
      // diziye ekle
      this.likes.push(newItem);
    }

    // likes dizisini locale'e aktar
    localStorage.setItem('likes', JSON.stringify(this.likes));

    // detay arayüzünü güncelle
    this.renderRecipe(this.info);

    // like listesinin arayüzünü güncelle
    this.renderLikeList();
  }

  // ekran'da detayı görüntülene eleman like'lanmış mı kontrol eder
  isRecipeLiked() {
    // eğer ki elemanı bulursa bulduğu elemanı döndürecek
    // bulamazsa undefined döndürecek
    return this.likes.find((i) => i.id === this.info.recipe_id);
  }

  // ekrana like listesi basar
  renderLikeList() {
    ele.like_list.innerHTML = this.likes.map((i) => `
    <a href="#${i.id}">
      <img
        src="${i.img}" alt=""  />
      <span>${i.title}</span>
    </a>
    `).join(" ");
  }

}