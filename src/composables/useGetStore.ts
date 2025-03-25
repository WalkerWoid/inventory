export const useGetStore = (inventoryStore: any) => {
    const savedStore = localStorage.getItem('inventory')
    //
    if (savedStore) {
        try {
            const parsedStore = JSON.parse(savedStore)

            for (const [key, value] of Object.entries(parsedStore)) {
                inventoryStore[key] = value
            }
        } catch (error) {
            console.log('Ошибка при парсинге стора', error)
            inventoryStore.fillInventory()
        }
    } else {
        inventoryStore.fillInventory()
    }
}