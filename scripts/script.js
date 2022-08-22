const app = new Vue({
    el: '#app',
    mounted: async function () {
        this.get()
        this.getUpdates()
    },

    data: {
        abacreate: false,
        abaUpdate: false,

        create_new: {
            name: '',
            id: ''
        },

        updates: [],


        users: []
    },

    methods: {
        get: async function () {
            let data = await axios.get('https://blaze-app.azurewebsites.net/c/get/admin')
            this.users = data.data
        },

        getUpdates: async function () {
            let data = await axios.get('https://blaze-app.azurewebsites.net/c/groups/admin')
            this.updates = data.data
        },


        openCreate: function () {
            this.abacreate = true;    
        },


        actualizeUpdate: function () {
            this.updates = []
            this.getUpdates()
        },

        closeUpdate: function () {
            this.abaUpdate = false
        },
        openUpdate: function () {
            this.abaUpdate = true
        },

        create: async function () {
            let data = await axios.get('https://blaze-app.azurewebsites.net/c/insert/' + this.create_new.name + '/' + this.create_new.id.trim() + '/admin')    
            console.log(data)
            this.get()
            this.abacreate = false
        },

        deletar: function (id) {
            let data = axios.get('https://blaze-app.azurewebsites.net/c/delete/' + id + '/admin')            
            this.get()
        }
    }
})