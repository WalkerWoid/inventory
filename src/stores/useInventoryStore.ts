import {defineStore} from "pinia";
import {computed, ref, toRaw} from "vue";
import type {Ref} from "vue";
import InventoryItem from "@/components/InventoryItem.vue";

export interface InventoryItemInterface {
    id: number
    position: number
    srcImg: string
    count: number
}
export type InventoryItemsTypes = InventoryItemInterface

interface InventoryStoreInterface {
    inventorySize: Ref<number>
    inventory: Ref<InventoryItemsTypes[]>
    inventoryItems: Ref<InventoryItemInterface[]>
    itemSubWindowVisibility: Ref<boolean>
    emptyItem: Ref<InventoryItemInterface>
    fillInventory(items: InventoryItemInterface[]): void
}

export const isInventoryItem = (item: InventoryItemInterface): item is InventoryItemInterface => {
    return item.count !== -1
}

export const useInventoryStore = defineStore('inventory', () => {
    const inventorySize = ref<number>(25)
    // const inventory = ref<InventoryItemsTypes[]>(Array(inventorySize.value).fill(''))
    const inventory = ref<InventoryItemsTypes[]>([])
    const inventoryItems = ref<InventoryItemInterface[]>([
        {
            id: 0,
            position: 1,
            srcImg: 'item-img1.png',
            count: 4,
        },
        {
            id: 1,
            position: 2,
            srcImg: 'item-img2.png',
            count: 2,
        },
        {
            id: 2,
            position: 3,
            srcImg: 'item-img3.png',
            count: 5,
        },
    ])
    const itemSubWindowVisibility = ref<boolean>(false)

    const emptyItem= ref<InventoryItemInterface>({
        id: -1,
        srcImg: '',
        count: -1,
        position: -1,
    })
    function fillInventory() {
        for (const item of inventoryItems.value) {
            inventory.value.push(item)
        }
        let newID = toRaw(inventory.value.length)

        for (let i = inventory.value.length; i < inventorySize.value; i++) {
            emptyItem.value.id = newID
            newID += 1
            inventory.value.push(structuredClone(toRaw(emptyItem.value)))
        }
    }

    return {
        inventorySize,
        inventory,
        inventoryItems,
        emptyItem,
        itemSubWindowVisibility,
        fillInventory,
    } as InventoryStoreInterface
})