import Search from "./scripts/search.js";
import Recipe from "./scripts/recipe.js";
import { ele, notify, renderLoader, renderResults, } from "./scripts/ui.js";
import { categories } from "./scripts/constant.js";


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
window.addEventListener("DOMContentLoaded", controlUrl);

// url deki id nin değişme olayını izle
window.addEventListener("hashchange", controlUrl);

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
        console.log(recipe.info);
    }

}