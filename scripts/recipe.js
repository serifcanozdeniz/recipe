export default class Recipe {
    constructor() {
        // tarif hakkında bilgiler
        this.info = {};
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
}