import {toRaw} from "vue";

export const useSaveStore = (storeToSave: any) => {
    try {
        const rawStore = toRaw(storeToSave)

        const dataToSave = {
            inventorySize: toRaw(rawStore.inventorySize.value),
            inventoryItems: toRaw(rawStore.inventoryItems.value),
            inventory: toRaw(rawStore.inventory.value)
        }

        localStorage.setItem('inventory', JSON.stringify(dataToSave))
    } catch (error) {
        console.log('Ошибка при записи в стор', error)
    }
}