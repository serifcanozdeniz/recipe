import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify, renderLoader, renderResults, } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";

// uuid id kütüphanesinden id oluşturma methodu import etme
import { v4 } from "https://jspm.dev//uuid";



// classın örneğini oluşturma
const search = new Search();

const recipe = new Recipe();

//! olay izleyicileri

// sayfa yüklenme olayını izler
document.addEventListener("DOMContentLoaded", () => {
    // rastgele kategori seç
    const index = Math.floor(Math.random() * categories.length);
    // kategorinin verilerini al ve ekrana bas
    getResults(categories[index]);
})

// formun gönderilme olayını izler
ele.form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = e.target[0].value;
    getResults(query)
})

// sayfa yüklenme olayını izle
window.addEventListener("DOMContentLoaded", () => {
    controlUrl();
    renderBasketItems();
});

// url deki id nin değişme olayını izle
window.addEventListener("hashchange", controlUrl);

// tarif alanındaki tıklanma olaylarını izle
ele.recipe_area.addEventListener("click", handleClick)



//! fonksiyonlar
// arama sonuçlarını alıp ekrana basar

async function getResults(query) {
    // arama terimi var mı kontrol et
    if (!query.trim()) {
        return notify("Please fill out the form");
    }

    // arama terimi varsa loader bas
    renderLoader(ele.result_list);

    try {
        // api dan verileri al
        await search.fetchResults(query.trim());
        // veri hatalı geldiyse ekrana uyarı bas
        if (search.results.error) {
            notify("Recipe not found");

            // Loaderı kaldır
            ele.result_list.innerHTML = "";
        } else {
            // sonuçları ekrana bas
            renderResults(search.results.recipes);
        }

    } catch (err) {
        // hata olursa bildirim ver
        notify("There is a problem!")

        // Loaderı kaldır
        ele.result_list.innerHTML = "";
    }
}

// detay verilerini alıp ekrana basa

async function controlUrl() {
    // detayı gösterilecek ürünün id sine eriş
    const id = (location.hash.slice(1));

    if (id) {
        // yükleniyor bas
        renderLoader(ele.recipe_area)

        // tarif bilgileri al
        await recipe.getRecipe(id);

        // tarif bilgilerini ekrana bas
        recipe.renderRecipe(recipe.info);
    }

}

//! sepet alanı
let basket = JSON.parse(localStorage.getItem("basket")) || [];

// tarif alanındaki tıklanmalarda çalışır
function handleClick(e) {
    if (e.target.id === "add-to-cart") {
        // bütün malzemeleri sepete ekle
        recipe.info.ingredients.forEach((title) => {
            // her bir tarif için yeni bir obje oluştur ve id ekle
            const newItem = {
                id: v4(),
                title,
            }
            // oluşturulan id'li tarifi sepete ekle
            basket.push(newItem);
        })

        // local'i güncelle
        localStorage.setItem("basket", JSON.stringify(basket));

        // sepet arayüzünü güncelle
        renderBasketItems();
    }
}

// tarif verilerini ekrana basar
function renderBasketItems() {
    ele.basket_list.innerHTML = basket.map((i) => `
    <li data-id="${i.id}">
     <i id="delete-item" class="bi bi-x"></i>
     <span>${i.title}</span>
    </li>
    `).join(" ");
}

// silme butonuna tıklanma olayı
ele.clear_btn.addEventListener("click", () => {
    const res = confirm("Do you want to clean the cart?")

    if (res) {
        // sepet dizisini sıfırla
        basket = [];

        // local'i temizle
        localStorage.removeItem("basket");

        // arayüzü temizle
        ele.basket_list.innerHTML = "";
    }
})

// tek tek silme
ele.basket_list.addEventListener("click", (e) => {
    if (e.target.id == "delete-item") {
        // tıklanılan elemanın id sine eriş
        const parent = e.target.parentElement;
        const id = parent.dataset.id;
        console.log(parent, id);

        // id sine göre diziden kaldırma
        basket = basket.filter((i) => i.id !== id)

        // local'e güncel diziyi aktar

        localStorage.setItem("basket", JSON.stringify(basket))

        // arayüzden ilgili elemanı kaldır
        parent.remove();
    }
})